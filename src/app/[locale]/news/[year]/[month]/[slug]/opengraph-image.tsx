import { ImageResponse } from 'next/og'
import { getBlogPosts } from '@/utils/markdown'
import AuthorData from "@/data/authors.json"

const websiteURL = process.env.NODE_ENV === 'production'
    // TODO update this adoptium.net once the new site is live
    ? 'https://adoptium-next.netlify.app' 
    : 'http://localhost:3000'

// Output size
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: { slug: string; year: string; month: string; locale: string }
}) {
  const { slug } = params
  const post = getBlogPosts().find((p) => p.slug === slug)

  // Title will be “Not Found” if there’s no post
  const titleText = post ? post.metadata.title : 'Not Found'
  // Description—fall back to empty string if missing
  let descText = post?.metadata.description || ''
  // Truncate description to ~100 characters for OG legibility
  if (descText.length > 100) {
    descText = descText.substring(0, 100).trim() + '…'
  }
  const authorId = post?.metadata.author || '';
  const author = authorId ? (AuthorData[authorId as keyof typeof AuthorData] || { name: 'Unknown Author' }) : { name: 'Unknown Author' };
  // Author—render “By XYZ” or blank
  const authorText = author ? `By ${author.name}` : ''

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',

          // Dark fallback color
          backgroundColor: '#0E002A',

          // Background image settings:
          backgroundImage: `url(${websiteURL}/images/blog/blog-background.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',

          color: '#FFFFFF',
          fontFamily: '"Inter", sans-serif',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 60, // 60px
            margin: 0,
            padding: 0,
            lineHeight: 1.2,
          }}
        >
          {titleText}
        </h1>

        {descText && (
          <p
            style={{
              fontSize: 40, // 40px
              margin: '20px 0 0 0',
              padding: 0,
              maxWidth: '80%',
              lineHeight: 1.3,
            }}
          >
            {descText}
          </p>
        )}

        {authorText && (
          <p
            style={{
              fontSize: 30, // 30px
              margin: '20px 0 0 0',
              padding: 0,
              opacity: 0.8,
            }}
          >
            {authorText}
          </p>
        )}
      </div>
    ),
    { ...size }
  )
}
