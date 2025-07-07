import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import LineChart from '../index';

describe('LineChart', () => {
    const mockSeries = [
        { name: 'A', data: [1, 2, 3], type: 'line' as const },
        { name: 'B', data: [4, 5, 6], type: 'line' as const },
    ];
    const mockCategories = ['Jan', 'Feb', 'Mar'];
    const mockName = 'Test Line Chart';

    afterEach(() => {
        cleanup();
    });

    it('renders nothing if no series', () => {
        const { container } = render(<LineChart name={mockName} />);
        expect(container.firstChild).toBeNull();
    });

    it('matches snapshot', () => {
        const { container } = render(<LineChart series={mockSeries} categories={mockCategories} name={mockName} />);
        // Strip dynamic Highcharts IDs
        container.querySelectorAll("[id^='highcharts-']").forEach(el => {
            el.removeAttribute("id");
        });
        container.querySelectorAll("[clip-path]").forEach(el => {
            el.removeAttribute("clip-path");
        });
        expect(container.firstChild).toMatchSnapshot();
    });
});
