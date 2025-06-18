import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import AuthorNewsPage, { generateMetadata } from '../page';
import * as newsUtils from '@/utils/news';
import * as authorUtils from '@/utils/authors';
import { notFound } from 'next/navigation';

vi.mock('@/utils/news');
vi.mock('@/utils/authors');
vi.mock('next/navigation', () => ({ notFound: vi.fn() }));

const mockGetNewsByAuthor = newsUtils.getNewsByAuthor as unknown as ReturnType<typeof vi.fn>;
const mockGetFormattedAuthorData = authorUtils.getFormattedAuthorData as unknown as ReturnType<typeof vi.fn>;

describe('AuthorNewsPage', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('generateMetadata returns correct metadata', async () => {
    mockGetFormattedAuthorData.mockReturnValue({ name: 'Jane Doe' });
    const meta = await generateMetadata({ params: Promise.resolve({ author: 'jane-doe' }) });
    expect(meta).toEqual({
      title: 'Jane Doe',
      description: 'News and updates from Eclipse Adoptium Project authored by Jane Doe',
    });
  });

  it('renders news and header for author when posts exist', async () => {
    mockGetFormattedAuthorData.mockReturnValue({ name: 'Jane Doe' });
    mockGetNewsByAuthor.mockReturnValue({
      posts: [
        {
          metadata: {
            title: 'Author News',
            description: 'desc',
            date: '2025-06-18',
            author: 'Jane Doe',
            tags: []
          },
          slug: 'author-news'
        }
      ],
      totalPages: 2
    });
    const element = await AuthorNewsPage({ params: Promise.resolve({ author: 'jane-doe' }) });
    const { container } = render(element);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Author News')).toBeInTheDocument();
    // Snapshot test
    expect(container).toMatchSnapshot();
    // Axe accessibility lint
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('calls notFound if no posts for author', async () => {
    mockGetFormattedAuthorData.mockReturnValue({ name: 'Jane Doe' });
    mockGetNewsByAuthor.mockReturnValue({ posts: [], totalPages: 1 });
    await AuthorNewsPage({ params: Promise.resolve({ author: 'jane-doe' }) });
    expect(notFound).toHaveBeenCalled();
  });
});
