"""Generate deterministic edition assets without modifying original files.

Run: python scripts/optimize-edition-assets.py
Pillow is the only dependency. Fonts for the social card are resolved from the
system; use --font-dir for the same Arial/Georgia files on another workstation.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "assets"
COLLECTION = ROOT / "public" / "demos" / "landing-collection"
QUALITY = 84
MAX_WIDTH = 1440
TILE_HEIGHT = 1200


def write_json(path: Path, value: object) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def optimize_rasters() -> tuple[dict, dict]:
    destination = ASSETS / "edition"
    destination.mkdir(parents=True, exist_ok=True)
    inputs = sorted({path for pattern in (
        "portfolio-*.png", "lab-*.png", "tree*.png", "cooperative*.png", "knowledge*.png", "process-piece-*.png", "leaf-?.png"
    ) for path in ASSETS.glob(pattern)})
    manifest = {}
    for source in inputs:
        with Image.open(source) as original:
            mode = "RGBA" if "A" in original.getbands() or "transparency" in original.info else "RGB"
            picture = original.convert(mode)
            if picture.width > MAX_WIDTH:
                picture = picture.resize((MAX_WIDTH, round(picture.height * MAX_WIDTH / picture.width)), Image.Resampling.LANCZOS)
            target = destination / (source.stem + ".webp")
            picture.save(target, "WEBP", quality=QUALITY, method=6, exact=True)
            manifest[source.name] = {
                "src": "/assets/edition/" + target.name,
                "width": picture.width, "height": picture.height,
                "sourceBytes": source.stat().st_size, "bytes": target.stat().st_size,
            }
    write_json(destination / "manifest.json", manifest)
    stats = {"files": len(manifest), "sourceBytes": sum(item["sourceBytes"] for item in manifest.values()), "outputBytes": sum(item["bytes"] for item in manifest.values())}
    return manifest, stats


def tile_landing_pages() -> tuple[dict, dict]:
    data = (COLLECTION / "data.js").read_text(encoding="utf-8-sig")
    projects = json.loads(data.split("=", 1)[1].strip().rstrip(";"))
    destination = COLLECTION / "screens" / "tiles"
    destination.mkdir(parents=True, exist_ok=True)
    manifest = {}
    source_bytes = output_bytes = tile_count = 0
    for project in projects:
        key = project["key"]
        source = COLLECTION / "screens" / "mobile" / f"{key}-mobile-v1.jpg"
        source_bytes += source.stat().st_size
        tiles = []
        with Image.open(source) as original:
            picture = original.convert("RGB")
            for index, top in enumerate(range(0, picture.height, TILE_HEIGHT), 1):
                tile = picture.crop((0, top, picture.width, min(top + TILE_HEIGHT, picture.height)))
                target = destination / f"{key}-{index:03}.webp"
                tile.save(target, "WEBP", quality=QUALITY, method=6)
                tiles.append({"src": "tiles/" + target.name, "width": tile.width, "height": tile.height})
                output_bytes += target.stat().st_size
                tile_count += 1
        manifest[key] = tiles
    write_json(destination / "manifest.json", manifest)
    return manifest, {"projects": len(manifest), "tiles": tile_count, "sourceBytes": source_bytes, "outputBytes": output_bytes}


def social_card(font_directory: Path) -> dict:
    scale = 2
    image = Image.new("RGB", (1200 * scale, 630 * scale), "#eee9df")
    draw = ImageDraw.Draw(image)
    def font(name: str, size: int) -> ImageFont.FreeTypeFont:
        path = font_directory / name
        if not path.is_file():
            raise FileNotFoundError(f"Required typeface missing: {path}; pass --font-dir with Arial and Georgia fonts.")
        return ImageFont.truetype(str(path), size * scale)
    def line(points, fill, width=1):
        draw.line([(int(x * scale), int(y * scale)) for x,y in points], fill=fill, width=width * scale)
    def text(position, value, typeface, fill):
        draw.text((position[0]*scale, position[1]*scale), value, font=typeface, fill=fill)

    # Fine printed coordinates frame the botanical specimen; no generated texture.
    for x in range(30, 430, 28):
        for y in range(108, 560, 28):
            draw.ellipse((x*scale,y*scale,x*scale+2,y*scale+2),fill="#b5b9a4")
    line([(42,79),(1158,79)], "#b6b8a6")
    text((44,31), "SOBERANIA", font("arial.ttf",18), "#27332a")
    text((157,31), "LABS", font("arialbd.ttf",18), "#a95835")
    text((897,33), "SISTEMAS BRASILEIROS", font("arial.ttf",12), "#606953")
    # Compose the existing transparent tree at its native aspect ratio.
    with Image.open(ASSETS / "tree.png") as original:
        tree = original.convert("RGBA")
        tree.thumbnail((435*scale,515*scale), Image.Resampling.LANCZOS)
        image.paste(tree, (max(0,22*scale+(390*scale-tree.width)//2), 90*scale), tree)
    draw = ImageDraw.Draw(image)
    text((458,132), "LABORATÓRIO INDEPENDENTE", font("arial.ttf",13), "#8b5436")
    text((451,182), "Tecnologia", font("arial.ttf",78), "#253329")
    text((454,273), "a serviço", font("georgiai.ttf",72), "#253329")
    text((453,357), "da humanidade.", font("georgiai.ttf",65), "#253329")
    line([(459,462),(1096,462)], "#b6b8a6")
    text((459,485), "Software, conhecimento e infraestrutura", font("arial.ttf",20), "#626d58")
    text((459,515), "para ampliar autonomia.", font("arial.ttf",20), "#626d58")
    draw.rectangle((0,577*scale,1200*scale,630*scale),fill="#26372b")
    text((45,596), "TECNOLOGIA · SOCIEDADE · TERRITÓRIO", font("arial.ttf",12), "#d6deca")
    text((955,596), "FLORIANÓPOLIS / BRASIL", font("arial.ttf",11), "#dbb18a")
    target = ASSETS / "social" / "edition-og.png"
    target.parent.mkdir(parents=True, exist_ok=True)
    image.resize((1200,630),Image.Resampling.LANCZOS).save(target,"PNG",compress_level=9)
    return {"src":"/assets/social/edition-og.png","width":1200,"height":630,"bytes":target.stat().st_size}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--font-dir", type=Path, default=Path("C:/Windows/Fonts"))
    args = parser.parse_args()
    _, raster_stats = optimize_rasters()
    _, phone_stats = tile_landing_pages()
    report = {"quality":QUALITY,"maxRasterWidth":MAX_WIDTH,"tileHeight":TILE_HEIGHT,"rasters":raster_stats,"landingPhones":phone_stats,"socialCard":social_card(args.font_dir)}
    report["sourceBytes"] = raster_stats["sourceBytes"] + phone_stats["sourceBytes"]
    report["outputBytes"] = raster_stats["outputBytes"] + phone_stats["outputBytes"]
    report["reductionPercent"] = round((1-report["outputBytes"]/report["sourceBytes"])*100,2)
    write_json(ASSETS / "edition" / "optimization-report.json", report)
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
