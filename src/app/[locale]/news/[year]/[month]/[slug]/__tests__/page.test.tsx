import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import NewsArticlePage, { generateMetadata } from '../page';
import * as markdownUtils from '@/utils/markdown';
import * as dateUtils from '@/utils/date';
import { notFound } from 'next/navigation';

vi.mock('@/components/CustomMDX', () => ({
  CustomMDX: () => <div>MDX Content</div>
}));
vi.mock('@/utils/markdown');
vi.mock('@/utils/date');
vi.mock('next/navigation', () => ({ notFound: vi.fn() }));

const mockGetBlogPosts = markdownUtils.getBlogPosts as unknown as ReturnType<typeof vi.fn>;
const mockFormatDate = dateUtils.formatDate as unknown as ReturnType<typeof vi.fn>;

describe('NewsArticlePage', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders article when post exists', async () => {
    mockGetBlogPosts.mockReturnValue([
      {
        slug: 'test-article',
        metadata: {
          title: 'Test Article',
          description: 'desc',
          date: '2025-06-18',
          author: 'Jane Doe',
          tags: ['temurin']
        },
        year: '2025',
        month: '06',
        content: 'Hello world'
      }
    ]);
    mockFormatDate.mockReturnValue('June 18, 2025');
    const element = await NewsArticlePage({ params: Promise.resolve({ slug: 'test-article', year: '2025', month: '06', locale: 'en' }) });
    const { container } = render(element);
    expect(screen.getByText('Test Article')).toBeInTheDocument();
    expect(screen.getByText('June 18, 2025')).toBeInTheDocument();
    // Snapshot test
    expect(container).toMatchSnapshot();
    // Axe accessibility lint
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('calls notFound if post does not exist', async () => {
    mockGetBlogPosts.mockReturnValue([]); // No posts at all
    await NewsArticlePage({ params: Promise.resolve({ slug: 'missing', year: '2025', month: '06', locale: 'en' }) });
    expect(notFound).toHaveBeenCalled();
  });

  it('generateMetadata returns correct metadata', async () => {
    mockGetBlogPosts.mockReturnValue([
      {
        slug: 'test-article',
        metadata: {
          title: 'Test Article',
          description: 'desc',
          date: '2025-06-18',
          author: 'Jane Doe',
          tags: ['temurin']
        },
        year: '2025',
        month: '06',
        content: 'Hello world'
      }
    ]);
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'test-article', year: '2025', month: '06', locale: 'en' }) });
    expect(meta).toBeDefined();
    expect(meta!.title).toBe('Test Article');
    expect(meta!.description).toBe('desc');
  });
});
