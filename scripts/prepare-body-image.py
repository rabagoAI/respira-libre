"""
Prepara la imagen del cuerpo para la app:
quita el fondo oscuro (lo convierte en transparencia), aclara la figura,
la recorta centrada en el eje del cuerpo y la guarda como public/body.webp.

Uso: python scripts/prepare-body-image.py design/body-original.png
"""
import sys
import numpy as np
from PIL import Image

SOURCE = sys.argv[1] if len(sys.argv) > 1 else 'design/body-original.png'
TARGET = 'public/body.webp'
TARGET_HEIGHT = 1400
GAMMA = 0.72  # < 1 aclara los tonos medios para fondos claros

im = np.asarray(Image.open(SOURCE).convert('RGB')).astype(np.float32)
H, W, _ = im.shape

# Color del fondo: media de las cuatro esquinas
corners = np.concatenate([im[:40, :40], im[:40, -40:], im[-40:, :40], im[-40:, -40:]]).reshape(-1, 3)
bg = corners.mean(axis=0)

# Alfa suave a partir de la luminancia (el halo queda semitransparente)
L = im.mean(axis=2)
lo, hi = bg.mean() + 6, bg.mean() + 55
t = np.clip((L - lo) / (hi - lo), 0, 1)
alpha = t * t * (3 - 2 * t)

# Quitar el color del fondo de los bordes: F = (C - (1 - a) * B) / a
a = alpha[..., None]
fg = np.where(a > 0.01, (im - (1 - a) * bg) / np.maximum(a, 1e-3), 0)
fg = 255 * (np.clip(fg, 0, 255) / 255) ** GAMMA

rgba = np.dstack([fg, alpha * 255]).astype(np.uint8)

# Recorte simétrico respecto al eje del cuerpo (calculado en el torso)
ys, xs = np.where(alpha > 0.05)
torso = alpha[int(H * 0.25):int(H * 0.4)]
cx = (torso.sum(axis=0) * np.arange(W)).sum() / torso.sum()
half = max(cx - xs.min(), xs.max() - cx) + 12
x0, x1 = int(round(cx - half)), int(round(cx + half))
y0, y1 = max(ys.min() - 12, 0), min(ys.max() + 12, H)

canvas = Image.new('RGBA', (x1 - x0, y1 - y0), (0, 0, 0, 0))
canvas.paste(Image.fromarray(rgba, 'RGBA').crop((max(x0, 0), y0, min(x1, W), y1)), (max(-x0, 0), 0))
out = canvas.resize((round(canvas.width * TARGET_HEIGHT / canvas.height), TARGET_HEIGHT), Image.LANCZOS)
out.save(TARGET, 'WEBP', quality=88, method=6)
print(f'{TARGET}: {out.size[0]}x{out.size[1]}')
