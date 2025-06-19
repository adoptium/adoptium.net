import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TabContent from '../TabContent';

vi.mock('next-intl', () => ({ useLocale: () => 'en' }));
vi.mock('@/i18n/navigation', () => ({ Link: (props: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => <a {...props} /> }));

describe('TabContent', () => {
    it('renders news posts', () => {
        const posts = [
            {
                slug: 'test-news',
                year: '2025',
                month: '06',
                metadata: {
                    title: 'Test News',
                    description: 'A test news item',
                    date: '2025-06-19',
                },
            },
        ];
        render(<TabContent posts={posts} />);
        expect(screen.getByText('Test News')).toBeInTheDocument();
        expect(screen.getByText('A test news item')).toBeInTheDocument();
    });

    it('renders events with truncated description', () => {
        const posts = [
            {
                title: 'Test Event',
                date: '2025-06-19',
                description: 'A'.repeat(200),
                infoLink: 'https://example.com',
            },
        ];
        render(<TabContent posts={posts} isEvents />);
        expect(screen.getByText('Test Event')).toBeInTheDocument();
        expect(screen.getByText(/A{150}\.{3}/)).toBeTruthy();
    });

    it('renders events with short description', () => {
        const posts = [
            {
                title: 'Short Event',
                date: '2025-06-19',
                description: 'Short desc',
                infoLink: 'https://example.com',
            },
        ];
        render(<TabContent posts={posts} isEvents />);
        expect(screen.getByText('Short Event')).toBeInTheDocument();
        expect(screen.getByText('Short desc')).toBeInTheDocument();
    });
});
