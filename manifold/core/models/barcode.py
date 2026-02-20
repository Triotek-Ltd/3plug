import os
from io import BytesIO

import barcode
import qrcode
from barcode.writer import ImageWriter
from django.conf import settings
from django.core.files import File
from PIL import Image


def write_barcode(self, field, ref):
    # Create the file name
    file_name = f"{self.id}.png"

    # Check if the file already exists in the designated location
    file_path = os.path.join(settings.MEDIA_ROOT, field.field.upload_to, file_name)

    if os.path.exists(file_path):
        print(f"File {file_name} already exists, skipping barcode generation.")
        return self  # Skip saving if the file already exists

    # Parse help_text to determine whether to generate QR code and/or barcode
    help_text = (
        self._meta.get_field("barcode").help_text
        if self._meta.get_field("barcode").help_text
        else "False, False"
    )
    has_qr, has_barcode = map(
        lambda x: x.strip().lower() == "true", help_text.split(",")
    )

    # Initialize images list
    images = []

    if has_qr:
        # Generate QR code
        base_url = self._meta.get_field("barcode").verbose_name
        qr_data = (
            f"{base_url.rsplit('/', 1)[0]}/{ref}"
            if "/" in base_url
            else f"{base_url}/{ref}"
        )

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)
        qr_img = qr.make_image(fill="black", back_color="white")
        images.append(qr_img)

    if has_barcode:
        # Generate Barcode
        spaced_ref = "".join(ref)
        CODE128 = barcode.get_barcode_class("code128")
        code128 = CODE128(spaced_ref, writer=ImageWriter())

        options = {
            "module_height": 10.0,  # Height of the barcode
            "module_width": 0.2,  # Width of each barcode module
        }

        barcode_buffer = BytesIO()
        code128.write(barcode_buffer, options=options)
        barcode_image = Image.open(barcode_buffer)
        images.append(barcode_image)

    # Combine images if any were generated
    if images:
        # Define constant width
        constant_width = 400
        padding = 50  # Padding between images

        # Resize images to the constant width
        resized_images = []
        for img in images:
            width, height = img.size
            new_height = int((constant_width / width) * height)
            resized_image = img.resize((constant_width, new_height), Image.LANCZOS)
            resized_images.append(resized_image)

        # Determine the combined height with padding
        combined_height = sum(img.size[1] for img in resized_images) + padding

        # Create a new image with the combined height plus padding
        combined_image = Image.new("RGB", (constant_width, combined_height), "white")

        # Paste images onto the combined image
        y_offset = 0
        for img in resized_images:
            combined_image.paste(img, (0, y_offset))
            y_offset += img.size[1]

        # Add padding at the bottom
        padding_image = Image.new("RGB", (constant_width, padding), "white")
        combined_image.paste(padding_image, (0, y_offset))

        # Save the final combined image
        final_buffer = BytesIO()
        combined_image.save(final_buffer, format="PNG")
        field.save(file_name, File(final_buffer), save=False)

    return self
