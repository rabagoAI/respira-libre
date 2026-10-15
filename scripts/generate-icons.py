"""
Genera los iconos PNG de la app (PWA) con el mismo diseño que public/favicon.svg:
cuadrado azul redondeado con dos ráfagas de aire.

Uso: python scripts/generate-icons.py
"""
from PIL import Image, ImageDraw

BLUE = (2, 132, 199, 255)
WHITE = (255, 255, 255, 255)
GREEN = (134, 239, 172, 255)
SS = 4  # sobremuestreo para bordes suaves


def draw_icon(size, maskable=False):
    s = size * SS
    img = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if maskable:
        # Los iconos "maskable" ocupan todo el lienzo; el sistema aplica su propia forma
        d.rectangle([0, 0, s, s], fill=BLUE)
        scale, offset = s / 64 * 0.72, s * 0.14
    else:
        d.rounded_rectangle([0, 0, s - 1, s - 1], radius=s * 14 / 64, fill=BLUE)
        scale, offset = s / 64, 0

    def p(x, y):
        return (offset + x * scale, offset + y * scale)

    w = 5 * scale

    def stroke(points, color):
        d.line(points, fill=color, width=round(w), joint='curve')
        r = w / 2
        for x, y in (points[0], points[-1]):
            d.ellipse([x - r, y - r, x + r, y + r], fill=color)

    def dot(x, y, color):
        cx, cy = p(x, y)
        d.ellipse([cx - w / 2, cy - w / 2, cx + w / 2, cy + w / 2], fill=color)

    def arc(cx, cy, r, start, end, color, end_point):
        x, y = p(cx, cy)
        # PIL dibuja el grosor hacia dentro de la caja: se amplía medio trazo para centrarlo
        rr = r * scale + w / 2
        d.arc([x - rr, y - rr, x + rr, y + rr], start, end, fill=color, width=round(w))
        dot(*end_point, color)  # extremo redondeado

    # Ráfaga superior: línea hasta x=38 y curva hacia arriba (M14 26 h24 a6 6 0 1 0 -6 -6)
    stroke([p(14, 26), p(38, 26)], WHITE)
    arc(38, 20, 6, 180, 90, WHITE, (32, 20))
    # Ráfaga inferior: línea hasta x=46 y curva hacia abajo (M14 38 h32 a6 6 0 1 1 -6 6)
    stroke([p(14, 38), p(46, 38)], GREEN)
    arc(46, 44, 6, 270, 180, GREEN, (40, 44))

    return img.resize((size, size), Image.LANCZOS)


for size in (192, 512):
    draw_icon(size).save(f'public/icon-{size}.png')
draw_icon(512, maskable=True).save('public/icon-maskable-512.png')
draw_icon(180).save('public/apple-touch-icon.png')
print('Iconos generados en public/')
