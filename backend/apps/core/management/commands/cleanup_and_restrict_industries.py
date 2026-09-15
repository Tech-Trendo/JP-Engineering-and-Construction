import os
import shutil
from django.core.management.base import BaseCommand
from apps.showcase.models import TeamMember, Partner, Client
from apps.categories.models import Industry, Category
from apps.products.models import Product


class Command(BaseCommand):
    help = "Remove mock data (team, partners, clients) and strictly restrict industries to Dairy, Cold Store, Water, Heat Pump System, and Meat."

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("=== CLEANING UP MOCK DATA & RESTRICTING INDUSTRIES ==="))

        # ---------------------------------------------------------------------
        # 1. CLEANUP TEAM MEMBERS
        # ---------------------------------------------------------------------
        self.stdout.write(self.style.NOTICE("\n1. Cleaning up Team Members..."))
        authentic_team = [
            "Ram Chandra Prasai",
            "Chiranjibi Prasai",
            "Jyoti Prakash Prasai",
            "Sagar Kharel",
            "Ganesh Prasad Uprety",
            "Samir Mainali",
            "Irina Velichko",
            "Bharat Biswokarma",
        ]
        
        deleted_team = 0
        for tm in TeamMember.objects.all():
            if not any(auth.lower() == tm.name.lower() for auth in authentic_team):
                self.stdout.write(f"  Deleting mock team member: {tm.name} (ID: {tm.id})")
                tm.delete()
                deleted_team += 1

        # Re-index order 1..8
        for idx, auth in enumerate(authentic_team, 1):
            m = TeamMember.objects.filter(name__iexact=auth).first()
            if m:
                m.order = idx
                m.save()

        self.stdout.write(self.style.SUCCESS(f"Deleted {deleted_team} mock team members. Remaining authentic: {TeamMember.objects.count()}"))

        # ---------------------------------------------------------------------
        # 2. CLEANUP PARTNERS
        # ---------------------------------------------------------------------
        self.stdout.write(self.style.NOTICE("\n2. Cleaning up Partners..."))
        authentic_partners = [
            "Juneng",
            "Vontron",
            "Tetra Pak",
            "Seko",
            "Shanghai Precise",
            "CNP Pumps",
            "Techco",
            "Darhor Sensors",
            "Wanhe",
        ]

        deleted_partners = 0
        for p in Partner.objects.all():
            if not any(auth.lower() == p.name.lower() for auth in authentic_partners):
                self.stdout.write(f"  Deleting mock partner: {p.name} (ID: {p.id})")
                p.delete()
                deleted_partners += 1

        # Re-index order 1..9
        for idx, auth in enumerate(authentic_partners, 1):
            part = Partner.objects.filter(name__iexact=auth).first()
            if part:
                part.order = idx
                part.save()

        self.stdout.write(self.style.SUCCESS(f"Deleted {deleted_partners} mock partners. Remaining authentic: {Partner.objects.count()}"))

        # ---------------------------------------------------------------------
        # 3. CLEANUP CLIENTS
        # ---------------------------------------------------------------------
        self.stdout.write(self.style.NOTICE("\n3. Cleaning up Clients..."))
        authentic_clients = [
            "Nepal Livestock Sector Innovation Project (NLSIP)",
            "Armed Police Force (APF) Nepal",
            "Crime Investigation Department (CID) Nepal",
            "Kathmandu Upatyaka Khanepani Limited (KUKL)",
            "Nepal Medical College",
            "Nepal Bharat Maitri Hospital",
            "Nepal Cancer Hospital & Research Center",
            "Alka Hospital",
        ]

        deleted_clients = 0
        for c in Client.objects.all():
            if not any(auth.lower() == c.name.lower() for auth in authentic_clients):
                self.stdout.write(f"  Deleting mock client: {c.name} (ID: {c.id})")
                c.delete()
                deleted_clients += 1

        # Re-index order 1..8
        for idx, auth in enumerate(authentic_clients, 1):
            cl = Client.objects.filter(name__iexact=auth).first()
            if cl:
                cl.order = idx
                cl.save()

        self.stdout.write(self.style.SUCCESS(f"Deleted {deleted_clients} mock clients. Remaining authentic: {Client.objects.count()}"))

        # ---------------------------------------------------------------------
        # 4. RESTRICT INDUSTRIES (ONLY DAIRY, COLD STORE, WATER, HEAT PUMP SYSTEM, MEAT)
        # ---------------------------------------------------------------------
        self.stdout.write(self.style.NOTICE("\n4. Restricting Industries to the 5 Core Sectors..."))

        # Desired 5 industries
        industry_specs = {
            "dairy": {
                "name": "Dairy Industry",
                "slug": "dairy-industry",
                "description": "Turnkey milk chilling centers, pasteurization lines, homogenizers, ghee boilers, and modern dairy processing plants.",
                "image": "industries/ind_dairy_processing.jpg",
                "order": 1,
            },
            "cold_store": {
                "name": "Cold Store",
                "slug": "cold-storage-refrigeration",
                "description": "Industrial cold rooms, blast freezers, hermetic condensing units, and controlled atmosphere refrigeration facilities.",
                "image": "industries/ind_cold_storage.jpg",
                "order": 2,
            },
            "water": {
                "name": "Water Industry",
                "slug": "water-industry",
                "description": "Community water treatment plants, industrial RO systems, automated bottle blowing, filling, and packaging lines.",
                "image": "industries/ind_water_treatment.jpg",
                "order": 3,
            },
            "heat_pump": {
                "name": "Heat Pump System",
                "slug": "heat-pump-system",
                "description": "High-efficiency commercial air-source heat pump chillers, sanitary hot water generation, and solar thermal energy systems.",
                "image": "industries/ind_heat_pump_sys.jpg",
                "order": 4,
            },
            "meat": {
                "name": "Meat Industry",
                "slug": "meat-industry",
                "description": "Hygienic industrial meat mincers, bowl cutters, bone band saws, sausage fillers, and commercial vacuum packaging systems.",
                "image": "industries/ind_meat_processing.jpg",
                "order": 5,
            },
        }

        # Create or update the 5 industries
        active_industries = {}
        for key, spec in industry_specs.items():
            ind, created = Industry.objects.update_or_create(
                slug=spec["slug"],
                defaults={
                    "name": spec["name"],
                    "description": spec["description"],
                    "icon_or_image": spec["image"],
                    "order": spec["order"],
                    "is_active": True,
                }
            )
            active_industries[key] = ind
            status = "Created" if created else "Updated"
            self.stdout.write(f"  [{status}] Industry: {ind.name} (slug: {ind.slug})")

        # Delete any industry that is NOT in the 5 approved
        allowed_slugs = [spec["slug"] for spec in industry_specs.values()]
        for old_ind in Industry.objects.all():
            if old_ind.slug not in allowed_slugs:
                self.stdout.write(self.style.WARNING(f"  Deleting disallowed industry: {old_ind.name} (slug: {old_ind.slug})"))
                old_ind.delete()

        # ---------------------------------------------------------------------
        # 5. RE-MAP ALL 92 PRODUCTS STRICTLY TO MATCHING INDUSTRY
        # ---------------------------------------------------------------------
        self.stdout.write(self.style.NOTICE("\n5. Re-mapping all products to strictly match their sector..."))

        cat_to_ind = {
            "dairy-factory-segment": active_industries["dairy"],
            "cold-store-solution": active_industries["cold_store"],
            "water-factory-segment": active_industries["water"],
            "heat-pump-system": active_industries["heat_pump"],
            "meat-packing-processing-segment": active_industries["meat"],
        }

        product_counts = {k: 0 for k in active_industries}

        for prod in Product.objects.all():
            cat_slugs = [c.slug for c in prod.categories.all()]
            target_ind = None
            target_key = None

            for c_slug, ind in cat_to_ind.items():
                if c_slug in cat_slugs:
                    target_ind = ind
                    for k, v in active_industries.items():
                        if v.id == ind.id:
                            target_key = k
                            break
                    break

            if target_ind:
                # Set ONLY this industry, clearing any old mock industries
                prod.industries.set([target_ind])
                product_counts[target_key] += 1
            else:
                self.stdout.write(self.style.ERROR(f"  Warning: Product {prod.name} has unknown categories: {cat_slugs}"))

        self.stdout.write(self.style.SUCCESS("\nProduct distribution across 5 industries:"))
        for k, ind in active_industries.items():
            cnt = ind.products.count()
            self.stdout.write(self.style.SUCCESS(f"  - {ind.name}: {cnt} products"))

        self.stdout.write(self.style.SUCCESS("\n=== SUMMARY OF FINAL DATABASE STATE ==="))
        self.stdout.write(f"Total Products: {Product.objects.count()} (Target: 92)")
        self.stdout.write(f"Total Industries: {Industry.objects.count()} (Target: 5)")
        self.stdout.write(f"Total Team Members: {TeamMember.objects.count()} (Target: 8)")
        self.stdout.write(f"Total Partners: {Partner.objects.count()} (Target: 9)")
        self.stdout.write(f"Total Clients: {Client.objects.count()} (Target: 8)")
