import { Metadata } from 'next';
import { generateSitemapData } from '@/utils/sitemapData';
import SitemapPageClient from './SitemapPageClient';

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'Complete sitemap of the Adoptium website including all pages, documentation, and resources.',
  robots: {
    index: true,
    follow: true,
  },
};

export default async function SitemapPage() {
  const sitemapData = generateSitemapData();

  return <SitemapPageClient sitemapData={sitemapData} />;
}
