#!/usr/bin/env node
/** Rebuilds the canonical template and fragments from the included source modules. */
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),src=resolve(root,'src');
const read=name=>readFile(resolve(src,name),'utf8');
try{
  const {version}=JSON.parse(await readFile(resolve(root,'VERSION.json'),'utf8'));
  if(!/^\d+\.\d+\.\d+$/.test(version))throw new Error('VERSION.json deve conter uma versão semântica numérica.');
  const stamp=text=>text.replaceAll('__IE_VERSION__',version);
  const files=(await readdir(src)).filter(n=>/^\d{2}-.*\.js$/.test(n)).sort();
  const runtime=stamp((await Promise.all(files.map(read))).join('\n'));
  const authored=await read('authored.js');
  if(/<\/script/i.test(runtime)||/<\/script/i.test(authored))throw new Error('Encontrado fechamento literal de script dentro do runtime.');
  const head='<!-- IE-AUTHORED:START -->\n<style id="inline-editor-authored-css" data-ie-authored>'+await read('authored.css')+'</style>\n<script id="inline-editor-authored-js" data-ie-authored>'+authored+'</script>\n<!-- IE-AUTHORED:END -->\n<!-- INLINE-EDITOR:HEAD:START -->\n<style id="inline-editor-runtime-css" data-ie-runtime>'+await read('runtime.css')+'</style>\n<!-- INLINE-EDITOR:HEAD:END -->';
  const body='<!-- INLINE-EDITOR:BODY:START version="'+version+'" -->\n'+stamp(await read('ui.html'))+'\n<script id="inline-editor-runtime-js" data-ie-runtime>'+runtime+'</script>\n<!-- INLINE-EDITOR:BODY:END -->';
  const host=stamp(await readFile(resolve(root,'tests/fixtures/canonical-host.html'),'utf8'));
  const template=host.replace('</head>',()=>head+'</head>').replace('</body>',()=>body+'</body>');
  await Promise.all([writeFile(resolve(src,'runtime.js'),runtime),writeFile(resolve(src,'head.fragment.html'),head),writeFile(resolve(src,'body.fragment.html'),body),writeFile(resolve(root,'INLINE_EDITOR_TEMPLATE.html'),template)]);
  console.log('Build concluído: INLINE_EDITOR_TEMPLATE.html + fragmentos canônicos.');
}catch(e){console.error(e.message);process.exit(1);}
