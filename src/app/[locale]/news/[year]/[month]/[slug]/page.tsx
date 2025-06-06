import { notFound } from 'next/navigation'
import { formatDate, getBlogPosts } from '@/utils/markdown'
import { sanitizeObject } from '@/utils/sanitize'
import { safeJsonLd } from '@/utils/jsonLd'
import AuthorData from "@/data/authors.json"
import { PinkIcon } from "@/components/Common/Icon"
import { CustomMDX } from '@/components/CustomMDX'
import Byline from '@/components/News/Byline'
import ShareButton from '@/components/News/ShareButton'
import Tags from '@/components/News/Tags'
import SharePost from '@/components/News/SharePost'

// TODO Hardcoded metadata for now, perhaps we could improve this?
const metadata = {
  social: {
    twitter: "@adoptium"
  },
  siteUrl: "https://adoptium.net",
}

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
      locale: "en" // Default locale
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
  const { slug, year, month } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug)

  if (!post) {
    notFound()
  }

  // Get author data safely
  const authorId = post.metadata.author || '';
  const author = authorId ? (AuthorData[authorId as keyof typeof AuthorData] || { name: 'Unknown Author' }) : { name: 'Unknown Author' };

  // Create a safe URL for this post
  const postURL = `${metadata.siteUrl}/news/${year || post.year || ''}/${month || post.month || ''}/${post.slug || ''}`

  // Create JSON-LD schema with potentially unsafe user content
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.metadata.title,
    datePublished: post.metadata.date || new Date().toISOString().slice(0, 10),
    description: post.metadata.description,
    image: post.metadata.featuredImage
      ? `${metadata.siteUrl}${post.metadata.featuredImage}`
      : `/og?title=${encodeURIComponent(post.metadata.title)}`,
    url: postURL,
    author: {
      '@type': 'Person',
      name: author?.name || 'Unknown Author',
    },
  };

  // Sanitize the schema to prevent XSS
  const sanitizedJsonLd = sanitizeObject(jsonLdSchema);

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(sanitizedJsonLd),
        }}
      />
      <div className="pt-48 pb-12">
        <div className="mx-auto max-w-[832px] w-full px-6 lg:px-0 flex flex-col items-center justify-center">
          <div className="self-stretch h-52 flex-col justify-center items-center gap-6 flex">
            <div className="self-stretch h-32 flex-col justify-center items-center gap-4 flex">
              <div className="justify-start items-center gap-3 inline-flex">
                <PinkIcon />
                <div className="text-rose-600 text-base font-bold leading-normal">
                  News article
                </div>
              </div>
              <h1 className="self-stretch text-center text-white text-2xl md:text-5xl pb-4 font-semibold">
                {post.metadata.title}
              </h1>
            </div>
            <div className="self-stretch text-center text-grey text-grey-300 text-lg md:text-xl font-normal leading-7">
              {post.metadata.description}
            </div>
            <Byline
              date={formatDate(post.metadata.date)}
              author={author?.name || 'Unknown Author'}
              identifier={post.metadata.author || ''}
            />
          </div>
        </div>
      </div>
      <section className="mx-auto p-0 md:p-6 lg:px-0 flex flex-col md:items-center justify-center w-full">
        <div className="m-4 max-w-4/5 md:max-w-4xl">
          <article>
            <header className="py-5">
              <ShareButton
                location={postURL}
                siteMetadata={metadata}
                post={post.metadata}
              />
            </header>
            <article className="prose prose-invert lg:prose-lg max-w-none">
              <CustomMDX source={post.content} />
            </article>
            <Tags tags={post.metadata.tags} />
            {/* <Comments /> */}
            <SharePost />
          </article>

          <div>
            <ul className="flex flex-wrap justify-between list-none pt-5 md:p-0">
              <li>
                {/* {next && (
                  <Link to={next.fields.postPath} rel="next">
                    ← {next.frontmatter.title}
                  </Link>
                )} */}
              </li>
              <li>
                {/* {previous && (
                  <Link to={previous.fields.postPath} rel="prev">
                    {previous.frontmatter.title} →
                  </Link>
                )} */}
              </li>
            </ul>
          </div>
        </div>
      </section>
      {/* <RelatedArticles /> */}
    </section>
  )
}
