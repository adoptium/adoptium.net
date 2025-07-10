import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import DocumentationHeader from '../index';

// Mock PinkIcon and DocumentationSearch
vi.mock('@/components/Common/Icon', () => ({
    PinkIcon: () => <svg data-testid="pink-icon" />,
}));
vi.mock('@/components/Documentation/Search', () => ({
    __esModule: true,
    default: () => <div data-testid="doc-search" />,
}));

describe('DocumentationHeader', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders the Documentation title and subtitle', () => {
        render(<DocumentationHeader />);
        expect(screen.getAllByText('Documentation').length).toBeGreaterThanOrEqual(2);
        expect(screen.getByText('Everything you need to get started with Adoptium technology')).toBeInTheDocument();
    });

    it('renders the PinkIcon', () => {
        render(<DocumentationHeader />);
        expect(screen.getByTestId('pink-icon')).toBeInTheDocument();
    });

    it('renders the DocumentationSearch component', () => {
        render(<DocumentationHeader />);
        expect(screen.getByTestId('doc-search')).toBeInTheDocument();
    });
});
