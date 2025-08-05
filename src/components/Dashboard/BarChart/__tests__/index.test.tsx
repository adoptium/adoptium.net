import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
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
});
