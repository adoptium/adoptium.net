import React from 'react';
import { act, render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import BarChart from '../index';

// NOTE: Use a delay to avoid diff with rendering animation
// https://github.com/highcharts/highcharts/issues/14328
const delay = 2000;

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

    it('matches snapshot', async () => {
        let container!: HTMLElement;
        await act(async () => {
            ({ container } = render(<BarChart data={mockData} name="Test Chart" />));
            setTimeout(() => { }, delay)
        });
        expect(container.firstChild).toMatchSnapshot();
    });
});
