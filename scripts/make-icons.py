"""Generate the Kitlist app icon, adaptive icon and splash image with Pillow.

    python3 scripts/make-icons.py

Flat design: a white ticked box on the accent colour. Everything is drawn at
4x and downsampled for clean anti-aliased edges.
"""
from PIL import Image, ImageDraw

ACCENT = (0xE6, 0x60, 0x2A, 255)
WHITE = (255, 255, 255, 255)
SCALE = 4


def ticked_box(size, color, box_frac=0.56, stroke_frac=0.075):
    """A rounded square outline with a check mark, centred on a transparent canvas."""
    s = size * SCALE
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    box = s * box_frac
    stroke = int(s * stroke_frac)
    x0 = (s - box) / 2
    y0 = (s - box) / 2
    x1 = x0 + box
    y1 = y0 + box
    d.rounded_rectangle([x0, y0, x1, y1], radius=box * 0.18, outline=color, width=stroke)
    # check mark: three points inside the box
    p1 = (x0 + box * 0.24, y0 + box * 0.52)
    p2 = (x0 + box * 0.43, y0 + box * 0.71)
    p3 = (x0 + box * 0.78, y0 + box * 0.32)
    w = int(stroke * 1.15)
    d.line([p1, p2, p3], fill=color, width=w, joint="curve")
    r = w / 2
    for p in (p1, p3):
        d.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=color)
    return img.resize((size, size), Image.LANCZOS)


def on_background(fg, color):
    bg = Image.new("RGBA", fg.size, color)
    bg.alpha_composite(fg)
    return bg


def rounded_tile(size, color, radius_frac=0.22):
    s = size * SCALE
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    ImageDraw.Draw(img).rounded_rectangle([0, 0, s - 1, s - 1], radius=s * radius_frac, fill=color)
    return img.resize((size, size), Image.LANCZOS)


# App icon: full-bleed accent square (iOS masks the corners itself).
icon = on_background(ticked_box(1024, WHITE), ACCENT)
icon.convert("RGB").save("assets/icon.png")

# Android adaptive icon foreground: glyph inside the safe zone (inner 66%),
# background colour comes from app.json.
adaptive = ticked_box(1024, WHITE, box_frac=0.40, stroke_frac=0.055)
adaptive.save("assets/adaptive-icon.png")
mono = ticked_box(1024, WHITE, box_frac=0.40, stroke_frac=0.055)
mono.save("assets/adaptive-icon-monochrome.png")

# Splash: the icon as a rounded tile on the app background colour (set in app.json).
tile = rounded_tile(512, ACCENT)
tile.alpha_composite(ticked_box(512, WHITE))
tile.save("assets/splash-icon.png")

# Web favicon (unused by the native apps, kept so Expo has one).
icon.resize((48, 48), Image.LANCZOS).convert("RGB").save("assets/favicon.png")
print("wrote assets/icon.png, adaptive-icon.png, adaptive-icon-monochrome.png, splash-icon.png, favicon.png")
