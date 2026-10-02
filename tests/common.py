from pathlib import Path
import os, shutil, base64, re
ROOT=Path(__file__).resolve().parents[1]
R=ROOT/'docs'/'qa-rerun'
R.mkdir(parents=True,exist_ok=True)
def build_preview():
    html=(ROOT/'index.html').read_text(encoding='utf-8')
    css=(ROOT/'styles.css').read_text(encoding='utf-8')
    for p in (ROOT/'assets').glob('*.png'):
        uri='data:image/png;base64,'+base64.b64encode(p.read_bytes()).decode('ascii')
        css=css.replace('./assets/'+p.name,uri);html=html.replace('./assets/'+p.name,uri)
    html=re.sub(r'<link rel="stylesheet" href="\./styles\.css(?:\?[^\"]*)?">','<style>'+css+'</style>',html)
    for name in ['config.js','content.js','motion.js','editor.js','app.js']:
        html=re.sub(r'<script src="\./'+re.escape(name)+r'(?:\?[^\"]*)?"></script>','<script>'+ (ROOT/name).read_text(encoding='utf-8')+'</script>',html)
    return html
HTML=build_preview()
BROWSER=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('google-chrome')
def launch(pw):
    args={'headless':True,'args':['--no-sandbox']}
    if BROWSER: args['executable_path']=BROWSER
    return pw.chromium.launch(**args)
