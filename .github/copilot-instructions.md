# GitHub Copilot Instructions for Adoptium.net

This document provides comprehensive instructions for GitHub Copilot to effectively assist with development on the [Adoptium.net](https://adoptium.net) site codebase.

## Project Overview

This is the official site for Eclipse Adoptium, built with **Next.js 15** using the **App Router** architecture. The site provides prebuilt OpenJDK binaries (Eclipse Temurin) and documentation for the Eclipse Adoptium project.

## Tech Stack & Architecture

### Core Technologies

- **Next.js 15** with App Router (`src/app/` directory structure)
- **TypeScript** for type safety
- **React 19** with Server/Client Components
- **Tailwind CSS** for styling with custom design system
- **next-intl** for internationalization
- **MDX/AsciiDoc** for content management
- **Vitest** for testing

### Key Dependencies

- `@asciidoctor/core` - AsciiDoc processing
- `next-mdx-remote` - MDX content rendering
- `framer-motion` - Animations
- `@mui/x-data-grid` - Data tables
- `highcharts-react-official` - Charts and visualizations
- `prismjs` - Syntax highlighting

## Project Structure

```tree
src/
├── app/                    # Next.js App Router (pages & layouts)
│   ├── [locale]/          # Internationalized routes
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable React components
├── data/                  # Static data files
├── hooks/                 # Custom React hooks
├── i18n/                  # Internationalization config
├── services/              # API and external service integrations
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
content/
├── blog/                  # Blog posts (MDX)
├── asciidoc-pages/        # Documentation (AsciiDoc)
└── locales/               # Translation files
```

## Coding Standards & Conventions

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper type annotations for props and function parameters
- Leverage Next.js built-in types (`Metadata`, `NextConfig`, etc.)

### React Components

- Use functional components with hooks
- Prefer Server Components when possible (default in App Router)
- Mark Client Components with `'use client'` directive only when needed
- Follow React 19 patterns for async components

### File Naming

- Use PascalCase for component files: `ComponentName.tsx`
- Use camelCase for utility files: `utilityFunction.ts`
- Use kebab-case for page routes: `[slug]/page.tsx`
- Index files for component directories: `components/ComponentName/index.tsx`

### CSS & Styling

- **Primary approach**: Tailwind CSS classes
- **Custom CSS custom properties** defined in `globals.css`:
  - `--purple: #14003c` (primary brand color)
  - `--pink: #ff1365` (accent color)
  - `--blue: #0d002a` (secondary)
  - `--grey: #c4bfce` (text secondary)

### Component Structure

```tsx
"use client"; // Only if client-side features needed

import React from "react";
import { useTranslations } from "next-intl"; // For i18n
import type { ComponentProps } from "@/types"; // Local types

interface ComponentNameProps {
  // Define props with proper TypeScript
}

const ComponentName: React.FC<ComponentNameProps> = ({ prop1, prop2 }) => {
  const t = useTranslations("ComponentName"); // Localization

  return <div className="bg-purple text-white">{/* Component JSX */}</div>;
};

export default ComponentName;
```

## Key Features & Patterns

### Internationalization (i18n)

- Uses `next-intl` for translations
- Locale files in `locales/` directory
- Route structure: `app/[locale]/...`
- Access translations: `const t = useTranslations('namespace')`

### Content Management

- **Blog posts**: MDX files in `content/blog/`
- **Documentation**: AsciiDoc files in `content/asciidoc-pages/`
- Custom MDX components in `components/CustomMDX/`
- AsciiDoc processing via `@asciidoctor/core`

### Styling System

- Tailwind CSS with custom theme extensions
- Brand colors: purple (`#14003c`), pink (`#ff1365`), blue (`#0d002a`)
- Responsive design patterns
- Custom utility classes in `globals.css`

### Data & API Integration

- Static data in `src/data/` directory
- External API integrations in `src/services/`
- GitHub API for contributor data
- Adoptium API for release information

## Development Guidelines

### When Creating New Components

1. **Determine if Server or Client Component** is needed
2. **Add proper TypeScript interfaces** for props
3. **Include internationalization** support with `useTranslations`
4. **Follow existing patterns** for styling and structure
5. **Add to appropriate directory** (`components/` with index file)

### When Working with Pages

- Use App Router conventions (`page.tsx`, `layout.tsx`)
- Implement proper metadata for SEO
- Handle internationalized routing with `[locale]` segments
- Use Server Components by default, Client Components only when needed

### When Styling Components

- Prefer Tailwind classes over custom CSS
- Use design system colors (`bg-purple`, `text-pink`, etc.)
- Maintain responsive design patterns
- Follow existing component styling patterns

### When Adding Content

- **Blog posts**: Create MDX files in `content/blog/[slug]/`
- **Documentation**: Create AsciiDoc files in `content/asciidoc-pages/`
- **Translations**: Update all locale files in `locales/`

## Testing Conventions

- Use Vitest for unit testing
- Test files alongside components: `ComponentName.test.tsx`
- **Import Vitest dependencies explicitly**: Always import test functions from vitest: `import { describe, it, expect } from 'vitest';`
- Focus on component behavior and integration
- Mock external dependencies appropriately
- **UI changes require snapshot updates only for components with existing snapshot tests**: After making such UI changes, run `npm test -- -u` to update snapshots

## Build & Deployment

- **Development**: `npm run dev` (uses Turbopack)
- **Build**: `npm run build`
- **Testing**: `npm run test`
- **Linting**: `npm run lint`
- Deployed via Netlify with automatic deployments

## Common Patterns & Examples

### Internationalized Component

```tsx
"use client";

import { useTranslations } from "next-intl";

const MyComponent = () => {
  const t = useTranslations("MyComponent");

  return <h1>{t("title")}</h1>;
};
```

### Server Component with Metadata

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
};

export default function Page() {
  return <div>Server Component Content</div>;
}
```

### Styled Component with Brand Colors

```tsx
const StyledComponent = () => (
  <div className="bg-purple text-white border-pink rounded-lg p-6 shadow-xl">
    <h2 className="text-2xl font-bold text-pink mb-4">Brand Styled Heading</h2>
    <p className="text-grey">Secondary text content</p>
  </div>
);
```

### Test File Structure

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ComponentName from "./ComponentName";

describe("ComponentName", () => {
  it("renders correctly", () => {
    const { container } = render(<ComponentName />);
    expect(container).toBeTruthy();
  });
});
```

## Important Notes for Copilot

1. **Always use the established design system** colors and patterns
2. **Prefer Server Components** unless client-side interactivity is required
3. **Include proper TypeScript typing** for all props and functions
4. **Follow the existing file structure** and naming conventions
5. **Add internationalization support** to user-facing text
6. **Use semantic HTML** and accessibility best practices
7. **Maintain responsive design** across all screen sizes
8. **Follow Next.js 15 App Router** patterns and best practices

## Quick Reference

### Essential Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm test -- -u       # Update test snapshots after UI changes
npm run lint         # Run ESLint
```

### Key Directories

- `src/app/` - Pages and layouts (App Router)
- `src/components/` - Reusable components
- `src/utils/` - Utility functions
- `content/` - Content files (MDX/AsciiDoc)
- `locales/` - Translation files

### Brand Colors (CSS Variables)

- `--purple: #14003c` (primary)
- `--pink: #ff1365` (accent)
- `--blue: #0d002a` (secondary)
- `--grey: #c4bfce` (text secondary)

This documentation should help GitHub Copilot provide contextually appropriate suggestions that align with the project's architecture, conventions, and design system.
