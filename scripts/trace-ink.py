"""Extract pencil guide geometry; never modify or resave the source illustration.

Offline authoring only: Pillow 12.0.0, NumPy 2.3.5. The PNG remains the artwork;
these centre lines only drive its reveal mask, not a replacement vector drawing.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image


def skeletonize(ink):
    """Two-pass topology-preserving thinning on a padded boolean analysis grid."""
    pixels = np.pad(ink, 1)
    while True:
        removed = 0
        for step in range(2):
            p = [pixels[:-2, 1:-1], pixels[:-2, 2:], pixels[1:-1, 2:],
                 pixels[2:, 2:], pixels[2:, 1:-1], pixels[2:, :-2],
                 pixels[1:-1, :-2], pixels[:-2, :-2]]
            count = sum(v.astype(np.uint8) for v in p)
            turns = sum((~p[i] & p[(i+1) % 8]).astype(np.uint8) for i in range(8))
            clear = pixels[1:-1, 1:-1] & (count >= 2) & (count <= 6) & (turns == 1)
            if step == 0:
                clear &= ~(p[0] & p[2] & p[4]) & ~(p[2] & p[4] & p[6])
            else:
                clear &= ~(p[0] & p[2] & p[6]) & ~(p[0] & p[4] & p[6])
            removed += int(clear.sum())
            pixels[1:-1, 1:-1][clear] = False
        if not removed:
            return pixels[1:-1, 1:-1]


def chains(grid):
    points = {(int(x), int(y)) for y, x in zip(*np.nonzero(grid))}
    neighbors = {}
    for x, y in sorted(points, key=lambda p: (p[1], p[0])):
        near = []
        for dy in [-1, 0, 1]:
            for dx in [-1, 0, 1]:
                if (dx or dy) and (x+dx, y+dy) in points:
                    # Do not add diagonal shortcuts across an existing corner.
                    if dx and dy and ((x+dx, y) in points or (x, y+dy) in points):
                        continue
                    near.append((x+dx, y+dy))
        neighbors[x, y] = near
    visited = set()
    starts = [p for p in neighbors if len(neighbors[p]) != 2]
    # Degree-two leftovers are closed loops, visited after all open chains.
    for start in starts + list(neighbors):
        for nxt in neighbors[start]:
            edge = tuple(sorted((start, nxt)))
            if edge in visited:
                continue
            path = [start]
            previous, current = start, nxt
            visited.add(edge)
            while True:
                path.append(current)
                options = [p for p in neighbors[current] if p != previous]
                if len(neighbors[current]) != 2 or not options:
                    break
                following = options[0]
                edge = tuple(sorted((current, following)))
                if edge in visited:
                    break
                visited.add(edge)
                previous, current = current, following
            yield path


def simplify(points, tolerance=.65):
    """Ramer–Douglas–Peucker; subpixel accuracy is sufficient for a reveal mask."""
    if len(points) <= 2:
        return points
    ax, ay = points[0]
    bx, by = points[-1]
    length = math.hypot(bx-ax, by-ay)
    distances = [abs((by-ay)*x-(bx-ax)*y+bx*ay-by*ax)/length
                 if length else math.hypot(x-ax, y-ay) for x, y in points]
    index = max(range(len(points)), key=distances.__getitem__)
    if distances[index] <= tolerance:
        return [points[0], points[-1]]
    return simplify(points[:index+1], tolerance)[:-1] + simplify(points[index:], tolerance)


def region(x, y):
    # Editorial sequencing for this specific commissioned composition.
    if y > 700 or (x < 930 and y > 525):
        return 0  # bench and vise
    if (x < 620 and y < 475) or (x > 995 and y < 690) or (x > 1200):
        return 2  # hands and sleeves
    return 1  # wrench and workpiece


def direction(points, end=False):
    ordered = list(reversed(points)) if end else points
    a = ordered[0]
    b = next((p for p in ordered[1:] if math.dist(a, p) >= 8), ordered[-1])
    dx, dy = b[0]-a[0], b[1]-a[1]
    length = max(.001, math.hypot(dx, dy))
    sign = -1 if end else 1
    return dx/length*sign, dy/length*sign


def order_locally(paths):
    """Follow adjacent endpoints, continuing a contour before lifting elsewhere.

    Reversing an existing polyline does not change its shape. Only coincident
    endpoints with compatible tangents are joined; no connecting line is invented.
    """
    ordered = []
    seeds = [(620, 630), (810, 450), (510, 400)]
    for phase, seed in enumerate(seeds):
        remaining = [p['points'] for p in paths if p['phase'] == phase]
        tip, heading = seed, None
        while remaining:
            candidates = []
            for index, points in enumerate(remaining):
                for reverse in [False, True]:
                    candidate = list(reversed(points)) if reverse else points
                    distance = math.dist(tip, candidate[0])
                    incoming = direction(candidate)
                    alignment = sum(a*b for a, b in zip(heading, incoming)) if heading else 1
                    # Keep the pencil on the current contour at junctions. Outside
                    # the neighborhood, distance dominates instead of line length.
                    cost = distance + (1-alignment)*12 if distance < 24 else distance+24
                    candidates.append((cost, distance, -alignment, index, reverse))
            _, gap, negative_alignment, index, reverse = min(candidates)
            points = remaining.pop(index)
            if reverse:
                points = list(reversed(points))
            if ordered and ordered[-1]['phase'] == phase and gap == 0 and negative_alignment < -.25:
                ordered[-1]['points'].extend(points[1:])
            else:
                ordered.append({'phase': phase, 'points': list(points)})
            tip, heading = points[-1], direction(points, end=True)
    return ordered


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('image', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    source = args.image.read_bytes()
    with Image.open(args.image) as image:
        gray = np.asarray(image.convert('L'))
        width, height = image.size
    if (width, height) != (1536, 1024):
        raise SystemExit('This editorial sequence is calibrated for the 1536 × 1024 workbench.')
    ink = gray < 180
    grid = skeletonize(ink)
    paths = []
    for points in chains(grid):
        length = sum(math.dist(a, b) for a, b in zip(points, points[1:]))
        if length < 13:
            continue
        x, y = points[len(points)//2]
        simplified = simplify(points)
        length = sum(math.dist(a, b) for a, b in zip(simplified, simplified[1:]))
        paths.append({'phase': region(x, y), 'points': simplified})
    paths = order_locally(paths)
    previous = None
    for path in paths:
        points = path.pop('points')
        path['length'] = round(sum(math.dist(a, b) for a, b in zip(points, points[1:])), 2)
        path['gap'] = round(math.dist(previous[1], points[0]), 2) if previous and previous[0] == path['phase'] else 0
        path['d'] = 'M'+' L'.join(f'{x} {y}' for x, y in points)
        previous = path['phase'], points[-1]
    result = {'version': 2, 'sourceSha256': hashlib.sha256(source).hexdigest(),
              'width': width, 'height': height, 'threshold': 180, 'paths': paths}
    args.output.write_text(json.dumps(result, ensure_ascii=False, separators=(',', ':'))+'\n', encoding='utf-8')
    print(json.dumps({'paths': len(paths), 'bytes': args.output.stat().st_size,
                      'phases': [sum(p['phase'] == i for p in paths) for i in range(3)],
                      'sourceSha256': result['sourceSha256']}))


if __name__ == '__main__':
    main()
