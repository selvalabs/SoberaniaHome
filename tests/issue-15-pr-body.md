A coleção permite comparar oito landing pages e alternar entre abertura e conteúdo de cada uma. A Entretrama adapta a estrutura da Escola Pé no Chão a uma escola fictícia de tecelagem manual, com textos próprios, outra identidade e três fotografias geradas.

Closes #15.

Implementação: site estático completo em demos/entretrama, FAQ nativa, prévia de primeira prática em diálogo com Escape/retorno de foco e download de roteiro TXT. Coleção em demos/landing-collection com 16 capturas isoladas de arquivos locais, sem requisições externas. SHÅLA identificada como reconstrução de referência. Não há matrículas, pagamentos, coleta de dados nem depoimentos fictícios.

Validação: quatro viewports (320×568, 390×844, 768×1024, 1366×900), imagens, overflow, âncoras, FAQ, diálogo/download/foco, todas as 16 vistas e leitura sem JavaScript; inspeção visual desktop/mobile; node --check nos três scripts; git diff --check. Não há dependências novas; revisão estática dos scripts confirmou ausência de integrações externas ou segredos. Não há build, lint, typecheck ou scanner de dependências configurados para estes arquivos estáticos.

Limitação: este PR contém somente a escola, coleção e ferramentas específicas da issue 15. A integração no capítulo horizontal está demonstrada na prévia local e depende dos rascunhos ainda não publicados das issues 12–14. Não inclui esses rascunhos. A integração local foi testada em oito viewports, leitura/reduced motion e com cliques reais/teclado em 320, 390 e 1366px.

Deploy/migração: nenhum deploy ou migração executado. Sem alterações no servidor/VPS. Revisão e homologação pendentes. Base 45ebfbbba3dd99fa64d62e6b5047901535568ef7; commit 4cc8e98b40355eec5a2382e97de8a21a35d6d65c. Rollback futuro dos arquivos por revert do commit; produção continua na versão anterior.
