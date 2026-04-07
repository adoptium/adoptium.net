#!/usr/bin/env python3
"""List GitHub contributor usernames for a given file."""

# pylint: disable=invalid-name

import argparse

import requests
from bs4 import BeautifulSoup

ORG = "adoptium"
REPO = "adoptium.net"
BRANCH = "main"
# This is where we define users that should be skipped
EXCLUDED_USERS = "adoptium-bot, eclipse-temurin-bot, Copilot, sxa555"

parser = argparse.ArgumentParser(
    description="List GitHub contributor usernames for a given file"
)
parser.add_argument(
    "--file",
    nargs="?",
    default="content/asciidoc-pages/docs/marketplace-policy.adoc",
    help="specify the relative path to a particular file",
)
args = parser.parse_args()

page = requests.get(
    f"https://github.com/{ORG}/{REPO}/contributors-list/{BRANCH}/{args.file}",
    timeout=30,
)
soup = BeautifulSoup(page.content, "html.parser")

contributors = soup.findAll("a")

for contributor in contributors:
    username = contributor.find("href")
    if contributor.text.strip() not in EXCLUDED_USERS:
        print(contributor.text.strip())
