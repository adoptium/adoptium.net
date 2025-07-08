import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import BarChart from '../index';

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

describe('BarChart', () => {
    const mockData = {
        github: 1234,
        dockerhub: 5678,
        total: 6912,
    };

    afterEach(() => {
        cleanup();
    });

    it('renders nothing if no data', () => {
        const { container } = render(<BarChart name="Test Chart" />);
        expect(container.firstChild).toBeNull();
    });

    it('matches snapshot', () => {
        const { container } = render(<BarChart data={mockData} name="Test Chart" />);
        expect(container.firstChild).toMatchSnapshot();
    });
});
