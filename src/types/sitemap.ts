export interface SitemapPage {
  title: string;
  url: string;
}

export interface SitemapSection {
  id: string;
  title: string;
  description?: string;
  pages: SitemapPage[];
}

export interface SitemapData {
  sections: SitemapSection[];
  dynamicContent?: {
    recentBlogs?: SitemapPage[];
    authorPages?: SitemapPage[];
  };
}

export const Sections = {
  topLevel: 'top-level',
  temurin: 'temurin',
  installation: 'installation',
  marketplace: 'marketplace',
  documentation: 'documentation',
  aqavit: 'aqavit',
  security: 'security',
  community: 'community',
  brand: 'brand',
  support: 'support',
} as const;

export type SectionId = typeof Sections[keyof typeof Sections];