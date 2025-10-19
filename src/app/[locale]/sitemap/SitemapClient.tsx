'use client';

import { useState, useMemo, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { SitemapData, SitemapPage } from '@/types/sitemap';
import {
  FaHome,
  FaDownload,
  FaCog,
  FaStore,
  FaBook,
  FaCheckCircle,
  FaShieldAlt,
  FaUsers,
  FaPalette,
  FaHeart,
  FaNewspaper,
  FaChevronDown,
  FaChevronRight,
  FaSearch
} from 'react-icons/fa';
import { Sections } from '@/types/sitemap';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface SectionWrapperProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  children: React.ReactNode;
  isExpanded?: boolean;
  onToggle: () => void;
}

function SectionWrapper({ 
  icon: IconComponent, 
  title, 
  description, 
  children, 
  isExpanded = false, 
  onToggle 
}: SectionWrapperProps) {
  const headerContent = (
    <div className="flex items-center gap-4">
      <IconComponent className="text-2xl text-rose-500" />
      <div>
        <h2 className="text-xl font-semibold text-white">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
        <button
          onClick={onToggle}
          className="w-full px-6 py-4 text-left hover:bg-gray-700/50 transition-colors duration-200 flex items-center justify-between"
        >
          {headerContent}
          {isExpanded ? (
            <FaChevronDown className="text-gray-400" />
          ) : (
            <FaChevronRight className="text-gray-400" />
          )}
        </button>

      {isExpanded && (
        <div className="px-6 pb-4 pt-2">
          {children}
        </div>
      )}
    </div>
  );
}

interface SitemapClientProps {
  sitemapData: SitemapData;
}

const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  [Sections.topLevel]: FaHome,
  [Sections.temurin]: FaDownload,
  [Sections.installation]: FaCog,
  [Sections.marketplace]: FaStore,
  [Sections.documentation]: FaBook,
  [Sections.aqavit]: FaCheckCircle,
  [Sections.security]: FaShieldAlt,
  [Sections.community]: FaUsers,
  [Sections.brand]: FaPalette,
  [Sections.support]: FaHeart,
};

export default function SitemapClient({ sitemapData }: SitemapClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedDynamicSections, setExpandedDynamicSections] = useState<Set<string>>(new Set());

  const debouncedSearchTerm = useDebounce(searchTerm, 300);


  const filteredSections = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return sitemapData.sections;

    const searchLower = debouncedSearchTerm.toLowerCase();
    return sitemapData.sections.map(section => ({
      ...section,
      pages: section.pages.filter(page =>
        page.title.toLowerCase().includes(searchLower)
      )
    })).filter(section => section.pages.length > 0);
  }, [sitemapData.sections, debouncedSearchTerm]);

  const filteredDynamicContent = useMemo(() => {
    if (!debouncedSearchTerm.trim() || !sitemapData.dynamicContent) {
      return sitemapData.dynamicContent;
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    return {
      recentBlogs: sitemapData.dynamicContent.recentBlogs?.filter(blog =>
        blog.title.toLowerCase().includes(searchLower)
      ),
      authorPages: sitemapData.dynamicContent.authorPages?.filter(author =>
        author.title.toLowerCase().includes(searchLower)
      ),
    };
  }, [sitemapData.dynamicContent, debouncedSearchTerm]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const toggleDynamicSection = (sectionId: string) => {
    setExpandedDynamicSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const renderPageLink = (page: SitemapPage) => {
    const isExternal = page.url.startsWith('http');
    const linkClasses = `block py-2 px-4 text-white hover:text-rose-600 transition-colors duration-200`;

    if (isExternal) {
      return (
        <a
          href={page.url}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClasses}
        >
          {page.title}
        </a>
      );
    }

    return (
      <Link href={page.url} className={linkClasses}>
        {page.title}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-purple">
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Sitemap Sections */}
        <div className="max-w-6xl mx-auto space-y-6">
          {filteredSections.map((section) => {
            const IconComponent = sectionIcons[section.id] || FaHome;
            const isExpanded = expandedSections.has(section.id);

            return (
              <SectionWrapper
                key={section.id}
                icon={IconComponent}
                title={section.title}
                description={section.description}
                isExpanded={isExpanded}
                onToggle={() => toggleSection(section.id)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {section.pages.map((page, index) => (
                    <div key={index} className="group">
                      {renderPageLink(page)}
                    </div>
                  ))}
                </div>
              </SectionWrapper>
            );
          })}

          {/* Dynamic Content Sections */}
          {filteredDynamicContent && (
            <>
              {/* Recent Blogs */}
              {filteredDynamicContent.recentBlogs && filteredDynamicContent.recentBlogs.length > 0 && (
                <SectionWrapper
                  icon={FaNewspaper}
                  title="Latest News"
                  description="Recent blog posts and announcements"
                  isExpanded={expandedDynamicSections.has('recentBlogs')}
                  onToggle={() => toggleDynamicSection('recentBlogs')}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {filteredDynamicContent.recentBlogs.map((blog, index) => (
                      <div key={index} className="group">
                        {renderPageLink(blog)}
                      </div>
                    ))}
                  </div>
                </SectionWrapper>
              )}

              {/* Author Pages */}
              {filteredDynamicContent.authorPages && filteredDynamicContent.authorPages.length > 0 && (
                <SectionWrapper
                  icon={FaUsers}
                  title="Authors"
                  description="Blog authors and contributors"
                  isExpanded={expandedDynamicSections.has('authors')}
                  onToggle={() => toggleDynamicSection('authors')}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {filteredDynamicContent.authorPages.map((author, index) => (
                      <div key={index} className="group">
                        {renderPageLink(author)}
                      </div>
                    ))}
                  </div>
                </SectionWrapper>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
