import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import ColumnDrilldown from '../index';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ColumnDrilldown', () => {
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
});
