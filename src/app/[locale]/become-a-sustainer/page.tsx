import { Metadata } from 'next'
import BecomeSustainerClient from './BecomeSustainerClient'

export const metadata: Metadata = {
    title: 'Become a Sustainer',
    description: 'Become a Sustainer of Eclipse Temurin to support the development and maintenance of high-performance, cross-platform, open-source Java runtime binaries.',
}

export default function BecomeSustainerPage() {
    return <BecomeSustainerClient />
}