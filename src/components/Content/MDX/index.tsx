import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { highlight } from "sugar-high";
import React from "react";
import { compileMdxToHtml } from "@/utils/markdown";
import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element,
  DOMNode,
} from "html-react-parser";

interface TableProps {
  data: {
    headers: string[];
    rows: (string | number)[][];
  };
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
  );
};

type CustomLinkProps = React.ComponentProps<"a">;

const CustomLink = React.forwardRef<HTMLAnchorElement, CustomLinkProps>(
  ({ href, children, ...props }, ref) => {
    const hrefValue = href ?? "";

    // Internal Next.js route
    if (hrefValue.startsWith("/")) {
      // Filter out props that might not be compatible with the Link component
      const { popover, ...filteredProps } = props;
      return (
        <Link href={hrefValue} ref={ref} {...filteredProps}>
          {children}
        </Link>
      );
    }

    // In-page anchor or no href
    if (hrefValue.startsWith("#") || hrefValue === "") {
      return (
        <a ref={ref} {...props}>
          {children}
        </a>
      );
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
    );
  },
);
CustomLink.displayName = "CustomLink";

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
  return (
    <Image
      className="rounded-lg"
      {...props}
      alt={props.alt || "blog image"}
      width={width}
      height={height}
    />
  );
}

interface CodeProps {
  children: string;
  [key: string]: unknown;
}

function Code({ children, ...props }: CodeProps) {
  const codeHTML = highlight(children);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level: number) {
  interface HeadingProps {
    children: string;
  }

  const Heading = ({ children }: HeadingProps) => {
    const slug = slugify(children);
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        }),
      ],
      children,
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
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

function isElement(node: { type?: string }): node is Element {
  return node.type === "tag";
}

export async function CustomMDX(props: MDXProps) {
  const html = await compileMdxToHtml(props.source);

  const options: HTMLReactParserOptions = {
    replace: (node) => {
      if (!isElement(node)) return undefined;

      // Custom links
      if (node.name === "a" && node.attribs?.href) {
        const href = node.attribs.href;
        if (href.startsWith("/")) {
          return (
            <Link href={href}>
              {domToReact(node.children as DOMNode[], options)}
            </Link>
          );
        }
        if (href.startsWith("http")) {
          return (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {domToReact(node.children as DOMNode[], options)}
            </a>
          );
        }
      }

      // Rounded images
      if (node.name === "img" && node.attribs?.src) {
        return (
          <Image
            className="rounded-lg"
            src={node.attribs.src}
            alt={node.attribs.alt || "blog image"}
            width={Number(node.attribs.width) || 800}
            height={Number(node.attribs.height) || 400}
          />
        );
      }

      // Code highlighting
      if (node.name === "code" && node.children?.[0]) {
        const text = (node.children[0] as unknown as { data?: string }).data;
        if (text && !node.attribs?.class) {
          const codeHTML = highlight(text);
          return <code dangerouslySetInnerHTML={{ __html: codeHTML }} />;
        }
      }

      // Headings with anchor links
      if (/^h[1-6]$/.test(node.name)) {
        const children = domToReact(node.children as DOMNode[], options);
        const text = node.children
          .map((child) => ("data" in child ? child.data : ""))
          .join("");
        const slug = slugify(text);
        return React.createElement(
          node.name,
          { id: slug },
          React.createElement("a", {
            href: `#${slug}`,
            key: `link-${slug}`,
            className: "anchor",
          }),
          children,
        );
      }

      return undefined;
    },
  };

  return <>{parse(html, options)}</>;
}
