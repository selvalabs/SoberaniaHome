"""Build a standalone four-cover preview; never include the unfinished chapters.

Run locally. Only public-preview/ is a publication candidate; index.html remains
the complete working draft. This command does not deploy anything.
"""
from pathlib import Path
import re
import shutil
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public-preview'
OUT.mkdir(exist_ok=True)
soup = BeautifulSoup((ROOT / 'index.html').read_text(encoding='utf-8'), 'html.parser')
for section in soup.select('main > section[data-number]'):
    if int(section['data-number']) > 4:
        section.decompose()
for script in soup.select('script'):
    script.decompose()
for dialog in soup.select('dialog:not(#index-dialog)'):
    dialog.decompose()

allowed = {'hero', 'folha', 'deslocamento-1', 'deslocamento-2'}
for nav in soup.select('.main-nav, .index-links, .no-js-index'):
    for link in list(nav.select('a')):
        if link.get('href', '')[1:] not in allowed:
            link.decompose()
nav = soup.select_one('.main-nav')
nav.clear()
for target, label in [('folha', 'Escolhas'), ('deslocamento-1', 'Tecnologia'), ('deslocamento-2', 'Inteligências')]:
    link = soup.new_tag('a', href='#' + target)
    link['data-jump'] = ''
    link.string = label
    nav.append(link)
soup.select_one('.text-actions').clear()
link = soup.new_tag('a', href='#folha')
link['data-jump'] = ''
link.string = 'Conhecer o laboratório ↓'
soup.select_one('.text-actions').append(link)
soup.select_one('#section-counter').string = '01 / 04'
soup.select_one('#index-dialog .small-label').string = 'Soberania Labs · site em construção'

footer = BeautifulSoup('''
<footer id="footer" class="construction-footer" aria-labelledby="construction-title">
  <div class="construction-copy">
    <span class="small-label"><i aria-hidden="true"></i> EM CONSTRUÇÃO</span>
    <h2 id="construction-title">O laboratório está<br><em>em construção.</em></h2>
    <p>Seguimos pesquisando, experimentando e construindo. Em breve, mais do que fazemos por aqui.</p>
  </div>
  <figure class="construction-animation" aria-label="Código, comunidade e cultivo conectados em uma mesma construção.">
    <svg viewBox="0 0 720 180" role="img" aria-labelledby="construction-art-title" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title id="construction-art-title">Da programação ao cultivo, com as pessoas no centro</title>
      <g class="construction-soil"><path d="M50 153H665"/><path d="M65 166h55m23 0h26m64 0h93m60 0h55m57 0h87"/></g>
      <g class="construction-code"><rect x="80" y="27" width="175" height="108" rx="5"/><path d="M80 48h175"/><circle cx="92" cy="38" r="1.5"/><circle cx="102" cy="38" r="1.5"/><circle cx="112" cy="38" r="1.5"/>
        <path class="code-bracket" d="m119 69-12 13 12 13m25-26 12 13-12 13m-10-32-7 38"/>
        <path class="code-line line-one" d="M176 73h51"/><path class="code-line line-two" d="M176 85h35"/><path class="code-line line-three" d="M176 97h43"/>
        <path d="M135 135v17m66-17v17"/>
      </g>
      <path class="construction-link" pathLength="1" d="M255 101h45q14 0 14 14v17q0 14 14 14h104q14 0 14-14v-17q0-14 14-14h45"/>
      <g class="construction-people"><circle cx="348" cy="89" r="9"/><circle cx="378" cy="78" r="10"/><circle cx="408" cy="89" r="9"/><path d="M331 126v-10q0-13 17-13t17 13v10m-7-18q0-15 20-15t20 15m-7 18v-10q0-13 17-13t17 13v10"/></g>
      <g class="construction-plant"><path class="plant-stem" pathLength="1" d="M539 151V75m0 40-23-19m23-3 21-20"/>
        <path class="plant-leaf leaf-left" d="M516 96c-26 1-37-14-38-32 23-2 40 10 38 32Z"/>
        <path class="plant-leaf leaf-right" d="M559 74c0-25 15-37 36-38 0 22-13 38-36 38Z"/>
        <path class="plant-leaf leaf-top" d="M539 76c-19-15-21-36-9-54 20 14 23 35 9 54Z"/>
        <path d="m539 151-13 10m13-10 13 10"/>
      </g>
      <g class="construction-seeds"><circle cx="291" cy="151" r="2"/><circle cx="467" cy="151" r="2"/><path d="M632 126v25m0-13c-12 0-18-7-18-15 11 0 18 5 18 15m0-7c0-10 7-15 17-15-1 9-6 15-17 15"/></g>
    </svg>
    <figcaption>Código, gente e terra.<span>Uma construção em comum.</span></figcaption>
  </figure>
  <div class="pile-field" id="pile-field" aria-hidden="true"><div class="pile-ground"></div><div class="leaf-pile" id="leaf-pile"><span id="leaf-dock" class="leaf-dock"></span><span class="rest-footer-leaf leaf-a"></span></div></div>
  <div class="construction-bottom"><div class="construction-signature"><strong>Soberania Labs</strong><span>Florianópolis · Brasil</span></div><button type="button" id="toggle-motion-footer">Modo de leitura</button><a href="#hero" data-jump>Ao início ↑</a></div>
</footer>''', 'html.parser')
soup.main.append(footer.footer)
soup.html['data-public-preview'] = 'true'
for filename in ['motion.js', 'public-preview.js']:
    tag = soup.new_tag('script', src='./' + filename + '?v=public-growing-44')
    soup.body.append(tag)
soup.select_one('link[rel="stylesheet"]')['href'] = './styles.css?v=public-growing-44'

# Only the illustrations used in these four covers and the animated leaf.
assets = {img['src'].removeprefix('./') for img in soup.select('img[src]')}
assets.update('assets/leaf-' + letter + '.png' for letter in 'abc')
for relative in sorted(assets):
    destination = OUT / relative
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(ROOT / relative, destination)
css = (ROOT / 'styles.css').read_text(encoding='utf-8')
# Unused later-chapter CSS must not introduce dependencies on draft assets.
css = re.sub(r"url\((['\"]?)(\./assets/[^)\"']+)\1\)",
             lambda match: match.group(0) if match.group(2).split('?')[0].removeprefix('./') in assets else 'none', css)
(OUT / 'styles.css').write_text(css, encoding='utf-8')
for filename in ['motion.js', 'public-preview.js']:
    shutil.copy2(ROOT / filename, OUT / filename)
(OUT / 'index.html').write_text(str(soup), encoding='utf-8')
print(f'Built {OUT}: four covers, construction footer, {len(assets)} public images; complete draft preserved.')
