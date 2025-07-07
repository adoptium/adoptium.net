import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import ContactUs from '../index';

describe('ContactUs', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders the title, description, and button', () => {
        render(
            <ContactUs
                title="Contact Adoptium"
                buttontitle="Contact Us"
                linkTo="/contact"
                description="Get in touch with us!"
            />
        );
        expect(screen.getByText('Contact Adoptium')).toBeInTheDocument();
        expect(screen.getByText('Get in touch with us!')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /contact us/i })).toBeInTheDocument();
    });

    it('renders default description if not provided', () => {
        render(
            <ContactUs
                title="Contact Adoptium"
                buttontitle="Contact Us"
                linkTo="/contact"
            />
        );
        expect(screen.getByText(/ready to get involved/i)).toBeInTheDocument();
    });

    it('button links to the correct URL', () => {
        render(
            <ContactUs
                title="Contact Adoptium"
                buttontitle="Contact Us"
                linkTo="/contact"
            />
        );
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/contact');
    });
});
