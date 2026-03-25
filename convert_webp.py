from PIL import Image
import os
import glob

img_dir = r"d:\trungtamtiengduc\public\images"

patterns = ["**/*.png", "**/*.jpg", "**/*.jpeg"]
files = []
for p in patterns:
    files.extend(glob.glob(os.path.join(img_dir, p), recursive=True))

converted = []
for f in files:
    try:
        img = Image.open(f)
        webp_path = os.path.splitext(f)[0] + ".webp"
        if img.mode in ("RGBA", "LA", "PA"):
            img.save(webp_path, "WEBP", quality=85, method=6)
        else:
            img.convert("RGB").save(webp_path, "WEBP", quality=85, method=6)
        
        old_size = os.path.getsize(f) / 1024
        new_size = os.path.getsize(webp_path) / 1024
        print(f"OK {os.path.basename(f)}: {old_size:.0f}KB -> {new_size:.0f}KB ({(1-new_size/old_size)*100:.0f}% smaller)")
        converted.append(f)
    except Exception as e:
        print(f"FAIL {os.path.basename(f)}: {e}")

print(f"\nConverted {len(converted)} images to WebP")
