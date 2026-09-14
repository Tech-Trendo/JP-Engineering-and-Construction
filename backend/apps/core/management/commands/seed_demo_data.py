"""
Management command to populate the database with realistic demo data
strictly matching the authentic JP Engineering & Construction business profile:
1. Community & Industrial Water Treatment Systems
2. Dairy Plant Machinery
3. Industrial Refrigeration & Cold Storage
4. Solar Energy & Irrigation Systems
5. Solar Energy & Heat Pump Systems
6. Meat Mincing & Packaging Machinery
7. Steel Fabrication

ZERO generic earthmoving / excavator / crane content.
All product images load directly from verified local industrial photography in
media/seeded_products/ to eliminate all stock photo mismatches (like the Hollywood sign).
"""

import os
import io
import urllib.request
from PIL import Image, ImageDraw, ImageFont
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction

from django.contrib.auth.models import User
from apps.categories.models import Category, Industry
from apps.core.models import SiteContent, DEFAULT_SHORT_INTRO, DEFAULT_FULL_INTRO
from apps.products.models import Product, ProductImage, ProductSpecification
from apps.quotes.models import QuoteRequest
from apps.showcase.models import TeamMember, Partner, Client
from apps.site_settings.models import SiteSettings, HeroSlide


def create_fallback_image(width, height, text, bg_color=(15, 23, 42), border_color=(30, 64, 175)):
    """
    Creates an industrial-styled fallback placeholder image in-memory using Pillow.
    Ensures high-contrast legible text and zero external network dependencies.
    """
    img = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Subtle blueprint border accent
    draw.rectangle([8, 8, width - 8, height - 8], outline=border_color, width=2)
    draw.rectangle([12, 12, width - 12, height - 12], outline=(30, 41, 59) if sum(bg_color)/3 < 128 else (226, 232, 240), width=1)

    # Calculate brightness of bg_color for high contrast text
    brightness = (bg_color[0] * 299 + bg_color[1] * 587 + bg_color[2] * 114) / 1000
    text_color = (15, 23, 42) if brightness > 128 else (241, 245, 249)

    # Center label
    display_text = str(text)[:36]
    draw.text((width // 2, height // 2), display_text, fill=text_color, anchor="mm")

    buf = io.BytesIO()
    img.save(buf, format='PNG')
    return buf.getvalue()


def create_branded_logo(brand, sub, color, symbol, w=320, h=130):
    """
    Generates a crisp, authentic corporate logo badge with distinct geometric glyphs
    and high-contrast typography for client and OEM partner showcases.
    """
    img = Image.new('RGB', (w, h), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Card border
    draw.rounded_rectangle([3, 3, w - 4, h - 4], radius=10, fill=(255, 255, 255), outline=(226, 232, 240), width=2)

    # Left brand emblem box
    draw.rounded_rectangle([18, 22, 92, 108], radius=12, fill=color)

    # Try font loading, fall back to default
    try:
        font_paths = ['C:/Windows/Fonts/segoeuib.ttf', 'C:/Windows/Fonts/arialbd.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf']
        bold_font_path = next((p for p in font_paths if os.path.exists(p)), None)
        sub_paths = ['C:/Windows/Fonts/segoeui.ttf', 'C:/Windows/Fonts/arial.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']
        regular_font_path = next((p for p in sub_paths if os.path.exists(p)), None)
        sym_font = ImageFont.truetype(bold_font_path, 28) if bold_font_path else ImageFont.load_default()
        title_font = ImageFont.truetype(bold_font_path, 16) if bold_font_path else ImageFont.load_default()
        sub_font = ImageFont.truetype(regular_font_path, 11) if regular_font_path else ImageFont.load_default()
    except Exception:
        sym_font = title_font = sub_font = ImageFont.load_default()

    draw.text((55, 65), symbol, fill=(255, 255, 255), font=sym_font, anchor='mm')
    draw.text((108, 52), brand[:19], fill=(15, 23, 42), font=title_font, anchor='lm')
    draw.text((108, 78), sub[:26].upper(), fill=(100, 116, 139), font=sub_font, anchor='lm')

    buf = io.BytesIO()
    img.save(buf, format='PNG')
    return buf.getvalue()


def load_verified_image(filename, fallback_text, width=800, height=600):
    """
    Loads verified authentic industrial photography from media/seeded_products/
    if available. Otherwise falls back to Pillow industrial drawing.
    """
    local_path = os.path.join(settings.MEDIA_ROOT, 'seeded_products', filename)
    if os.path.exists(local_path):
        with open(local_path, 'rb') as f:
            return f.read()
    return create_fallback_image(width, height, fallback_text)


class Command(BaseCommand):
    help = "Populates database with authentic JP Engineering industrial demo data"

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Clearing existing demo data..."))

        # Clear existing models
        QuoteRequest.objects.all().delete()
        ProductSpecification.objects.all().delete()
        ProductImage.objects.all().delete()
        Product.objects.all().delete()
        Industry.objects.all().delete()
        Category.objects.all().delete()
        TeamMember.objects.all().delete()
        Partner.objects.all().delete()
        Client.objects.all().delete()
        HeroSlide.objects.all().delete()

        self.stdout.write(self.style.SUCCESS("Existing records purged. Seeding authentic JP Engineering data..."))

        # ==========================================================
        # 0a. STAFF ADMIN USER (For Admin CMS Access)
        # ==========================================================
        admin_user, _ = User.objects.get_or_create(username="admin")
        admin_user.set_password("admin123")
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.email = "info@jpec.com.np"
        admin_user.save()
        self.stdout.write("  [+] Configured Staff Admin User (admin / admin123)")

        # ==========================================================
        # 0b. SITE SETTINGS (Singleton Global Identity, Hero & Stats)
        # ==========================================================
        site_settings = SiteSettings.get_solo()
        site_settings.company_name = "JP Engineering & Construction Pvt. Ltd."
        site_settings.company_short_name = "JP Engineering & Construction Pvt. Ltd."
        site_settings.tagline = "Engineered for Extreme Industrial Performance"
        site_settings.company_description = (
            "JP Engineering & Construction Pvt. Ltd. is Nepal's premier manufacturer and turnkey contractor "
            "for industrial refrigeration, community and industrial water treatment plants, modern dairy "
            "processing machinery, precision steel fabrication, and solar energy systems."
        )
        site_settings.founding_year = "2014"
        site_settings.company_type = "Private Limited"
        site_settings.registration_number = ""
        site_settings.pan_vat_number = ""
        site_settings.employee_count = "45+ Technical Engineers & Specialists"
        site_settings.primary_phone = "01-5385552"
        site_settings.secondary_phone = "9851112988, 9851158661, 9851158660"
        site_settings.primary_email = "info@jpec.com.np"
        site_settings.secondary_email = ""
        site_settings.address = "Kathmandu, Nepal"
        site_settings.business_hours = "Mon – Fri: 9:00 AM – 6:00 PM | Sat: 9:00 AM – 2:00 PM"
        site_settings.map_location_text = "Kathmandu, Nepal"
        site_settings.hero_badge = "Nepal's Premier Industrial Machinery Manufacturer"
        site_settings.hero_heading = "Engineered Machinery & Turnkey Industrial Plants"
        site_settings.hero_subtext = (
            "Specializing in cold storage facilities, water purification plants, automated dairy processing, "
            "stainless steel equipment fabrication, and high-efficiency solar thermal systems."
        )
        site_settings.hero_cta_primary_label = "Explore Machinery"
        site_settings.hero_cta_primary_link = "/products"
        site_settings.hero_cta_secondary_label = "Request a Quote"
        site_settings.hero_cta_secondary_link = "/contact-us#quote"
        site_settings.stat_years_experience = "10+"
        site_settings.stat_projects_completed = "500+"
        site_settings.stat_happy_clients = "350+"
        site_settings.stat_business_sectors = "7"
        site_settings.facebook_url = "https://facebook.com"
        site_settings.linkedin_url = "https://linkedin.com"
        site_settings.hero_image = "site_settings/hero/hero_machinery_bg.jpg"

        # Copy official logo asset to media directory if not present
        logo_dir = os.path.join(settings.MEDIA_ROOT, 'site_settings', 'logo')
        os.makedirs(logo_dir, exist_ok=True)
        dest_logo_path = os.path.join(logo_dir, 'logo.png')
        src_logo_path = os.path.join(settings.BASE_DIR, '..', 'frontend', 'public', 'assets', 'logo.png')
        if os.path.exists(src_logo_path) and not os.path.exists(dest_logo_path):
            import shutil
            shutil.copyfile(src_logo_path, dest_logo_path)

        if os.path.exists(dest_logo_path):
            site_settings.logo = 'site_settings/logo/logo.png'

        site_settings.save()
        self.stdout.write("  [+] Configured SiteSettings (Singleton Global Identity, Hero, Logo & Stats)")

        # ==========================================================
        # 0d. HERO CAROUSEL SLIDES (Dynamic Hero Banner Slides)
        # ==========================================================
        hero_slides_data = [
            {
                "title": "Turnkey Industrial Machinery & Plants",
                "badge": "Nepal's Premier Industrial Machinery Manufacturer",
                "heading": "Engineered Machinery & Turnkey Industrial Plants",
                "subtext": "Specializing in cold storage facilities, water purification plants, automated dairy processing, stainless steel equipment fabrication, and high-efficiency solar thermal systems.",
                "image": "site_settings/hero/hero_machinery_bg.jpg",
                "primary_cta_label": "Explore Machinery",
                "primary_cta_link": "/products",
                "secondary_cta_label": "Request a Quote",
                "secondary_cta_link": "/contact-us#quote",
                "order": 1,
            },
            {
                "title": "Commercial Cold Storage & Blast Freezers",
                "badge": "Agro & Pharmaceutical Cold Chain Engineering",
                "heading": "Controlled-Atmosphere Cold Storage & Blast Freezers",
                "subtext": "State-of-the-art multi-zone cold storage rooms for fruits, vegetables, dairy, medicines, and rapid blast freezing with automated temperature telemetry.",
                "image": "site_settings/hero/hero_cold_storage.jpg",
                "primary_cta_label": "View Cold Storage",
                "primary_cta_link": "/categories/cold-storage-refrigeration",
                "secondary_cta_label": "Contact Engineering",
                "secondary_cta_link": "/contact-us",
                "order": 2,
            },
            {
                "title": "Turnkey Dairy Processing & Water Purification",
                "badge": "Automated Food & Beverage Lines",
                "heading": "Automated Dairy Plants & Industrial Water Treatment",
                "subtext": "Complete automated engineering for continuous HTST milk pasteurization, rotary rinsing-filling-capping bottling lines, and industrial two-pass RO filtration.",
                "image": "site_settings/hero/hero_water_dairy.jpg",
                "primary_cta_label": "Explore Dairy & Water",
                "primary_cta_link": "/categories/dairy-machinery",
                "secondary_cta_label": "Get Custom Proposal",
                "secondary_cta_link": "/contact-us#quote",
                "order": 3,
            },
        ]

        for sdata in hero_slides_data:
            HeroSlide.objects.create(
                title=sdata["title"],
                badge=sdata["badge"],
                heading=sdata["heading"],
                subtext=sdata["subtext"],
                image=sdata["image"],
                primary_cta_label=sdata["primary_cta_label"],
                primary_cta_link=sdata["primary_cta_link"],
                secondary_cta_label=sdata["secondary_cta_label"],
                secondary_cta_link=sdata["secondary_cta_link"],
                order=sdata["order"],
                is_active=True,
            )
            self.stdout.write(f"  [+] Created Hero Slide: {sdata['heading']}")

        # ==========================================================
        # 0c. SITE CONTENT (Corporate Introduction Copy)
        # ==========================================================
        site_content = SiteContent.get_solo()
        site_content.title = "JP Engineering & Construction Pvt. Ltd."
        site_content.short_intro = DEFAULT_SHORT_INTRO
        site_content.full_intro = DEFAULT_FULL_INTRO
        site_content.save()
        self.stdout.write("  [+] Configured SiteContent (Short & Full Corporate Introduction)")

        # ==========================================================
        # 1. CATEGORIES (The 7 Real Industrial Divisions)
        # ==========================================================
        categories_data = [
            {
                "name": "Water Treatment Systems",
                "slug": "water-treatment",
                "description": "Community-based water treatment for schools, hospitals, and corporate facilities plus turnkey industrial RO plants for bottle and jar sections.",
                "order": 1,
                "image": "water_treatment_ro_plant.jpg",
            },
            {
                "name": "Dairy Plant Machinery",
                "slug": "dairy-machinery",
                "description": "Machinery for pouch milk, curd, ghee, ice cream, cheese, panir, khuwa, and bottled dairy products; HTST pasteurizers and homogenizers.",
                "order": 2,
                "image": "dairy_pasteurizer_plant.jpg",
            },
            {
                "name": "Industrial Refrigeration & Cold Storage",
                "slug": "cold-storage-refrigeration",
                "description": "Storage systems for vaccines, fruits, vegetables, dairy, and medicines; ammonia refrigeration units, blast freezers, and spare parts.",
                "order": 3,
                "image": "cold_storage_blast_freezer.jpg",
            },
            {
                "name": "Solar Energy & Irrigation Systems",
                "slug": "solar-irrigation",
                "description": "Eco-friendly solar-powered irrigation pumping systems and community drinking water supply stations.",
                "order": 4,
                "image": "solar_irrigation_pump.jpg",
            },
            {
                "name": "Solar Energy & Heat Pump Systems",
                "slug": "solar-heat-pump",
                "description": "Commercial air-source heat pump systems and solar thermal water heating for hotels, hostels, hospitals, and corporate facilities.",
                "order": 5,
                "image": "commercial_heat_pump.jpg",
            },
            {
                "name": "Meat Mincing & Packaging Machinery",
                "slug": "meat-mincing-packaging",
                "description": "Heavy-duty meat grinders, commercial chamber vacuum packaging machines, continuous plastic sealers, and sausage stuffers.",
                "order": 6,
                "image": "meat_packaging_machine.jpg",
            },
            {
                "name": "Steel Fabrication",
                "slug": "steel-fabrication",
                "description": "Tanker fabrication, stainless steel process tanks, pressure vessels, industrial basins, and commercial kitchen shelf fabrication.",
                "order": 7,
                "image": "stainless_steel_fabrication.jpg",
            },
        ]

        category_objs = {}
        for cdata in categories_data:
            cat = Category.objects.create(
                name=cdata["name"],
                slug=cdata["slug"],
                description=cdata["description"],
                order=cdata["order"],
                is_active=True,
            )
            cat_img_bytes = load_verified_image(cdata["image"], cat.name, 600, 400)
            cat.icon_or_image.save(f"cat_{cat.slug}.jpg", ContentFile(cat_img_bytes), save=True)
            category_objs[cat.slug] = cat
            self.stdout.write(f"  [+] Created Category: {cat.name}")

        # ==========================================================
        # 2. PRODUCTS (18 Authentic Products across the 7 Real Lines)
        # ==========================================================
        products_data = [
            # --- 1. Water Treatment ---
            {
                "name": "Industrial Reverse Osmosis Water Treatment Plant",
                "slug": "industrial-reverse-osmosis-water-plant",
                "categories": ["water-treatment"],
                "image": "water_treatment_ro_plant.jpg",
                "short_description": "High-capacity two-pass RO skid engineered for industrial process water, bottling facilities, and pure mineral recovery.",
                "full_description": (
                    "The JP Industrial Reverse Osmosis (RO) Water Treatment Plant is precision engineered for high-duty continuous operation in manufacturing plants, beverage bottling lines, and municipal utility stations. Featuring multi-stage pre-filtration with automated backwash cycles, the system removes dissolved solids, micro-particulates, and organic contaminants down to 0.0001 microns.\n\n"
                    "Constructed upon a heavy-gauge structural stainless steel skid, each unit integrates high-pressure multi-stage Grundfos pumps, FilmTec high-rejection polyamide spiral-wound membranes, and an automated CIP (Clean-In-Place) flushing system. The modular layout allows parallel scaling to match facility expansion while maintaining compact plant room footprints.\n\n"
                    "Comprehensive instrumentation includes inline conductivity probes, digital differential pressure transmitters, and an IP65-rated Siemens S7-1200 PLC control cabinet featuring an intuitive high-definition HMI touchscreen for real-time membrane performance logging and remote telemetry."
                ),
                "is_featured": True,
                "order": 1,
                "specs": [
                    ("Permeate Output Capacity", "25,000 Liters / Hour"),
                    ("Membrane Configuration", "8-inch High Rejection TFC Elements (x12)"),
                    ("Operating Pressure", "14 to 18 Bar continuous"),
                    ("Structural Skid Material", "AISI 304 Stainless Steel"),
                    ("Control Architecture", "Siemens S7-1200 PLC with 7-inch HMI"),
                    ("Dimensions (L x W x H)", "4,800 mm x 1,600 mm x 2,100 mm"),
                ],
            },
            {
                "name": "Community Drinking Water Treatment Station",
                "slug": "community-drinking-water-treatment-station",
                "categories": ["water-treatment"],
                "image": "water_treatment_ro_plant.jpg",
                "short_description": "Turnkey multi-barrier filtration and UV disinfection station for schools, colleges, hospitals, and public institutions.",
                "full_description": (
                    "Designed specifically for public institutions, educational campuses, and healthcare centers, this community drinking water station delivers reliable, pathogen-free potable water meeting WHO quality guidelines.\n\n"
                    "The system combines dual-media quartz sand filtration, activated carbon adsorption for chlorine and odor removal, micron sediment polishing, and high-intensity ultraviolet (UV) germicidal disinfection.\n\n"
                    "Built with food-grade stainless steel manifolds and tamper-resistant lockable enclosures, it requires minimal daily operator intervention and features automated backwashing timers."
                ),
                "is_featured": True,
                "order": 2,
                "specs": [
                    ("Treated Water Delivery", "5,000 to 10,000 Liters / Hour"),
                    ("Disinfection Technology", "High-Intensity UV-C Disinfection Skid"),
                    ("Filtration Media", "High-Purity Quartz Sand & Coconut Shell Carbon"),
                    ("Manifold Construction", "Sanitary Grade Stainless Steel SS304"),
                    ("Target Deployment", "Schools, Colleges, Hospitals, Public Institutions"),
                ],
            },
            {
                "name": "Turnkey Rotary Rinsing-Filling-Capping Bottling Line",
                "slug": "rotary-rinsing-filling-capping-bottling-line",
                "categories": ["water-treatment"],
                "image": "beverage_bottling_line.jpg",
                "short_description": "Automated 3-in-1 monoblock line for PET bottles and 20-liter water jars with precision liquid filling valves.",
                "full_description": (
                    "The JP Rotary Monoblock Bottling Line is engineered for high-speed automated packaging of purified drinking water into 500ml, 1000ml bottles and 20-liter commercial jars.\n\n"
                    "Constructed entirely from sanitary AISI 304/316 stainless steel, the monoblock integrates automated bottle air-rinsing, isobaric precision gravity filling, and magnetic torque screw capping in a single enclosed hygienic cabinet.\n\n"
                    "Integrated variable-frequency speed control, no-bottle-no-fill optical sensors, and stainless steel slat chain conveyors ensure smooth continuous plant production."
                ),
                "is_featured": True,
                "order": 3,
                "specs": [
                    ("Production Speed", "4,000 to 6,000 Bottles / Hour (500ml)"),
                    ("Bottle Size Range", "250ml to 2000ml PET & 20L Water Jars"),
                    ("Filling Valve Precision", "+/- 2mm liquid level accuracy"),
                    ("Machine Framework", "Heavy Stainless Steel AISI 304/316"),
                    ("Automation Suite", "Touchscreen HMI with Optical Line Telemetry"),
                ],
            },

            # --- 2. Dairy Plant Machinery ---
            {
                "name": "Continuous HTST Milk Pasteurizer & Heat Exchanger",
                "slug": "continuous-htst-milk-pasteurizer-plant",
                "categories": ["dairy-machinery"],
                "image": "dairy_pasteurizer_plant.jpg",
                "short_description": "High-efficiency plate pasteurization plant with automated holding tube, diversion valve, and heat regeneration.",
                "full_description": (
                    "Engineered for modern commercial dairies, this High-Temperature Short-Time (HTST) milk pasteurizer processes raw milk to destroy pathogenic micro-organisms while preserving natural nutritional qualities and milk flavor.\n\n"
                    "Featuring multi-section sanitary stainless steel plate heat exchangers with up to 90% thermal heat regeneration, an insulated stainless holding tube, and an automated pneumatic flow diversion valve that automatically redirects under-pasteurized milk.\n\n"
                    "Built with an ergonomic Siemens PLC interface recording pasteurization temperature graphs in compliance with national dairy quality standards."
                ),
                "is_featured": True,
                "order": 4,
                "specs": [
                    ("Processing Capacity", "3,000 to 10,000 Liters / Hour"),
                    ("Pasteurization Temperature", "72 C to 75 C with 15-second holding tube"),
                    ("Thermal Regeneration", "Up to 90% heat recovery efficiency"),
                    ("Sanitary Standard", "3A & EHEDG Dairy Compliant SS316L Plates"),
                    ("Safety Feature", "Pneumatic Automatic Flow Diversion Valve"),
                ],
            },
            {
                "name": "Sanitary High-Pressure Dairy Homogenizer & Deaerator",
                "slug": "sanitary-high-pressure-dairy-homogenizer",
                "categories": ["dairy-machinery"],
                "image": "dairy_pasteurizer_plant.jpg",
                "short_description": "Two-stage micro-homogenization skid for uniform fat globule dispersion in pouch milk, curd, and ice cream.",
                "full_description": (
                    "Essential for commercial milk processing, curd, ice cream, and flavoured dairy beverages, this high-pressure homogenizer breaks milk fat globules down to sub-micron diameters to prevent cream separation and provide a rich mouthfeel.\n\n"
                    "Featuring a forged stainless steel single-block cylinder, ceramic wear valves, and dual-stage hydraulic pressure regulation with pulsation dampeners.\n\n"
                    "Fully compatible with automated CIP cycles and temperature monitoring alarms for uninterrupted daily operation."
                ),
                "is_featured": False,
                "order": 5,
                "specs": [
                    ("Homogenizing Capacity", "5,000 Liters / Hour"),
                    ("Working Pressure", "Up to 250 Bar (Two-Stage Valve Assembly)"),
                    ("Valve Block Material", "Forged High-Grade AISI 316L Stainless"),
                    ("Motor Rating", "37 kW Heavy Industrial Duty"),
                    ("Application Range", "Pouch Milk, Curd, Ice Cream, Yogurt, Dairy Beverages"),
                ],
            },
            {
                "name": "Automated Pouch Milk & Curd Packaging Machine",
                "slug": "automated-pouch-milk-curd-packaging-machine",
                "categories": ["dairy-machinery"],
                "image": "beverage_bottling_line.jpg",
                "short_description": "Vertical form-fill-seal packaging machine for pouch milk, buttermilk, curd, and liquid dairy products.",
                "full_description": (
                    "Precision vertical form-fill-seal (VFFS) machine built specifically for dairy liquid and viscous packaging. Forms, fills, seals, and batch-codes standard 500ml and 1000ml LDPE pouches under hygienic conditions.\n\n"
                    "Includes an integrated UV film sterilizer lamp, precise piston dosing pumps for thick curd and liquid milk, and pneumatic horizontal sealing jaws with temperature controllers.\n\n"
                    "Stainless steel contact surfaces prevent contamination and facilitate quick washdowns between packaging shifts."
                ),
                "is_featured": False,
                "order": 6,
                "specs": [
                    ("Packaging Speed", "1,800 to 2,500 Pouches / Hour"),
                    ("Pouch Volume Range", "200ml, 500ml, 1000ml"),
                    ("Dosing Accuracy", "+/- 1.5% volumetric precision"),
                    ("Film Sterilization", "Continuous Inline Ultraviolet (UV) Lamp"),
                    ("Product Handling", "Pouch Milk, Dahi (Curd), Buttermilk, Ghee"),
                ],
            },
            {
                "name": "Stainless Steel Jacketed Bulk Milk Cooling Tank",
                "slug": "stainless-steel-bulk-milk-cooling-tank",
                "categories": ["dairy-machinery", "steel-fabrication"],
                "image": "stainless_steel_fabrication.jpg",
                "short_description": "Dimple-jacketed direct-expansion bulk milk chiller for village collection centers and dairy factories.",
                "full_description": (
                    "Constructed to rapidly chill freshly collected raw milk from 35 C down to 4 C, preventing bacterial multiplication and maintaining milk acidity standards.\n\n"
                    "Features a laser-welded dimple jacket bottom with direct expansion freon refrigeration, high-density polyurethane insulation, and a low-speed sanitary agitator.\n\n"
                    "Equipped with digital temperature indicators, automatic CIP spray balls, and food-grade stainless steel butterfly drain valves."
                ),
                "is_featured": True,
                "order": 7,
                "specs": [
                    ("Storage Capacity", "2,000 to 5,000 Liters"),
                    ("Cooling Performance", "35 C to 4 C within 2.5 hours"),
                    ("Insulation Type", "High-Density Eco-Friendly Polyurethane Foam (PUF)"),
                    ("Inner Shell Material", "Sanitary Polished AISI 304 Stainless Steel"),
                    ("Agitator Type", "Low-RPM Stainless Paddle with Gearmotor"),
                ],
            },

            # --- 3. Industrial Refrigeration & Cold Storage ---
            {
                "name": "Controlled-Atmosphere Agro Cold Storage & Blast Freezer",
                "slug": "controlled-atmosphere-cold-storage-blast-freezer",
                "categories": ["cold-storage-refrigeration"],
                "image": "cold_storage_blast_freezer.jpg",
                "short_description": "Turnkey commercial cold storage rooms for fruits, vegetables, medicines, and rapid blast freezing.",
                "full_description": (
                    "JP Engineering designs and erects complete commercial cold storage facilities and industrial IQF blast freezers tailored for apple, potato, vegetable, and dairy bulk storage.\n\n"
                    "Constructed using modular cam-lock polyisocyanurate (PIR) insulated panels with high-efficiency ceiling-hung evaporator blowers and weather-proof external condensing units.\n\n"
                    "Features digital multi-zone microclimatic controllers with remote humidity regulation, automatic hot-gas defrost cycles, and heavy-duty insulated sliding doors with safety release handles."
                ),
                "is_featured": True,
                "order": 8,
                "specs": [
                    ("Temperature Operating Range", "+15 C down to -35 C (Chilling to Blast Freeze)"),
                    ("Panel Insulation", "100mm to 150mm High-Density PIR Modular Panels"),
                    ("Refrigeration System", "Semi-Hermetic Compressor with Economizer Cycle"),
                    ("Defrost Method", "Automated Hot-Gas & Electric Coil Defrost"),
                    ("Typical Storage", "Vaccines, Apples, Potatoes, Dairy, Meat, Agro Produce"),
                ],
            },
            {
                "name": "Industrial Ammonia Screw Compressor Chiller Package",
                "slug": "industrial-ammonia-screw-compressor-chiller",
                "categories": ["cold-storage-refrigeration"],
                "image": "cold_storage_blast_freezer.jpg",
                "short_description": "Heavy industrial refrigeration package for bulk dairy, food processing, and large commercial ice plants.",
                "full_description": (
                    "Engineered for large industrial facilities requiring continuous heavy refrigeration duty with maximum thermodynamic coefficient of performance (COP).\n\n"
                    "Driven by high-reliability semi-hermetic screw compressors with step-less slide valve capacity control (10% to 100%), integrated oil separators, and shell-and-tube evaporators.\n\n"
                    "Equipped with automated microprocessor safety cutoffs for oil pressure, suction superheat, and discharge pressure limits."
                ),
                "is_featured": False,
                "order": 9,
                "specs": [
                    ("Refrigeration Capacity", "250 kW to 850 kW Chilling Output"),
                    ("Refrigerant Compatibility", "NH3 (Ammonia R717) / Eco Glycol"),
                    ("Capacity Modulation", "Step-less 10% - 100% Slide Valve"),
                    ("Condenser Configuration", "Induced-Draft Evaporative Condenser Bank"),
                ],
            },
            {
                "name": "Vaccine & Pharmaceutical Cold Storage Walk-in Unit",
                "slug": "vaccine-pharmaceutical-cold-storage-unit",
                "categories": ["cold-storage-refrigeration"],
                "image": "cold_storage_blast_freezer.jpg",
                "short_description": "Precision temperature walk-in cold rooms (+2 C to +8 C) with dual redundant cooling circuits for medicines and vaccines.",
                "full_description": (
                    "Certified cold chain storage for hospital medical supplies, vaccines, and biotechnology formulations requiring strict uninterrupted 2 C to 8 C temperature bands.\n\n"
                    "Includes 100% duty redundant twin refrigeration condensing circuits with automated duty-cycle rotation and automatic generator failover triggers.\n\n"
                    "Built with 24/7 continuous digital temperature data logging, SMS/Email alarm notifications, and hermetic clean-room interior wall linings."
                ),
                "is_featured": False,
                "order": 10,
                "specs": [
                    ("Temperature Stability", "+2 C to +8 C (+/- 0.5 C Precision)"),
                    ("Redundancy Setup", "Dual 100% Redundant Independent Compressors"),
                    ("Monitoring System", "Continuous 21 CFR Part 11 Compliant Data Logger"),
                    ("Alarm Telemetry", "Audible Siren, Visual Strobe, and GSM SMS Alerts"),
                ],
            },

            # --- 4. Solar Energy & Irrigation Systems ---
            {
                "name": "Solar-Powered Agricultural Irrigation Pumping Skid",
                "slug": "solar-powered-agricultural-irrigation-pumping-skid",
                "categories": ["solar-irrigation"],
                "image": "solar_irrigation_pump.jpg",
                "short_description": "Direct solar PV powered submersible borehole pumping station for commercial farms and canal networks.",
                "full_description": (
                    "An eco-friendly, cost-effective irrigation solution replacing expensive diesel generators in agricultural valleys and rural farm cooperatives.\n\n"
                    "Combines high-efficiency Tier-1 monocrystalline solar PV panels with a smart MPPT (Maximum Power Point Tracking) solar pump inverter and a stainless steel multi-stage submersible pump.\n\n"
                    "Operates directly on sunlight without requiring batteries, delivering reliable pressurized water for drip systems, sprinkler networks, and open furrow irrigation."
                ),
                "is_featured": True,
                "order": 11,
                "specs": [
                    ("Solar Array Capacity", "5 kWp to 25 kWp Ground-Mounted Array"),
                    ("Water Discharge Flow", "15,000 to 50,000 Liters / Hour"),
                    ("Operating Head", "Up to 120 Meters Borehole / River Head"),
                    ("Inverter Architecture", "Smart Solar VFD with MPPT Efficiency > 98%"),
                    ("Pump Construction", "Complete AISI 304 Stainless Steel Submersible"),
                ],
            },
            {
                "name": "Community Solar Drinking Water Pumping Station",
                "slug": "community-solar-drinking-water-pumping-station",
                "categories": ["solar-irrigation", "water-treatment"],
                "image": "solar_irrigation_pump.jpg",
                "short_description": "Autonomous solar water lifting station with overhead reservoir delivery for rural villages and institutions.",
                "full_description": (
                    "Engineered for municipal communities, hill village drinking water schemes, and institutions where grid electrical supply is intermittent or unavailable.\n\n"
                    "Includes an all-weather galvanized ground structure, solar PV strings, water level sensors, and automated tank-full cutoff controls.\n\n"
                    "Zero running energy cost with long-life components requiring virtually zero routine maintenance."
                ),
                "is_featured": False,
                "order": 12,
                "specs": [
                    ("Pumping Delivery", "20,000 to 80,000 Liters Daily Yield"),
                    ("Solar Tracker Mount", "Fixed Angle Heavy Galvanized Steel Framing"),
                    ("Protection Class", "IP66 Weatherproof Outdoor Control Cubicle"),
                    ("Automated Features", "Dry-Run Protection & High-Tank Level Cutoff"),
                ],
            },

            # --- 5. Solar Energy & Heat Pump Systems ---
            {
                "name": "Commercial Air-Source Heat Pump Central Water Heater",
                "slug": "commercial-air-source-heat-pump-central-water-heater",
                "categories": ["solar-heat-pump"],
                "image": "commercial_heat_pump.jpg",
                "short_description": "High-efficiency thermal heat pump producing 60 C hot water with up to 75% energy savings for hotels and hospitals.",
                "full_description": (
                    "The modern energy-efficient heating solution for hotels, hostels, hospitals, sports complexes, and corporate staff quarters. Absorbs ambient thermal energy from outside air and transfers it into water at COP ratings above 4.0.\n\n"
                    "Features Copeland scroll compressors with EVI vapor injection for sub-zero performance, hydrophilic aluminum fin coils, and titanium shell-and-tube heat exchangers.\n\n"
                    "Cuts electricity bills by up to 75% compared to conventional electrical geysers or diesel boilers."
                ),
                "is_featured": True,
                "order": 13,
                "specs": [
                    ("Heating Thermal Capacity", "60 kW to 180 kW Thermal Output"),
                    ("Hot Water Supply Temp", "Up to 60 C to 65 C Continuous"),
                    ("Coefficient of Performance", "COP 4.2 (Air 20 C / Water 55 C)"),
                    ("Compressor Type", "EVI Enhanced Vapor Injection Scroll Compressor"),
                    ("Applications", "Hotels, Hostels, Hospitals, Sports Clubs, Industrial Plants"),
                ],
            },
            {
                "name": "Solar Thermal & Heat Pump Hybrid Hot Water Array",
                "slug": "solar-thermal-heat-pump-hybrid-hot-water-array",
                "categories": ["solar-heat-pump"],
                "image": "commercial_heat_pump.jpg",
                "short_description": "Combined solar flat-plate evacuated tube collectors and heat pump backup for zero-carbon hot water.",
                "full_description": (
                    "This hybrid heating system maximizes renewable solar heating on sunny days and seamlessly blends with the air-source heat pump on cloudy days or peak night usage.\n\n"
                    "Includes evacuated glass tube solar collectors with copper heat pipes, central stainless steel insulated storage buffer tanks, and electronic differential controllers.\n\n"
                    "Provides 24/7 continuous pressurized hot water to every guest room, patient ward, or processing facility."
                ),
                "is_featured": False,
                "order": 14,
                "specs": [
                    ("Daily Hot Water Output", "5,000 to 20,000 Liters / Day"),
                    ("Collector Technology", "Three-Target Evacuated Solar Heat Pipe Tubes"),
                    ("Buffer Tank Construction", "AISI 304 Stainless Inner with 60mm PUF Insulation"),
                    ("Backup Heating", "Integrated Commercial Heat Pump Auto-Switching"),
                ],
            },

            # --- 6. Meat Mincing & Packaging Machinery ---
            {
                "name": "Heavy-Duty Industrial Meat Mincing Grinder",
                "slug": "heavy-duty-industrial-meat-mincing-grinder",
                "categories": ["meat-mincing-packaging"],
                "image": "meat_packaging_machine.jpg",
                "short_description": "High-torque stainless steel commercial meat grinder for butcheries, sausage plants, and processing kitchens.",
                "full_description": (
                    "Built for demanding commercial kitchens, sausage production plants, and meat processing facilities requiring continuous rapid mincing without crushing meat fibers.\n\n"
                    "Features a heavy stainless steel feeding hopper, hardened tool-steel cutting knives, and reversible worm gears driven by a fan-cooled motor with thermal overload protection.\n\n"
                    "Entirely washable food-contact parts easily disassemble within seconds without tools for daily sanitization."
                ),
                "is_featured": True,
                "order": 15,
                "specs": [
                    ("Throughput Capacity", "500 kg to 1,200 kg / Hour"),
                    ("Cutting Plate Diameters", "3mm, 5mm, 8mm, 12mm interchangeable"),
                    ("Motor Power", "5.5 kW Heavy Gear-Drive Motor with Reverse"),
                    ("Machine Body", "Heavy Gauge Sanitary Stainless Steel AISI 304"),
                    ("Safety Features", "Feeding Throat Guard & Emergency Stop Switch"),
                ],
            },
            {
                "name": "Commercial Double-Chamber Vacuum Packaging Machine",
                "slug": "commercial-double-chamber-vacuum-packaging-machine",
                "categories": ["meat-mincing-packaging"],
                "image": "meat_packaging_machine.jpg",
                "short_description": "Twin-chamber vacuum packaging machine with gas flushing for extended shelf life of meats, cheese, and produce.",
                "full_description": (
                    "Heavy-duty double chamber vacuum packaging unit designed for continuous commercial packaging of fresh meat cuts, sausages, cheese blocks, and food portions.\n\n"
                    "While one chamber is vacuum-sealing under its transparent heavy lid, the operator loads bags into the second chamber, maximizing packing throughput.\n\n"
                    "Includes an oil-immersed high-vacuum Busch-type rotary pump, digital vacuum level controller, and optional inert gas flushing for delicate foods."
                ),
                "is_featured": False,
                "order": 16,
                "specs": [
                    ("Chamber Configuration", "Dual High-Volume Stainless Steel Chambers"),
                    ("Sealing Bar Length", "600 mm x 2 per Chamber (Dual Sealing)"),
                    ("Vacuum Pump Flow", "40 to 63 m3 / Hour Rotary Vane Vacuum Pump"),
                    ("Cycle Time", "15 to 30 Seconds per Batch"),
                    ("Packaging Uses", "Fresh Meats, Processed Sausages, Cheese, Dried Fruits"),
                ],
            },

            # --- 7. Steel Fabrication ---
            {
                "name": "Sanitary Stainless Steel Tanker & Process Vessel",
                "slug": "sanitary-stainless-steel-tanker-process-vessel",
                "categories": ["steel-fabrication", "dairy-machinery"],
                "image": "stainless_steel_fabrication.jpg",
                "short_description": "Custom fabricated road milk tankers, chemical vessels, and cylindrical stainless storage silos.",
                "full_description": (
                    "JP Engineering fabricates certified food-grade and industrial storage vessels, road milk transport tankers, and pressure tanks from AISI 304 and 316 stainless steel.\n\n"
                    "Fabricated by certified TIG and automated submerged-arc welders with polished internal seams down to Ra < 0.4 microns for sanitary CIP cleanability.\n\n"
                    "Equipped with manways, pressure-relief safety vents, level sight gauges, spray cleaning balls, and calibrated structural saddle legs."
                ),
                "is_featured": True,
                "order": 17,
                "specs": [
                    ("Fabrication Volume", "1,000 Liters to 50,000 Liters Custom Built"),
                    ("Sheet Thickness", "3mm to 12mm Stainless Steel Plate"),
                    ("Welding Methodology", "100% Argon Shielded TIG with X-Ray Inspection"),
                    ("Surface Finish", "Internal Mirror Polish (Ra < 0.4um), Satin External"),
                    ("Vessel Styles", "Insulated Road Tankers, Vertical Silos, Pressure Vessels"),
                ],
            },
            {
                "name": "Commercial Kitchen SS Basin & Heavy Storage Shelf",
                "slug": "commercial-kitchen-ss-basin-heavy-storage-shelf",
                "categories": ["steel-fabrication"],
                "image": "stainless_steel_fabrication.jpg",
                "short_description": "Heavy gauge stainless steel commercial kitchen wash basins, prep tables, and reinforced storage shelving.",
                "full_description": (
                    "Custom designed and fabricated for commercial hotels, corporate canteens, hospital kitchens, and food processing plants requiring heavy sanitary equipment.\n\n"
                    "Constructed from corrosion-proof AISI 304 stainless steel with sound-deadening undercoating on basins, deep sinks, and reinforced undershelves.\n\n"
                    "Engineered with rounded hygienic corners, backsplash panels, and adjustable leveling bullet feet."
                ),
                "is_featured": False,
                "order": 18,
                "specs": [
                    ("Material Specifications", "16 Gauge (1.5mm) AISI 304 Stainless Steel"),
                    ("Basin Configuration", "Single, Double, or Triple Deep Bowl Options"),
                    ("Load Capacity", "Up to 350 kg Distributed Weight per Shelf"),
                    ("Edge Finishing", "Anti-Drip Rolled Edges with Sanitary Radius Corners"),
                ],
            },
        ]

        created_products = []
        for pdata in products_data:
            prod = Product.objects.create(
                name=pdata["name"],
                slug=pdata["slug"],
                short_description=pdata["short_description"],
                full_description=pdata["full_description"],
                is_featured=pdata["is_featured"],
                order=pdata["order"],
                is_active=True,
            )

            # Link categories
            cat_list = [category_objs[cslug] for cslug in pdata["categories"] if cslug in category_objs]
            prod.categories.set(cat_list)

            # Create dynamic specifications
            for idx, (lbl, val) in enumerate(pdata["specs"]):
                ProductSpecification.objects.create(
                    product=prod,
                    label=lbl,
                    value=val,
                    order=idx,
                )

            # Assign verified matching image directly from local media
            img_bytes = load_verified_image(pdata["image"], prod.name, 800, 600)
            pimg = ProductImage.objects.create(
                product=prod,
                alt_text=f"{prod.name} Industrial View",
                order=0,
                is_primary=True,
            )
            pimg.image.save(f"{prod.slug}_primary.jpg", ContentFile(img_bytes), save=True)

            created_products.append(prod)
            self.stdout.write(f"  [+] Created Product: {prod.name} ({len(pdata['specs'])} specs)")

        products_by_slug = {p.slug: p for p in created_products}

        # ==========================================================
        # 2b. INDUSTRIES (Dynamic Industrial Sectors linking Categories & Machinery)
        # ==========================================================
        industries_data = [
            {
                "name": "Dairy & Milk Industry",
                "slug": "dairy-milk-industry",
                "description": "Comprehensive turnkey engineering for milk collection, bulk chilling, continuous HTST pasteurization, homogenization, and pouch/bottle dairy packaging plants.",
                "order": 1,
                "image": "dairy_pasteurizer_plant.jpg",
                "category_slugs": ["dairy-machinery", "steel-fabrication", "cold-storage-refrigeration"],
                "product_slugs": [
                    "continuous-htst-milk-pasteurizer-plant",
                    "sanitary-high-pressure-dairy-homogenizer",
                    "automated-pouch-milk-curd-packaging-machine",
                    "stainless-steel-bulk-milk-cooling-tank",
                    "sanitary-stainless-steel-tanker-process-vessel",
                ],
            },
            {
                "name": "Fruits & Agro Processing Industry",
                "slug": "fruits-agro-processing",
                "description": "Controlled-atmosphere cold storage, rapid blast freezing, solar irrigation pumps, and vacuum packaging systems for orchards, vegetable farms, and post-harvest agro centers.",
                "order": 2,
                "image": "cold_storage_blast_freezer.jpg",
                "category_slugs": ["cold-storage-refrigeration", "solar-irrigation"],
                "product_slugs": [
                    "controlled-atmosphere-cold-storage-blast-freezer",
                    "commercial-double-chamber-vacuum-packaging-machine",
                    "solar-powered-agricultural-irrigation-pumping-skid",
                ],
            },
            {
                "name": "Beverages & Water Treatment Industry",
                "slug": "beverages-water-treatment",
                "description": "Turnkey two-pass industrial reverse osmosis plants, rotary 3-in-1 bottle/jar packaging monoblocks, and high-intensity UV germicidal water purification stations.",
                "order": 3,
                "image": "beverage_bottling_line.jpg",
                "category_slugs": ["water-treatment"],
                "product_slugs": [
                    "industrial-reverse-osmosis-water-plant",
                    "community-drinking-water-treatment-station",
                    "rotary-rinsing-filling-capping-bottling-line",
                    "community-solar-drinking-water-pumping-station",
                ],
            },
            {
                "name": "Cold Chain & Logistics Industry",
                "slug": "cold-chain-logistics",
                "description": "Heavy industrial ammonia screw chillers, vaccine walk-in cold rooms (+2 C to +8 C), blast freezers, and sanitary insulated road transport tankers.",
                "order": 4,
                "image": "cold_storage_blast_freezer.jpg",
                "category_slugs": ["cold-storage-refrigeration", "steel-fabrication"],
                "product_slugs": [
                    "industrial-ammonia-screw-compressor-chiller",
                    "vaccine-pharmaceutical-cold-storage-unit",
                    "controlled-atmosphere-cold-storage-blast-freezer",
                    "sanitary-stainless-steel-tanker-process-vessel",
                ],
            },
            {
                "name": "Meat & Poultry Processing Industry",
                "slug": "meat-poultry-processing",
                "description": "High-torque industrial meat grinders, double-chamber vacuum packaging machines with gas flushing, and food-grade stainless steel prep tables and wash basins.",
                "order": 5,
                "image": "meat_packaging_machine.jpg",
                "category_slugs": ["meat-mincing-packaging", "steel-fabrication"],
                "product_slugs": [
                    "heavy-duty-industrial-meat-mincing-grinder",
                    "commercial-double-chamber-vacuum-packaging-machine",
                    "commercial-kitchen-ss-basin-heavy-storage-shelf",
                ],
            },
        ]

        for idata in industries_data:
            ind = Industry.objects.create(
                name=idata["name"],
                slug=idata["slug"],
                description=idata["description"],
                order=idata["order"],
                is_active=True,
            )
            # Link categories
            linked_cats = [category_objs[cslug] for cslug in idata["category_slugs"] if cslug in category_objs]
            ind.categories.set(linked_cats)

            # Link products
            for pslug in idata["product_slugs"]:
                if pslug in products_by_slug:
                    products_by_slug[pslug].industries.add(ind)

            # Assign image
            ind_img_bytes = load_verified_image(idata["image"], ind.name, 600, 400)
            ind.icon_or_image.save(f"ind_{ind.slug}.jpg", ContentFile(ind_img_bytes), save=True)

            self.stdout.write(f"  [+] Created Industry: {ind.name} ({ind.categories.count()} categories, {ind.products.count()} products)")

        # ==========================================================
        # 3. TEAM MEMBERS (Authentic Engineering Leadership with Pravatar Headshots)
        # ==========================================================
        team_data = [
            ("Er. Ramesh Adhikari", "Managing Director & Principal Mechanical Engineer", 1, "https://i.pravatar.cc/400?img=11"),
            ("Sunita Sharma", "VP of Industrial Operations & Project Logistics", 2, "https://i.pravatar.cc/400?img=32"),
            ("Er. Bikash Thapa", "Lead Automation & SCADA Control Systems Engineer", 3, "https://i.pravatar.cc/400?img=68"),
            ("Anjali Shrestha", "Head of Quality Assurance & ISO Compliance", 4, "https://i.pravatar.cc/400?img=49"),
            ("Er. Dipendra Poudel", "Senior Thermal & Industrial Refrigeration Specialist", 5, "https://i.pravatar.cc/400?img=59"),
            ("Manisha Giri", "Procurement & Supply Chain Lead", 6, "https://i.pravatar.cc/400?img=45"),
            ("Er. Pradeep KC", "Stainless Steel Fabrication Superintendent", 7, "https://i.pravatar.cc/400?img=12"),
        ]

        def fetch_image_bytes(url, fallback_text, w=400, h=400, bg=(241, 245, 249), fg=(30, 64, 175)):
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=5) as response:
                    if response.status == 200:
                        b = response.read()
                        if len(b) > 800:
                            return b
            except Exception:
                pass
            return create_fallback_image(w, h, fallback_text, bg_color=bg, border_color=fg)

        for name, designation, order_num, photo_url in team_data:
            member = TeamMember.objects.create(
                name=name,
                designation=designation,
                order=order_num,
                is_active=True,
            )
            photo_bytes = fetch_image_bytes(photo_url, name, 400, 480, bg=(15, 23, 42), fg=(30, 64, 175))
            member.photo.save(f"team_{member.id}.jpg", ContentFile(photo_bytes), save=True)
            self.stdout.write(f"  [+] Created Team Member: {name}")

        # ==========================================================
        # 4. PARTNERS (OEM Component & Technology Suppliers with Crisp Logos)
        # ==========================================================
        partners_data = [
            ("Danfoss Industrial Refrigeration", "https://www.danfoss.com", "Danfoss", "Refrigeration", (220, 38, 38), "DF"),
            ("Alfa Laval Process Technology", "https://www.alfalaval.com", "Alfa Laval", "Process Systems", (2, 132, 199), "AL"),
            ("Siemens Industrial Automation", "https://www.siemens.com", "Siemens", "Automation & Drives", (15, 118, 110), "SI"),
            ("Grundfos Pumping Systems", "https://www.grundfos.com", "Grundfos", "Pumping Systems", (29, 78, 216), "GF"),
            ("ABB Motors & Drives", "https://new.abb.com", "ABB", "Motors & Drives", (220, 38, 38), "ABB"),
            ("Krones Beverage Processing", "https://www.krones.com", "Krones", "Beverage Lines", (37, 99, 235), "KR"),
            ("Schneider Electric Solutions", "https://www.se.com", "Schneider", "Energy & Auto", (22, 163, 74), "SE"),
            ("Atlas Copco Compressed Air", "https://www.atlascopco.com", "Atlas Copco", "Industrial Air", (2, 132, 199), "AC"),
        ]

        for idx, (pname, purl, brand, sub, color, sym) in enumerate(partners_data):
            partner = Partner.objects.create(
                name=pname,
                website_url=purl,
                order=idx + 1,
                is_active=True,
            )
            logo_bytes = create_branded_logo(brand, sub, color, sym)
            partner.logo.save(f"partner_{partner.id}.png", ContentFile(logo_bytes), save=True)
            self.stdout.write(f"  [+] Created Partner: {pname}")

        # ==========================================================
        # 5. CLIENT REFERENCES (Institutional Client Logos)
        # ==========================================================
        clients_data = [
            ("Himalayan Spring Beverages Ltd", "https://example.com", "Himalayan Spring", "Beverages & Water", (26, 86, 160), "HS"),
            ("National Dairy Development Grid", "https://example.com", "National Dairy", "Development Grid", (14, 116, 144), "ND"),
            ("Apex Cold Chain & Logistics", "https://example.com", "Apex Cold Chain", "Logistics & Storage", (2, 132, 199), "AC"),
            ("Everest Agro Processing Mills", "https://example.com", "Everest Agro", "Processing Mills", (22, 101, 52), "EA"),
            ("Valley Health Systems & Hospital", "https://example.com", "Valley Health", "Systems & Hospital", (185, 28, 28), "VH"),
            ("Gandaki Food Products Industries", "https://example.com", "Gandaki Food", "Products Industries", (194, 65, 12), "GF"),
            ("Bagmati Community Water Authority", "https://example.com", "Bagmati Water", "Community Authority", (29, 78, 216), "BW"),
            ("Nepal Stainless Process Industries", "https://example.com", "Nepal Stainless", "Process Industries", (51, 65, 85), "NS"),
        ]

        for idx, (cname, curl, brand, sub, color, sym) in enumerate(clients_data):
            client = Client.objects.create(
                name=cname,
                website_url=curl,
                order=idx + 1,
                is_active=True,
            )
            logo_bytes = create_branded_logo(brand, sub, color, sym)
            client.logo.save(f"client_{client.id}.png", ContentFile(logo_bytes), save=True)
            self.stdout.write(f"  [+] Created Client: {cname}")

        # ==========================================================
        # 6. QUOTE REQUESTS (5 Demo Leads matching Real Product Lines)
        # ==========================================================
        quotes_data = [
            {
                "full_name": "Siddharth Koirala",
                "email": "siddharth@himalayanbeverage.com",
                "phone": "+977 985-1029384",
                "company": "Himalayan Spring Beverages Ltd",
                "product": created_products[0],  # RO Plant
                "message": (
                    "Inquiring regarding rapid mobilization, line speed specs, and utility requirements "
                    "for 25,000 LPH RO water plant and 500ml bottling line. We are commissioning our second "
                    "packaging wing and require technical layout drawings."
                ),
                "status": "new",
            },
            {
                "full_name": "Pooja Manandhar",
                "email": "pooja.m@everestagro.com",
                "phone": "+977 984-1294857",
                "company": "Everest Agro Processing Mills",
                "product": created_products[7],  # Cold Storage
                "message": (
                    "We require turnkey cold storage installation for apple and potato bulk storage "
                    "in the Pokhara valley corridor. Please provide technical duty cycle analysis and "
                    "evaporator air throw calculations."
                ),
                "status": "new",
            },
            {
                "full_name": "Dr. Rajesh Shrestha",
                "email": "rajesh@valleyhealth.org",
                "phone": "+977 980-3344556",
                "company": "Valley Health Systems & Hospital",
                "product": created_products[12],  # Heat pump
                "message": (
                    "Discussed commercial heat pump and solar hybrid water heating system for 150-bed "
                    "inpatient wing with Er. Dipendra Poudel. Awaiting final thermal schematic and piping layout."
                ),
                "status": "contacted",
            },
            {
                "full_name": "Bikash Gurung",
                "email": "bikash@nationaldairy.com.np",
                "phone": "+977 981-9988776",
                "company": "National Dairy Development Grid",
                "product": created_products[3],  # HTST Pasteurizer
                "message": (
                    "Technical consultation held regarding 5,000 LPH HTST milk pasteurizer and pouch "
                    "milk packaging unit. Please furnish complete utility load parameters."
                ),
                "status": "contacted",
            },
            {
                "full_name": "Govinda Sharma",
                "email": "g.sharma@bagmatiwater.gov.np",
                "phone": "+977 01-4258901",
                "company": "Bagmati Community Water Authority",
                "product": created_products[1],  # Community water station
                "message": (
                    "Procurement proposal approved under Contract REF: BCWA-2026-WT09 for community "
                    "water treatment stations across 4 suburban municipal schools. Moving to fabrication."
                ),
                "status": "closed",
            },
        ]

        for qdata in quotes_data:
            QuoteRequest.objects.create(
                full_name=qdata["full_name"],
                email=qdata["email"],
                phone=qdata["phone"],
                company=qdata["company"],
                product=qdata["product"],
                message=qdata["message"],
                status=qdata["status"],
            )
            self.stdout.write(f"  [+] Created Demo Quote: {qdata['full_name']} [{qdata['status'].upper()}]")

        self.stdout.write(self.style.SUCCESS("\nSuccessfully seeded authentic JP Engineering dataset!"))
        self.stdout.write(self.style.NOTICE(
            f"Summary: {len(categories_data)} categories, {len(products_data)} products, "
            f"{len(team_data)} team members, {len(partners_data)} partners, "
            f"{len(clients_data)} clients, {len(quotes_data)} quotes."
        ))
