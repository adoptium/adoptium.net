"""Check for outdated locale translations and create GitHub issues."""

import argparse
import os
import re
import subprocess

CONTENT_DIR = "content/asciidoc-pages"
REPO = "adoptium/adoptium.net"
LOCALIZED_FILE_PATTERN = re.compile(r"^index\..+\.adoc$")

# List of locale leads for each locale
locale_leads = {
    "de": "@hendrikebbers",
    "fr": "@xavierfacq",
    "zh-CN": "@zdtsw",
}


def get_shasum(file_path):
    """Get the page-based-on shasum from a localized file."""
    if not os.path.exists(file_path):
        return None
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        match = re.search(r":page-based-on:\s+(\S+)", content)
        return match.group(1) if match else None


def get_shasum_from_git(file_path):
    """Get the latest git commit hash for a file."""
    shasum = None
    if os.path.exists(file_path):
        result = subprocess.run(
            ["git", "log", "-1", "--format=%H", file_path],
            capture_output=True,
            text=True,
            check=False,
        )
        shasum = result.stdout.strip() or None
    return shasum


def add_localized_shasum(english_shasum, locale, root):
    """Add or update the page-based-on shasum in a localized file."""
    # Add the shasum to the localized file
    localized_file = os.path.join(root, f"index.{locale}.adoc")
    with open(localized_file, "r", encoding="utf-8") as f:
        content = f.read()
        match = re.search(r":page-based-on:\s+(\S+)", content)
        if match:
            print(f"Updating {localized_file} with shasum {english_shasum}")
            content = content.replace(match.group(1), english_shasum)
            with open(localized_file, "w", encoding="utf-8") as f:
                f.write(content)
        else:
            print(f"Adding shasum {english_shasum} to {localized_file}")
            with open(localized_file, "r", encoding="utf-8") as f:
                content = f.readlines()

            # Find the line number where ':page-authors:' exists
            line_number = next(
                (
                    index
                    for index, line in enumerate(content)
                    if ":page-authors:" in line
                ),
                None,
            )

            # Insert shasum after the line with ':page-authors:'
            if line_number is not None:
                shasum_line = f":page-based-on: {english_shasum}\n"
                content.insert(line_number + 1, shasum_line)

            # Write the updated content back to the file
            with open(localized_file, "w", encoding="utf-8") as f:
                f.writelines(content)


def build_issue_body(english_file, english_shasum, outdated_locales, root):
    """Build the GitHub issue body for outdated translations."""
    body = "The English version of this file has been updated. "
    body += "The following localised versions are potentially out of date:\n\n"
    body += "View the Latest English version of the file "
    body += f"[here](https://github.com/{REPO}/blob/main/{english_file}).\n\n"
    body += "| Locale | File | Locale Lead |\n"
    body += "| ------ | ---- | ----------- |\n"
    for locale in outdated_locales:
        locale_lead = locale_leads.get(locale, "n/a")
        loc_file = f"index.{locale}.adoc"
        loc_path = os.path.join(root, loc_file)
        url = f"https://github.com/{REPO}" f"/blob/main/{loc_path}"  # noqa: E501
        body += (
            f"| {locale.upper()} "
            f"| [{loc_file}]({url}) "
            f"| {locale_lead}\n"  # noqa: E501
        )
    body += "\n"
    body += "```diff\n"
    body += f"- {english_shasum} (English latest)\n"
    for locale in outdated_locales:
        localized_shasum = get_shasum(  # noqa: E501
            os.path.join(root, f"index.{locale}.adoc")
        )
        # If localized file has no shasum, add it and use the initial commit
        if localized_shasum is None:
            add_localized_shasum(english_shasum, locale, root)
            # Use the first commit so the diff shows all changes
            result = subprocess.run(
                ["git", "log", "--reverse", "--format=%H", english_file],
                capture_output=True,
                text=True,
                check=False,
            )
            first_line = result.stdout.split("\n", 1)[0].strip()
            localized_shasum = first_line or None
        # Add localized shasum to outdated_locales
        outdated_locales[outdated_locales.index(locale)] = (
            f"{localized_shasum} {locale}"
        )
        body += f"+ {localized_shasum} ({locale})\n"
    body += "```\n\n"
    body += "---\n\n"

    for locale in outdated_locales:
        localized_shasum = locale.split()[0].strip()
        locale = locale.split()[1].strip()
        body += (
            "### View the changes to the English"
            f' file since the last "{locale.upper()}"'
            " update\n\n"
        )
        body += "<details>\n"
        body += "<summary>View Diff</summary>\n\n"
        body += "```diff\n"
        if localized_shasum and localized_shasum != "None":
            result = subprocess.run(
                [
                    "git",
                    "diff",
                    "-I:page-authors:",
                    f"{localized_shasum}..{english_shasum}",
                    "--",
                    english_file,
                ],
                capture_output=True,
                text=True,
                check=False,
            )
            body += result.stdout
        else:
            result = subprocess.run(
                ["git", "show", f"{english_shasum}:{english_file}"],
                capture_output=True,
                text=True,
                check=False,
            )
            body += result.stdout
        body += "```\n\n"
        body += "</details>\n\n"
    return body


def main(dry_run=False):
    """Find outdated translations and create issues for them."""
    if dry_run:
        print("=== DRY RUN: files updated, no issues created ===")
    for root, _, files in os.walk(CONTENT_DIR):
        english_file = os.path.join(root, "index.adoc")

        if "index.adoc" not in files:
            continue

        english_shasum = get_shasum_from_git(english_file)
        if not english_shasum:
            continue

        outdated_locales = []

        for localized_file in files:
            if LOCALIZED_FILE_PATTERN.match(localized_file):
                file_path = os.path.join(
                    root.replace(".index.adoc", ""), localized_file
                )
                local_shasum = get_shasum(file_path)

                if local_shasum != english_shasum:
                    locale = localized_file.split(".")[1]
                    outdated_locales.append(locale)

        if not outdated_locales:
            continue

        # Print the list of outdated locales
        print(f"Outdated locales for {english_file}: {outdated_locales}")

        rel_path = os.path.relpath(english_file, CONTENT_DIR)
        title = "Translation review required" f" after updates to {rel_path}"

        if dry_run:
            print(f"[DRY RUN] Would create issue: {title}")
            body = build_issue_body(
                english_file,
                english_shasum,
                outdated_locales,
                root,
            )
            print(f"[DRY RUN] Issue body:\n{body}")
            continue

        # Check if an issue already exists for this file
        result = subprocess.run(
            [
                "gh",
                "issue",
                "list",
                "-R",
                REPO,
                "--search",
                "Translation review required"
                " after updates to "
                f"{os.path.relpath(english_file, CONTENT_DIR)}",
                "--state",
                "open",
            ],
            capture_output=True,
            text=True,
            check=False,
        )
        check_issue = result.stdout.strip()
        if check_issue:
            print(
                f"An issue already exists for "
                f"{english_file}: {check_issue}"  # noqa: E501
            )
            continue

        # Create an issue for this file
        print(f"Creating issue for {english_file}")

        body = build_issue_body(
            english_file, english_shasum, outdated_locales, root
        )  # noqa: E501

        # Generate Issue
        subprocess.run(
            [
                "gh",
                "issue",
                "create",
                "--repo",
                REPO,
                "--title",
                title,
                "--body",
                body,
                "--label",
                "translation,help wanted",
            ],
            check=False,
        )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Check for outdated locale translations."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Report outdated translations without creating issues.",
    )
    args = parser.parse_args()
    main(dry_run=args.dry_run)
