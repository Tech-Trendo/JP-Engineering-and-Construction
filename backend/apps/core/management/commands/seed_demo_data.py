"""
Management command to populate the database with realistic demo data.

IMPORTANT NOTICE:
This data is for DEMONSTRATION & DESIGN REVIEW PURPOSES ONLY.
All demo categories, products, specifications, team members, partner logos,
client logos, and quote requests created by this command must be cleared
or audited before entering production client data.

Command is completely idempotent: running it multiple times safely resets
and re-seeds the demo dataset without creating duplicates or affecting
staff user credentials.
"""

import io
import urllib.request
from PIL import Image, ImageDraw
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from apps.categories.models import Category
from apps.core.models import SiteContent, DEFAULT_SHORT_INTRO, DEFAULT_FULL_INTRO
from apps.products.models import Product, ProductImage, ProductSpecification
from apps.quotes.models import QuoteRequest
from apps.showcase.models import TeamMember, Partner, Client


def create_fallback_image(width, height, text, bg_color=(30, 41, 59), border_color=(245, 158, 11)):
    """
    Creates an industrial-styled fallback placeholder image in-memory using Pillow.
    Ensures zero external network dependencies if image CDNs are unreachable.
    """
    img = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Industrial border accent
    draw.rectangle([10, 10, width - 10, height - 10], outline=border_color, width=2)
    draw.rectangle([14, 14, width - 14, height - 14], outline=(51, 65, 85), width=1)

    # Corner technical brackets
    bracket_len = 24
    for cx, cy in [(10, 10), (width - 10, 10), (10, height - 10), (width - 10, height - 10)]:
        dx = -bracket_len if cx > 10 else bracket_len
        dy = -bracket_len if cy > 10 else bracket_len
        draw.line([(cx, cy), (cx + dx, cy)], fill=border_color, width=3)
        draw.line([(cx, cy), (cx, cy + dy)], fill=border_color, width=3)

    # Center label
    display_text = str(text)[:32]
    draw.text((width // 2, height // 2), display_text, fill=(241, 245, 249), anchor="mm")

    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=88)
    return buf.getvalue()


def fetch_or_generate_image(url, width, height, label_text, bg_color=(30, 41, 59), border_color=(245, 158, 11)):
    """
    Attempts to download a placeholder photo from the given URL.
    Falls back gracefully to Pillow in-memory generation on timeout or connection error.
    """
    if url:
        try:
            req = urllib.request.Request(
                url,
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
            )
            with urllib.request.urlopen(req, timeout=3.5) as resp:
                data = resp.read()
                if len(data) > 500:
                    return data
        except Exception:
            pass

    return create_fallback_image(width, height, label_text, bg_color=bg_color, border_color=border_color)


class Command(BaseCommand):
    help = "Seeds comprehensive, realistic demo data for JP Engineering & Construction (DEMO DATA ONLY)"

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Clearing existing demo data..."))

        # Clean existing demonstration records
        QuoteRequest.objects.all().delete()
        ProductSpecification.objects.all().delete()
        ProductImage.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        TeamMember.objects.all().delete()
        Partner.objects.all().delete()
        Client.objects.all().delete()

        self.stdout.write(self.style.SUCCESS("Existing records purged. Seeding fresh demo data..."))

        # ==========================================================
        # 0. SITE CONTENT (Corporate Introduction Copy)
        # ==========================================================
        site_content = SiteContent.get_solo()
        site_content.title = "JP Engineering & Construction (P) Ltd."
        site_content.short_intro = DEFAULT_SHORT_INTRO
        site_content.full_intro = DEFAULT_FULL_INTRO
        site_content.save()
        self.stdout.write("  [+] Configured SiteContent (Short & Full Corporate Introduction)")

        # ==========================================================
        # 1. CATEGORIES (6 Realistic Categories)
        # ==========================================================
        categories_data = [
            {
                "name": "Water Treatment",
                "slug": "water-treatment",
                "description": "Industrial reverse osmosis, sand filtration, and ultrafiltration skids engineered for municipal and manufacturing facilities.",
                "order": 1,
            },
            {
                "name": "Cold Storage & Refrigeration",
                "slug": "cold-storage-refrigeration",
                "description": "Ammonia screw refrigeration skids, IQF blast freezers, and controlled-atmosphere agro-cold-room systems.",
                "order": 2,
            },
            {
                "name": "Dairy Machinery",
                "slug": "dairy-machinery",
                "description": "Sanitary milk reception, HTST continuous pasteurizers, homogenizers, and bulk stainless steel chilling tanks.",
                "order": 3,
            },
            {
                "name": "Juice & Beverage Bottling",
                "slug": "juice-beverage-bottling",
                "description": "Turnkey rotary rinsing-filling-capping monoblocks, carbonation units, deaeration skids, and shrink tunnel systems.",
                "order": 4,
            },
            {
                "name": "Steel Fabrication",
                "slug": "steel-fabrication",
                "description": "Heavy industrial CNC fiber laser cutting tables, 4-roll hydraulic plate rollers, and automated submerged-arc girder welders.",
                "order": 5,
            },
            {
                "name": "Solar & Heat Pump",
                "slug": "solar-heat-pump",
                "description": "High-efficiency commercial heat pump chillers, industrial thermal solar arrays, and ground-mount PV inverter skids.",
                "order": 6,
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
            cat_img_bytes = fetch_or_generate_image(
                f"https://picsum.photos/seed/cat-{cat.slug}/600/400",
                600,
                400,
                cat.name,
                bg_color=(15, 23, 42),
                border_color=(245, 158, 11),
            )
            cat.icon_or_image.save(f"cat_{cat.slug}.jpg", ContentFile(cat_img_bytes), save=True)
            category_objs[cat.slug] = cat
            self.stdout.write(f"  [+] Created Category: {cat.name}")

        # ==========================================================
        # 2. PRODUCTS (18 Comprehensive Industrial Products)
        # ==========================================================
        products_data = [
            # --- Category: Water Treatment ---
            {
                "name": "Industrial Reverse Osmosis Water Treatment Plant",
                "slug": "industrial-reverse-osmosis-water-plant",
                "categories": ["water-treatment"],
                "short_description": "High-capacity two-pass RO skid engineered for process water purification and mineral recovery.",
                "full_description": (
                    "The JP Industrial Reverse Osmosis (RO) Water Treatment Plant is precision engineered for high-duty continuous operation in manufacturing plants, beverage facilities, and municipal utility stations. Featuring multi-stage pre-filtration with automated backwash cycles, the system removes dissolved solids, micro-particulates, and organic contaminants down to 0.0001 microns.\n\n"
                    "Constructed upon a heavy-gauge structural stainless steel skid, each unit integrates high-pressure multi-stage Grundfos pumps, FilmTec high-rejection polyamide spiral-wound membranes, and an automated CIP (Clean-In-Place) flushing system. The modular layout allows parallel scaling to match facility expansion while maintaining compact plant room footprints.\n\n"
                    "Comprehensive instrumentation includes inline conductivity probes, digital differential pressure transmitters, and an IP65-rated Siemens S7-1200 PLC control cabinet featuring an intuitive high-definition HMI touchscreen for real-time membrane performance logging and remote telemetry."
                ),
                "is_featured": True,
                "order": 1,
                "specs": [
                    ("Permeate Flow Output", "25,000 Liters / Hour"),
                    ("Membrane Configuration", "8-inch High Rejection TFC Elements (x12)"),
                    ("Operating Pressure", "14 to 18 Bar continuous"),
                    ("Structural Skid Material", "AISI 304 Stainless Steel"),
                    ("Control Architecture", "Siemens S7-1200 PLC with 7-inch HMI"),
                    ("Dimensions (L x W x H)", "4,800 mm x 1,600 mm x 2,100 mm"),
                ],
            },
            {
                "name": "Automated Dual-Media Sand & Carbon Filtration Skid",
                "slug": "automated-dual-media-sand-carbon-filtration",
                "categories": ["water-treatment"],
                "short_description": "Pressurized multi-grade quartz sand and activated carbon filtration battery with automatic pneumatic valves.",
                "full_description": (
                    "Engineered as a heavy-duty primary clarification barrier, the Dual-Media Sand and Activated Carbon Filtration Skid eliminates suspended turbidity, sediment, chlorine, and volatile organic odors from raw surface and borehole water supplies.\n\n"
                    "Each vertical pressure vessel is fabricated from ASME-standard carbon steel with internal solvent-free food-grade epoxy lining, paired with top and bottom ABS hub-and-lateral distribution systems that prevent channeling and media compaction during high-velocity loading.\n\n"
                    "Automated pneumatic butterfly valves governed by differential pressure triggers initiate scheduled backwash and rinse cycles without interrupting downstream process operations."
                ),
                "is_featured": False,
                "order": 2,
                "specs": [
                    ("Filtration Hydraulic Capacity", "40,000 Liters / Hour"),
                    ("Media Composition", "Graded Quartz Sand + High Iodine Virgin Carbon"),
                    ("Vessel Design Pressure", "6.0 Bar Hydro-Tested to 9.0 Bar"),
                    ("Valve Actuation", "Air-Actuated Pneumatic Butterfly Valves"),
                    ("Flange Standard", "ANSI Class 150 Flanged Manifolds"),
                ],
            },
            {
                "name": "Continuous Ozone & UV Disinfection System",
                "slug": "continuous-ozone-uv-disinfection-system",
                "categories": ["water-treatment"],
                "short_description": "Dual-barrier germicidal ultraviolet reactor with integrated corona discharge ozone generator.",
                "full_description": (
                    "Providing zero-chemical microbiological sterilization, this continuous disinfection package combines high-output low-pressure amalgamation UV lamp reactors with corona discharge ozone injection into a venturi dissolution manifold.\n\n"
                    "The 316L sanitary polished reactor vessel is hydraulic-flow modeled to ensure maximum UV-C dosage distribution across every milliliter of process fluid, inactivating bacteria, viruses, and heat-resistant cysts.\n\n"
                    "Equipped with digital UV intensity monitoring, automatic quartz sleeve mechanical wiping mechanisms, and ozone destructor destruct catalyst beds for complete worker safety."
                ),
                "is_featured": False,
                "order": 3,
                "specs": [
                    ("Disinfection Flow Rate", "15,000 Liters / Hour"),
                    ("UV Dosage Level", "> 40 mJ/cm2 at End of Lamp Life"),
                    ("Ozone Generation Output", "50 grams / Hour (Oxygen-Fed)"),
                    ("Chamber Wetted Material", "AISI 316L Electro-Polished Stainless"),
                    ("Lamp Operating Life", "12,000 Hours Continuous Rating"),
                ],
            },

            # --- Category: Cold Storage & Refrigeration ---
            {
                "name": "Industrial Ammonia Screw Compressor Chiller Package",
                "slug": "ammonia-screw-compressor-chiller-package",
                "categories": ["cold-storage-refrigeration"],
                "short_description": "Open-drive rotary screw refrigeration skid utilizing natural eco-friendly R717 refrigerant.",
                "full_description": (
                    "Designed for round-the-clock heavy industrial chilling, the JP Ammonia Screw Compressor Package delivers unyielding thermal duty across large agro-processing facilities, beverage bottling plants, and regional refrigerated logistics terminals.\n\n"
                    "Equipped with forged asymmetric rotor profiles, multi-stage oil separation, and micro-stepless slide valve capacity regulation from 10% to 100% mechanical load, the unit maintains extreme energy efficiency across shifting operational demands.\n\n"
                    "Integrated safety instrumentation includes dual relief safety valves, low oil level cutouts, suction accumulator liquid separation traps, and hazardous-area gas monitoring telemetry."
                ),
                "is_featured": True,
                "order": 4,
                "specs": [
                    ("Refrigeration Capacity", "480 kW (-10 C Evaporation / +35 C Condensing)"),
                    ("Refrigerant Type", "Natural Ammonia (R717)"),
                    ("Drive Motor", "160 kW Inverter-Duty IE4 Motor"),
                    ("Capacity Regulation", "10% to 100% Stepless Hydraulic Slide"),
                    ("Oil Management", "Coalescing Multi-Element Separator with Water Chiller"),
                    ("Control System", "Dedicated Microprocessor Chiller Controller"),
                ],
            },
            {
                "name": "Controlled Atmosphere Cold Storage Blast Freezer Unit",
                "slug": "controlled-atmosphere-blast-freezer-unit",
                "categories": ["cold-storage-refrigeration"],
                "short_description": "Rapid pull-down modular blast freezer capable of reducing core temperature to -35 C.",
                "full_description": (
                    "The Controlled Atmosphere Blast Freezer Unit is purpose-built for commercial meat, seafood, dairy, and fruit preservation facilities requiring rapid thermal extraction to lock in cellular integrity and shelf freshness.\n\n"
                    "Constructed with 150mm high-density cyclopentane-blown polyurethane insulated cam-lock panels faced with antibacterial plastisol steel, the enclosure features heavy floor reinforcement rated for pallet jack and forklift loading.\n\n"
                    "High-static axial fan evaporators with stainless steel tubes and aluminum fin coils utilize hot gas automatic defrosting to ensure continuous duty without frost bridging."
                ),
                "is_featured": True,
                "order": 5,
                "specs": [
                    ("Batch Freezing Capacity", "5,000 kg per 4-Hour Duty Cycle"),
                    ("Operating Temperature Range", "-25 C to -40 C"),
                    ("Insulation Core", "150 mm Rigid Polyurethane Foam (42 kg/m3 density)"),
                    ("Evaporator Air Throw", "28 meters High-Velocity Laminar Stream"),
                    ("Defrost Mechanism", "Reversed Hot Gas with Heated Drain Pan"),
                ],
            },
            {
                "name": "Multi-Stage Evaporative Condenser & Coil Bank",
                "slug": "multi-stage-evaporative-condenser-coil-bank",
                "categories": ["cold-storage-refrigeration"],
                "short_description": "Induced-draft counterflow evaporative heat rejection tower with hot-dip galvanized steel coil casing.",
                "full_description": (
                    "Engineered to minimize compressor discharge pressures in high-ambient climates, this evaporative condenser maximizes heat transfer through simultaneous evaporative water spray and forced ambient airflow.\n\n"
                    "The prime-surface condensing coil circuits are assembled from continuous seamless steel pipe, hydrostatically tested to 30 bar, and hot-dip galvanized after fabrication for impervious corrosion defense.\n\n"
                    "Fitted with non-clog spray nozzles, high-efficiency drift eliminators that limit water loss to under 0.001%, and direct-drive axial fans balanced to ISO 1940 standards."
                ),
                "is_featured": False,
                "order": 6,
                "specs": [
                    ("Heat Rejection Rating", "1,200 kW Total Thermal Duty"),
                    ("Fan Assembly", "Dual Low-Noise Aero-Foil Axial Fans"),
                    ("Spray Water Flow Rate", "65 m3 / Hour with Centrifugal Pumping Skid"),
                    ("Coil Construction", "Heavy Gauge Seamless Steel Hot-Dip Galvanized"),
                    ("Casing Metallurgy", "Z725 Heavy Zinc-Coated Structural Steel"),
                ],
            },

            # --- Category: Dairy Machinery ---
            {
                "name": "Sanitary High-Pressure Milk Homogenizer & Deaerator",
                "slug": "sanitary-high-pressure-milk-homogenizer",
                "categories": ["dairy-machinery"],
                "short_description": "Two-stage micro-fluidizing homogenizing block with tungsten carbide impact heads.",
                "full_description": (
                    "Specifically engineered for high-volume dairy processing plants, this sanitary two-stage homogenizer forces milk through micro-metered orifice assemblies under extreme pressure, disintegrating fat globules to prevent cream separation.\n\n"
                    "The compression cylinder block is machined from a single solid forged billet of duplex stainless steel, eliminating internal welds and stress points while maintaining complete CIP cleanability.\n\n"
                    "Featuring splash lubrication with water-cooled oil recirculation, ceramic-coated plunger pistons, and pneumatic valve pressure adjustment controls for accurate micrometer stabilization."
                ),
                "is_featured": True,
                "order": 7,
                "specs": [
                    ("Throughput Flow Rate", "5,000 Liters / Hour"),
                    ("Maximum Operating Pressure", "250 Bar Two-Stage Pressure Split"),
                    ("Piston Count", "3 Solid Tungsten-Carbide Coated Plungers"),
                    ("Cylinder Block", "Forged 1.4462 Duplex Stainless Steel"),
                    ("Drive Unit", "37 kW Heavy Transmission Gearbox with VFD"),
                    ("Sanitary Standard", "3-A Sanitary Standards & EHEDG Compliant"),
                ],
            },
            {
                "name": "Continuous HTST Milk Pasteurizer & Heat Exchanger",
                "slug": "continuous-htst-milk-pasteurizer-skid",
                "categories": ["dairy-machinery"],
                "short_description": "Multi-section sanitary plate heat exchanger with holding tubes and automatic flow diversion valve.",
                "full_description": (
                    "The JP Continuous High-Temperature Short-Time (HTST) Pasteurizer provides reliable thermal pasteurization of raw milk, yogurt bases, and flavored dairy drinks.\n\n"
                    "Utilizing regenerative multi-section titanium/stainless plate packs with 92% heat regeneration efficiency, incoming cold product is pre-heated by pasteurized outbound product, drastically reducing boiler steam and chilled water consumption.\n\n"
                    "Includes an automated air-actuated 3-way flow diversion valve that instantly redirects under-temperature milk back to the balance tank if pasteurization criteria are not met, guaranteeing safety."
                ),
                "is_featured": False,
                "order": 8,
                "specs": [
                    ("Processing Capacity", "10,000 Liters / Hour"),
                    ("Thermal Profile", "Cold Raw In @ 4 C -> Heat to 74 C -> Hold 15s -> Out @ 4 C"),
                    ("Heat Regeneration Rate", "92% Thermodynamic Recovery"),
                    ("Holding Tube Retention", "15 Seconds Continuous Spiral Loop"),
                    ("Plate Metallurgy", "AISI 316 Stainless Steel with Food-Grade EPDM Gaskets"),
                ],
            },
            {
                "name": "Sanitary Stainless Steel Bulk Milk Cooling Tank",
                "slug": "sanitary-stainless-bulk-milk-cooling-tank",
                "categories": ["dairy-machinery"],
                "short_description": "Direct-expansion refrigerated milk storage vat with automated rotary cleaning spray balls.",
                "full_description": (
                    "Designed for farm collection hubs and central dairy reception docks, this horizontal insulated bulk tank cools raw milk from 35 C to 4 C in less than 2.5 hours, inhibiting bacterial development.\n\n"
                    "The inner shell features laser-welded dimple jacket heat transfer plates connected directly to a high-efficiency scroll condensing unit. Injected polyurethane insulation preserves chilling during utility interruptions.\n\n"
                    "Equipped with a low-speed sanitary agitator to prevent butterfat churning and a motorized high-pressure rotary spray head for automated CIP cycles."
                ),
                "is_featured": False,
                "order": 9,
                "specs": [
                    ("Storage Volume", "5,000 Liters Working Capacity"),
                    ("Cooling Speed", "35 C to 4 C within 150 Minutes"),
                    ("Evaporator Type", "Laser-Welded Dimple Plate Bottom Jacket"),
                    ("Agitation Drive", "32 RPM Low-Shear Gearmotor with Timer"),
                    ("Insulation Specification", "50 mm Rigid CFC-Free Polyurethane"),
                ],
            },

            # --- Category: Juice & Beverage Bottling ---
            {
                "name": "High-Speed Rotary Monoblock Rinsing-Filling-Capping Line",
                "slug": "high-speed-rotary-monoblock-bottling-line",
                "categories": ["juice-beverage-bottling"],
                "short_description": "Integrated 24-24-6 rotary station for automated beverage bottling in glass and PET containers.",
                "full_description": (
                    "The JP Rotary Monoblock Bottling Line combines container rinsing, isobaric or gravity liquid filling, and screw capping inside a single synchronized HEPA-filtered clean enclosure.\n\n"
                    "Star-wheel transfer mechanisms move containers smoothly through 24 interior spray nozzles, 24 electro-pneumatic filling heads with magnetic flow meters, and a 6-head magnetic torque capping turret designed to prevent cap damage.\n\n"
                    "All fluid-contact paths are manufactured from surgical-grade AISI 316L stainless steel, complete with automated fake-bottle CIP cups that swing into position for seamless caustic sanitation."
                ),
                "is_featured": True,
                "order": 10,
                "specs": [
                    ("Filling Speed", "6,000 to 8,000 Bottles / Hour (500ml basis)"),
                    ("Turret Configuration", "24 Rinsers / 24 Fillers / 6 Cappers"),
                    ("Filling Accuracy", "+/- 1.5 ml via Electro-Pneumatic Flow Valves"),
                    ("Applicable Closures", "28mm Plastic PCO/Alcoa Metal Screw Caps"),
                    ("Air Handling Enclosure", "Class 100 HEPA Laminar Air Flow Canopy"),
                    ("Main Line Power", "18.5 kW Synchronized Servo Drive System"),
                ],
            },
            {
                "name": "Hot-Fill Fruit Juice Processing & Dearation Plant",
                "slug": "hot-fill-fruit-juice-processing-plant",
                "categories": ["juice-beverage-bottling"],
                "short_description": "Continuous vacuum deaerator and tubular thermal sterilizer for pulpy and clear fruit juices.",
                "full_description": (
                    "Engineered to process fresh mango, apple, citrus, and mixed fruit nectars without loss of natural aroma or vitamin nutrients, this hot-fill processing module prepares beverage batches for aseptic and ambient bottling.\n\n"
                    "The vacuum deaeration chamber removes entrained air bubbles, preventing product foaming on filling carousels and inhibiting oxidation over extended storage periods.\n\n"
                    "Features a corrugated 4-tube concentric tubular heat exchanger that handles high-viscosity pulpy blends without fouling or caramelization."
                ),
                "is_featured": False,
                "order": 11,
                "specs": [
                    ("Product Capacity", "3,000 Liters / Hour Continuous Flow"),
                    ("Sterilization Temperature", "95 C to 105 C with 30s Holding Section"),
                    ("Vacuum Vessel Pressure", "-0.085 to -0.092 MPa"),
                    ("Heat Exchanger Type", "4-Tube Multi-Pass Corrugated Concentric Unit"),
                    ("Automation Platform", "Allen-Bradley CompactLogix Control Skid"),
                ],
            },
            {
                "name": "Automated Shrink Sleeve Labeling & Heat Tunnel System",
                "slug": "automated-shrink-sleeve-labeling-system",
                "categories": ["juice-beverage-bottling"],
                "short_description": "High-velocity rotating mandrel sleeve applicator with multi-zone steam shrinking tunnel.",
                "full_description": (
                    "This automated sleeve labeling station applies full-body 360-degree decorative shrink sleeves and tamper-evident neck bands onto shaped glass, PET, and aluminum containers.\n\n"
                    "A motorized rotary knife cutter slices sleeve films from continuous rolls with sub-millimeter precision, dropping sleeves onto bottles guided by timing screws and optical sensors.\n\n"
                    "Containers then progress through a 3-stage stainless steel steam tunnel where graduated vapor nozzles shrink films uniformly around curved contours without blistering or label distortion."
                ),
                "is_featured": False,
                "order": 12,
                "specs": [
                    ("Labeling Speed", "Up to 150 Bottles / Minute"),
                    ("Film Compatibility", "PVC, PETG, OPS (35 to 70 microns thickness)"),
                    ("Container Diameters", "30 mm to 125 mm Outer Diameter"),
                    ("Tunnel Length", "2,400 mm Multi-Stage Steam Chamber"),
                    ("Steam Consumption", "35 kg / Hour @ 3.0 Bar Clean Steam"),
                ],
            },

            # --- Category: Steel Fabrication ---
            {
                "name": "Heavy Duty CNC Fiber Laser Cutting Gantry 12kW",
                "slug": "cnc-fiber-laser-cutting-gantry-12kw",
                "categories": ["steel-fabrication"],
                "short_description": "High-power industrial fiber laser machine with dual shuttle exchange tables for heavy steel plate processing.",
                "full_description": (
                    "The 12kW CNC Fiber Laser Cutting Gantry is an industrial manufacturing centerpiece designed for high-speed, high-precision profile cutting of structural carbon steel, stainless steel, and aluminum plates.\n\n"
                    "The machine bed is constructed from heat-treated stress-relieved welded plate steel, ensuring zero thermal deformation over years of multi-shift cutting. An aerospace-grade extruded aluminum gantry driven by dual helical rack-and-pinion servos enables accelerations up to 1.5G.\n\n"
                    "Features an automated autofocus laser head, high-pressure nitrogen/oxygen gas assist manifolds, automatic nozzle cleaning, and an enclosed safety viewing enclosure."
                ),
                "is_featured": True,
                "order": 13,
                "specs": [
                    ("Laser Source Power", "12,000 Watts (12 kW) IPG/Raycus Fiber"),
                    ("Effective Cutting Area", "6,000 mm x 2,500 mm (Dual Pallet Shuttle)"),
                    ("Max Carbon Steel Thickness", "35 mm Clean Industrial Cut"),
                    ("Max Stainless Steel Thickness", "30 mm Nitrogen Assist Cut"),
                    ("Positioning Accuracy", "+/- 0.03 mm Repeatability"),
                    ("Dust Extraction", "Multi-Zone Partitioned Cyclone Filtration Unit"),
                ],
            },
            {
                "name": "Hydraulic CNC Plate Bending & Rolling 4-Roll Machine",
                "slug": "hydraulic-cnc-plate-bending-rolling-machine",
                "categories": ["steel-fabrication"],
                "short_description": "Heavy planetary 4-roll bending machine for thick-wall pressure vessel shell and tank rolling.",
                "full_description": (
                    "Engineered for heavy vessel manufacturers and structural fabrication yards, this 4-roll machine rolls cylindrical, conical, and oval shells with minimal flat ends through precision pre-bending capabilities.\n\n"
                    "The top roll remains stationary while the bottom pinch roll clamps the plate hydraulically. Dual side rolls mounted on planetary swing guides move along parabolic arcs, applying uniform bending moments without roll slipping.\n\n"
                    "Equipped with forged 42CrMo alloy steel rolls, spherical roller bearings, hydraulic drop-end tilting for shell extraction, and graphic multi-axis CNC touch control."
                ),
                "is_featured": False,
                "order": 14,
                "specs": [
                    ("Max Rolling Width", "3,100 mm Plate Span"),
                    ("Max Rolling Thickness", "25 mm Carbon Steel (Pre-Bending @ 20 mm)"),
                    ("Top Roll Diameter", "380 mm Forged Alloy Steel"),
                    ("Drive Mechanism", "Hydraulic Dual Motors with Planetary Reducers"),
                    ("CNC Controller", "ESA S600 4-Axis Bending Numerical Control"),
                ],
            },
            {
                "name": "Submerged Arc Structural Steel Box-Girder Welding Station",
                "slug": "submerged-arc-box-girder-welding-station",
                "categories": ["steel-fabrication"],
                "short_description": "Dual-head twin-wire submerged arc welding gantry for structural civil bridge girders and crane booms.",
                "full_description": (
                    "Designed for heavy civil infrastructure fabricators, this Submerged Arc Welding (SAW) gantry deposits high-penetration structural welds along long box-girder seams and heavy H-beams with consistent metallurgical purity.\n\n"
                    "The motorized gantry spans the work zone, carrying two independently tracking welding heads with laser seam following sensors and automatic flux delivery/recovery vacuums.\n\n"
                    "Twin 1000A inverter power sources provide deep weld pool penetration with zero spatter, producing radiographic-quality full-penetration joints certified for seismic and dynamic structural codes."
                ),
                "is_featured": False,
                "order": 15,
                "specs": [
                    ("Gantry Track Span", "4,000 mm Rail-Mounted Runway"),
                    ("Welding Power Units", "Dual 1000A 100% Duty Cycle Submerged Arc Rectifiers"),
                    ("Wire Diameters Supported", "3.2 mm to 5.0 mm Solid Sub-Arc Wires"),
                    ("Flux Management", "Continuous Pressurized Pneumatic Recovery & Reheat Tank"),
                    ("Travel Speed", "0.15 to 1.8 Meters / Minute Stepless Inverter"),
                ],
            },

            # --- Category: Solar & Heat Pump ---
            {
                "name": "Commercial Industrial Air-Source Heat Pump Water Heater",
                "slug": "commercial-air-source-heat-pump-chiller",
                "categories": ["solar-heat-pump", "cold-storage-refrigeration"],
                "short_description": "High-COP commercial heat pump supplying hot water up to 65 C for industrial sanitization and hospitality.",
                "full_description": (
                    "The Commercial Air-Source Heat Pump system extracts ambient heat from the atmosphere to generate high-volume hot water at a fraction of the operating consumption of conventional diesel boilers or electric resistance heaters.\n\n"
                    "Utilizing vapor-injection scroll compressor technology and environmentally responsible R410A refrigerant, the unit operates reliably in ambient conditions ranging from -15 C to +45 C without supplemental electric backup.\n\n"
                    "Built with hydrophilic coated fin heat exchangers, titanium shell-and-tube water heat exchangers, and Modbus RS485 communication protocols for central facility BMS integration."
                ),
                "is_featured": True,
                "order": 16,
                "specs": [
                    ("Thermal Heating Capacity", "180 kW Thermal Output"),
                    ("Hot Water Supply Temp", "Up to 65 C Continuous"),
                    ("Rated Coefficient of Perf (COP)", "4.2 (Air 20 C / Water 55 C)"),
                    ("Compressor Architecture", "Dual EVI Enhanced Vapor Injection Scrolls"),
                    ("Water Side Exchanger", "Corrosion-Proof Titanium Shell-and-Tube"),
                    ("Operating Ambient Range", "-15 C to +45 C"),
                ],
            },
            {
                "name": "Ground-Mounted Solar PV Tracker & Inverter Skid",
                "slug": "ground-mount-solar-pv-tracker-inverter-skid",
                "categories": ["solar-heat-pump"],
                "short_description": "Single-axis astronomical solar tracker with centralized grid-tied utility inverter skid.",
                "full_description": (
                    "Engineered for industrial off-grid factories and grid-tied renewable generation sites, this single-axis tracker rotates photovoltaic strings from east to west following the sun, increasing daily yield by up to 25% over static arrays.\n\n"
                    "Driven by a smart slewing drive with astronomical algorithm control and wind-stow aerodynamic protection, the structural torque tubes resist 140 km/h wind loads without structural deflection.\n\n"
                    "The companion galvanized inverter skid houses utility-grade string inverters, DC disconnect combiners, lightning arrestors, and automated power factor correction banks."
                ),
                "is_featured": False,
                "order": 17,
                "specs": [
                    ("Array Capacity Support", "250 kWp per Modular Tracking Block"),
                    ("Tracking Range", "+/- 60 Degrees Continuous Slewing Drive"),
                    ("Wind Survivability", "140 km/h Automatic Stow Position"),
                    ("Inverter Skid Rating", "200 kVA 400V 3-Phase Grid-Tied"),
                    ("Structural Coating", "Hot-Dip Galvanized to ISO 1461 (85 microns)"),
                ],
            },

            # --- Multi-Category Product ---
            {
                "name": "Sanitary Stainless Steel CIP Cleaning Skid Station",
                "slug": "sanitary-stainless-steel-cip-skid-station",
                "categories": ["dairy-machinery", "juice-beverage-bottling"],
                "short_description": "Three-tank Clean-In-Place system with automatic chemical dosing and plate heat exchangers.",
                "full_description": (
                    "Essential for pharmaceutical, dairy, and beverage bottling plants, this 3-tank CIP station automates the cleaning and chemical sanitization of pipelines, process tanks, filling valves, and plate pasteurizers without disassembly.\n\n"
                    "The skid integrates three insulated AISI 316 stainless steel tanks (Rinse Water, Caustic Soda, and Acidic Sanitizer) equipped with inline steam heating coils, temperature transmitters, and magnetic conductivity concentration sensors.\n\n"
                    "A pre-programmed multi-recipe Siemens touch panel automates forward supply pumping, chemical recovery, and neutral water rinsing, verifying cleanliness via inline turbidity and pH sensors."
                ),
                "is_featured": True,
                "order": 18,
                "specs": [
                    ("Tank Configuration", "3 x 2,000 Liters (Water, Caustic, Acid)"),
                    ("Supply Pump Flow Rate", "20,000 Liters / Hour @ 4.5 Bar Pressure"),
                    ("Heating Method", "Sanitary Tube-in-Tube Steam Heat Exchanger"),
                    ("Dosing Accuracy", "Automatic Peristaltic Pump Control (+/- 0.1% Concentration)"),
                    ("Wetted Metallurgy", "AISI 316L Stainless Steel Internal Polish Ra < 0.4 um"),
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

            # Create 4-6 dynamic specifications
            for idx, (lbl, val) in enumerate(pdata["specs"]):
                ProductSpecification.objects.create(
                    product=prod,
                    label=lbl,
                    value=val,
                    order=idx,
                )

            # Create 2-3 images (1 primary)
            num_images = 3 if prod.is_featured else 2
            for img_idx in range(num_images):
                is_prim = (img_idx == 0)
                seed_key = f"prod-{prod.slug}-{img_idx}"
                img_bytes = fetch_or_generate_image(
                    f"https://picsum.photos/seed/{seed_key}/800/600",
                    800,
                    600,
                    f"{prod.name[:20]} #{img_idx + 1}",
                    bg_color=(30, 41, 59) if is_prim else (15, 23, 42),
                    border_color=(245, 158, 11) if is_prim else (100, 116, 139),
                )
                pimg = ProductImage.objects.create(
                    product=prod,
                    alt_text=f"{prod.name} View {img_idx + 1}",
                    order=img_idx,
                    is_primary=is_prim,
                )
                pimg.image.save(f"{prod.slug}_{img_idx}.jpg", ContentFile(img_bytes), save=True)

            created_products.append(prod)
            self.stdout.write(f"  [+] Created Product: {prod.name} ({len(pdata['specs'])} specs, {num_images} images)")

        # ==========================================================
        # 3. TEAM MEMBERS (7 Realistic Professionals)
        # ==========================================================
        team_data = [
            ("Er. Ramesh Adhikari", "Managing Director & Principal Mechanical Engineer", 1, 68),
            ("Sunita Sharma", "VP of Industrial Operations & Project Logistics", 2, 45),
            ("Er. Bikash Thapa", "Lead Automation & SCADA Control Systems Engineer", 3, 33),
            ("Anjali Shrestha", "Head of Quality Assurance & ISO Compliance", 4, 28),
            ("Er. Dipendra Poudel", "Senior Thermal & Industrial Refrigeration Specialist", 5, 59),
            ("Manisha Giri", "Procurement & Supply Chain Lead", 6, 49),
            ("Er. Pradeep KC", "Heavy Structural Steel Fabrication Superintendent", 7, 12),
        ]

        for name, designation, order_num, avatar_seed in team_data:
            member = TeamMember.objects.create(
                name=name,
                designation=designation,
                order=order_num,
                is_active=True,
            )
            photo_bytes = fetch_or_generate_image(
                f"https://i.pravatar.cc/300?img={avatar_seed}",
                300,
                300,
                name.split()[-1],
                bg_color=(51, 65, 85),
                border_color=(245, 158, 11),
            )
            member.photo.save(f"team_{slugify(name)}.jpg", ContentFile(photo_bytes), save=True)
            self.stdout.write(f"  [+] Created Team Member: {name}")

        # ==========================================================
        # 4. PARTNERS (8 Realistic OEM & Engineering Partners)
        # ==========================================================
        partners_data = [
            ("Danfoss Industrial Refrigeration", "https://www.danfoss.com", 1),
            ("Alfa Laval Process Technology", "https://www.alfalaval.com", 2),
            ("Siemens Industrial Automation", "https://www.siemens.com", 3),
            ("Grundfos Pumping Systems", "https://www.grundfos.com", 4),
            ("ABB Motors & Drives", "https://www.abb.com", 5),
            ("Krones Beverage Processing", "https://www.krones.com", 6),
            ("Schneider Electric Solutions", "https://www.se.com", 7),
            ("Atlas Copco Compressed Air", "https://www.atlascopco.com", 8),
        ]

        for pname, purl, order_num in partners_data:
            partner = Partner.objects.create(
                name=pname,
                website_url=purl,
                order=order_num,
                is_active=True,
            )
            logo_bytes = fetch_or_generate_image(
                f"https://placehold.co/240x120/1e293b/f59e0b.png?text={slugify(pname[:16])}",
                240,
                120,
                pname.split()[0],
                bg_color=(30, 41, 59),
                border_color=(245, 158, 11),
            )
            partner.logo.save(f"partner_{slugify(pname)}.jpg", ContentFile(logo_bytes), save=True)
            self.stdout.write(f"  [+] Created Partner: {pname}")

        # ==========================================================
        # 5. CLIENTS (8 Realistic Enterprise Clients)
        # ==========================================================
        clients_data = [
            ("Himalayan Spring Beverages Ltd", "https://example.com/hsb", 1),
            ("National Dairy Development Grid", "https://example.com/nddg", 2),
            ("Apex Cold Chain & Logistics", "https://example.com/accl", 3),
            ("Everest Agro Processing Mills", "https://example.com/eapm", 4),
            ("Valley Infrastructure & Power Corp", "https://example.com/vipc", 5),
            ("Gandaki Food Products Industries", "https://example.com/gfpi", 6),
            ("Bagmati Water Supply Authority", "https://example.com/bwsa", 7),
            ("Royal Steel Works Ltd", "https://example.com/rswl", 8),
        ]

        for cname, curl, order_num in clients_data:
            client = Client.objects.create(
                name=cname,
                website_url=curl,
                order=order_num,
                is_active=True,
            )
            logo_bytes = fetch_or_generate_image(
                f"https://placehold.co/240x120/0f172a/38bdf8.png?text={slugify(cname[:16])}",
                240,
                120,
                cname.split()[0],
                bg_color=(15, 23, 42),
                border_color=(56, 189, 248),
            )
            client.logo.save(f"client_{slugify(cname)}.jpg", ContentFile(logo_bytes), save=True)
            self.stdout.write(f"  [+] Created Client: {cname}")

        # ==========================================================
        # 6. QUOTE REQUESTS (5 Demo Leads with Mixed Statuses)
        # ==========================================================
        sample_prod_ro = created_products[0]  # Industrial RO
        sample_prod_freezer = created_products[4]  # Blast Freezer
        sample_prod_bottling = created_products[9]  # Bottling Line
        sample_prod_laser = created_products[12]  # CNC Laser

        quotes_data = [
            {
                "full_name": "Siddharth Koirala",
                "email": "siddharth@himalayanbeverage.com",
                "phone": "+977 985-1029384",
                "company": "Himalayan Spring Beverages Ltd",
                "product": sample_prod_bottling,
                "message": (
                    "Inquiring regarding rapid mobilization, line speed specs, and utility requirements "
                    "for 500ml and 1000ml bottling line. We are commissioning our second packaging wing "
                    "and require technical layout drawings."
                ),
                "status": "new",
            },
            {
                "full_name": "Pooja Manandhar",
                "email": "pooja.m@everestagro.com",
                "phone": "+977 984-1294857",
                "company": "Everest Agro Processing Mills",
                "product": sample_prod_freezer,
                "message": (
                    "We require turnkey cold storage installation for apple and potato bulk storage "
                    "in the Pokhara valley corridor. Please provide technical duty cycle analysis and "
                    "evaporator air throw calculations."
                ),
                "status": "new",
            },
            {
                "full_name": "Rajesh Shrestha",
                "email": "rajesh@valleypower.org",
                "phone": "+977 980-3344556",
                "company": "Valley Infrastructure & Power Corp",
                "product": created_products[15],  # Heat Pump
                "message": (
                    "Discussed preliminary thermal requirements with Er. Dipendra Poudel. Awaiting "
                    "site layout drawings and heat balance calculations for the central utility substation."
                ),
                "status": "contacted",
            },
            {
                "full_name": "Kiran Basnet",
                "email": "kiran@royalsteelworks.com",
                "phone": "+977 981-9988776",
                "company": "Royal Steel Works Ltd",
                "product": sample_prod_laser,
                "message": (
                    "Technical consultation held regarding gantry bed dimensions, dual table shuttle "
                    "clearance, and nitrogen generation auxiliary skid requirements."
                ),
                "status": "contacted",
            },
            {
                "full_name": "Govinda Sharma",
                "email": "g.sharma@bagmatiwater.gov.np",
                "phone": "+977 01-4258901",
                "company": "Bagmati Water Supply Authority",
                "product": sample_prod_ro,
                "message": (
                    "Procurement proposal approved and finalized under Contract REF: BWSA-2026-WT09. "
                    "Project moving to fabrication and skid assembly phase."
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

        self.stdout.write(self.style.SUCCESS("\nSuccessfully seeded demo dataset!"))
        self.stdout.write(self.style.NOTICE(
            f"Summary: {len(categories_data)} categories, {len(products_data)} products, "
            f"{len(team_data)} team members, {len(partners_data)} partners, "
            f"{len(clients_data)} clients, {len(quotes_data)} quotes."
        ))
