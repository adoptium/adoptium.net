---
on:
  push:
    paths: [content/asciidoc-pages/**]
    branches: [main]
  workflow_dispatch:
  permissions:
    contents: read
  steps:
    - name: Checkout repository
      uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
      with:
        persist-credentials: false
        fetch-depth: 0
    - name: Detect outdated translations
      id: has_outdated
      run: |
        found=false
        for dir in $(find content/asciidoc-pages -name "index.adoc" -exec dirname {} \;); do
          english="$dir/index.adoc"
          sha=$(git log -1 --format=%H "$english")
          for localized in "$dir"/index.*.adoc; do
            [ -f "$localized" ] || continue
            based_on=$(grep -oP '(?<=:page-based-on:\s)\S+' "$localized" || true)
            if [ "$based_on" != "$sha" ]; then
              found=true
              break 2
            fi
          done
        done
        echo "has_outdated=$found" >> "$GITHUB_OUTPUT"

permissions:
  contents: read
  issues: read
  pull-requests: read

features:
  copilot-requests: true

safe-outputs:
  create-pull-request:
    title-prefix: "[translation] "
    labels: [translation, help wanted]
    draft: false
    max: 1
    expires: 30d

checkout:
  fetch-depth: 0

concurrency:
  group: update-translations
  cancel-in-progress: true

timeout-minutes: 60

jobs:
  pre-activation:
    outputs:
      has_outdated: ${{ steps.has_outdated.outputs.has_outdated }}

if: needs.pre_activation.outputs.has_outdated == 'true'
---

# Update Outdated AsciiDoc Translations

You are a translation maintenance agent for the Eclipse Adoptium site. Your job
is to update localised AsciiDoc documentation files when the English source has changed.

## Context

This repository contains AsciiDoc documentation under `content/asciidoc-pages/`.
Each directory may have an English source file (`index.adoc`) and localised versions
(`index.de.adoc`, `index.fr.adoc`, `index.zh-CN.adoc`, `index.es.adoc`, etc.).

Each localised file contains a `:page-based-on:` attribute that records the Git commit
SHA of the English file it was last synced against. When the English file changes, this
SHA becomes stale.

## Locale Leads

Assign PRs for review to the appropriate locale lead.
See [locales/README.md](../../locales/README.md#locale-leads) for the current list.

## Instructions

1. **Detect outdated translations**: For each directory under `content/asciidoc-pages/`,
   check if `index.adoc` exists. If so, get the latest Git commit hash for it using
   `git log -1 --format=%H <path>`. Then check each localised `index.<locale>.adoc`
   file and read its `:page-based-on:` attribute. If the attribute differs from the
   latest English commit hash, that localised file is outdated.

2. **Determine what changed**: For each outdated localised file, run:

   ```bash
   git diff <old-sha>..<new-sha> -- <english-file>
   ```

   to see exactly what changed in the English version since the translation was last updated.

3. **Update the translation**: Apply the equivalent changes to the localised file.
   - Preserve the AsciiDoc formatting, structure, headings, and attributes exactly.
   - Translate only the changed content into the target locale's language.
   - Keep the same level of formality and technical accuracy as the existing translation.
   - Do NOT translate proper nouns (Eclipse Adoptium, Temurin, AdoptOpenJDK, OpenJDK, etc.).
   - Do NOT translate code blocks, command examples, or URLs.
   - Do NOT modify the `:page-authors:` attribute.

4. **Update the `:page-based-on:` attribute** to the new English commit SHA.

5. **Create a single PR containing all locale updates** with the title format:
   `[translation] Update outdated translations`
   Request review from all relevant locale leads listed above (only those whose locales were updated).
   In the PR description, include:
   - A list of which locales and files were updated
   - A summary of what changed in the English source
   - The diff of the English changes for reference
   - A note that this is an AI-generated translation that needs human review

6. **If a localised file has no `:page-based-on:` attribute**, add one after the
   `:page-authors:` line, set to the current English commit SHA, and include the
   full file in the translation update.

7. **Quality guidelines**:
   - German (de): Use formal "Sie" form, standard Hochdeutsch
   - French (fr): Use formal "vous" form, standard French
   - Chinese (zh-CN): Use simplified Chinese characters
   - Spanish (es): Use Latin American neutral Spanish
   - Keep sentence structure natural in the target language rather than doing
     word-for-word translation
