import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import NotFound from '../not-found';

describe('NotFound page', () => {
    it('renders not found message', () => {
        const { container } = render(<NotFound />);
        expect(container).toBeTruthy();
    });
});
