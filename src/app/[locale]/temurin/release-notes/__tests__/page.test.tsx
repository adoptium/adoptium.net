import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TemurinPage, { metadata } from '../page';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockImplementation(() =>
    Promise.resolve((key: string) => {
      if (key === 'title') return 'Release Notes';
      return key;
    })
  ),
}));

// Mock the fetchAvailableReleases function
vi.mock('@/utils/fetchAvailableReleases', () => ({
  fetchAvailableReleases: () => Promise.resolve({
    available_lts_releases: [8, 11, 17, 21],
    available_releases: [8, 11, 17, 18, 19, 20, 21, 22, 23],
    most_recent_feature_release: 23,
    most_recent_feature_version: 23,
    most_recent_lts: 21,
    tip_version: 24
  })
}));

// Mock the ReleaseNotesPageClient component
vi.mock('../ReleaseNotesPageClient', () => ({
  default: () => <div data-testid="release-notes-content">Release Notes Content</div>
}));


describe('TemurinPage', () => {
  it('renders the release notes page with header and content', async () => {
    const { container } = render(await TemurinPage());
    expect(screen.getByTestId('temurin-release-notes-page')).toBeInTheDocument();
    expect(screen.getByText('Release Notes')).toBeInTheDocument();
    expect(screen.getByText('Temurin')).toBeInTheDocument();
    expect(screen.getByTestId('release-notes-content')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('has correct metadata export', () => {
    expect(metadata).toEqual({
      title: 'Release Notes',
      description: 'Eclipse Temurin offers high-performance, cross-platform, open-source Java runtime binaries that are enterprise-ready and Java SE TCK-tested for general use in the Java ecosystem.',
    });
  });
});
