# Internationalization (i18n) Guide

This folder contains all translation files used for internationalization in the Adoptium website. The project uses [next-intl](https://next-intl-docs.vercel.app/) for managing translations.

## Table of Contents

- [File Structure](#file-structure)
- [How Localization Works](#how-localization-works)
- [Default Language and Fallbacks](#default-language-and-fallbacks)
- [Adding New Translations](#adding-new-translations)
- [Translation Keys Structure](#translation-keys-structure)
- [Rich Text Formatting](#rich-text-formatting)
- [Adding a New Language](#adding-a-new-language)
- [Best Practices](#best-practices)

## File Structure

Each language is represented by a JSON file following the [BCP 47](https://en.wikipedia.org/wiki/IETF_language_tag) format:

- `en.json` - English (default)
- `en-GB.json` - British English (with fallback to `en.json`)
- `de.json` - German
- `es.json` - Spanish
- `fr.json` - French
- `zh-CN.json` - Simplified Chinese

## How Localization Works

1. The website detects the user's locale from the URL path (e.g., `/de/download` for German)
2. The appropriate locale file is loaded based on the URL
3. Translation keys are looked up in the locale file
4. If a translation is missing, it falls back to English (`en.json`)

Components use the `useTranslations` hook to access translations:

```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('SectionName');
  
  return <h1>{t('title')}</h1>;  // Uses "SectionName.title" from the locale file
}
```

## Default Language and Fallbacks

English (`en.json`) is the default language and contains the complete set of translations. 

For the British English locale (`en-GB.json`), we implement a special fallback mechanism. The `en-GB.json` file only needs to contain entries that differ from standard English. All other keys automatically fall back to `en.json`.

This fallback is implemented in `/src/i18n/request.ts` using a deep merge function.

## Adding New Translations

To add a new section or translation key:

1. First, add the key and translation to `en.json` (mandatory)
2. Then add translations to other language files as needed

Example:

```json
// en.json
{
  "FeatureName": {
    "title": "Feature Title",
    "description": "Feature description"
  }
}

// de.json
{
  "FeatureName": {
    "title": "Feature-Titel",
    "description": "Feature-Beschreibung"
  }
}
```

## Translation Keys Structure

We organize translations by component or page name:

```json
{
  "HomePage": {
    "title": "Home Page Title"
  },
  "NotFoundPage": {
    "title": "Sorry, we couldn't find this page"
  },
  "ComponentName": {
    "some-key": "Some value"
  }
}
```

## Rich Text Formatting

For rich text with HTML elements, use the `rich` method and placeholders:

```tsx
// In locale file
{
  "example": "This is <highlight>highlighted</highlight> text with a <link>link</link>"
}

// In component
t.rich('example', {
  highlight: (chunks) => <span className="highlighted">{chunks}</span>,
  link: (chunks) => <a href="/some-url">{chunks}</a>
})
```

## Adding a New Language

To add support for a new language:

1. Create a new JSON file in the locales folder (e.g., `it.json` for Italian)
2. Update the supported locales in `/src/i18n/routing.ts`:

```typescript
export const routing = defineRouting({
  locales: ["en", "en-GB", "de", "es", "fr", "zh-CN", "it"],
  // ...
});
```

3. Translate all keys from `en.json` to the new language

## Best Practices

1. **Always add new translations to `en.json` first** - This ensures the default locale has all strings
2. **Use variables for dynamic content** - Use `{variableName}` syntax for content that changes
3. **Keep translation keys descriptive** - Use clear, readable keys that indicate the purpose of the text
4. **Use namespaces** - Group related translations under a common namespace (usually component or page name)
5. **Don't hardcode text in components** - Always use the translation system for visible text
6. **For British English variations** - Only add entries to `en-GB.json` when they differ from standard English

## Examples

### Simple translation:
```tsx
const t = useTranslations('HomePage');
return <h1>{t('title')}</h1>;
```

### Translation with variables:
```tsx
// In locale file: "greeting": "Hello, {name}!"
const t = useTranslations('CommonTexts');
return <p>{t('greeting', { name: userName })}</p>;
```

### Rich text with formatting:
```tsx
// In locale file: "welcome": "Welcome to <highlight>Adoptium</highlight>"
const t = useTranslations('HomePage');
return t.rich('welcome', {
  highlight: (chunks) => <span className="text-pink">{chunks}</span>
});
```
