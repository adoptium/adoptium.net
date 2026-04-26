# Asciidoc Pages

Most static pages on this site are written as [asciidoc](https://asciidoctor.org/docs/what-is-asciidoc/) pages. These are similar to Markdown in format but give us more flexibility.

The directory layout of these files is very important as it determines the path to the file in the site. Every page must use the `directory/index.adoc` convention — for example, `/docs/faq/index.adoc` will be served as `/docs/faq` on the site. This structure is required so that localised versions of a page can live alongside the English source in the same directory.

```tree
.
├── about/
│   ├── index.adoc
│   ├── index.de.adoc
│   ├── index.es.adoc
│   ├── index.fr.adoc
│   └── index.zh-CN.adoc
├── docs/
│   ├── faq/
│   │   ├── index.adoc
│   │   ├── index.de.adoc
│   │   ├── index.es.adoc
│   │   ├── index.fr.adoc
│   │   └── index.zh-CN.adoc
│   └── qvs-policy/
│       ├── index.adoc
│       ├── index.de.adoc
│       ├── index.es.adoc
│       └── index.zh-CN.adoc
├── installation/
│   ├── index.adoc
│   ├── linux/
│   │   ├── index.adoc
│   │   └── index.de.adoc
│   └── windows/
│       ├── index.adoc
│       └── index.de.adoc
└── support/
    ├── index.adoc
    ├── index.de.adoc
    └── index.es.adoc
```

## Required Attributes

Every asciidoc file must have a `page-authors` attribute at the top. If you are starting a new page then start with just your own GitHub username. There is a [GitHub Action](https://github.com/adoptium/adoptium.net/blob/main/.github/workflows/check-contributors.yml) that will update contributors automatically once the doc has been merged so there is no need to add your username if you're editing an existing doc.

```adoc
:page-authors: gdams, karianna, sxa
:keywords: two-to-three, keywords, are, good
```

There may be other attributes that are required for your particular piece of documentation. See [Document Attributes](https://docs.asciidoctor.org/asciidoc/latest/attributes/document-attributes/) for more information.

## Localising Documentation

The site has multi-language support which means that documentation can be served up in the user's local language. By default, the English version is served if a localised version doesn't exist.

Localised documentation is named with the language key in the name so a German version would be `index.de.adoc` and a Spanish version would be `index.es.adoc`.

Localised files must include a `:page-based-on:` attribute set to the Git commit SHA of the English `index.adoc` they were translated from. This allows the automated translation workflow to detect when the English source has changed and the translation needs updating.

```adoc
:page-authors: gdams, karianna, sxa
:page-based-on: abc123def456
```

If you want to modify an existing translation you can locate the file most easily using the `Edit this page` button at the bottom of the page:

![Edit this page](/public/docs/edit-this-page.png)

To add a new translation, create a file named `index.<locale>.adoc` alongside the English `index.adoc` in the same directory. For example, to translate `docs/faq/index.adoc` to German, create `docs/faq/index.de.adoc`.

### Automated Translation Updates

When the English source file (`index.adoc`) is updated on the `main` branch, an [agentic workflow](https://github.com/adoptium/adoptium.net/blob/main/.github/workflows/update-translations.lock.yml) automatically detects outdated translations by comparing each localised file's `:page-based-on:` SHA against the latest English commit. It then opens a draft pull request per locale with the updated translation and assigns the appropriate locale lead for review:

- **en-GB** (British English): @gdams
- **de** (German): @hendrikebbers
- **fr** (French): @xavierfacq
- **zh-CN** (Simplified Chinese): @zdtsw

## Adding Images

You may wish to add images to the Asciidoc page. In order to do this you should add the image to the static directory at the root of this repository (`/public/docs/`). Once you've added the image you can reference it in the document using the following syntax:

```adoc
image:sample_image.png[a description of the image]
```

Which would pick up the file from `/public/docs/sample_image.png`. Please note that editors will not show the render the image because it has to be in a different directory for the site framework.
