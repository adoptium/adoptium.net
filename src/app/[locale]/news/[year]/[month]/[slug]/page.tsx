import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getBlogPosts } from "@/utils/markdown";
import { formatDate } from "@/utils/date";
import { sanitizeObject } from "@/utils/sanitize";
import AuthorData from "@/data/authors.json";
import { PinkIcon } from "@/components/Common/Icon";
import { CustomMDX } from "@/components/CustomMDX";
import Byline from "@/components/News/Byline";
import ShareButton from "@/components/News/ShareButton";
import Tags from "@/components/News/Tags";
import RelatedArticles from "@/components/News/RelatedArticles";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";
import DocThemeToggle from "@/components/DocThemeToggle";
import type { BlogPosting, Person, Graph } from "schema-dts";
import { metadata } from "@/utils/metadata";

export async function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => {
    // Extract year and month from date format: "2025-05-15"
    // Default to current date if date is missing
    const date = post.metadata.date || new Date().toISOString().slice(0, 10);
    const [year = "", month = ""] = date.split("-");

    return {
      year,
      month,
      slug: post.slug || "",
      locale: "en",
    };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
    year: string;
    month: string;
    locale: string;
  }>;
}) {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);
  if (!post) {
    return;
  }

  const {
    title,
    date: date,
    description: description,
    featuredImage,
  } = post.metadata;

  // Extract year and month from date
  const [year, month] = date.split("-");
  const postURL = `${metadata.siteUrl}/news/${year}/${month}/${post.slug}`;

  const ogImage = featuredImage
    ? featuredImage
    : `/news/${year}/${month}/${post.slug}/opengraph-image`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: date,
      url: postURL,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({
  params,
}: {
  params: Promise<{
    slug: string;
    year: string;
    month: string;
    locale: string;
  }>;
}) {
  const { slug, year, month, locale } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
    return null;
  }

  const authorId = post.metadata.author;
  const author = AuthorData[authorId as keyof typeof AuthorData];

  // Create a safe URL for this post
  const postURL = `${metadata.siteUrl}/news/${year || post.year || ""}/${month || post.month || ""}/${post.slug || ""}`;

  const socialLinks = [];
  if (author.twitter) socialLinks.push(`https://x.com/${author.twitter}`);
  if (author.github) socialLinks.push(`https://github.com/${author.github}`);
  if (author.linkedin)
    socialLinks.push(`https://www.linkedin.com/in/${author.linkedin}`);

  const personSchema: Person = {
    "@type": "Person",
    name: author.name || "Unknown Author",
    description: author.summary || "No biography available",
    affiliation: {
      "@type": "Organization",
      name: "Eclipse Adoptium",
    },
    url: `${metadata.siteUrl}/news/author/${authorId}`,
    ...(socialLinks.length > 0 && { sameAs: socialLinks }),
  };

  const blogSchema: BlogPosting = {
    "@type": "BlogPosting",
    headline: post.metadata.title,
    datePublished: new Date(post.metadata.date).toISOString(),
    description: post.metadata.description,
    image: post.metadata.featuredImage
      ? `${metadata.siteUrl}${post.metadata.featuredImage}`
      : `${metadata.siteUrl}/news/${year}/${month}/${post.slug}/opengraph-image`,
    url: postURL,
    author: {
      "@type": "Person",
      name: author?.name || "Unknown Author",
      url: `${metadata.siteUrl}/news/author/${authorId}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Eclipse Adoptium",
      logo: {
        "@type": "ImageObject",
        url: `${metadata.siteUrl}/images/adoptium-icon.png`,
      },
    },
  };

  const jsonLdSchema: Graph = {
    "@context": "https://schema.org",
    "@graph": [personSchema, blogSchema],
  };

  // Sanitize the schema to prevent XSS
  const sanitizedJsonLd = sanitizeObject(jsonLdSchema);

  // Find the index of the current post in the sorted list
  const posts = getBlogPosts().sort((a, b) => {
    const dateA = new Date(a.metadata.date).getTime();
    const dateB = new Date(b.metadata.date).getTime();
    return dateB - dateA; // Newest first
  });
  const currentIndex = posts.findIndex((p) => p.slug === slug);
  const next = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const previous =
    currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <section className="light:bg-white">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(sanitizedJsonLd),
        }}
      />

      {/* Hero header */}
      <div className="relative pt-16 md:pt-24 pb-12 overflow-hidden light:bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-purple/50 to-transparent pointer-events-none light:from-gray-50 light:to-transparent" />
        <div className="relative mx-auto max-w-3xl w-full px-6 lg:px-0 flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2">
              <PinkIcon />
              <Link
                href="/news"
                className="text-pink text-sm font-semibold uppercase tracking-wider underline hover:no-underline transition-colors"
              >
                News
              </Link>
              <span className="text-gray-500 text-sm">/</span>
              <span className="text-gray-400 light:text-gray-500 text-sm truncate max-w-[200px] md:max-w-xs">
                {post.metadata.title}
              </span>
            </nav>
            <DocThemeToggle />
          </div>
          <h1 className="text-center text-white light:text-gray-900 text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
            {post.metadata.title}
          </h1>
          <p className="text-center text-gray-400 light:text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
            {post.metadata.description}
          </p>
          <Byline
            date={formatDate(post.metadata.date, locale)}
            author={author?.name || "Unknown Author"}
            identifier={post.metadata.author || ""}
            readingTime={post.readingTime}
          />
        </div>
      </div>

      {/* Article body */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-0 pb-16 light:bg-white">
        <div className="rounded-2xl border border-white/10 light:border-gray-200 bg-white/[0.03] light:bg-white backdrop-blur-sm shadow-xl light:shadow-md overflow-hidden">
          {/* Meta bar */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 md:px-10 py-5 border-b border-white/10 light:border-gray-200">
            <Tags tags={post.metadata.tags} />
            <ShareButton
              location={postURL}
              siteMetadata={metadata}
              post={post.metadata}
            />
          </header>

          {/* Prose content */}
          <div className="px-6 md:px-10 py-8 md:py-12">
            <article className="prose prose-invert light:prose-gray lg:prose-lg max-w-none prose-headings:tracking-tight prose-a:text-pink prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-pre:rounded-xl prose-pre:border-0 prose-pre:bg-[rgb(255,255,255,0.03)] light:prose-pre:bg-gray-50 light:prose-pre:border light:prose-pre:border-gray-200">
              <CustomMDX source={post.content} />
              <SyntaxHighlighter />
            </article>
          </div>

          {/* Previous / Next navigation */}
          <nav
            className="flex items-stretch border-t border-white/10 light:border-gray-200"
            aria-label="Post navigation"
          >
            <div className="flex-1 border-r border-white/10 light:border-gray-200">
              {next && (
                <Link
                  href={`/news/${next.year}/${next.month}/${next.slug}`}
                  rel="next"
                  className="block px-6 md:px-10 py-5 group transition-colors hover:bg-white/[0.03] light:hover:bg-gray-50"
                >
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1 block">
                    Previous
                  </span>
                  <span className="text-pink group-hover:underline text-sm font-medium line-clamp-1">
                    ← {next.metadata.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="flex-1 text-right">
              {previous && (
                <Link
                  href={`/news/${previous.year}/${previous.month}/${previous.slug}`}
                  rel="prev"
                  className="block px-6 md:px-10 py-5 group transition-colors hover:bg-white/[0.03] light:hover:bg-gray-50"
                >
                  <span className="text-xs uppercase tracking-wider text-gray-500 mb-1 block">
                    Next
                  </span>
                  <span className="text-pink group-hover:underline text-sm font-medium line-clamp-1">
                    {previous.metadata.title} →
                  </span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>

      <RelatedArticles currentSlug={post.slug} tags={post.metadata.tags} />
    </section>
  );
}
