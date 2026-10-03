"""Package only the canonical public source in site/, with immutable identity."""
import json
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'site'
OUT = ROOT / '.pages-release'
sha = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
allowed = {'index.html', 'styles.css', 'motion.js', 'public-preview.js'}
images = {'tree.png', 'leaf-a.png', 'leaf-b.png', 'leaf-c.png',
          'cooperative-newsprint-v1.png', 'cooperative-tablet-v1.png',
          'knowledge-branch-v1.png', 'knowledge-hands-v1.png', 'knowledge-notebook-v1.png'}
expected = allowed | {'assets/' + image for image in images}
actual = {p.relative_to(SOURCE).as_posix() for p in SOURCE.rglob('*') if p.is_file()}
if actual != expected | {'README.md'}:
    raise SystemExit(f'Unexpected public source inventory: {actual ^ (expected | {"README.md"})}')
if OUT.exists():
    previous = {p.relative_to(OUT).as_posix() for p in OUT.rglob('*') if p.is_file()}
    if previous - expected - {'release.json', '.nojekyll'}:
        raise SystemExit('Unexpected files in output; use a fresh checkout. Nothing removed.')
for relative in sorted(expected):
    target = OUT / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(SOURCE / relative, target)
(OUT / '.nojekyll').write_text('', encoding='utf-8')
(OUT / 'release.json').write_text(json.dumps({'commit': sha, 'sections': 4, 'status': 'under-construction'}, indent=2) + '\n', encoding='utf-8')
print(f'Public release: {sha}, four covers, {len(images)} images, no draft files.')
