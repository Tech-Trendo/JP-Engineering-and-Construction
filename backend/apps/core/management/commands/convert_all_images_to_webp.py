import os
import shutil
from PIL import Image
from django.core.management.base import BaseCommand
from django.conf import settings
from django.apps import apps


class Command(BaseCommand):
    help = "Converts all images in media and database to .webp format while preserving visual content."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("=== Starting WebP Image Conversion ==="))
        media_root = settings.MEDIA_ROOT
        frontend_public = os.path.abspath(os.path.join(settings.BASE_DIR, "..", "frontend", "public"))
        frontend_media = os.path.join(frontend_public, "media")

        converted_count = 0
        db_updated_count = 0

        # Step 1: Walk backend/media and convert any .jpg, .jpeg, .png to .webp
        for root, _, files in os.walk(media_root):
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext in [".jpg", ".jpeg", ".png"]:
                    src_path = os.path.join(root, file)
                    base_name = os.path.splitext(file)[0]
                    webp_path = os.path.join(root, f"{base_name}.webp")

                    try:
                        with Image.open(src_path) as img:
                            # Preserve transparency if present
                            if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                                img.save(webp_path, "WEBP", quality=95, method=6)
                            else:
                                rgb_img = img.convert("RGB")
                                rgb_img.save(webp_path, "WEBP", quality=92, method=6)

                        converted_count += 1
                        self.stdout.write(f"Converted: {os.path.relpath(src_path, media_root)} -> {base_name}.webp")
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"Failed to convert {src_path}: {e}"))

        self.stdout.write(self.style.SUCCESS(f"Finished converting {converted_count} media files to WebP."))

        # Step 2: Convert static images in frontend/public/assets and frontend/public/images
        for folder in ["assets", "images"]:
            target_dir = os.path.join(frontend_public, folder)
            if os.path.exists(target_dir):
                for file in os.listdir(target_dir):
                    ext = os.path.splitext(file)[1].lower()
                    if ext in [".jpg", ".jpeg", ".png"]:
                        src_path = os.path.join(target_dir, file)
                        base_name = os.path.splitext(file)[0]
                        webp_path = os.path.join(target_dir, f"{base_name}.webp")
                        try:
                            with Image.open(src_path) as img:
                                if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                                    img.save(webp_path, "WEBP", quality=95, method=6)
                                else:
                                    rgb_img = img.convert("RGB")
                                    rgb_img.save(webp_path, "WEBP", quality=92, method=6)
                            self.stdout.write(f"Converted static asset: {folder}/{file} -> {base_name}.webp")
                        except Exception as e:
                            self.stdout.write(self.style.ERROR(f"Failed to convert static asset {src_path}: {e}"))

        # Step 3: Update database records pointing to image fields
        targets = [
            ("categories", "Category", "icon_or_image"),
            ("categories", "Industry", "icon_or_image"),
            ("showcase", "TeamMember", "photo"),
            ("showcase", "Partner", "logo"),
            ("showcase", "Client", "logo"),
            ("site_settings", "SiteSettings", "logo"),
            ("site_settings", "SiteSettings", "hero_image"),
            ("site_settings", "HeroSlide", "image"),
            ("products", "ProductImage", "image"),
        ]

        for app_label, model_name, field_name in targets:
            model = apps.get_model(app_label, model_name)
            for obj in model.objects.all():
                val = getattr(obj, field_name)
                if val and val.name:
                    current_path = val.name
                    ext = os.path.splitext(current_path)[1].lower()
                    if ext in [".jpg", ".jpeg", ".png"]:
                        new_path = os.path.splitext(current_path)[0] + ".webp"
                        # Verify the webp file exists in backend/media
                        full_webp_path = os.path.join(media_root, new_path)
                        if os.path.exists(full_webp_path):
                            setattr(obj, field_name, new_path)
                            obj.save(update_fields=[field_name])
                            db_updated_count += 1
                        else:
                            self.stdout.write(self.style.WARNING(f"File not found for {full_webp_path}"))

        self.stdout.write(self.style.SUCCESS(f"Updated {db_updated_count} database image records to .webp"))

        # Step 4: Mirror all converted webp files to frontend/public/media
        copied_count = 0
        for root, _, files in os.walk(media_root):
            for file in files:
                if file.lower().endswith(".webp"):
                    rel_dir = os.path.relpath(root, media_root)
                    dest_dir = os.path.join(frontend_media, rel_dir)
                    os.makedirs(dest_dir, exist_ok=True)
                    src_file = os.path.join(root, file)
                    dest_file = os.path.join(dest_dir, file)
                    shutil.copy2(src_file, dest_file)
                    copied_count += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully mirrored {copied_count} WebP files to frontend/public/media."))
        self.stdout.write(self.style.SUCCESS("=== WebP Conversion Completed Successfully ==="))
