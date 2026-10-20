# Issue #59 — saberes e construção em comum

Issue: https://github.com/selvalabs/SoberaniaHome/issues/59.
Branch: `chore/59-knowledge-copy`.
Base remota: `77cbc76c632c95281d7cc2cc2e65af4f5362c061`.
Dependência e rollback: `b7d11c99e2c379b5169a6cf5d5972a82c31a1fd1`, PR #58 e sequência anterior incorporada por fast-forward.

Copy aprovada aplicada à dobra #deslocamento-2: “Saberes diferentes. Soluções construídas em comum.” Dois parágrafos conectam pesquisa, ofício e vida cotidiana à construção participativa de soluções. O destaque passa a ser “Quem vive o problema participa da construção.” e a anotação da colagem, “Quem pesquisa abre possibilidades.” Preservadas as imagens, referência e citação de Paulo Freire, classes de destaque, glows e código de animação.

Entre 760 e 1100 px, a colagem mantém proporção própria, sem se esticar com a coluna textual ampliada; a nota da pesquisa fica abaixo do cartão de código. Não foram alterados fontes nem movimentos.

Validação: TypeScript, 42 testes Node, build, verificação estática e diff check aprovados; npm audit sem vulnerabilidades reportadas. Inspeção de layout em 320×568, 390×844, 768×1024, 1024×768 e 1440×900, nos temas claro e escuro, sem overflow horizontal nem sobreposição dos parágrafos. Capturas mobile/tablet/desktop inspecionadas; tamanhos de tablet revalidados após ajuste da colagem. Teste existente de contraste/glow aprovado em 390×844 e 1440×900, incluindo modo de leitura. Safari/iOS físico não testado.

Servidor Wi-Fi existente reutilizado em `http://192.168.1.4:4198/`, PID 12080, HTTP 200 com a copy atual. Sem novos servidores persistentes, processos encerrados, merge na main, tag/release, migração, deploy em produção ou operação/sincronização de mirror VPS. PR em rascunho para homologação.
