#!/usr/bin/env node
/** Integrates only canonical editor blocks. The demonstration site is never copied. */
import {readFile, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const [input, output]=process.argv.slice(2);
if(!input || !output){console.error('Uso: node tools/integrate.mjs landing-oficial.html landing-editavel.html');process.exit(2);}
try{
  if(resolve(input)===resolve(output))throw new Error('A saída deve ser diferente da entrada para preservar o original.');
  const source=await readFile(resolve(input),'utf8');
  if(/id=["'](?:inline-editor-runtime-js|ie-toolbar)["']/i.test(source))throw new Error('A entrada já contém um editor. Use a landing oficial limpa, ou faça Clean Build antes.');
  if(!/^\s*<!doctype html/i.test(source)||!/<html[\s>]/i.test(source))throw new Error('Forneça um documento HTML completo, não um fragmento.');
  if((source.match(/<\/head>/gi)||[]).length!==1||(source.match(/<\/body>/gi)||[]).length!==1)throw new Error('O HTML deve ter um único fechamento de head e body.');
  const head=await readFile(resolve(root,'src/head.fragment.html'),'utf8'),body=await readFile(resolve(root,'src/body.fragment.html'),'utf8');
  const result=source.replace(/<\/head>/i,()=>head+'\n</head>').replace(/<\/body>/i,()=>body+'\n</body>');
  await writeFile(resolve(output),result,'utf8');
  console.log('Criado:',resolve(output));
  const {version}=JSON.parse(await readFile(resolve(root,'VERSION.json'),'utf8'));
  console.log('Editor '+version+' acoplado. Copy, CSS/JS e assets da página não foram reescritos.');
  console.log('Importante: recursos externos já presentes na entrada continuam externos; o integrador não faz download de assets.');
}catch(err){console.error('Integração interrompida:',err.message);process.exit(1);}
