import os
from PIL import Image

# Paths to directories
base_nft_path = "build/images/"  # Path to the 10,000 NFTs
wing_states_path = "build/wings/"  # Path to the 3 wing state images
output_path = "build/final_wings/"  # Output folder for the merged images

# Ensure output folder exists
os.makedirs(output_path, exist_ok=True)

# Load the 3 wing state images
wing_states = {
    "wing_up": Image.open(os.path.join(wing_states_path, "wing-up.png")).convert("RGBA"),
    "wing_mid": Image.open(os.path.join(wing_states_path, "wing-mid.png")).convert("RGBA"),
    "wing_down": Image.open(os.path.join(wing_states_path, "wing-down.png")).convert("RGBA"),
}

# Process each NFT and apply the wing states
for nft_file in os.listdir(base_nft_path):
    if nft_file.endswith(".png"):
        base_nft = Image.open(os.path.join(base_nft_path, nft_file)).convert("RGBA")
        
        # Create 3 versions with each wing state
        for wing_name, wing_image in wing_states.items():
            combined = Image.alpha_composite(base_nft, wing_image)
            combined.save(os.path.join(output_path, f"{nft_file.replace('.png', '')}_{wing_name}.png"))

print("Wing state merging completed! Check the output folder.")