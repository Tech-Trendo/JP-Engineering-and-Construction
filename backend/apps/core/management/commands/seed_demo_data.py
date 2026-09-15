"""
Management command to populate the database with 100% authentic JP Engineering & Construction
data directly extracted from the official company product catalog (JP.pdf):
1. Dairy Factory Segment
2. Cold Store Solution (Industrial Refrigeration)
3. Water Factory Segment (Water Treatment, Bottling & Blowing, RO Spares, Media, Components, Injection Moulding)
4. Heat Pump System
5. Meat Packing & Processing Segment

Preserves all existing records of TeamMember, Partner, and Client.
"""

from django.core.management.base import BaseCommand
from django.core.management import call_command


class Command(BaseCommand):
    help = "Populates database with authentic JP Engineering data from JP.pdf catalog"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Running extract_and_seed_pdf_data pipeline..."))
        call_command('extract_and_seed_pdf_data')
        self.stdout.write(self.style.SUCCESS("Database successfully seeded with authentic catalog data!"))
