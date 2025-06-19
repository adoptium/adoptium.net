import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import TagsPage, { generateMetadata } from '../page';
import * as newsUtils from '@/utils/news';
import { notFound } from 'next/navigation';

vi.mock('@/utils/news');
vi.mock('next/navigation', () => ({ notFound: vi.fn() }));

const mockGetNewsByTag = newsUtils.getNewsByTag as unknown as ReturnType<typeof vi.fn>;

describe('TagsPage', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('generateMetadata returns correct metadata', async () => {
        const meta = await generateMetadata({ params: Promise.resolve({ tag: 'temurin' }) });
        expect(meta).toEqual({
            title: 'News with tag: temurin',
            description: 'News and updates from Eclipse Adoptium Project tagged with temurin',
        });
    });

    it('renders news and header for tag when posts exist', async () => {
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
            totalPages: 1
        });
        const element = await TagsPage({ params: Promise.resolve({ tag: 'temurin' }) });
        const { container } = render(element);
        expect(screen.getByText('News tagged with "temurin"')).toBeInTheDocument();
        expect(screen.getByText('Tagged News')).toBeInTheDocument();
        // Snapshot test
        expect(container).toMatchSnapshot();
        // Axe accessibility lint
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('calls notFound if no posts for tag', async () => {
        mockGetNewsByTag.mockReturnValue({ posts: [], totalPages: 1 });
        await TagsPage({ params: Promise.resolve({ tag: 'temurin' }) });
        expect(notFound).toHaveBeenCalled();
    });
});
