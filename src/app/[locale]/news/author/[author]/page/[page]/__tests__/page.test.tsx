import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import AuthorNewsPagePaginated, { generateMetadata } from '../page';
import * as newsUtils from '@/utils/news';
import * as authorUtils from '@/utils/authors';
import { notFound, redirect } from 'next/navigation';

vi.mock('@/utils/news');
vi.mock('@/utils/authors');
vi.mock('next/navigation', () => ({ notFound: vi.fn(), redirect: vi.fn() }));
vi.mock('@/data/authors.json', () => ({
  default: {
    'jdoe': {
      name: 'Jane Doe',
      bio: 'Author bio',
      avatar: '/path/to/avatar.jpg'
    }
  }
}));

const mockGetNewsByAuthor = newsUtils.getNewsByAuthor as unknown as ReturnType<typeof vi.fn>;
const mockGetFormattedAuthorData = authorUtils.getFormattedAuthorData as unknown as ReturnType<typeof vi.fn>;


describe('AuthorNewsPagePaginated', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('redirects to author root if page is 1', async () => {
    mockGetFormattedAuthorData.mockReturnValue({ name: 'Jane Doe' });
    mockGetNewsByAuthor.mockReturnValue({ posts: [], totalPages: 1 });
    await AuthorNewsPagePaginated({ params: Promise.resolve({ author: 'jane-doe', page: '1' }) });
    expect(redirect).toHaveBeenCalledWith('/news/author/jane-doe');
  });

  it('renders news and header for author and page when posts exist', async () => {
    mockGetFormattedAuthorData.mockReturnValue({ name: 'Jane Doe' });
    mockGetNewsByAuthor.mockReturnValue({
      posts: [
        {
          metadata: {
            title: 'Author Paged News',
            description: 'desc',
            date: '2025-06-18',
            author: 'jdoe',
            tags: []
          },
          slug: 'author-paged-news'
        }
      ],
      totalPages: 3
    });
    const element = await AuthorNewsPagePaginated({ params: Promise.resolve({ author: 'jane-doe', page: '2' }) });
    const { container } = render(element);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Author Paged News')).toBeInTheDocument();
    // Snapshot test
    expect(container).toMatchSnapshot();
    // Axe accessibility lint
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('calls notFound if no posts for author and page', async () => {
    mockGetFormattedAuthorData.mockReturnValue({ name: 'Jane Doe' });
    mockGetNewsByAuthor.mockReturnValue({ posts: [], totalPages: 1 });
    await AuthorNewsPagePaginated({ params: Promise.resolve({ author: 'jdoe', page: '2' }) });
    expect(notFound).toHaveBeenCalled();
  });

  it('generateMetadata returns correct metadata', async () => {
    mockGetFormattedAuthorData.mockReturnValue({ name: 'Jane Doe' });
    const meta = await generateMetadata({ params: Promise.resolve({ author: 'jdoe', page: '2' }) });
    expect(meta).toEqual({
      title: 'Jane Doe - Page 2',
      description: 'News and updates from Eclipse Adoptium Project authored by Jane Doe',
    });
  });
});
