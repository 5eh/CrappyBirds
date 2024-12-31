import os
from PIL import Image

# Define input and output directories
input_folder = "/Users/ironandsilk/Documents/GitHub/CrappyBirds/art/layers-large"
output_folder = "/Users/ironandsilk/Documents/GitHub/CrappyBirds/art/layers-34"

# Ensure the output folder exists
os.makedirs(output_folder, exist_ok=True)

# Resize images recursively
def resize_images_recursively(input_folder, output_folder, size=(34, 34)):
    for root, _, files in os.walk(input_folder):  # Traverse subfolders
        # Calculate relative path for subfolders
        relative_path = os.path.relpath(root, input_folder)
        target_folder = os.path.join(output_folder, relative_path)
        
        # Ensure the corresponding subfolder exists in the output
        os.makedirs(target_folder, exist_ok=True)
        
        for filename in files:
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff')):
                try:
                    # Open the image
                    img_path = os.path.join(root, filename)
                    img = Image.open(img_path)
                    
                    # Resize the image (maintain aspect ratio if desired)
                    img = img.resize(size, Image.ANTIALIAS)
                    
                    # Save the resized image to the corresponding subfolder
                    output_path = os.path.join(target_folder, filename)
                    img.save(output_path)
                    
                    print(f"Resized and saved: {output_path}")
                except Exception as e:
                    print(f"Error processing {filename} in {root}: {e}")

# Run the resizing function
resize_images_recursively(input_folder, output_folder)