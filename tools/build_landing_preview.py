"""Copy only public static preview files. Never expose the worktree itself."""
from pathlib import Path
import shutil,json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT.parent/'preview-15-public'
if OUT.exists():raise SystemExit('Destination already exists; use a fresh versioned directory.')
OUT.mkdir()
allowed={'.html','.css','.js','.png','.jpg','.jpeg','.webp','.svg','.ico','.woff','.woff2'}
paths=[ROOT/n for n in ['index.html','styles.css','motion.js','portfolio.js','editor-preview.js','public-preview.js'] if (ROOT/n).is_file()]
for folder in ['assets','demos']:
 paths.extend(p for p in (ROOT/folder).rglob('*') if p.is_file() and p.suffix.lower() in allowed)
inventory=[]
for p in paths:
 rel=p.relative_to(ROOT)
 assert not any(part.startswith('.') or part in ['tests','tools','research'] for part in rel.parts)
 dst=OUT/rel;dst.parent.mkdir(exist_ok=True,parents=True);shutil.copy2(p,dst)
 inventory.append({'path':str(rel),'bytes':p.stat().st_size})
(ROOT/'tests/preview-15-public-inventory.json').write_text(json.dumps(inventory,indent=2),encoding='utf-8')
print(json.dumps({'public_directory':str(OUT),'files':len(inventory),'bytes':sum(p['bytes'] for p in inventory)}))
