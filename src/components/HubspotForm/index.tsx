"use client"
import React, { useEffect } from 'react';

declare global {
    interface Window {
        hbspt?: any;
    }
}

interface HubspotFormProps {
    portalId: string
    formId: string
}

export default function HubspotForm({ portalId, formId }: HubspotFormProps) {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.hsforms.net/forms/v2.js';
        document.body.appendChild(script);

        script.addEventListener('load', () => {
            if (window.hbspt) {
                window.hbspt.forms.create({
                    portalId: portalId,
                    formId: formId,
                    target: '#hubspotForm'
                });
            }
        });
    }, []);

    return (
        <div id="hubspotForm" className="hubspotForm"></div>
    );
}
