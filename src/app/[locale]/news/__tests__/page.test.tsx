import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from "vitest-axe"

import NewsPage from '../page';
import * as newsUtils from '@/utils/news';
import { notFound } from 'next/navigation';

vi.mock('@/utils/news');
vi.mock('next/navigation', () => ({ notFound: vi.fn() }));

const mockGetNews = newsUtils.getNews as unknown as ReturnType<typeof vi.fn>;

describe('NewsPage', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('renders news and header when posts exist', async () => {
        mockGetNews.mockResolvedValue({
            posts: [
                {
                    metadata: {
                        title: 'Test News',
                        description: 'desc',
                        date: '2025-06-18',
                        author: 'author',
                        tags: []
                    },
                    slug: 'test-news'
                }
            ],
            totalPages: 2
        });
        const element = await NewsPage();
        const { container } = render(element);
        expect(screen.getByText('News & Updates')).toBeInTheDocument();
        expect(screen.getByText('Test News')).toBeInTheDocument();
        // Snapshot test
        expect(container).toMatchSnapshot();
        // Axe accessibility lint
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('calls notFound if no posts', async () => {
        mockGetNews.mockResolvedValue({ posts: [], totalPages: 1 });
        await NewsPage();
        expect(notFound).toHaveBeenCalled();
    });
});
