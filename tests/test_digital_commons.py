"""Regression entrypoint for the visual-first network pilot."""
import argparse
from test_visual_narrative import run
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4205/');args=parser.parse_args()
run(args.url,'network')
