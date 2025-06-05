import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import fs from 'fs';
import path from 'path';
import { redirect } from '@/i18n/navigation';
import { getAsciidocContent, getAllAsciidocPaths } from '@/services/asciidocService';
import PageHeader from '@/components/Common/PageHeader';
import AsciiDocFormatter from '@/components/AsciiDocFormatter';
import AuthorList from '@/components/Asciidoc/AuthorList';
import EditLink from '@/components/Asciidoc/EditLink';
import ContactUs from '@/components/ContactUs';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';
import InstallTabs from '@/components/InstallTabs';
import LinkText from '@/components/LinkText';

import "@fortawesome/fontawesome-free/css/all.min.css"
import "@fortawesome/fontawesome-free/css/v4-shims.min.css"

// Base directory for AsciiDoc content - same as in asciidocService.ts
const CONTENT_BASE_DIR = path.join(process.cwd(), 'content/asciidoc-pages');

export async function generateStaticParams() {
    const paths = await getAllAsciidocPaths();

    return paths.map(({ slug, locale }) => ({
        slug: slug.split('/'),
        locale,
    }));
}


export async function generateMetadata(
    { params }: { params: Promise<{ slug: string[]; locale: string }> }
): Promise<Metadata> {
    const { slug: pathSegments, locale } = await params;
    const slug = pathSegments.join('/');
    const asciidoc = await getAsciidocContent(slug, locale);

    if (!asciidoc) {
        return {
            title: 'Page not found',
        };
    }

    return {
        title: asciidoc.metadata.title,
        description: asciidoc.metadata.description ||
            `${asciidoc.metadata.title} - Eclipse Adoptium documentation`,
    };
}

export default async function AsciidocPage({ params }: {
    params: Promise<{ slug: string[]; locale: string }>;
}) {
    const { slug: pathSegments, locale } = await params;
    // Enable static rendering
    setRequestLocale(locale);
    const slug = pathSegments.join('/');

    // Check if this is a root section like 'about' without trailing slash
    if (pathSegments.length === 1) {
        const rootPath = pathSegments[0];
        const asciidoc = await getAsciidocContent(rootPath, locale);

        // Only redirect if we know this is a valid directory in our content structure
        // Otherwise just continue to the notFound() handling below
        if (!asciidoc) {
            const withTrailingSlashPath = path.join(CONTENT_BASE_DIR, rootPath);
            if (fs.existsSync(withTrailingSlashPath) && fs.lstatSync(withTrailingSlashPath).isDirectory()) {
                // If the path exists as a directory, redirect to it with trailing slash
                redirect({
                    href: `/${rootPath}/`,
                    locale: locale
                });
            }
            // Otherwise, proceed to notFound() below
        }
    }

    const asciidoc = await getAsciidocContent(slug, locale);
    if (!asciidoc) {
        notFound();
    }

    const t = await getTranslations('Asciidoc');
    
    // Determine if we should display the default locale warning
    // Show warning when:
    // 1. The current locale is not English ('en') or British English ('en-GB')
    // 2. The page content is in English (not available in user's locale)
    const displayDefaultLocaleWarning = locale !== 'en' && 
                                       locale !== 'en-GB' && 
                                       !asciidoc.availableLocales.includes(locale);
    
    // Get the relative path for the current document
    // This is used in the warning message for the GitHub edit link
    const relativePath = `${asciidoc.slug}/${path.basename(asciidoc.path)}`;

    return (
        <div>
            <PageHeader
                title={asciidoc.metadata.title}
                subtitle="Documentation"
                description=""
            />
            <section className="mx-auto max-w-4xl w-full p-6 lg:px-0 flex flex-col items-center justify-center">
                <div className="asciidoc-container w-full" id="asciidoc-container">
                    <div className="col-lg-3 hide-on-mobile">
                        {/* Leaving space for a table of contents (side bar) */}
                    </div>
                    <div className="asciidoc col-lg-6 col-md-12">
                        {displayDefaultLocaleWarning && (
                            <div className="mb-6 bg-purple-950/40 border-l-4 border-purple-400 p-4 rounded-md shadow-sm">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-sm text-gray-300">
                                            {t.rich('warn-default-locale', {
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
                        {/* {displayOutdatedWarning && (
                            <div className="alert alert-warning">
                                <i className="fas fa-exclamation-triangle pe-1" />
                                <Trans
                                    i18nKey="asciidoc.template.warn.outdated"
                                    defaults="This localized page is based on a <previousEnglishVersionLink>previous version of the English page</previousEnglishVersionLink> and might be inaccurate. Please help us by updating this page to match the <lastEnglishVersionLink>latest version of the English page</lastEnglishVersionLink>. See our <translationGuideLink>translation guide</translationGuideLink> for more information."
                                    components={{
                                        previousEnglishVersionLink: (
                                            <LinkText
                                                href={`https://github.com/adoptium/adoptium.net/blob/${basedOnSha}/content/asciidoc-pages/${relativePath.replace(
                                                    `.${locale}`,
                                                    "",
                                                )}`}
                                            />
                                        ),
                                        lastEnglishVersionLink: (
                                            <LinkText
                                                href={`https://github.com/adoptium/adoptium.net/blob/main/content/asciidoc-pages/${relativePath.replace(
                                                    `.${locale}`,
                                                    "",
                                                )}`}
                                            />
                                        ),
                                        translationGuideLink: (
                                            <LinkText href="https://github.com/adoptium/adoptium.net/tree/main/content/asciidoc-pages#localising-documentation" />
                                        ),
                                    }}
                                />
                            </div>
                        )} */}
                        {slug === "installation" && (
                            <section className="adopt-demo-container hidden md:block my-5">
                                <div className="adopt-demo mx-auto">
                                    <InstallTabs />
                                </div>
                            </section>
                        )}
                        <div className="asciidoc-content prose prose-invert lg:prose-lg max-w-none">
                            <AsciiDocFormatter content={asciidoc.content} />
                            <SyntaxHighlighter />
                        </div>
                        <div className="h-px my-5 border border-gray-700"></div>
                        <AuthorList authors={asciidoc.metadata.authors} />
                        <EditLink relativePath={relativePath} />
                    </div>
                    <div className="col-lg-3 hide-on-mobile"></div>
                </div>
            </section>
            <ContactUs
                title="Connect with the community"
                buttontitle="Learn More"
                description="Join our Slack channel to discuss work and reach out to project maintainers."
                linkTo="/slack"
            />
            {/* <FAQ /> */}
        </div>
    );
}
