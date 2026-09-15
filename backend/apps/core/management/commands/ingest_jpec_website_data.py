import os
import shutil
import ssl
import urllib.request
import re
from io import BytesIO
from PIL import Image, ImageOps

from django.core.management.base import BaseCommand
from django.conf import settings
from django.utils.text import slugify

from apps.showcase.models import TeamMember, Partner, Client
from apps.products.models import Product, ProductImage, ProductSpecification
from apps.categories.models import Category, Industry


class Command(BaseCommand):
    help = "Ingest authentic partners, clients, team members, and newly discovered products from https://jpec.com.np/"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("=== Starting Ingestion from https://jpec.com.np/ ==="))

        # SSL context for scraping
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

        backend_media = settings.MEDIA_ROOT
        frontend_media = os.path.abspath(os.path.join(settings.BASE_DIR, '..', 'frontend', 'public', 'media'))

        def fetch_image_bytes(url):
            clean_url = url.replace('jpec.com.np//', 'jpec.com.np/').strip()
            req = urllib.request.Request(clean_url, headers=headers)
            with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
                return resp.read()

        def save_and_sync(rel_path, pil_img, fmt='JPEG', quality=95):
            b_path = os.path.join(backend_media, rel_path)
            f_path = os.path.join(frontend_media, rel_path)
            os.makedirs(os.path.dirname(b_path), exist_ok=True)
            os.makedirs(os.path.dirname(f_path), exist_ok=True)

            if fmt.upper() in ('JPG', 'JPEG') and pil_img.mode in ('RGBA', 'LA', 'P'):
                # Convert with white background
                bg = Image.new('RGB', pil_img.size, (255, 255, 255))
                if pil_img.mode == 'RGBA':
                    bg.paste(pil_img, mask=pil_img.split()[3])
                else:
                    bg.paste(pil_img)
                pil_img = bg
            elif fmt.upper() in ('JPG', 'JPEG') and pil_img.mode != 'RGB':
                pil_img = pil_img.convert('RGB')

            pil_img.save(b_path, format=fmt, quality=quality)
            pil_img.save(f_path, format=fmt, quality=quality)
            return rel_path.replace('\\', '/')

        def make_square_product_image(img_bytes, target_size=800, padding=40):
            im = Image.open(BytesIO(img_bytes))
            if im.mode in ('RGBA', 'LA'):
                canvas = Image.new('RGBA', im.size, (255, 255, 255, 255))
                canvas.paste(im, mask=im.split()[-1])
                im = canvas.convert('RGB')
            else:
                im = im.convert('RGB')

            # Fit into (target_size - 2*padding) preserving aspect ratio
            max_inner = target_size - (padding * 2)
            im.thumbnail((max_inner, max_inner), Image.Resampling.LANCZOS)

            # Center onto square white canvas
            square = Image.new('RGB', (target_size, target_size), (255, 255, 255))
            offset_x = (target_size - im.width) // 2
            offset_y = (target_size - im.height) // 2
            square.paste(im, (offset_x, offset_y))
            return square

        def make_clean_logo_image(img_bytes, target_width=400, target_height=200):
            im = Image.open(BytesIO(img_bytes))
            if im.mode not in ('RGBA', 'RGB'):
                im = im.convert('RGBA')
            
            # Fit inside max box
            im.thumbnail((target_width - 20, target_height - 20), Image.Resampling.LANCZOS)
            canvas = Image.new('RGBA', (target_width, target_height), (255, 255, 255, 0))
            offset_x = (target_width - im.width) // 2
            offset_y = (target_height - im.height) // 2
            if im.mode == 'RGBA':
                canvas.paste(im, (offset_x, offset_y), mask=im.split()[3])
            else:
                canvas.paste(im, (offset_x, offset_y))
            return canvas

        def make_team_photo(img_bytes, target_size=(600, 600)):
            im = Image.open(BytesIO(img_bytes))
            im = im.convert('RGB')
            # Center crop or fit
            im = ImageOps.fit(im, target_size, Image.Resampling.LANCZOS)
            return im

        # =========================================================================
        # 1. INGEST TEAM MEMBERS
        # =========================================================================
        self.stdout.write(self.style.NOTICE("\n--- Ingesting Authentic Executive Team Members ---"))
        team_data = [
            {
                "name": "Ram Chandra Prasai",
                "designation": "Chief Executive Officer (CEO)",
                "url": "https://jpec.com.np/storage/promoters/November2022/X1gKBgfQXEsmRsyzJv0H-list.jpg",
                "filename": "ram_chandra_prasai.jpg",
                "order": 1
            },
            {
                "name": "Chiranjibi Prasai",
                "designation": "Managing Director",
                "url": "https://jpec.com.np/storage/promoters/January2023/ZS5YVxxoB2syZl9W4d84-list.jpg",
                "filename": "chiranjibi_prasai.jpg",
                "order": 2
            },
            {
                "name": "Jyoti Prakash Prasai",
                "designation": "Director",
                "url": "https://jpec.com.np/storage/promoters/November2022/UgWi9Wwvu8JKjK563wy7-list.jpg",
                "filename": "jyoti_prakash_prasai.jpg",
                "order": 3
            },
            {
                "name": "Sagar Kharel",
                "designation": "Business Development Manager",
                "url": "https://jpec.com.np/storage/promoters/January2023/tyffeWCcsucZNw1NYYR7-list.jpg",
                "filename": "sagar_kharel.jpg",
                "order": 4
            },
            {
                "name": "Ganesh Prasad Uprety",
                "designation": "General Manager",
                "url": "https://jpec.com.np/storage/promoters/November2022/wI7kvVOqaTikv5rxWIha-list.jpg",
                "filename": "ganesh_prasad_uprety.jpg",
                "order": 5
            },
            {
                "name": "Samir Mainali",
                "designation": "Digital Marketing & Administration",
                "url": "https://jpec.com.np/storage/promoters/November2022/ErKIggBz6ParSYDUCcFl-list.jpg",
                "filename": "samir_mainali.jpg",
                "order": 6
            },
            {
                "name": "Irina Velichko",
                "designation": "Finance Director",
                "url": "https://jpec.com.np/storage/promoters/January2023/duFkpFlsuVSFNatJdTVv-list.jpg",
                "filename": "irina_velichko.jpg",
                "order": 7
            },
            {
                "name": "Bharat Biswokarma",
                "designation": "International Marketing Manager",
                "url": "https://jpec.com.np/storage/promoters/November2022/MZKJtjUGenO1XoUc15Ee-list.jpg",
                "filename": "bharat_biswokarma.jpg",
                "order": 8
            }
        ]

        # Shift any existing mock members to higher orders so real ones lead
        for existing in TeamMember.objects.all():
            if not any(t["name"].lower() == existing.name.lower() for t in team_data):
                existing.order = existing.order + 10
                existing.save()

        for t in team_data:
            try:
                rel_path = f"showcase/team/{t['filename']}"
                raw = fetch_image_bytes(t["url"])
                processed_img = make_team_photo(raw)
                final_rel = save_and_sync(rel_path, processed_img, fmt='JPEG')

                member, created = TeamMember.objects.update_or_create(
                    name=t["name"],
                    defaults={
                        "designation": t["designation"],
                        "photo": final_rel,
                        "order": t["order"],
                        "is_active": True
                    }
                )
                status = "Created" if created else "Updated"
                self.stdout.write(f"  [{status}] Team Member: {member.name} ({member.designation})")
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"  Failed team member {t['name']}: {e}"))

        # =========================================================================
        # 2. INGEST PARTNERS
        # =========================================================================
        self.stdout.write(self.style.NOTICE("\n--- Ingesting Authentic Equipment Partners ---"))
        partners_data = [
            {
                "name": "Juneng",
                "url": "https://jpec.com.np/storage/partners/January2023/v5ul1PYYADzPhrvpyTDX.png",
                "website": "http://www.china-centrifuge.com",
                "filename": "juneng.png",
                "order": 1
            },
            {
                "name": "Vontron",
                "url": "https://jpec.com.np/storage/partners/January2023/rkmE8ZiIyW91qLRAjJNv.png",
                "website": "http://www.vontron.com",
                "filename": "vontron.png",
                "order": 2
            },
            {
                "name": "Tetra Pak",
                "url": "https://jpec.com.np/storage/partners/January2023/DVvdQuBvzHwx4MGet15W.png",
                "website": "https://www.tetrapak.com",
                "filename": "tetra_pak.png",
                "order": 3
            },
            {
                "name": "Seko",
                "url": "https://jpec.com.np/storage/partners/January2023/MysieQjiTqocBXnfhyEc.png",
                "website": "https://www.seko.com",
                "filename": "seko.png",
                "order": 4
            },
            {
                "name": "Shanghai Precise",
                "url": "https://jpec.com.np/storage/partners/January2023/GbqVqtbuC1dSETJOTo3b.png",
                "website": "http://www.precise-flow.com",
                "filename": "shanghai_precise.png",
                "order": 5
            },
            {
                "name": "CNP Pumps",
                "url": "https://jpec.com.np/storage/partners/January2023/mrmgEdDPDMRJbAIJyxZl.png",
                "website": "https://www.cnp-pumps.com",
                "filename": "cnp_pumps.png",
                "order": 6
            },
            {
                "name": "Techco",
                "url": "https://jpec.com.np/storage/partners/January2023/xRVx68vzuFYCaXgvdfD1.png",
                "website": "https://techco.com",
                "filename": "techco.png",
                "order": 7
            },
            {
                "name": "Darhor Sensors",
                "url": "https://jpec.com.np/storage/partners/January2023/XNmH0VZfO19f7S7RRgIc.png",
                "website": "https://www.darhor.com",
                "filename": "darhor.png",
                "order": 8
            },
            {
                "name": "Wanhe",
                "url": "https://jpec.com.np/storage/partners/January2023/C01jrDaKjgQczmT9XNV4.png",
                "website": "http://www.wanhe-water.com",
                "filename": "wanhe.png",
                "order": 9
            }
        ]

        # Shift existing partners
        for existing in Partner.objects.all():
            if not any(p["name"].lower() == existing.name.lower() for p in partners_data):
                existing.order = existing.order + 10
                existing.save()

        for p in partners_data:
            try:
                rel_path = f"showcase/partners/{p['filename']}"
                raw = fetch_image_bytes(p["url"])
                processed_logo = make_clean_logo_image(raw)
                final_rel = save_and_sync(rel_path, processed_logo, fmt='PNG')

                partner, created = Partner.objects.update_or_create(
                    name=p["name"],
                    defaults={
                        "website_url": p["website"],
                        "logo": final_rel,
                        "order": p["order"],
                        "is_active": True
                    }
                )
                status = "Created" if created else "Updated"
                self.stdout.write(f"  [{status}] Partner: {partner.name}")
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"  Failed partner {p['name']}: {e}"))

        # =========================================================================
        # 3. INGEST FEATURED CLIENTS
        # =========================================================================
        self.stdout.write(self.style.NOTICE("\n--- Ingesting Authentic Featured Clients ---"))
        clients_data = [
            {
                "name": "Nepal Livestock Sector Innovation Project (NLSIP)",
                "url": "https://jpec.com.np/storage/client/January2023/SBmu5bNstiHmx0LE6REU.png",
                "website": "https://www.nlsip.gov.np/",
                "filename": "nlsip.png",
                "order": 1
            },
            {
                "name": "Armed Police Force (APF) Nepal",
                "url": "https://jpec.com.np/storage/client/January2023/aATSY5X1GTEiNp1Eh6yT.png",
                "website": "https://www.apf.gov.np/",
                "filename": "apf.png",
                "order": 2
            },
            {
                "name": "Crime Investigation Department (CID) Nepal",
                "url": "https://jpec.com.np/storage/client/January2023/ZYAL5NBpk5RlyIJmpUIa.png",
                "website": "https://cid.nepalpolice.gov.np/",
                "filename": "cid.png",
                "order": 3
            },
            {
                "name": "Kathmandu Upatyaka Khanepani Limited (KUKL)",
                "url": "https://jpec.com.np/storage/client/January2023/sSglVR5XrLp7Z0LiB8RZ.png",
                "website": "https://kathmanduwater.org/",
                "filename": "kukl.png",
                "order": 4
            },
            {
                "name": "Nepal Medical College",
                "url": "https://jpec.com.np/storage/client/January2023/0EuDHnePapfgFzOPOZIx.png",
                "website": "https://www.nmcth.edu/",
                "filename": "nepal_medical_college.png",
                "order": 5
            },
            {
                "name": "Nepal Bharat Maitri Hospital",
                "url": "https://jpec.com.np/storage/client/January2023/2ivSainOBQ2NsHHN0h3d.png",
                "website": "https://nbmh.com.np/",
                "filename": "nepal_bharat_maitri.png",
                "order": 6
            },
            {
                "name": "Nepal Cancer Hospital & Research Center",
                "url": "https://jpec.com.np/storage/client/March2023/sQTWFFlq7jGzcxd8gFoj.png",
                "website": "https://www.nch.com.np/",
                "filename": "nepal_cancer_hospital.png",
                "order": 7
            },
            {
                "name": "Alka Hospital",
                "url": "https://jpec.com.np/storage/client/January2023/BILmgKfGiHZlgxOInwsE.png",
                "website": "http://www.alkahospital.com/",
                "filename": "alka_hospital.png",
                "order": 8
            }
        ]

        # Shift existing clients
        for existing in Client.objects.all():
            if not any(c["name"].lower() == existing.name.lower() for c in clients_data):
                existing.order = existing.order + 10
                existing.save()

        for c in clients_data:
            try:
                rel_path = f"showcase/clients/{c['filename']}"
                raw = fetch_image_bytes(c["url"])
                processed_logo = make_clean_logo_image(raw)
                final_rel = save_and_sync(rel_path, processed_logo, fmt='PNG')

                client, created = Client.objects.update_or_create(
                    name=c["name"],
                    defaults={
                        "website_url": c["website"],
                        "logo": final_rel,
                        "order": c["order"],
                        "is_active": True
                    }
                )
                status = "Created" if created else "Updated"
                self.stdout.write(f"  [{status}] Client: {client.name}")
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"  Failed client {c['name']}: {e}"))

        # =========================================================================
        # 4. INGEST NEW PRODUCTS (WITHOUT OVERWRITING EXISTING ONES)
        # =========================================================================
        self.stdout.write(self.style.NOTICE("\n--- Ingesting Newly Discovered Products from jpec.com.np ---"))

        # Ensure Categories & Industries exist
        cat_water, _ = Category.objects.get_or_create(name="Water Factory Segment", defaults={"slug": "water-factory-segment"})
        cat_cold, _ = Category.objects.get_or_create(name="Cold Store Solution", defaults={"slug": "cold-store-solution"})
        
        ind_water, _ = Industry.objects.get_or_create(name="Water Industry", defaults={"slug": "water-industry"})
        ind_beverage, _ = Industry.objects.get_or_create(name="Beverage Industry", defaults={"slug": "beverage-industry"})
        ind_food, _ = Industry.objects.get_or_create(name="Food Industry", defaults={"slug": "food-industry"})
        ind_cold, _ = Industry.objects.get_or_create(name="Cold Storage & Refrigeration", defaults={"slug": "cold-storage-refrigeration"})
        ind_dairy, _ = Industry.objects.get_or_create(name="Dairy Industry", defaults={"slug": "dairy-industry"})
        ind_meat, _ = Industry.objects.get_or_create(name="Meat Industry", defaults={"slug": "meat-industry"})

        new_products_definitions = [
            {
                "name": "Automatic Bottle Blowing Machine",
                "slug": "automatic-bottle-blowing-machine",
                "categories": [cat_water],
                "industries": [ind_water, ind_beverage],
                "short_description": "High performance automatic PET bottle blow moulding machine designed for beverage, mineral water, and liquid bottling production lines.",
                "full_description": "The Automatic Bottle Blowing Machine is an advanced stretch blow molding system engineered for high-speed, stable, and energy-efficient PET bottle manufacturing. Suitable for producing standard mineral water bottles, carbonated soft drink bottles, and edible oil containers. Features precision servo-driven clamping, intelligent infrared heating oven, and pneumatic controls ensuring uniform wall thickness and crystal-clear bottle finish.",
                "image_url": "https://jpec.com.np/storage/products/April2023/MhXFKZEIx0RgY5DC3fsy.png",
                "filename": "automatic-bottle-blowing-machine.jpg",
                "specs": [
                    ("Power Supply", "3P / 380-420V / 50-60Hz"),
                    ("Production Capacity", "2000 - 2400 BPH"),
                    ("High Pressure Air Compressor", "18.5 kW"),
                    ("Max Neck Diameter", "80 mm"),
                    ("Max Bottle Volume", "2.0 L"),
                    ("Clamping Force", "150 kN"),
                    ("Max Mold Thickness", "110 - 230 mm"),
                    ("Mold Opening Stroke", "240 mm"),
                    ("Heating Power", "24 kW"),
                    ("Machine Weight", "2800 kg")
                ]
            },
            {
                "name": "Automatic Wrapping Machine",
                "slug": "automatic-wrapping-machine",
                "categories": [cat_water],
                "industries": [ind_water, ind_beverage, ind_food],
                "short_description": "Industrial automatic shrink wrapping and bundling machine for bottles, cans, and cartons in end-of-line packaging.",
                "full_description": "The Automatic Wrapping Machine provides fully automated grouping, film feeding, cutting, and heat shrink bundling for bottled water, juices, and canned beverages. Built with heavy-duty conveyor systems, PID temperature control, and a high-efficiency thermal circulation shrinkage tunnel to deliver tight, durable, and aesthetically wrapped bottle packs without cartons.",
                "image_url": "https://jpec.com.np/storage/products/April2023/KQnUfqCRehLrVTDrL0T1.jpeg",
                "filename": "automatic-wrapping-machine.jpg",
                "specs": [
                    ("Dimension for Whole Unit (L*W*H)", "6500 x 3200 x 2100 mm"),
                    ("Thermal Shrinkage Passage Dimension", "1800 x 650 x 400 mm"),
                    ("Maximum Packing Dimension", "600 x 400 x 350 mm"),
                    ("Packing Speed", "10 - 12 Packs/min"),
                    ("Transfer Belt Width", "304 mm"),
                    ("Sealing & Cutting Temperature", "140 - 160 °C"),
                    ("Sealing & Cutting Time", "0.5 - 1.5 s"),
                    ("Working Air Pressure", "0.6 - 0.8 MPa"),
                    ("Power Rating", "22 kW"),
                    ("Shrink Film Compatibility", "PE / POF / PVC")
                ]
            },
            {
                "name": "Cold Room Panel",
                "slug": "cold-room-panel",
                "categories": [cat_cold],
                "industries": [ind_cold, ind_dairy, ind_meat],
                "short_description": "Modular insulated polyurethane (PU/PIR) sandwich panels with cam-lock interlocking for walk-in cold rooms and blast freezers.",
                "full_description": "Premium modular Cold Room Panels constructed with high-density CFC-free polyurethane foam (40-42 kg/m³) injected between galvanized pre-painted or grade 304 stainless steel facings. Designed with precision male-female eccentric cam-lock interlocking joints for airtight, thermal-bridge-free assembly. Perfect for fruit and vegetable cold storage, dairy chillers, pharma storage, and meat deep freezers (-40°C to +15°C).",
                "image_url": "https://jpec.com.np/storage/products/April2023/1usJGiIQf529cRE9iNOh.png",
                "filename": "cold-room-panel.jpg",
                "specs": [
                    ("Available Thicknesses", "50 mm, 75 mm, 100 mm, 120 mm, 150 mm, 180 mm, 200 mm"),
                    ("Panel Width", "600 - 1200 mm"),
                    ("Surface Material", "Pre-painted Galvanized Steel / Grade 304 Stainless Steel"),
                    ("Surface Thickness", "0.4 mm, 0.5 mm, 0.6 mm"),
                    ("Surface Coating", "200 micron food-grade anti-corrosive PVC"),
                    ("Core Insulation Material", "High Density Rigid Polyurethane (PU/PIR)"),
                    ("Foam Density", "40 - 42 kg/m³"),
                    ("Thermal Conductivity", "≤ 0.022 W/m·K"),
                    ("Joint Connection", "Eccentric Cam-Lock male/female tongue & groove"),
                    ("Fire Rating", "B1 / B2 Flame Retardant")
                ]
            },
            {
                "name": "Evaporating Unit",
                "slug": "evaporating-unit",
                "categories": [cat_cold],
                "industries": [ind_cold],
                "short_description": "Ceiling suspended commercial and industrial air cooler evaporating unit for medium and low-temperature cold rooms.",
                "full_description": "Heavy-duty forced-draft Evaporating Unit engineered for walk-in chillers, cold storage rooms, and industrial freezers. Features inner-grooved copper coils with hydrophilic aluminum fins for maximized thermal heat transfer, low-noise external rotor axial fans with safety guards, and built-in stainless steel electric heating elements for rapid and uniform defrosting.",
                "image_url": "https://jpec.com.np/storage/products/April2023/YpQnDhTpASfHwtWWKZB6.png",
                "filename": "evaporating-unit.jpg",
                "specs": [
                    ("Cooling Capacity Range", "2.6 kW - 30.0 kW (DD-2.6 to DD-5.3 series)"),
                    ("Fan Diameter", "300 mm - 400 mm"),
                    ("Operating Voltage", "380V / 220V 50Hz"),
                    ("Electric Defrosting Power", "900 W - 2400 W"),
                    ("Fin Spacing", "4.5 mm (Chiller) / 6.0 mm / 9.0 mm (Freezer)"),
                    ("Air Throw Range", "8 m - 15 m"),
                    ("Refrigerant Compatibility", "R404A, R22, R507A, R134a"),
                    ("Casing Material", "Powder-coated galvanized steel / Aluminum alloy")
                ]
            },
            {
                "name": "Semi-Hermetic Condensing Unit",
                "slug": "semi-hermetic-condensing-unit",
                "categories": [cat_cold],
                "industries": [ind_cold],
                "short_description": "Industrial semi-hermetic compressor air-cooled condensing unit for commercial cold storage and freezing facilities.",
                "full_description": "High-reliability Semi-Hermetic Condensing Unit designed for continuous, heavy-duty duty cycles in cold storage, dairy milk cooling, food processing, and meat preservation facilities. Features a service-friendly semi-hermetic compressor with oil pump lubrication, vibration absorber, liquid receiver, filter drier, sight glass, and dual pressure safety controls mounted on a rigid vibration-damped steel chassis.",
                "image_url": "https://jpec.com.np/storage/products/April2023/FX2r5qdHlUeLkpIksZwl.png",
                "filename": "semi-hermetic-condensing-unit.jpg",
                "specs": [
                    ("Compressor Type", "Semi-Hermetic Reciprocating Compressor"),
                    ("Power Range", "2 HP - 30 HP (2.0 kW - 27.7 kW)"),
                    ("Evaporating Temperature", "-5 °C to -30 °C"),
                    ("Condenser", "Air-cooled high efficiency copper finned coil"),
                    ("Fan Specification", "Low-noise external rotor axial fans (IP54)"),
                    ("Refrigerant", "R404A / R507A / R22"),
                    ("Power Supply", "380V - 415V 3-Phase 50Hz"),
                    ("Standard Accessories", "Receiver, Filter Drier, Solenoid Valve, Dual Pressure Controller, Oil Gauge")
                ]
            }
        ]

        inserted_count = 0
        for pdef in new_products_definitions:
            existing = Product.objects.filter(slug=pdef["slug"]).first()
            if existing:
                self.stdout.write(self.style.WARNING(f"  Product '{existing.name}' already exists (slug: {existing.slug}). Preserving existing without overwriting."))
                continue

            # Process image
            rel_img = f"products/images/{pdef['filename']}"
            raw = fetch_image_bytes(pdef["image_url"])
            sq_img = make_square_product_image(raw, target_size=800, padding=40)
            final_img = save_and_sync(rel_img, sq_img, fmt='JPEG', quality=95)

            # Create product
            prod = Product.objects.create(
                name=pdef["name"],
                slug=pdef["slug"],
                short_description=pdef["short_description"],
                full_description=pdef["full_description"],
                is_active=True,
                is_featured=True,
                order=Product.objects.count() + 1
            )
            prod.categories.set(pdef["categories"])
            prod.industries.set(pdef["industries"])

            # Create primary image
            ProductImage.objects.create(
                product=prod,
                image=final_img,
                alt_text=prod.name,
                is_primary=True,
                order=1
            )

            # Create specifications
            for s_order, (s_name, s_val) in enumerate(pdef["specs"], 1):
                ProductSpecification.objects.create(
                    product=prod,
                    label=s_name,
                    value=s_val,
                    order=s_order
                )

            inserted_count += 1
            self.stdout.write(self.style.SUCCESS(f"  [Inserted New Product] {prod.name} (Categories: {[c.name for c in pdef['categories']]})"))

        self.stdout.write(self.style.SUCCESS(f"\nSuccessfully inserted {inserted_count} new products into catalog!"))
        self.stdout.write(self.style.SUCCESS(f"Total Products in DB: {Product.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"Total Team Members in DB: {TeamMember.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"Total Partners in DB: {Partner.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"Total Clients in DB: {Client.objects.count()}"))
