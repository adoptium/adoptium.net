import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import BarChart from '../index';

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
