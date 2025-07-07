import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import DocumentationSearch from '../index';

describe('DocumentationSearch', () => {
    const mockResults = [
        { slug: 'foo', title: 'Foo Title', desc: 'Foo Desc', locale: 'en' },
        { slug: 'bar', title: 'Bar Title', desc: 'Bar Desc', locale: 'en' },
        { slug: 'baz', title: 'Baz Title', desc: 'Baz Desc', locale: 'fr' },
    ];

    beforeEach(() => {
        vi.spyOn(global, 'fetch').mockImplementation((): Promise<Response> => {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResults),
            } as unknown as Response);
        });
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    it('renders the input', () => {
        render(<DocumentationSearch />);
        expect(screen.getByPlaceholderText(/search documentation/i)).toBeInTheDocument();
    });

    it('shows results when typing a query', async () => {
        render(<DocumentationSearch />);
        const input = screen.getByPlaceholderText(/search documentation/i);
        fireEvent.change(input, { target: { value: 'fo' } });
        await waitFor(() => expect(screen.getByText('Foo Title')).toBeInTheDocument());
        expect(screen.getByText('Bar Title')).toBeInTheDocument();
        // Should not show non-en locale
        expect(screen.queryByText('Baz Title')).not.toBeInTheDocument();
    });

    it('hides results when clicking outside', async () => {
        render(<DocumentationSearch />);
        const input = screen.getByPlaceholderText(/search documentation/i);
        fireEvent.change(input, { target: { value: 'fo' } });
        await waitFor(() => expect(screen.getByText('Foo Title')).toBeInTheDocument());
        // Simulate click outside
        fireEvent.mouseDown(document.body);
        expect(screen.queryByText('Foo Title')).not.toBeInTheDocument();
    });

    it('navigates to the correct link when a result is clicked', async () => {
        render(<DocumentationSearch />);
        const input = screen.getByPlaceholderText(/search documentation/i);
        fireEvent.change(input, { target: { value: 'fo' } });
        await waitFor(() => expect(screen.getByText('Foo Title')).toBeInTheDocument());
        const link = screen.getByText('Foo Title').closest('a');
        expect(link).toHaveAttribute('href', '/foo');
    });
});
