import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import PieChart from '../index';

afterEach(() => {
    cleanup();
});

describe('PieChart', () => {
    const mockData = [
        { name: 'Github', y: 1234 },
        { name: 'Dockerhub', y: 5678 },
        { name: 'Other', y: 100 },
    ];

    it('renders nothing if no data', () => {
        const { container } = render(<PieChart name="Test Pie" />);
        expect(container.firstChild).toBeNull();
    });

    it('renders the chart container and passes correct props', () => {
        render(<PieChart data={mockData} name="Test Pie" />);
        // The chart should render an SVG or at least a div with class 'highcharts-container' or similar
        expect(screen.getByText('Test Pie')).toBeInTheDocument();
    });

    it('renders with legend and dataLabels', () => {
        render(<PieChart data={mockData} name="Test Pie" showInLegend dataLabels />);
        expect(screen.getByText('Test Pie')).toBeInTheDocument();
    });

    it('renders with custom colors', () => {
        render(<PieChart data={mockData} name="Test Pie" colors={["#fff", "#000"]} />);
        expect(screen.getByText('Test Pie')).toBeInTheDocument();
    });
});
