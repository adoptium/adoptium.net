import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import StatsNav from '../index';

// Mock next/navigation and i18n/navigation Link
vi.mock('next/navigation', () => ({
    usePathname: () => '/stats/download',
}));
vi.mock('@/i18n/navigation', () => ({
    Link: ({ href, className, children, ...props }: any) => <a href={href} className={className} {...props}>{children}</a>,
}));

describe('StatsNav', () => {
    afterEach(() => {
        cleanup();
    });

    it('matches snapshot', () => {
        const { container } = render(<StatsNav />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
