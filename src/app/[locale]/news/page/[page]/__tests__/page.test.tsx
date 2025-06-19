import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import NewsPage, { generateMetadata } from '../page';
import * as newsUtils from '@/utils/news';
import { notFound, redirect } from 'next/navigation';

vi.mock('@/utils/news');
vi.mock('next/navigation', () => ({ notFound: vi.fn(), redirect: vi.fn() }));

const mockGetNews = newsUtils.getNews as unknown as ReturnType<typeof vi.fn>;

describe('NewsPage (paginated)', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('generateMetadata returns correct metadata', async () => {
        const meta = await generateMetadata({ params: Promise.resolve({ page: '2' }) });
        expect(meta).toEqual({
            title: 'News & Updates - Page 2',
            description: 'Latest news and updates from the Eclipse Adoptium Project',
        });
    });

    it('redirects to /news if page is 1', async () => {
        mockGetNews.mockResolvedValue({ posts: [], totalPages: 1 });
        await NewsPage({ params: Promise.resolve({ page: '1' }) });
        expect(redirect).toHaveBeenCalledWith('/news');
    });

    it('renders news and header for page when posts exist', async () => {
        mockGetNews.mockResolvedValue({
            posts: [
                {
                    metadata: {
                        title: 'Paged News',
                        description: 'desc',
                        date: '2025-06-18',
                        author: 'author',
                        tags: []
                    },
                    slug: 'paged-news'
                }
            ],
            totalPages: 3
        });
        const element = await NewsPage({ params: Promise.resolve({ page: '2' }) });
        const { container } = render(element);
        expect(screen.getByText('News & Updates')).toBeInTheDocument();
        expect(screen.getByText('Paged News')).toBeInTheDocument();
        // Snapshot test
        expect(container).toMatchSnapshot();
        // Axe accessibility lint
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('calls notFound if no posts for page', async () => {
        mockGetNews.mockResolvedValue({ posts: [], totalPages: 1 });
        await NewsPage({ params: Promise.resolve({ page: '2' }) });
        expect(notFound).toHaveBeenCalled();
    });
});
