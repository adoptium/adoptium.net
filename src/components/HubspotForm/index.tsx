"use client"
import React, { useEffect, useState } from 'react';

declare global {
    interface Window {
        hbspt?: {
            forms: {
                create: (options: {
                    portalId: string;
                    formId: string;
                    target: string;
                    onFormSubmit?: ($form: any) => void;
                }) => void;
            };
        };
    }
}

interface HubspotFormProps {
    portalId: string
    formId: string
    onFormSubmit?: () => void;
}

export default function HubspotForm({ portalId, formId, onFormSubmit }: HubspotFormProps) {
    const [formLoaded, setFormLoaded] = useState(false);

    useEffect(() => {
        if (!formLoaded) {
            const script = document.createElement('script');
            script.src = 'https://js.hsforms.net/forms/v2.js';
            document.body.appendChild(script);

            script.addEventListener('load', () => {
                if (window.hbspt) {
                    window.hbspt.forms.create({
                        portalId: portalId,
                        formId: formId,
                        target: '#hubspotForm',
                        onFormSubmit: function($form: any) {
                            setFormLoaded(true); 
                            if (onFormSubmit) {
                                onFormSubmit();
                            }
                        }
                    });
                }
            });

            return () => {
                if (document.body.contains(script)) {
                    document.body.removeChild(script);
                }
            };
        }
    }, [formId, portalId, onFormSubmit, formLoaded]);

    return (
        <div id="hubspotForm" className="hubspotForm"></div>
    );
}