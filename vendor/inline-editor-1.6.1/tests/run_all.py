"""Rebuild and execute current and inherited behavioral suites; validate JSON, not exit code alone."""
from pathlib import Path
import subprocess,sys,os,argparse,json,hashlib,time
P=Path(__file__).resolve().parents[1]
a=argparse.ArgumentParser();a.add_argument('--landing-original',required=True);a.add_argument('--landing-editable',required=True);args=a.parse_args()
original=Path(args.landing_original).resolve();editable=Path(args.landing_editable).resolve()
if not original.is_file() or original==editable:raise SystemExit('Informe uma landing original existente e um caminho de saída diferente.')
subprocess.run(['node',str(P/'tools/build.mjs')],check=True)
subprocess.run(['node','--check',str(P/'src/runtime.js')],check=True)
subprocess.run(['node',str(P/'tools/integrate.mjs'),str(original),str(editable)],check=True)
env=os.environ.copy();env.update(IE_LANDING_ORIGINAL=str(original),IE_LANDING_EDITABLE=str(editable))
for key in ['GATES','BOX_GATES','TEXT_GATES','ONLY','DELETE_ONLY']:env.pop(key,None)
(P/'qa/logs').mkdir(exist_ok=True);rows=[]
def source_hashes():
 return {str(f.relative_to(P)):hashlib.sha256(f.read_bytes()).hexdigest() for f in (P/'src').rglob('*') if f.is_file()}
source_before=source_hashes()
suites=[('test_template.py','template-results.json',25),('test_extra.py','extra-results.json',8),('test_box_model.py','box-model-results.json',36),('test_box_edges.py','box-edges.json',15),('test_text_range.py','text-range-results.json',43),('test_text_edges.py','text-edges.json',20),('test_comments_duplicate.py','comments-duplicate-results.json',15),('test_landing.py','landing-results.json',8),('test_product_ui.py','product-ui-results.json',40),('test_delete_reflow.py','delete-reflow-results.json',108),('test_mobility.py','evidence/mobility-153.json',None)]
for filename,report,expected in suites:
 start=time.monotonic();target=P/'qa'/report
 if target.exists():target.unlink()
 with (P/'qa/logs'/filename.replace('.py','.log')).open('w') as log:
  result=subprocess.run([sys.executable,str(P/'tests'/filename)],env=env,stdout=log,stderr=subprocess.STDOUT,timeout=600)
 data=json.loads(target.read_text()) if target.exists() else []
 if expected is not None:passed=isinstance(data,list) and len(data)==expected and all(r.get('status')=='PASS' for r in data)
 else:passed=isinstance(data,dict) and data.get('grab_not_occluded') is True and data.get('drag_commits_one_history_entry') is True and data.get('burst_500_pointermoves_processed_frames',999)<=4
 row={'suite':filename,'expected_cases':expected,'passed':bool(passed and result.returncode==0),'exit_code':result.returncode,'seconds':round(time.monotonic()-start,2),'report':report};rows.append(row);print(row,flush=True)
 (P/'qa/run-summary.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
 if not row['passed']:raise SystemExit(f'Falha na suíte {filename}; veja qa/logs. Nenhuma homologação deve ser declarada.')
if source_hashes()!=source_before:raise SystemExit('Os fontes mudaram durante a execução. Refaça a suíte completa antes de homologar.')
files=[p for p in (P/'src').rglob('*') if p.is_file()]
manifest={str(f.relative_to(P)):hashlib.sha256(f.read_bytes()).hexdigest() for f in files};manifest['landing_original']=hashlib.sha256(original.read_bytes()).hexdigest();manifest['landing_editable']=hashlib.sha256(editable.read_bytes()).hexdigest()
(P/'qa/tested-build-sha256.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('Todas as suítes concluídas com sucesso.',flush=True)
