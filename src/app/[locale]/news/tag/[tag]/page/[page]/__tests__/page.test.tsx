import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import TaggedNewsPage, { generateMetadata } from '../page';
import * as newsUtils from '@/utils/news';
import { notFound, redirect } from 'next/navigation';

vi.mock('@/utils/news');
vi.mock('next/navigation', () => ({ notFound: vi.fn(), redirect: vi.fn() }));

const mockGetNewsByTag = newsUtils.getNewsByTag as unknown as ReturnType<typeof vi.fn>;

describe('TaggedNewsPage', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('redirects to tag root if page is 1', async () => {
        mockGetNewsByTag.mockReturnValue({ posts: [], totalPages: 1 });
        await TaggedNewsPage({ params: Promise.resolve({ tag: 'temurin', page: '1' }) });
        expect(redirect).toHaveBeenCalledWith('/news/tag/temurin');
    });

    it('renders news and header for tag and page when posts exist', async () => {
        mockGetNewsByTag.mockReturnValue({
            posts: [
                {
                    metadata: {
                        title: 'Tagged News',
                        description: 'desc',
                        date: '2025-06-18',
                        author: 'author',
                        tags: ['temurin']
                    },
                    slug: 'tagged-news'
                }
            ],
            totalPages: 3
        });
        const element = await TaggedNewsPage({ params: Promise.resolve({ tag: 'temurin', page: '2' }) });
        const { container } = render(element);
        expect(screen.getByText('News tagged with "temurin"')).toBeInTheDocument();
        expect(screen.getByText('Tagged News')).toBeInTheDocument();
        // Snapshot test
        expect(container).toMatchSnapshot();
        // Axe accessibility lint
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('calls notFound if no posts for tag and page', async () => {
        mockGetNewsByTag.mockReturnValue({ posts: [], totalPages: 1 });
        await TaggedNewsPage({ params: Promise.resolve({ tag: 'temurin', page: '2' }) });
        expect(notFound).toHaveBeenCalled();
    });

    it('generateMetadata returns correct metadata', async () => {
        const meta = await generateMetadata({ params: Promise.resolve({ tag: 'temurin', page: '2' }) });
        expect(meta).toEqual({
            title: 'News with tag: temurin - Page 2',
            description: 'News and updates from Eclipse Adoptium Project tagged with temurin',
        });
    });
});
