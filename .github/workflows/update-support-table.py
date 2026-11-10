#!/usr/bin/env python3
"""
Update support-table.adoc with the latest Temurin release names from the Adoptium API.

For each active Java version this script:
  - Fetches the latest release asset from https://api.adoptium.net/v3/assets/latest
  - Updates the "Latest Release" column (release tag + month of publication)
  - Derives and updates the "Next Release Due" tag (the next interim CPU patch)
  - Derives the expected next-release month (one month after the latest CPU month)

Columns that are NOT touched:
  - First Availability
  - End of Availability
  - Rows where the latest-release cell already says "None, yet." (unreleased version)
  - Rows where the latest-release cell says "EOSL^[2]^" (end of service life)
"""

import re
import sys
from datetime import datetime, timezone

import requests

SUPPORT_TABLE_PATH = "content/asciidoc-pages/support/_partials/support-table.adoc"

ADOPTIUM_LATEST_URL = "https://api.adoptium.net/v3/assets/latest/{version}/hotspot"

# Versions tracked in the table (newest first).
# Versions not yet generally available (e.g. 27) are included — the script will
# skip their rows automatically because they contain "None, yet.".
TRACKED_VERSIONS = [27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 11, 8]

LTS_VERSIONS = {8, 11, 17, 21, 25}

MONTH_ATTRS = {
    1: "{month-jan}",
    2: "{month-feb}",
    3: "{month-mar}",
    4: "{month-apr}",
    5: "{month-may}",
    6: "{month-jun}",
    7: "{month-jul}",
    8: "{month-aug}",
    9: "{month-sep}",
    10: "{month-oct}",
    11: "{month-nov}",
    12: "{month-dec}",
}

MONTH_ATTR_TO_NUM = {v: k for k, v in MONTH_ATTRS.items()}


def fetch_latest_release(version: int) -> dict | None:
    """
    Return {'release_name': str, 'month_attr': str} for the latest Temurin
    release of the given major version, or None on error / no data.
    """
    url = ADOPTIUM_LATEST_URL.format(version=version)
    params = {"os": "linux", "arch": "x64", "image_type": "jdk"}
    try:
        resp = requests.get(url, params=params, timeout=15)
        resp.raise_for_status()
        data = resp.json()
    except requests.RequestException as exc:
        print(f"  WARNING: failed to fetch Java {version}: {exc}", file=sys.stderr)
        return None

    if not data:
        print(f"  INFO: no assets found for Java {version}", file=sys.stderr)
        return None

    pkg = data[0]
    release_name: str = pkg.get("release_name", "")

    # updated_at lives inside binary{}
    updated_at_raw: str | None = (pkg.get("binary") or {}).get("updated_at")
    if updated_at_raw:
        dt = datetime.fromisoformat(updated_at_raw.rstrip("Z")).replace(tzinfo=timezone.utc)
        month_attr = MONTH_ATTRS[dt.month]
    else:
        month_attr = None

    return {"release_name": release_name, "month_attr": month_attr}


def derive_next_release_tag(release_name: str) -> str:
    """
    Given the latest CPU release name, derive the next interim-patch tag.

    Examples:
      jdk-21.0.12+8   →  jdk-21.0.12.1   (next is the .1 interim patch)
      jdk-21.0.12.1+1 →  jdk-21.0.12.2   (already an interim patch → bump)
      jdk-25.0.4.1+1  →  jdk-25.0.4.2
      jdk8u504-b01    →  jdk8u505         (Java 8 legacy format)
    """
    # Java 8 style: jdk8uNNN-bNN
    m8 = re.match(r"^jdk8u(\d+)-b\d+$", release_name)
    if m8:
        return f"jdk8u{int(m8.group(1)) + 1}"

    # Modern style: jdk-MAJOR.MINOR.SECURITY[.PATCH][+BUILD]
    m = re.match(r"^jdk-([\d.]+?)(?:\+\d+)?$", release_name)
    if not m:
        return ""

    parts = m.group(1).split(".")
    if len(parts) == 3:
        # Quarterly CPU release (e.g. 21.0.12) → next is the .1 interim patch
        return f"jdk-{m.group(1)}.1"
    elif len(parts) == 4:
        # Already an interim patch (e.g. 21.0.12.1) → bump the patch number
        return f"jdk-{'.'.join(parts[:3])}.{int(parts[3]) + 1}"

    return ""


def update_table(content: str, version: int, release_name: str, month_attr: str | None) -> str:
    """
    Update the Latest Release and Next Release Due cells in the asciidoc table
    for the given Java version.

    The table row for each version (split by newline) looks like:

        | Java NN[(LTS)]
        | {month-xxx} YYYY          ← first availability  [+0]
        | {month-xxx} YYYY +        ← latest release      [+1]
        [.small]#jdk-NN.N.N+N#                            [+2]
        | {month-xxx} YYYY +        ← next release due    [+3]
        [.small]#jdk-NN.N.N.N#                            [+4]
        | ...                        ← end of availability [+5]

    Offsets are relative to the version-label line.
    """
    label = f"Java {version} (LTS)" if version in LTS_VERSIONS else f"Java {version}"
    lines = content.split("\n")

    # Find the version label line
    start_idx: int | None = None
    for i, line in enumerate(lines):
        if line.strip() == f"| {label}":
            start_idx = i
            break

    if start_idx is None:
        print(f"  Java {version}: row not found in table, skipping.", file=sys.stderr)
        return content

    latest_month_line = lines[start_idx + 2]

    # Skip rows that are not yet released or already EOSL
    if "None, yet." in latest_month_line or "EOSL" in latest_month_line:
        return content

    next_tag = derive_next_release_tag(release_name)

    # Derive next-release month: one calendar month after the CPU release month
    if month_attr:
        cpu_month_num = MONTH_ATTR_TO_NUM.get(month_attr)
        if cpu_month_num:
            next_month_num = cpu_month_num % 12 + 1
            next_month_attr = MONTH_ATTRS[next_month_num]
        else:
            next_month_attr = month_attr
    else:
        next_month_attr = None

    # Preserve the existing year from the latest-release line
    year_match = re.search(r"\d{4}", latest_month_line)
    year = year_match.group(0) if year_match else ""

    # --- Update Latest Release cell (lines[start_idx+2] and [start_idx+3]) ---
    if month_attr and year:
        lines[start_idx + 2] = f"| {month_attr} {year} +"
    lines[start_idx + 3] = f"[.small]#{release_name}#"

    # --- Update Next Release Due cell (lines[start_idx+4] and [start_idx+5]) ---
    next_month_line = lines[start_idx + 4]
    if "EOSL" not in next_month_line:
        next_year_match = re.search(r"\d{4}", next_month_line)
        next_year = next_year_match.group(0) if next_year_match else year
        if next_month_attr and next_year:
            lines[start_idx + 4] = f"| {next_month_attr} {next_year} +"
        if next_tag and lines[start_idx + 5].startswith("[.small]#"):
            lines[start_idx + 5] = f"[.small]#{next_tag}#"

    return "\n".join(lines)


def main() -> None:
    with open(SUPPORT_TABLE_PATH, encoding="utf-8") as f:
        content = f.read()

    original = content
    changed_versions: list[int] = []

    for version in TRACKED_VERSIONS:
        print(f"Fetching Java {version}...")
        info = fetch_latest_release(version)
        if info is None:
            print(f"  Skipping Java {version} (no API data).")
            continue

        release_name = info["release_name"]
        month_attr = info["month_attr"]
        print(f"  latest={release_name!r}, published_month={month_attr!r}")

        new_content = update_table(content, version, release_name, month_attr)
        if new_content != content:
            print(f"  Updated table row for Java {version}.")
            changed_versions.append(version)
            content = new_content
        else:
            print(f"  No changes for Java {version}.")

    if content != original:
        with open(SUPPORT_TABLE_PATH, "w", encoding="utf-8") as f:
            f.write(content)
        print(
            f"\nWrote updates for Java version(s): {', '.join(str(v) for v in changed_versions)}"
        )
        print(f"File: {SUPPORT_TABLE_PATH}")
    else:
        print("\nTable is already up to date — no changes written.")


if __name__ == "__main__":
    main()
