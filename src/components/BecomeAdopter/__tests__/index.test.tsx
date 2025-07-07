import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import BecomeAdopter from '../index';

describe('BecomeAdopter', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders the button', () => {
        render(<BecomeAdopter />);
        expect(screen.getByRole('button', { name: /how can i get my logo displayed/i })).toBeInTheDocument();
    });

    it('shows dropdown content when button is clicked', () => {
        render(<BecomeAdopter />);
        const button = screen.getByRole('button', { name: /how can i get my logo displayed/i });
        fireEvent.click(button);
        expect(screen.getByText(/option 1 - open an issue/i)).toBeInTheDocument();
        expect(screen.getByText(/option 2 - submit a pull request/i)).toBeInTheDocument();
    });

    it('hides dropdown content when button is clicked twice', () => {
        render(<BecomeAdopter />);
        const button = screen.getByRole('button', { name: /how can i get my logo displayed/i });
        fireEvent.click(button);
        fireEvent.click(button);
        expect(screen.queryByText(/option 1 - open an issue/i)).not.toBeInTheDocument();
    });
});
