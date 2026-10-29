"""Reference search reflows without losing discoveries and has a usable fallback."""
import argparse
import unicodedata
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:4205/')
args = parser.parse_args()

with sync_playwright() as pw:
    browser = pw.chromium.launch()
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(args.url, wait_until='networkidle')
    page.wait_for_selector('[data-reference-search][data-ready]')
    grid = page.locator('[data-reference-grid]')
    targets = page.locator('[data-reference-targets]')
    assert grid.locator('[data-cell]').count() == 32 * 22
    desktop_letters = grid.inner_text()
    round_number = grid.get_attribute('data-round')
    labels = targets.locator('button').all_text_contents()
    # A name fitting both layouts is kept in the compact board.
    name = next(label for label in labels if len(''.join(
        char for char in unicodedata.normalize('NFD', label) if char.isascii() and char.isalpha()
    )) <= 14)
    button = targets.get_by_role('button', name=name, exact=True)
    button.focus()
    button.press('Enter')
    assert button.get_attribute('aria-pressed') == 'true'
    assert grid.locator('[data-found=true]').count() > 0

    page.set_viewport_size({'width': 390, 'height': 844})
    page.wait_for_function('document.querySelectorAll("[data-reference-grid] [data-cell]").length === 252')
    assert grid.get_attribute('data-round') == round_number
    assert targets.get_by_role('button', name=name, exact=True).get_attribute('aria-pressed') == 'true'
    assert page.evaluate('document.activeElement.textContent') == name
    compact_letters = grid.inner_text()
    page.set_viewport_size({'width': 320, 'height': 568})
    assert grid.inner_text() == compact_letters
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')

    page.set_viewport_size({'width': 1440, 'height': 900})
    page.wait_for_function('document.querySelectorAll("[data-reference-grid] [data-cell]").length === 704')
    assert grid.inner_text() == desktop_letters
    assert targets.get_by_role('button', name=name, exact=True).get_attribute('aria-pressed') == 'true'
    assert grid.get_attribute('data-round') == round_number
    print('PASS reference keyboard, reflow, restored board and discoveries', flush=True)

    # Changing orientation while the board is covered must use the final size.
    shuffle = page.locator('[data-reference-shuffle]')
    shuffle.click()
    page.set_viewport_size({'width': 390, 'height': 844})
    page.wait_for_function('!document.querySelector("[data-reference-shuffle]").disabled', timeout=10000)
    assert grid.locator('[data-cell]').count() == 252
    assert grid.get_attribute('data-round') == str(int(round_number) + 1)
    assert targets.locator('[aria-pressed=true]').count() == 0

    library = page.locator('.reference-library')
    assert not library.evaluate('element => element.open')
    page.evaluate('dispatchEvent(new Event("beforeprint"))')
    page.emulate_media(media='print')
    assert library.evaluate('element => element.open')
    assert not grid.is_visible()
    assert library.locator('[data-reference-library-list]').evaluate('element => getComputedStyle(element).maxHeight') == 'none'
    page.emulate_media(media='screen')
    page.evaluate('dispatchEvent(new Event("afterprint"))')
    assert not library.evaluate('element => element.open')
    assert not errors, errors
    print('PASS shuffle during resize and complete print library', flush=True)
    page.close()

    page = browser.new_page(java_script_enabled=False, viewport={'width': 320, 'height': 568})
    page.goto(args.url, wait_until='networkidle')
    assert not page.locator('[data-reference-grid]').is_visible()
    assert not page.locator('[data-reference-shuffle]').is_visible()
    assert not page.locator('#open-map').is_visible()
    assert page.locator('.reference-library').evaluate('element => element.open')
    assert page.locator('[data-reference-library-list] p').count() > 0
    assert page.locator('[data-reference-library-list]').evaluate('element => getComputedStyle(element).maxHeight') == 'none'
    assert 'curadoria completa' in page.locator('[data-reference-status]').inner_text()
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    print('PASS no-JS references without empty board or dead controls', flush=True)
    browser.close()
