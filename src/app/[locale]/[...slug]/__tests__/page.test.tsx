import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import AsciidocPage from '../page';

// Configure mocks
vi.mock('next/navigation', () => ({
  notFound: vi.fn()
}));

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue({
    rich: vi.fn(() => <div>Translated warning</div>)
  }),
  setRequestLocale: vi.fn()
}));

vi.mock('fs', () => ({
  existsSync: vi.fn(() => true),
  lstatSync: vi.fn(() => ({
    isDirectory: vi.fn(() => true)
  }))
}));

vi.mock('@/services/asciidocService', () => ({
  getAsciidocContent: vi.fn().mockImplementation((slug, locale) => {
    return {
      content: '<div>Mock content</div>',
      metadata: {
        title: 'Page Title',
        description: 'Page description',
        authors: ['Author']
      },
      path: '/mock/path.adoc',
      slug,
      locale: 'en',
      availableLocales: locale === 'en' ? ['en'] : ['en']
    };
  }),
  getAllAsciidocPaths: vi.fn().mockResolvedValue([
    { slug: 'test', locale: 'en' }
  ])
}));

describe('AsciidocPage', () => {
  it('renders correctly with English locale', async () => {
    const params = Promise.resolve({ slug: ['test'], locale: 'en' });
    const { container } = render(await AsciidocPage({ params }));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly with non-English locale', async () => {
    const params = Promise.resolve({ slug: ['test'], locale: 'es' });
    const { container } = render(await AsciidocPage({ params }));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly for installation page', async () => {
    const params = Promise.resolve({ slug: ['installation'], locale: 'en' });
    const { container } = render(await AsciidocPage({ params }));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('has no accessibility violations', async () => {
    const params = Promise.resolve({ slug: ['test'], locale: 'en' });
    const { container } = render(await AsciidocPage({ params }));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
