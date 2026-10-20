"""Serve one built artifact on loopback, run selected checks, always close the server."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import subprocess
import sys
from threading import Thread
from urllib.parse import urlsplit

ROOT_TESTS = [
    'test_motion_edition.py', 'test_leaf_flow.py', 'test_leaf_return.py',
    'test_leaf_reveal_origin.py', 'test_leaf_gallery_spiral.py', 'test_theme_orbit.py',
    'test_leaf_contrast.py', 'test_horizontal_viewports.py', 'test_project_galleries.py',
    'test_site_edition.py', 'test_landing_touch.py', 'test_atelier_edge_ui.py',
    'test_brand_signature.py', 'test_hero_print.py', 'test_choices_print.py', 'test_work_marquee.py',
    'test_mobile_viewport_fit.py',
    'test_mobile_safe_area.py',
    'test_mobile_reading_resize.py',
]
PAGES_TESTS = ['test_pages_edition.py', 'test_project_galleries.py', 'test_hero_print.py', 'test_choices_print.py']

parser = argparse.ArgumentParser()
parser.add_argument('--directory', required=True)
parser.add_argument('--base', default='/')
parser.add_argument('--suite', choices=['root', 'pages'], default='root')
parser.add_argument('--tests', nargs='+')
args = parser.parse_args()
directory = Path(args.directory).resolve(strict=True)
if not args.base.startswith('/') or not args.base.endswith('/') or '..' in args.base:
    raise SystemExit('Invalid base path')

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *unused):
        pass

    def do_GET(self):
        if not urlsplit(self.path).path.startswith(args.base):
            self.send_error(404)
            return
        super().do_GET()

    def translate_path(self, original):
        local = '/' + urlsplit(original).path[len(args.base):]
        return super().translate_path(local)

class Server(ThreadingHTTPServer):
    request_queue_size = 128

server = Server(('127.0.0.1', 0), partial(Handler, directory=str(directory)))
thread = Thread(target=server.serve_forever, daemon=True)
thread.start()
url = f'http://127.0.0.1:{server.server_port}{args.base}'
try:
    for name in args.tests or (PAGES_TESTS if args.suite == 'pages' else ROOT_TESTS):
        test_path = Path('tests', name)
        if test_path.parent != Path('tests') or not name.startswith('test_') or not name.endswith('.py'):
            raise SystemExit('Invalid test name')
        print(f'RUN {name} at {url}', flush=True)
        result = subprocess.run([sys.executable, str(test_path), '--url', url])
        if result.returncode:
            raise SystemExit(result.returncode)
finally:
    server.shutdown()
    server.server_close()
    thread.join(timeout=5)
