import csv
import os
import sys

from PIL import Image


def overlay_images(
    base_image_path: str, overlay_image_path: str, output_path: str
) -> None:
    base_image = Image.open(base_image_path).convert("RGBA")

    overlay_image = Image.open(overlay_image_path).convert("RGBA")

    if base_image.size != overlay_image.size:
        raise ValueError("The sizes of the images are different.")

    composite_image = Image.alpha_composite(base_image, overlay_image)
    composite_image.save(output_path, "PNG")


if __name__ == "__main__":
    overlay_image_path = sys.argv[1]
    index_path = sys.argv[2]
    image_dir = sys.argv[3]
    output_dir = sys.argv[4]
    with open(index_path, "r") as f:
        reader = csv.reader(f)
        for row in reader:
            base_image_path = os.path.join(image_dir, row[22])
            output_path = os.path.join(
                output_dir, row[22].replace(".png", "_circle_guide.png")
            )
            overlay_images(base_image_path, overlay_image_path, output_path)
