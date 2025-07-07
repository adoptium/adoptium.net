import { Metadata } from 'next';
import TrendsClient from './trends-client';

export const metadata: Metadata = {
    title: "Download Trends",
    description: "View download trends for Temurin releases",
}

export default function DownloadTrendsPage() {
    return (
        <TrendsClient />
    )
}
