import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'
import { mdxOptions } from '@/utils/markdown'

interface TableProps {
  data: {
    headers: string[]
    rows: (string | number)[][]
  }
}
const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <table>
      <thead>
        <tr className="text-left">
          {data.headers.map((header, idx) => (
            <th key={idx}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, rowIdx) => (
          <tr key={rowIdx}>
            {row.map((cell, cellIdx) => (
              <td key={cellIdx}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

type CustomLinkProps = React.ComponentProps<'a'>

const CustomLink = React.forwardRef<HTMLAnchorElement, CustomLinkProps>(
  ({ href, children, ...props }, ref) => {
    const hrefValue = href ?? ''

    // Internal Next.js route
    if (hrefValue.startsWith('/')) {
      // Filter out props that might not be compatible with the Link component
      const { popover, ...filteredProps } = props;
      return (
        <Link href={hrefValue} ref={ref} {...filteredProps}>
          {children}
        </Link>
      )
    }

    // In-page anchor or no href
    if (hrefValue.startsWith('#') || hrefValue === '') {
      return (
        <a ref={ref} {...props}>
          {children}
        </a>
      )
    }

    // External link
    return (
      <a
        ref={ref}
        href={hrefValue}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    )
  }
)
CustomLink.displayName = 'CustomLink'

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
}

function RoundedImage(props: ImageProps) {
  const width = props.width || 800;
  const height = props.height || 400;
  return <Image className="rounded-lg" {...props} alt={props.alt || 'blog image'} width={width} height={height} />;
}

interface CodeProps {
  children: string;
  [key: string]: unknown;
}

function Code({ children, ...props }: CodeProps) {
  const codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

function createHeading(level: number) {
  interface HeadingProps {
    children: string;
  }

  const Heading = ({ children }: HeadingProps) => {
    const slug = slugify(children)
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  img: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
};

// Define proper types for MDXRemote in RSC mode
interface MDXProps {
  source: string; // Content to be rendered
  components?: Record<string, React.ComponentType<unknown>>; // Custom components
}

export function CustomMDX(props: MDXProps) {
  return (
    <MDXRemote
      source={props.source}
      options={mdxOptions}
      components={
        // eslint-disable-next-line
        { ...components, ...(props.components || {}) } as any
      }
    />
  );
}