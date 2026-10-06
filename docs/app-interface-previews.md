# App interface previews — issue 32

Four 1440 × 960 screenshots captured from the existing local frontend/dist builds, with browser-only API interception and synthetic content. No application service, real voice, private document, inference, or model download was used. Screenshots show real rendered React interfaces, not generated illustrations.

- Universal Voice Engine source: b38b9cba469d6be196a79bcf935ec05e32ba721f. Studio with a synthetic profile and public Soberania text; profile-preparation form without submitting it.
- SIALabs Local RAG source: adc7b139c7209fcbc5967410563ba313a5752f6d. Existing compiled UI in Portuguese; synthetic community-garden document, fixture answer and source card; mock/hash mode remains visible.
- Source SHAs identify local source checkouts; existing ignored dist builds were not rebuilt or claimed reproducible at those SHAs.
- Integration: load app-interface-previews.js after portfolio.js in the homepage draft that has #laboratorio .work-uve and .work-rag. No external runtime dependencies or backend calls are added by the preview script.
- Interface preparation wizard in the existing UVE build has older preview-audio copy; this capture does not verify current audio-generation behavior.

Local validation: four images visually inspected; both selectors/assets decoded on served preview at 390 and 1366px; no page errors; syntax and diff checks. No build/typecheck/security scanner configured for this static addition; no dependencies added. Physical-device review pending.

No merge, release tag, production deployment, migration or VPS mirror synchronization. Rollback removes the preview initializer from the local homepage; prior logo assets remain available.
