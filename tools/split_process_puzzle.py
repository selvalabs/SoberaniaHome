"""Split the generated process board into six alpha PNGs with shared seams.

The generated image remains the single visual source.  The contours below are
drawn once and reused by each neighbouring piece, so an outward tab and its
corresponding recess can never diverge.  Only the ochre drawing is retained;
the generated dark-green paper is converted to transparency.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "process-puzzle-master.png"
OUTPUT = ROOT / "assets"
WIDTH, HEIGHT = 1536, 1024
CELL_W, CELL_H = 498, 424
PAD_X, PAD_Y = 82, 72


def cubic(start, control_a, control_b, end, steps=24):
    """Return a smooth, shared curve including its end but not its start."""
    points = []
    for step in range(1, steps + 1):
        t = step / steps
        inverse = 1 - t
        points.append((
            inverse ** 3 * start[0] + 3 * inverse ** 2 * t * control_a[0] + 3 * inverse * t ** 2 * control_b[0] + t ** 3 * end[0],
            inverse ** 3 * start[1] + 3 * inverse ** 2 * t * control_a[1] + 3 * inverse * t ** 2 * control_b[1] + t ** 3 * end[1],
        ))
    return points


def vertical_seam(x, top, bottom, start, end, offset):
    """A vertical puzzle join with one asymmetric, rounded tab."""
    middle = (start + end) / 2
    return [(x, top), (x, start)] + cubic(
        (x, start), (x, start + 24), (x + offset, middle - 38), (x + offset, middle)
    ) + cubic(
        (x + offset, middle), (x + offset, middle + 38), (x, end - 24), (x, end)
    ) + [(x, bottom)]


def horizontal_seam(y, left, right, start, end, offset):
    """A horizontal puzzle join with a different tab profile."""
    middle = (start + end) / 2
    return [(left, y), (start, y)] + cubic(
        (start, y), (start + 26, y), (middle - 40, y + offset), (middle, y + offset)
    ) + cubic(
        (middle, y + offset), (middle + 40, y + offset), (end - 26, y), (end, y)
    ) + [(right, y)]


def reverse(points):
    return list(reversed(points))


def paste_crop(image, left, top, size):
    """Crop safely with transparent padding beyond the source board."""
    result = Image.new("RGBA", size, (0, 0, 0, 0))
    source_box = (max(left, 0), max(top, 0), min(left + size[0], WIDTH), min(top + size[1], HEIGHT))
    if source_box[2] > source_box[0] and source_box[3] > source_box[1]:
        result.paste(image.crop(source_box), (source_box[0] - left, source_box[1] - top))
    return result


def main():
    source = Image.open(SOURCE).convert("RGB")
    if source.size != (WIDTH, HEIGHT):
        raise ValueError(f"Expected {(WIDTH, HEIGHT)}, got {source.size}")

    # The generated background is very dark; retain only the warm ink, with a
    # soft alpha fringe for the hand-drawn texture.
    pixels = np.asarray(source, dtype=np.int16)
    brightness = pixels.max(axis=2)
    warmth = pixels[:, :, 0] - pixels[:, :, 2]
    alpha = np.clip((brightness - 42) * 2.35, 0, 255).astype(np.uint8)
    alpha[~((warmth > 20) & (brightness > 42))] = 0
    ink = np.dstack((pixels.astype(np.uint8), alpha))
    # The final state uses the same transparent line-art as a unified board.
    # Individual pieces remain available for the exploded and draggable state.
    Image.fromarray(ink, "RGBA").save(OUTPUT / "process-puzzle-assembled.png", optimize=True)

    # Trace regions from the generated raster itself. The luminous contour is a
    # barrier; the six resulting paper fields are filled from their own cells.
    # This makes the source's actual, irregular tabs the only cut geometry.
    contour = alpha > 0
    labels, count = ndimage.label(~ndimage.binary_dilation(contour, iterations=3))
    sizes = np.bincount(labels.ravel(), minlength=count + 1)
    outside = int(np.argmax(sizes[1:]) + 1)
    centres = np.asarray([(270, 290), (768, 290), (1266, 290), (270, 720), (768, 720), (1266, 720)])
    component_centres = ndimage.center_of_mass(np.ones_like(labels), labels, np.arange(1, count + 1))
    owner = np.full(count + 1, -1, dtype=np.int8)
    for label, (row, column) in enumerate(component_centres, start=1):
        if label == outside or np.isnan(row) or np.isnan(column):
            continue
        owner[label] = int(np.argmin((centres[:, 0] - column) ** 2 + (centres[:, 1] - row) ** 2))
    pieces = []
    for index in range(6):
        field = owner[labels] == index
        # Fill small islands made by letterforms and botanical line work, then
        # expand only enough to retain the original anti-aliased contour.
        pieces.append(ndimage.binary_dilation(ndimage.binary_fill_holes(ndimage.binary_dilation(field, iterations=2)), iterations=3))
    # A few isolated strokes (letters, seeds and fine botanical hatching) do
    # not belong to a flood-filled paper field. Assign only those remaining
    # pixels by their original cell so the six exports reconstruct every pixel
    # of the master without inventing any new outline.
    covered = np.logical_or.reduce(pieces)
    rows, columns = np.indices((HEIGHT, WIDTH))
    fallback_owner = (rows >= 507).astype(np.int8) * 3 + (columns >= 518).astype(np.int8) + (columns >= 1016).astype(np.int8)
    for index in range(6):
        pieces[index] |= (~covered) & (fallback_owner == index)
    origins = [(20, 88), (518, 88), (1016, 88), (20, 507), (518, 507), (1016, 507)]
    reconstructed = np.zeros((HEIGHT, WIDTH), dtype=np.uint8)

    for index, (shape, (origin_x, origin_y)) in enumerate(zip(pieces, origins), start=1):
        piece_alpha = np.where(shape, ink[:, :, 3], 0).astype(np.uint8)
        transparent_piece = Image.fromarray(np.dstack((ink[:, :, :3], piece_alpha)), "RGBA")
        crop = paste_crop(
            transparent_piece,
            origin_x - PAD_X,
            origin_y - PAD_Y,
            (CELL_W + PAD_X * 2, CELL_H + PAD_Y * 2),
        )
        crop.save(OUTPUT / f"process-piece-{index:02d}.png", optimize=True)
        crop_alpha = np.asarray(crop)[:, :, 3]
        left, top = origin_x - PAD_X, origin_y - PAD_Y
        source_left, source_top = max(left, 0), max(top, 0)
        source_right, source_bottom = min(left + crop.width, WIDTH), min(top + crop.height, HEIGHT)
        cropped_alpha = crop_alpha[source_top - top:source_bottom - top, source_left - left:source_right - left]
        reconstructed[source_top:source_bottom, source_left:source_right] = np.maximum(
            reconstructed[source_top:source_bottom, source_left:source_right], cropped_alpha
        )

    missing = int(np.count_nonzero((ink[:, :, 3] > 0) & (reconstructed == 0)))
    if missing:
        raise RuntimeError(f"The individual assets lost {missing} pixels from the master board")


if __name__ == "__main__":
    main()
