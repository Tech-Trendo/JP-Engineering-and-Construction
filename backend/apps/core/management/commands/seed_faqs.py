from django.core.management.base import BaseCommand
from apps.core.models import FAQ

FAQ_DATA = [
    # Products Catalog FAQs
    {
        "page": "products",
        "category": "Manufacturing & Metallurgy",
        "order": 1,
        "question": "What types of industrial machinery does JP Engineering manufacture in Nepal?",
        "answer": "We manufacture and assemble complete processing equipment for dairy plants (pasteurizers, homogenizers, chilling vats, road tankers), water treatment facilities (commercial Reverse Osmosis, multi-grade filtration), cold storage infrastructure, food processing, and custom stainless steel vessels."
    },
    {
        "page": "products",
        "category": "Customization & Design",
        "order": 2,
        "question": "Can machinery capacity and footprint be customized to our factory layout?",
        "answer": "Yes. Every machine skid, storage tank, and conveyor assembly is custom engineered to match your target production throughput, ceiling height, and floor space constraints across Nepal."
    },
    {
        "page": "products",
        "category": "Sanitation Standards",
        "order": 3,
        "question": "What food safety and steel metallurgy standards are maintained?",
        "answer": "All product contact surfaces are fabricated from certified AISI 304 or AISI 316L stainless steel with sanitary TIG welding, mirror polishing (Ra < 0.8 µm), and full Clean-In-Place (CIP) compatibility."
    },
    {
        "page": "products",
        "category": "Automation & Components",
        "order": 4,
        "question": "Do you integrate imported components and automation hardware?",
        "answer": "Yes. We partner with and integrate genuine global components including Siemens and Schneider PLCs, Danfoss refrigeration compressors, Grundfos pumps, and Festo pneumatics with local programming and maintenance support."
    },
    {
        "page": "products",
        "category": "Delivery & Commissioning",
        "order": 5,
        "question": "What is the typical fabrication and delivery timeline?",
        "answer": "After engineering sign-off on CAD layouts, standard machinery units take 2 to 4 weeks, while comprehensive turnkey plants take 4 to 8 weeks including on-site pipe fitting and commissioning."
    },

    # Industries We Serve FAQs
    {
        "page": "industries",
        "category": "Industry Scope",
        "order": 1,
        "question": "Which key industrial sectors does JP Engineering specialize in?",
        "answer": "We engineer complete turnkey plants and machinery for 6 major sectors in Nepal: Dairy & Milk Processing, Beverages & Mineral Water Bottling, Cold Chain Storage & Blast Freezing, Food & Snack Processing, Pharmaceuticals, and Meat & Poultry Processing."
    },
    {
        "page": "industries",
        "category": "Turnkey Solutions",
        "order": 2,
        "question": "What does 'Turnkey Industrial Execution' include?",
        "answer": "Our turnkey service encompasses initial site surveys, architectural and P&ID layout drafting, stainless steel tank and skid fabrication, utility piping (steam, glycol, compressed air), electrical panel wiring, on-site commissioning, and operator certification."
    },
    {
        "page": "industries",
        "category": "Plant Expansion",
        "order": 3,
        "question": "Can you retrofit or expand an existing processing facility in Nepal?",
        "answer": "Yes. We frequently upgrade existing facilities by expanding pasteurization capacity, converting manual washing to automated CIP, installing energy-saving heat pumps, or automating manual processing lines with Siemens PLCs."
    },
    {
        "page": "industries",
        "category": "Quality & Standards",
        "order": 4,
        "question": "How does JP Engineering ensure compliance with quality regulations?",
        "answer": "As an ISO 9001:2015 certified manufacturer (accredited by URS and UKAS 0043), our welding, pressure vessel fabrication, and sanitation standards comply with international sanitary engineering guidelines and Department of Food Technology and Quality Control (DFTQC) standards."
    },

    # Contact Us FAQs
    {
        "page": "contact",
        "category": "Quotation & Inquiries",
        "order": 1,
        "question": "How quickly can I receive a turnkey machinery quotation?",
        "answer": "Our mechanical engineering team reviews your throughput capacity, facility dimensions, and process requirements to prepare a detailed technical specification and budget quotation within 24 to 48 hours."
    },
    {
        "page": "contact",
        "category": "Site Inspection",
        "order": 2,
        "question": "Do you conduct on-site feasibility visits outside Kathmandu Valley?",
        "answer": "Yes. Our senior field engineers regularly travel across Nepal—including Chitwan, Birgunj, Butwal, Pokhara, Nepalgunj, and Biratnagar—for site surveys, piping layouts, and civil foundation assessments."
    },
    {
        "page": "contact",
        "category": "Custom Fabrication",
        "order": 3,
        "question": "Can machinery be custom-fabricated to fit our specific facility layout?",
        "answer": "Absolutely. All stainless steel storage tanks, pasteurization skids, conveyor networks, and CIP units are custom-designed and fabricated in our workshop to match your ceiling heights and floor plan constraints."
    },
    {
        "page": "contact",
        "category": "Warranty & Support",
        "order": 4,
        "question": "What after-sales and spare parts support is available in Nepal?",
        "answer": "We maintain an inventory of genuine spare parts (pumps, valves, seals, PLC cards) at our central warehouse and provide 24/7 technical field support and annual maintenance contracts (AMC) across Nepal."
    },

    # Introduction Page FAQs
    {
        "page": "introduction",
        "category": "History & Experience",
        "order": 1,
        "question": "When was JP Engineering & Construction established in Nepal?",
        "answer": "JP Engineering & Construction was established over a decade ago and has grown into one of Nepal's foremost industrial machinery manufacturers, delivering over 150+ turnkey installations across the country."
    },
    {
        "page": "introduction",
        "category": "Infrastructure",
        "order": 2,
        "question": "What is your primary manufacturing workshop infrastructure?",
        "answer": "Our dedicated workshop in Kathmandu features heavy metal rolling machines, automated TIG/MIG welding bays, sanitary orbital welding tools, stainless steel polishing lines, and hydrostatic pressure testing rigs."
    },
    {
        "page": "introduction",
        "category": "Accreditation",
        "order": 3,
        "question": "What credentials and quality certifications does the company hold?",
        "answer": "We are ISO 9001:2015 certified for design, fabrication, and installation of dairy, food processing, water treatment, and industrial refrigeration machinery, accredited by UKAS (United Kingdom Accreditation Service)."
    },
    {
        "page": "introduction",
        "category": "Geographic Reach",
        "order": 4,
        "question": "Which geographic areas of Nepal do you support?",
        "answer": "We install and service equipment nationwide, including remote dairy chilling centers in hill districts, commercial water plants in the Terai, and large-scale industrial complexes across Bagmati, Gandaki, Koshi, Lumbini, and Sudurpashchim provinces."
    },

    # Company Profile FAQs
    {
        "page": "company-profile",
        "category": "Legal & Corporate",
        "order": 1,
        "question": "What is the corporate structure and legal registration of JP Engineering?",
        "answer": "JP Engineering & Construction Pvt. Ltd. is a legally registered private limited enterprise under the Office of the Company Registrar, Government of Nepal, holding permanent Inland Revenue Department VAT registration (PAN 604245648) and Department of Industry manufacturing licenses."
    },
    {
        "page": "company-profile",
        "category": "Quality Assurance",
        "order": 2,
        "question": "What is the certified scope under ISO 9001:2015?",
        "answer": "Our ISO 9001:2015 certification (Certificate No. 106297/A/0001/UK/En) certifies quality management across design, manufacturing, supply, installation, testing, and commissioning of food, beverage, water, and refrigeration systems."
    },
    {
        "page": "company-profile",
        "category": "Track Record",
        "order": 3,
        "question": "How many industrial installations has JP Engineering completed?",
        "answer": "To date, we have successfully completed and commissioned more than 150 turnkey projects across Nepal, including government dairy chilling centers, commercial bottled water plants, pharmaceutical cleanrooms, and private food processors."
    },
    {
        "page": "company-profile",
        "category": "Maintenance Contracts",
        "order": 4,
        "question": "Do you offer Annual Maintenance Contracts (AMC) for completed plants?",
        "answer": "Yes. We offer structured Comprehensive and Non-Comprehensive AMCs, providing periodic preventive audits, calibration of instruments, ultrasonic weld inspection, and priority 24/7 technical breakdown support."
    },

    # Our Team FAQs
    {
        "page": "our-team",
        "category": "Engineering Expertise",
        "order": 1,
        "question": "What technical qualifications does the engineering team hold?",
        "answer": "Our engineering team includes certified mechanical engineers, electrical and SCADA automation specialists, ASME-qualified TIG welders, and certified refrigeration technicians with extensive Nepal project experience."
    },
    {
        "page": "our-team",
        "category": "Safety & Protocols",
        "order": 2,
        "question": "How do your engineers handle on-site installation and factory safety?",
        "answer": "Our project managers adhere to strict industrial safety protocols, managing structural foundation alignment, sanitary utility piping, pressure vessel testing, and 3-phase electrical integration with certified equipment."
    },
    {
        "page": "our-team",
        "category": "Design & CAD",
        "order": 3,
        "question": "Can your engineering team provide custom CAD layouts before fabrication?",
        "answer": "Yes. Every proposal includes 2D architectural footprints, 3D equipment models, and Process & Instrumentation Diagrams (P&ID) for client review and engineering sign-off before manufacturing begins."
    },
    {
        "page": "our-team",
        "category": "Commissioning & Training",
        "order": 4,
        "question": "Is operator training provided during machine commissioning?",
        "answer": "Yes. During on-site commissioning, our specialists provide comprehensive training to factory operating staff covering daily operations, CIP sanitation cycles, routine lubrication, and safety troubleshooting."
    },

    # Our Clients FAQs
    {
        "page": "our-clients",
        "category": "Client Portfolio",
        "order": 1,
        "question": "Which major national organizations are clients of JP Engineering?",
        "answer": "We have served leading public and private organizations across Nepal, including Dairy Development Corporation (DDC), Kathmandu Dairy, Central Dairy, ND Dairy, Himchuli Water, Aqua Mineral, and regional cold store cooperatives."
    },
    {
        "page": "our-clients",
        "category": "Plant Visits",
        "order": 2,
        "question": "Can prospective clients visit reference installations in Nepal?",
        "answer": "Yes. With prior coordination, we organize client visits to operational dairy, water treatment, and cold storage facilities so you can inspect machine build quality and talk with plant operating managers."
    },
    {
        "page": "our-clients",
        "category": "Documentation",
        "order": 3,
        "question": "What technical handover documentation is provided to clients?",
        "answer": "We provide complete engineering documentation including as-built CAD drawings, P&ID schematics, electrical circuit diagrams, equipment test certificates, and operation manuals."
    },
    {
        "page": "our-clients",
        "category": "After-sales Support",
        "order": 4,
        "question": "What ongoing maintenance support is guaranteed after commissioning?",
        "answer": "We support all our client installations with 24/7 technical hotline access, emergency breakdown dispatch within 24 hours, scheduled quarterly servicing, and genuine replacement spare parts."
    },

    # Our Partners FAQs
    {
        "page": "our-partners",
        "category": "Global Partnerships",
        "order": 1,
        "question": "Who are JP Engineering's global component and technology partners?",
        "answer": "We collaborate with world-leading industrial component manufacturers including Siemens and Schneider Electric for automation, Danfoss and Bitzer for refrigeration compressors, and Grundfos for sanitary fluid pumps."
    },
    {
        "page": "our-partners",
        "category": "Component Warranty",
        "order": 2,
        "question": "Are integrated international components backed by official warranties?",
        "answer": "Yes. All international components integrated into our machinery skids are genuine, factory-certified, and covered by original manufacturer warranties alongside our local fabrication guarantee."
    },
    {
        "page": "our-partners",
        "category": "Client Advantages",
        "order": 3,
        "question": "How do international equipment partnerships benefit factory owners in Nepal?",
        "answer": "Clients receive European-grade energy efficiency and reliability paired with local mechanical engineering, immediate on-site maintenance, and domestic pricing."
    },
    {
        "page": "our-partners",
        "category": "Supplier Onboarding",
        "order": 4,
        "question": "Can new industrial equipment suppliers propose a partnership?",
        "answer": "We welcome inquiries from verified global manufacturers of sanitary valves, high-pressure pumps, heat exchangers, and packaging automation. Contact our procurement desk via our contact form."
    },
]


class Command(BaseCommand):
    help = "Seed initial curated FAQ items into the database"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding FAQs into database..."))
        created_count = 0
        updated_count = 0

        for item in FAQ_DATA:
            faq, created = FAQ.objects.update_or_create(
                question=item["question"],
                defaults={
                    "page": item["page"],
                    "category": item.get("category", ""),
                    "answer": item["answer"],
                    "order": item.get("order", 0),
                    "is_active": True,
                }
            )
            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully processed FAQs: {created_count} created, {updated_count} updated. Total in DB: {FAQ.objects.count()}"
            )
        )
