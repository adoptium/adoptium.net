import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TemurinPage, { metadata } from '../page';

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key === 'title' ? 'Release Notes' : key }));
vi.mock('@/components/ReleaseNotesRender', () => ({ default: () => <div>Release Notes Content</div> }));


describe('TemurinPage', () => {
  it('renders the release notes page with header and content', () => {
    const { container } = render(<TemurinPage />);
    expect(screen.getByText('Release Notes')).toBeInTheDocument();
    expect(screen.getByText('Release Notes Content')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('has correct metadata export', () => {
    expect(metadata).toEqual({
      title: 'Release Notes',
      description: 'Eclipse Temurin offers high-performance, cross-platform, open-source Java runtime binaries that are enterprise-ready and Java SE TCK-tested for general use in the Java ecosystem.',
    });
  });
});
