import { Metadata } from 'next'
import DownloadPageClient from './client'

export const metadata: Metadata = {
    title: 'Thanks for your Download!',
    description: 'Thank you for downloading from the Eclipse Adoptium Working Group. We hope you find our high-performance, cross-platform, open-source Java runtime binaries useful.',
}

export default function DownloadPage() {
    return <DownloadPageClient />
}
