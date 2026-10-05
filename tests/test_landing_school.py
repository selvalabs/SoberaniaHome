from pathlib import Path
import json
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]
results=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch()
 for w,h in [(320,568),(390,844),(768,1024),(1366,900)]:
  page=browser.new_page(viewport={'width':w,'height':h});errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto((ROOT/'demos/entretrama/index.html').as_uri())
  page.evaluate("document.querySelectorAll('img').forEach(i=>i.loading='eager')")
  for img in page.locator('img').all():img.evaluate('e=>e.decode()')
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),w
  assert 'Pé no Chão' not in page.locator('body').inner_text()
  assert page.locator('h1').count()==1
  for anchor in page.locator('a[href^="#"]').all():
   assert page.locator(anchor.get_attribute('href')).count()==1
  page.screenshot(path=str(ROOT/'tests'/f'entretrama-{w}.png'),full_page=True)
  page.locator('#open-trilha').click();expect(page.locator('dialog')).to_be_visible()
  with page.expect_download() as downloaded:page.locator('#download-trilha').click()
  assert downloaded.value.suggested_filename=='entretrama-primeira-pratica.txt'
  assert 'Escola fictícia' in Path(downloaded.value.path()).read_text(encoding='utf-8')
  page.keyboard.press('Escape');expect(page.locator('dialog')).not_to_be_visible()
  expect(page.locator('#open-trilha')).to_be_focused()
  page.locator('#faq details').last.locator('summary').click();assert page.locator('#faq details').last.get_attribute('open') is not None
  page.goto((ROOT/'demos/landing-collection/index.html').as_uri())
  select=page.locator('select');assert select.locator('option').count()==8
  sources=set()
  for project in range(8):
   select.select_option(str(project));expect(page.locator('figure')).not_to_have_attribute('aria-busy','true')
   for i in range(2):
    page.locator('.work-page-selector button').nth(i).click();expect(page.locator('.work-page-count')).to_have_text(f'{i+1} / 2')
    page.locator('img').evaluate('e=>e.decode()');sources.add(page.locator('img').get_attribute('src'))
  assert len(sources)==16
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert not errors,errors
  results.append({'viewport':[w,h],'school_images':'loaded','overflow':False,'dialog_download_escape_focus':'passed','collection_views':len(sources)})
  print('PASS school and collection',w,h,flush=True);page.close()
 page=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce',java_script_enabled=False)
 page.goto((ROOT/'demos/entretrama/index.html').as_uri());assert page.locator('#metodo').is_visible();assert page.locator('#faq details').count()==4
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 browser.close()
(ROOT/'tests/landing-school-results.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
