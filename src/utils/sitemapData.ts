import { SitemapData, SitemapSection, SitemapPage, Sections } from '@/types/sitemap';
import { getBlogRoutes } from './getAppRoutes';
import authorsData from '@/data/authors.json';
export function generateSitemapData(): SitemapData {
  const sections: SitemapSection[] = [
    {
      id: Sections.topLevel,
      title: 'Top-level',
      description: 'Main pages and navigation',
      pages: [
        { title: 'Home', url: '/' },
        { title: 'What We Do', url: '/what-we-do' },
        { title: 'About', url: '/about' },
        { title: 'Members', url: '/members' },
        { title: 'Adopters', url: '/adopters' },
        { title: 'Business Benefits', url: '/business-benefits' },
        { title: 'Join our Slack', url: '/slack' },
        { title: 'News & Updates', url: '/news' },
      ],
    },
    {
      id: Sections.temurin,
      title: 'Temurin (Product & Downloads)',
      description: 'Eclipse Temurin downloads and information',
      pages: [
        { title: 'Temurin Overview', url: '/temurin' },
        { title: 'Latest Releases', url: '/temurin/releases' },
        { title: 'Release Notes', url: '/temurin/release-notes' },
        { title: 'Supported Platforms', url: '/supported-platforms' },
        { title: 'Download Buttons', url: '/temurin/buttons' },
        { title: 'Nightly Builds', url: '/temurin/nightly' },
      ],
    },
    {
      id: Sections.installation,
      title: 'Installation',
      description: 'Installation guides for different platforms',
      pages: [
        { title: 'Installation Overview', url: '/installation' },
        { title: 'Windows (MSI)', url: '/installation/windows' },
        { title: 'macOS (PKG)', url: '/installation/macOS' },
        { title: 'Linux (RPM/DEB/APK)', url: '/installation/linux' },
        { title: 'Archive Installs', url: '/installation/archives' },
      ],
    },
    {
      id: Sections.marketplace,
      title: 'Marketplace',
      description: 'Eclipse Marketplace downloads',
      pages: [
        { title: 'Marketplace', url: '/marketplace' },
      ],
    },
    {
      id: Sections.documentation,
      title: 'Documentation Hub',
      description: 'Documentation and guides',
      pages: [
        { title: 'Documentation', url: '/docs' },
        { title: 'FAQ', url: '/docs/faq' },
        { title: 'Migration Guide', url: '/docs/migration' },
        { title: 'Support Guide', url: '/support' },
      ],
    },
    {
      id: Sections.aqavit,
      title: 'AQAvit / Quality & Verification',
      description: 'Quality assurance and verification',
      pages: [
        { title: 'AQAvit Overview', url: '/aqavit' },
        { title: 'AQAvit Verification', url: '/docs/aqavit-verification' },
        { title: 'QVS Policy', url: '/docs/qvs-policy' },
      ],
    },
    {
      id: Sections.security,
      title: 'Security & Supply Chain',
      description: 'Security practices and supply chain',
      pages: [
        { title: 'Secure Software Practices', url: '/docs/secure-software' },
        { title: 'SLSA', url: '/docs/slsa' },
        { title: 'Reproducible Verification Builds', url: '/docs/reproducible-verification-builds' },
      ],
    },
    {
      id: Sections.community,
      title: 'Community & Contributing',
      description: 'Community resources and contribution guides',
      pages: [
        { title: 'How to Contribute', url: '/contributing' },
        { title: 'First-Timer Support', url: '/docs/first-timer-support' },
        { title: 'Developer Nightly Builds', url: '/temurin/nightly' },
        { title: 'Slack', url: '/slack' },
      ],
    },
    {
      id: Sections.brand,
      title: 'Brand & Marketing',
      description: 'Branding and marketing resources',
      pages: [
        { title: 'Logo Styleguide', url: '/docs/logo-styleguide' },
        { title: 'Marketing Criteria', url: '/docs/marketing-criteria' },
        { title: 'Download Buttons', url: '/temurin/buttons' },
      ],
    },
    {
      id: Sections.support,
      title: 'Support Us',
      description: 'Support the Adoptium project',
      pages: [
        { title: 'Support Us', url: '/support-us' },
        { title: 'Become a Sustainer', url: '/become-a-sustainer' },
        { title: 'Sustainers', url: '/sustainers' },
      ],
    },
  ];

  const blogRoutes = getBlogRoutes();
  
  const recentBlogs: SitemapPage[] = blogRoutes
    .sort((a, b) => new Date(b.lastmod).getTime() < new Date(a.lastmod).getTime() ? 1 : -1)
    .slice(0, 10) // Taking Top 10 Blogs for Sitemap
    .map(blog => ({
      title: blog.loc?.replace(/\/$/, '').split('/').pop()?.replace(/-/g, ' ')?.split(' ').map(word => word.charAt(0)?.toUpperCase() + word.slice(1))?.join(' ') || 'Blog Post',
      url: blog.loc,
      lastModified: new Date(blog.lastmod),
    }));

  const authorPages: SitemapPage[] = Object.keys(authorsData).map(authorId => ({
    title: `Author: ${authorId}`,
    url: `/news/author/${authorId}`,
  }));

  return {
    sections,
    dynamicContent: {
      recentBlogs,
      authorPages,
    },
  };
}

export function getAllSitemapUrls(): string[] {
  const data = generateSitemapData();
  const urls: string[] = [];

  function extractUrls(pages: SitemapPage[]): void {
    pages.forEach(page => {
      urls.push(page.url);
    });
  }

  data.sections.forEach(section => {
    extractUrls(section.pages);
  });

  if (data.dynamicContent) {
    if (data.dynamicContent.recentBlogs) {
      extractUrls(data.dynamicContent.recentBlogs);
    }
    if (data.dynamicContent.authorPages) {
      extractUrls(data.dynamicContent.authorPages);
    }
  }

  return urls;
}
