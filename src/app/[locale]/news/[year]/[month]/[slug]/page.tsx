import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { getBlogPosts } from '@/utils/markdown'
import { formatDate } from '@/utils/date'
import { sanitizeObject } from '@/utils/sanitize'
import AuthorData from "@/data/authors.json"
import { PinkIcon } from "@/components/Common/Icon"
import { CustomMDX } from '@/components/CustomMDX'
import Byline from '@/components/News/Byline'
import ShareButton from '@/components/News/ShareButton'
import Tags from '@/components/News/Tags'
import RelatedArticles from '@/components/News/RelatedArticles'
import SyntaxHighlighter from '@/components/SyntaxHighlighter'
import type { BlogPosting, Person, Graph } from 'schema-dts'
import { metadata } from '@/utils/metadata'

export async function generateStaticParams() {
  const posts = getBlogPosts()

  return posts.map((post) => {
    // Extract year and month from date format: "2025-05-15"
    // Default to current date if date is missing
    const date = post.metadata.date || new Date().toISOString().slice(0, 10);
    const [year = "", month = ""] = date.split('-');

    return {
      year,
      month,
      slug: post.slug || "",
      locale: "en"
    };
  })
}

export async function generateMetadata(
  { params }: {
    params: Promise<{
      slug: string
      year: string
      month: string
      locale: string
    }>
  }
) {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug)
  if (!post) {
    return
  }

  const {
    title,
    date: date,
    description: description,
    featuredImage,
  } = post.metadata

  // Extract year and month from date
  const [year, month] = date.split('-');
  const postURL = `${metadata.siteUrl}/news/${year}/${month}/${post.slug}`;

  const ogImage = featuredImage
    ? featuredImage
    : `/news/${year}/${month}/${post.slug}/opengraph-image`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: date,
      url: postURL,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Blog(
  { params }: {
    params: Promise<{
      slug: string
      year: string
      month: string
      locale: string
    }>
  }
) {
  const { slug, year, month, locale } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug)

  if (!post) {
    notFound();
    return null;
  }

  const authorId = post.metadata.author;
  const author = AuthorData[authorId as keyof typeof AuthorData]

  // Create a safe URL for this post
  const postURL = `${metadata.siteUrl}/news/${year || post.year || ''}/${month || post.month || ''}/${post.slug || ''}`

  const socialLinks = [];
  if (author.twitter) socialLinks.push(`https://x.com/${author.twitter}`);
  if (author.github) socialLinks.push(`https://github.com/${author.github}`);
  if (author.linkedin) socialLinks.push(`https://www.linkedin.com/in/${author.linkedin}`);

  const personSchema: Person = {
    '@type': 'Person',
    name: author.name || 'Unknown Author',
    description: author.summary || 'No biography available',
    affiliation: {
      '@type': 'Organization',
      name: 'Eclipse Adoptium',
    },
    url: `${metadata.siteUrl}/news/author/${authorId}`,
    ...(socialLinks.length > 0 && { sameAs: socialLinks }),
  };

  const blogSchema: BlogPosting = {
    '@type': 'BlogPosting',
    headline: post.metadata.title,
    datePublished: new Date(post.metadata.date).toISOString(),
    description: post.metadata.description,
    image: post.metadata.featuredImage
      ? `${metadata.siteUrl}${post.metadata.featuredImage}`
      : `${metadata.siteUrl}/news/${year}/${month}/${post.slug}/opengraph-image`,
    url: postURL,
    author: {
      '@type': 'Person',
      name: author?.name || 'Unknown Author',
      url: `${metadata.siteUrl}/news/author/${authorId}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Eclipse Adoptium',
      logo: {
        '@type': 'ImageObject',
        url: `${metadata.siteUrl}/images/adoptium-icon.png`,
      },
    },
  }

  const jsonLdSchema: Graph = {
    '@context': 'https://schema.org',
    '@graph': [personSchema, blogSchema],
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
  const previous = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(sanitizedJsonLd),
        }}
      />
      <div className="pt-16 md:pt-24 pb-12">
        <div className="mx-auto max-w-[832px] w-full px-6 lg:px-0 flex flex-col items-center justify-center">
          <div className="self-stretch flex-col justify-center items-center gap-6 flex pb-4">
            <div className="self-stretch flex-col justify-center items-center gap-4 flex">
              <div className="justify-start items-center gap-3 inline-flex">
                <PinkIcon />
                <div className="text-rose-600 text-base font-bold leading-normal">News article</div>
              </div>
              <h1 className="self-stretch text-center text-white text-2xl md:text-5xl pb-4 font-semibold break-words">
                <span className="break-words whitespace-normal">{post.metadata.title}</span>
              </h1>
            </div>
            <div className="self-stretch text-center text-grey text-grey-300 text-lg md:text-xl font-normal leading-7">
              {post.metadata.description}
            </div>
            <div className="flex justify-center items-center gap-5">
              <Byline
                date={formatDate(post.metadata.date, locale)}
                author={author?.name || 'Unknown Author'}
                identifier={post.metadata.author || ''}
              />
            </div>
          </div>
        </div>
      </div>
      <section className="w-full mx-auto p-0 md:p-6 lg:px-0 flex flex-col md:items-center justify-center">
        <div className="w-full max-w-full m-2 md:m-4 md:max-w-4xl bg-white/5 rounded-2xl shadow-2xl p-2 md:p-12 relative z-10 overflow-x-auto">
          <article>
            <header className="py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 mb-8 px-2 md:px-0">
              <ShareButton
                location={postURL}
                siteMetadata={metadata}
                post={post.metadata}
              />
              <Tags tags={post.metadata.tags} />
            </header>
            <article className="prose prose-invert lg:prose-lg max-w-full px-2 md:px-0">
              <CustomMDX source={post.content} />
              {/* Add SyntaxHighlighter to enable Prism highlighting on client */}
              <SyntaxHighlighter />
            </article>
          </article>
          <div className="mt-8 px-2 md:px-0">
            <ul className="flex flex-wrap justify-between list-none pt-5 md:p-0">
              <li>
                {next && (
                  <Link
                    href={`/news/${next.year}/${next.month}/${next.slug}`}
                    rel="next"
                    className="text-pink hover:underline"
                  >
                    ← {next.metadata.title}
                  </Link>
                )}
              </li>
              <li>
                {previous && (
                  <Link
                    href={`/news/${previous.year}/${previous.month}/${previous.slug}`}
                    rel="prev"
                    className="text-pink hover:underline"
                  >
                    {previous.metadata.title} →
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </section>
      <RelatedArticles currentSlug={post.slug} tags={post.metadata.tags} />
    </section>
  )
}
