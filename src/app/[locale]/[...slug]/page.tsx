import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import fs from "fs";
import path from "path";
import { redirect, Link } from "@/i18n/navigation";
import {
  getAsciidocContent,
  getAllAsciidocPaths,
} from "@/services/asciidocService";
import Image from "next/image";
import PageHeader from "@/components/Common/PageHeader";
import AsciiDocFormatter from "@/components/AsciiDocFormatter";
import AuthorList from "@/components/Asciidoc/AuthorList";
import EditLink from "@/components/Asciidoc/EditLink";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import InstallTabs from "@/components/InstallTabs";
import LinkText from "@/components/LinkText";
import DocSidebar from "@/components/DocSidebar";
import DocTableOfContents from "@/components/DocTableOfContents";
import DocThemeToggle from "@/components/DocThemeToggle";

// Base directory for AsciiDoc content - same as in asciidocService.ts
const CONTENT_BASE_DIR = path.join(process.cwd(), "content/asciidoc-pages");

export async function generateStaticParams() {
  const paths = await getAllAsciidocPaths();

  return paths.map(({ slug, locale }) => ({
    slug: slug.split("/"),
    locale,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[]; locale: string }>;
}): Promise<Metadata> {
  const { slug: pathSegments, locale } = await params;
  const slug = pathSegments.join("/");
  const asciidoc = await getAsciidocContent(slug, locale);

  if (!asciidoc) {
    return {
      title: "Page not found",
    };
  }

  return {
    title: asciidoc.metadata.title,
    description:
      asciidoc.metadata.description ||
      `${asciidoc.metadata.title} - Eclipse Adoptium documentation`,
  };
}

export default async function AsciidocPage({
  params,
}: {
  params: Promise<{ slug: string[]; locale: string }>;
}) {
  const { slug: pathSegments, locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);
  const slug = pathSegments.join("/");

  // Check if this is a root section like 'about' without trailing slash
  if (pathSegments.length === 1) {
    const rootPath = pathSegments[0];
    const asciidoc = await getAsciidocContent(rootPath, locale);

    // Only redirect if we know this is a valid directory in our content structure
    // Otherwise just continue to the notFound() handling below
    if (!asciidoc) {
      const withTrailingSlashPath = path.join(CONTENT_BASE_DIR, rootPath);
      if (
        fs.existsSync(withTrailingSlashPath) &&
        fs.lstatSync(withTrailingSlashPath).isDirectory()
      ) {
        // If the path exists as a directory, redirect to it with trailing slash
        redirect({
          href: `/${rootPath}/`,
          locale: locale,
        });
      }
      // Otherwise, proceed to notFound() below
    }
  }

  const asciidoc = await getAsciidocContent(slug, locale);
  if (!asciidoc) {
    notFound();
  }

  const t = await getTranslations("Asciidoc");

  // Determine if we should display the default locale warning
  // Show warning when:
  // 1. The current locale is not English ('en') or British English ('en-GB')
  // 2. The page content is in English (not available in user's locale)
  const displayDefaultLocaleWarning =
    locale !== "en" &&
    locale !== "en-GB" &&
    !asciidoc.availableLocales.includes(locale);

  // Get the relative path for the current document
  // This is used in the warning message for the GitHub edit link
  const relativePath = `${asciidoc.slug}/${path.basename(asciidoc.path)}`;

  // Build breadcrumb segments from the slug
  const breadcrumbs = pathSegments.map((segment, i) => ({
    label:
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
    href: `/${pathSegments.slice(0, i + 1).join("/")}`,
    isLast: i === pathSegments.length - 1,
  }));

  return (
    <div className="doc-wrapper pt-4 light:bg-white">
      {/* Compact doc header */}
      <div className="doc-header border-b border-white/10 light:bg-white light:border-gray-200">
        <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8 py-6 lg:pl-[calc(16rem+2rem)]">
          <div className="flex items-center justify-between mb-3">
            <nav
              className="flex items-center text-sm text-gray-400 light:text-gray-500"
              aria-label="Breadcrumb"
            >
              <a
                href="/"
                className="hover:text-white light:hover:text-gray-900 transition-colors"
              >
                Home
              </a>
              {breadcrumbs.map((crumb) => (
                <React.Fragment key={crumb.href}>
                  <svg
                    className="w-4 h-4 mx-1.5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  {crumb.isLast ? (
                    <span className="text-gray-200 light:text-gray-900">
                      {crumb.label}
                    </span>
                  ) : (
                    <a
                      href={crumb.href}
                      className="hover:text-white light:hover:text-gray-900 transition-colors"
                    >
                      {crumb.label}
                    </a>
                  )}
                </React.Fragment>
              ))}
            </nav>
            <DocThemeToggle />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white light:text-gray-900 tracking-tight">
            {asciidoc.metadata.title}
          </h1>
        </div>
      </div>

      <div className="doc-layout mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8 pb-16 light:bg-white">
        <div className="flex flex-col lg:flex-row">
          {/* Left sidebar */}
          <aside
            className="hidden lg:block w-64 flex-shrink-0"
            aria-label="Documentation navigation"
          >
            <div className="doc-sidebar sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] py-8 pr-6 border-r border-white/10 light:border-gray-200">
              <DocSidebar />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 py-8 lg:px-10" role="article">
            {displayDefaultLocaleWarning && (
              <div className="mb-6 bg-purple-950/40 border-l-4 border-purple-400 p-4 rounded-md shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-purple-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-gray-300">
                      {t.rich("warn-default-locale", {
                        englishVersionLink: (chunks: React.ReactNode) => (
                          <span className="font-medium text-purple-300 hover:text-purple-200">
                            <LinkText
                              href={`https://github.com/adoptium/adoptium.net/blob/main/content/asciidoc-pages/${relativePath.replace(
                                `.${locale}`,
                                "",
                              )}`}
                            >
                              {chunks}
                            </LinkText>
                          </span>
                        ),
                        translationGuideLink: (chunks: React.ReactNode) => (
                          <span className="font-medium text-purple-300 hover:text-purple-200">
                            <LinkText href="https://github.com/adoptium/adoptium.net/tree/main/content/asciidoc-pages#localising-documentation">
                              {chunks}
                            </LinkText>
                          </span>
                        ),
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {slug === "installation" && (
              <section className="mb-8">
                <InstallTabs />
              </section>
            )}
            <article className="doc-content prose prose-invert prose-base max-w-none">
              <AsciiDocFormatter content={asciidoc.content} />
              <SyntaxHighlighter />
            </article>
            <div className="doc-footer h-px my-8 border border-white/10 light:border-gray-200"></div>
            <div className="space-y-4">
              <EditLink relativePath={relativePath} />
              <AuthorList authors={asciidoc.metadata.authors} />
              <div className="doc-community-banner inline-flex items-center gap-3 flex-wrap pt-4">
                <svg
                  className="doc-community-icon w-5 h-5 text-gray-400 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                </svg>
                <span className="doc-community-desc text-gray-400 light:text-gray-500 text-sm">
                  Join our Slack channel to discuss and reach out to
                  maintainers.
                </span>
                <Link href="/slack" className="flex-shrink-0">
                  <span className="inline-flex items-center px-4 py-1.5 text-sm font-medium text-white bg-pink rounded-lg hover:opacity-90 transition-opacity">
                    Join Slack
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right sidebar - Table of Contents */}
          <aside className="hidden xl:block w-56 flex-shrink-0">
            <div className="doc-toc-sidebar sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] py-8 pl-6 border-l border-white/10 light:border-gray-200">
              <DocTableOfContents />
            </div>
          </aside>
        </div>
      </div>
      {/* <FAQ /> */}
    </div>
  );
}
