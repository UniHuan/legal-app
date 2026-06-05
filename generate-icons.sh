#!/bin/bash
# Generate app icons using ImageMagick or sips (macOS built-in)
# This creates placeholder icons - replace with actual design

ICON_SRC=""
# Check if we have any source icon
for f in icon-512.png icon.png; do
  [ -f "$f" ] && ICON_SRC="$f" && break
done

if [ -z "$ICON_SRC" ]; then
  echo "No icon source found. Creating placeholder..."
  # Create a simple blue square icon using base64
  # For now, we'll use the Capacitor default icons
  echo "Using Capacitor default icons. Replace with your own design."
  exit 0
fi

# Generate various sizes
sizes=(20 29 40 48 50 55 57 58 60 72 76 80 87 88 100 114 120 144 152 167 180 192 512 1024)
for size in "${sizes[@]}"; do
  sips -z $size $size "$ICON_SRC" --out "www/icons/icon-${size}.png" 2>/dev/null
done
echo "Icons generated in www/icons/"
