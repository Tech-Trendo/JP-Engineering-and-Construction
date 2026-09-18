import logging
from django.core.management.base import BaseCommand
from apps.site_settings.models import DistrictCoverage, SiteSettings

logger = logging.getLogger(__name__)

ALL_DISTRICTS_DATA = [
    # Koshi Province (14)
    ("Taplejung", "Koshi"),
    ("Panchthar", "Koshi"),
    ("Ilam", "Koshi"),
    ("Jhapa", "Koshi"),
    ("Morang", "Koshi"),
    ("Sunsari", "Koshi"),
    ("Dhankuta", "Koshi"),
    ("Tehrathum", "Koshi"),
    ("Sankhuwasabha", "Koshi"),
    ("Bhojpur", "Koshi"),
    ("Solukhumbu", "Koshi"),
    ("Okhaldhunga", "Koshi"),
    ("Khotang", "Koshi"),
    ("Udayapur", "Koshi"),

    # Madhesh Province (8)
    ("Saptari", "Madhesh"),
    ("Siraha", "Madhesh"),
    ("Dhanusha", "Madhesh"),
    ("Mahottari", "Madhesh"),
    ("Sarlahi", "Madhesh"),
    ("Rautahat", "Madhesh"),
    ("Bara", "Madhesh"),
    ("Parsa", "Madhesh"),

    # Bagmati Province (13)
    ("Dolakha", "Bagmati"),
    ("Sindhupalchok", "Bagmati"),
    ("Ramechhap", "Bagmati"),
    ("Sindhuli", "Bagmati"),
    ("Kavrepalanchok", "Bagmati"),
    ("Bhaktapur", "Bagmati"),
    ("Lalitpur", "Bagmati"),
    ("Kathmandu", "Bagmati"),
    ("Nuwakot", "Bagmati"),
    ("Rasuwa", "Bagmati"),
    ("Dhading", "Bagmati"),
    ("Makwanpur", "Bagmati"),
    ("Chitawan", "Bagmati"),

    # Gandaki Province (11)
    ("Manang", "Gandaki"),
    ("Mustang", "Gandaki"),
    ("Myagdi", "Gandaki"),
    ("Kaski", "Gandaki"),
    ("Lamjung", "Gandaki"),
    ("Gorkha", "Gandaki"),
    ("Tanahu", "Gandaki"),
    ("Syangja", "Gandaki"),
    ("Parbat", "Gandaki"),
    ("Baglung", "Gandaki"),
    ("Nawalparasi East", "Gandaki"),

    # Lumbini Province (12)
    ("Nawalparasi", "Lumbini"),
    ("Rupandehi", "Lumbini"),
    ("Kapilbastu", "Lumbini"),
    ("Palpa", "Lumbini"),
    ("Arghakhanchi", "Lumbini"),
    ("Gulmi", "Lumbini"),
    ("Pyuthan", "Lumbini"),
    ("Rolpa", "Lumbini"),
    ("Dang", "Lumbini"),
    ("Banke", "Lumbini"),
    ("Bardiya", "Lumbini"),
    ("Rukum", "Lumbini"),

    # Karnali Province (10)
    ("Dolpa", "Karnali"),
    ("Mugu", "Karnali"),
    ("Humla", "Karnali"),
    ("Jumla", "Karnali"),
    ("Kalikot", "Karnali"),
    ("Dailekh", "Karnali"),
    ("Jajarkot", "Karnali"),
    ("Surkhet", "Karnali"),
    ("Salyan", "Karnali"),
    ("Rukum West", "Karnali"),

    # Sudurpashchim Province (9)
    ("Bajura", "Sudurpashchim"),
    ("Bajhang", "Sudurpashchim"),
    ("Darchula", "Sudurpashchim"),
    ("Baitadi", "Sudurpashchim"),
    ("Dadeldhura", "Sudurpashchim"),
    ("Doti", "Sudurpashchim"),
    ("Achham", "Sudurpashchim"),
    ("Kailali", "Sudurpashchim"),
    ("Kanchanpur", "Sudurpashchim"),
]

DEMO_HIGHLIGHTED_DETAILS = {
    "Kathmandu": {
        "is_highlighted": True,
        "projects_count": 48,
        "services_summary": "Commercial Cold Storage, Industrial RO Plants, Stainless Steel Fabrication",
        "description": "National headquarters and major engineering installation base. Over 48 turnkey commercial installations including pharmaceutical RO plants, food cold stores, and central dairy equipment.",
        "highlight_color": "#c8391a",
        "order": 1,
    },
    "Lalitpur": {
        "is_highlighted": True,
        "projects_count": 26,
        "services_summary": "Commercial RO Filtration, Food Processing Lines, Solar Water Heating",
        "description": "Turnkey engineering solutions for beverage plants, packaged drinking water factories, and commercial heat pump systems in Patan and surrounding industrial zones.",
        "highlight_color": "#c8391a",
        "order": 2,
    },
    "Bhaktapur": {
        "is_highlighted": True,
        "projects_count": 18,
        "services_summary": "Industrial Water Purification, Dairy Processing, Steel Fabrication",
        "description": "Engineered fabrication and stainless equipment supply for dairy cooperatives and industrial water processing facilities.",
        "highlight_color": "#c8391a",
        "order": 3,
    },
    "Chitawan": {
        "is_highlighted": True,
        "projects_count": 35,
        "services_summary": "Agricultural Cold Storage, Milk Tankers, Dairy Processing",
        "description": "Central agricultural hub (Bharatpur & Ratnanagar). Engineered large-scale cold stores, bulk milk chillers, and insulated stainless road milk tankers.",
        "highlight_color": "#c8391a",
        "order": 4,
    },
    "Kaski": {
        "is_highlighted": True,
        "projects_count": 24,
        "services_summary": "Commercial Refrigeration, Dairy Pasteurization, Cold Rooms",
        "description": "Regional base in Pokhara. Multi-chamber hotel refrigeration, food preservation cold stores, and dairy processing lines.",
        "highlight_color": "#c8391a",
        "order": 5,
    },
    "Morang": {
        "is_highlighted": True,
        "projects_count": 29,
        "services_summary": "Industrial Cold Stores, Structural Steel, Large RO Plants",
        "description": "Key industrial corridor (Biratnagar). Supplied and erected multi-ton cold stores, chemical treatment plants, and heavy steel framing.",
        "highlight_color": "#c8391a",
        "order": 6,
    },
    "Rupandehi": {
        "is_highlighted": True,
        "projects_count": 32,
        "services_summary": "Food & Beverage Machinery, Cold Stores, Grain Silos",
        "description": "Extensive industrial installations across Butwal and Bhairahawa special economic zones, including cold stores and high-capacity water filtration.",
        "highlight_color": "#c8391a",
        "order": 7,
    },
    "Sunsari": {
        "is_highlighted": True,
        "projects_count": 17,
        "services_summary": "Water Treatment Plants, Dairy Equipment, Heat Pumps",
        "description": "Installations in Itahari and Dharan covering drinking water purification systems, dairy chilling, and industrial refrigeration.",
        "highlight_color": "#c8391a",
        "order": 8,
    },
    "Jhapa": {
        "is_highlighted": True,
        "projects_count": 19,
        "services_summary": "Tea Processing Refrigeration, Water Filtration Plants, Chilling Vats",
        "description": "Supplied specialized climate-controlled cold storage, dairy vats, and reverse osmosis plants for tea and agricultural enterprises in Birtamode and Damak.",
        "highlight_color": "#c8391a",
        "order": 9,
    },
    "Banke": {
        "is_highlighted": True,
        "projects_count": 16,
        "services_summary": "Industrial Cold Storage, Deep Freezing Units, Dairy Chilling",
        "description": "Mid-western hub (Nepalgunj). Delivered cold chain warehousing, meat/dairy refrigeration, and high-volume water treatment systems.",
        "highlight_color": "#c8391a",
        "order": 10,
    },
    "Kailali": {
        "is_highlighted": True,
        "projects_count": 14,
        "services_summary": "Commercial Cold Storage, Water Plants, Solar Pumping",
        "description": "Installations in Dhangadhi and Tikapur covering agro-produce cold storage, solar systems, and commercial water treatment plants.",
        "highlight_color": "#c8391a",
        "order": 11,
    },
    "Makwanpur": {
        "is_highlighted": True,
        "projects_count": 21,
        "services_summary": "Industrial Chemical & Food Processing, Cold Rooms, Steel Structures",
        "description": "Major projects in Hetauda Industrial District including custom stainless steel fabrication, process piping, and industrial cold rooms.",
        "highlight_color": "#c8391a",
        "order": 12,
    },
    "Tanahu": {
        "is_highlighted": True,
        "projects_count": 8,
        "services_summary": "Bulk Milk Coolers, Dairy Equipment, Water Treatment",
        "description": "Dairy chilling vats and water filtration facilities installed across cooperative collection centers in Damauli and Vyas.",
        "highlight_color": "#c8391a",
        "order": 13,
    },
    "Kavrepalanchok": {
        "is_highlighted": True,
        "projects_count": 15,
        "services_summary": "Agro Cold Storage, Dairy Pasteurizers, Solar Energy",
        "description": "Multiple cold rooms for potato and seed preservation, alongside dairy processing plants in Banepa and Dhulikhel.",
        "highlight_color": "#c8391a",
        "order": 14,
    },
    "Surkhet": {
        "is_highlighted": True,
        "projects_count": 7,
        "services_summary": "Solar Water Treatment, Community Cold Stores, Dairy Coolers",
        "description": "Provincial capital installations in Birendranagar supporting agricultural cooperatives and clean drinking water facilities.",
        "highlight_color": "#c8391a",
        "order": 15,
    },
}


class Command(BaseCommand):
    help = "Seed all 77 districts of Nepal for the dynamic coverage map with demo engineering data"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding Nepal district coverage data..."))

        created_count = 0
        updated_count = 0

        for district_name, province in ALL_DISTRICTS_DATA:
            detail = DEMO_HIGHLIGHTED_DETAILS.get(district_name, {})
            is_highlighted = detail.get("is_highlighted", False)
            projects_count = detail.get("projects_count", 0)
            services_summary = detail.get("services_summary", "")
            description = detail.get("description", "")
            highlight_color = detail.get("highlight_color", "#c8391a")
            order = detail.get("order", 99)

            obj, created = DistrictCoverage.objects.update_or_create(
                district_name=district_name,
                defaults={
                    "province": province,
                    "is_highlighted": is_highlighted,
                    "projects_count": projects_count,
                    "services_summary": services_summary,
                    "description": description,
                    "highlight_color": highlight_color,
                    "order": order,
                    "is_active": True,
                }
            )

            if created:
                created_count += 1
            else:
                updated_count += 1

        # Also ensure SiteSettings has good initial coverage copy
        settings = SiteSettings.get_solo()
        if not settings.coverage_heading or settings.coverage_heading == "Our Engineering Services Across Nepal":
            settings.coverage_badge = "Nationwide Service Coverage"
            settings.coverage_heading = "Our Engineering Services Across Nepal"
            settings.coverage_subtext = (
                "From industrial cold storage and commercial reverse osmosis water treatment plants to "
                "dairy processing machinery, solar setups, and structural steel fabrication — explore the districts "
                "across Nepal where JP Engineering & Construction delivers trusted engineering solutions."
            )
            settings.coverage_stat_districts = "25+"
            settings.coverage_stat_projects = "150+"
            settings.coverage_stat_provinces = "7"
            settings.coverage_is_active = True
            settings.save()

        highlighted_total = DistrictCoverage.objects.filter(is_highlighted=True).count()
        total_districts = DistrictCoverage.objects.count()

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully processed {total_districts} districts ({created_count} created, {updated_count} updated). "
                f"Active highlighted districts: {highlighted_total}."
            )
        )
