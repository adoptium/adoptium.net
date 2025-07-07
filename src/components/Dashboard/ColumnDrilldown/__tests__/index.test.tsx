import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import ColumnDrilldown from '../index';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock getBoundingClientRect to avoid errors in JSDOM such as:
// - transform="translate(NaN,355) scale(1 0.001)"
// + transform="translate(NaN,354.99914874732053) scale(1 0.0010024649316718226)"
vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width: 600,
    height: 400,
    top: 0,
    left: 0,
    right: 600,
    bottom: 400,
    x: 0,
    y: 0,
    toJSON: () => { } // needed for JSDOM
});

describe('ColumnDrilldown', () => {
    const availableReleases = { available_releases: ['21', '17'] };
    const mockApiData = {
        '21': { linux: 100, windows: 200 },
        '17': { linux: 50, windows: 75 },
        linux: { 'artifact1': 60, 'artifact2': 40 },
        windows: { 'artifact1': 120, 'artifact2': 80 },
    };

    beforeEach(() => {
        mockFetch.mockImplementation((url: string) => {
            if (url.includes('/21/')) return Promise.resolve({ ok: true, json: () => Promise.resolve(mockApiData.linux) });
            if (url.includes('/17/')) return Promise.resolve({ ok: true, json: () => Promise.resolve(mockApiData.windows) });
            if (url.endsWith('/21')) return Promise.resolve({ ok: true, json: () => Promise.resolve(mockApiData['21']) });
            if (url.endsWith('/17')) return Promise.resolve({ ok: true, json: () => Promise.resolve(mockApiData['17']) });
            return Promise.resolve({ ok: false });
        });
    });

    afterEach(() => {
        cleanup();
        mockFetch.mockReset();
    });

    it('renders nothing if no data', () => {
        const { container } = render(<ColumnDrilldown name="Test Drilldown" availableReleases={{ available_releases: [] }} />);
        expect(container.firstChild).toBeNull();
    });

    it('matches snapshot', async () => {
        const { container } = render(<ColumnDrilldown name="Test Drilldown" availableReleases={availableReleases} />);
        await waitFor(() => container.querySelector('svg[aria-label="Test Drilldown"]'));
        expect(container.firstChild).toMatchSnapshot();
    });
});
