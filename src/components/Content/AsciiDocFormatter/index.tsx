"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element,
  DOMNode,
} from "html-react-parser";
import AccordionItem from "@/components/Content/Asciidoc/AccordionItem";
import Icon from "@/components/Icon";

function isElement(node: { type?: string }): node is Element {
  return node.type === "tag";
}

interface AsciiDocFormatterProps {
  content: string;
}

const AsciiDocFormatter: React.FC<AsciiDocFormatterProps> = ({ content }) => {
  const t = useTranslations("Asciidoc");

  const options: HTMLReactParserOptions = {
    replace: (node) => {
      if (!isElement(node)) {
        return undefined;
      }

      // Transform <a> tags
      if (node.name === "a" && node.attribs) {
        const href = node.attribs.href || "";
        const isExternal = href.startsWith("http");

        // Don't show external icon if the link wraps an image
        const wrapsImage = node.children.some(
          (child) => isElement(child) && child.name === "img",
        );

        if (isExternal) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={node.attribs.class}
            >
              {domToReact(node.children as DOMNode[], options)}
              {!wrapsImage && (
                <Icon name="external-link" className="w-3 h-3 p-1" />
              )}
            </a>
          );
        } else {
          return (
            <Link href={href} className={node.attribs.class}>
              {domToReact(node.children as DOMNode[], options)}
            </Link>
          );
        }
      }

      // Prevent script execution + hydration mismatches from AsciiDoc output
      if (node.name === "script") {
        return <template />;
      }

      // Transform heading tags (h1-h6) to add hoverable anchors
      if (node.name && /^h[1-6]$/.test(node.name)) {
        const id = node.attribs?.id;
        const headingProps = {
          id,
          className: `${node.attribs?.class || ""} group relative scroll-mt-30`,
        };

        const headingContent = (
          <>
            {domToReact(node.children as DOMNode[], options)}
            {id && (
              <a
                href={`#${id}`}
                className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-pink dark:text-purple-400 hover:text-pink-600 dark:hover:text-purple-300 no-underline"
                aria-label={`Link to ${node.name} section`}
              >
                <Icon name="link" className="w-3.5 h-3.5" />
              </a>
            )}
          </>
        );

        return React.createElement(node.name, headingProps, headingContent);
      }

      // Transform <i> tags with FontAwesome classes to inline SVG icons
      if (
        node.name === "i" &&
        node.attribs?.class &&
        node.attribs.class.includes("fa")
      ) {
        const classes = node.attribs.class;
        if (classes.includes("fa-docker")) {
          return <Icon name="docker" className="w-4 h-4 inline-block" />;
        }
        if (classes.includes("fa-check")) {
          return (
            <Icon
              name="check"
              className="w-4 h-4 inline-block text-green-500"
            />
          );
        }
        if (classes.includes("fa-times")) {
          return (
            <Icon name="times" className="w-4 h-4 inline-block text-red-500" />
          );
        }
      }

      // Transform admonition blocks into GitHub-style callouts
      if (
        node.name === "div" &&
        node.attribs?.class &&
        node.attribs.class.includes("admonitionblock")
      ) {
        const type = node.attribs.class.replace("admonitionblock ", "").trim();

        const config: Record<
          string,
          { icon: React.ReactNode; label: string; className: string }
        > = {
          note: {
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path>
              </svg>
            ),
            label: "Note",
            className: "callout-note",
          },
          tip: {
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path>
              </svg>
            ),
            label: "Tip",
            className: "callout-tip",
          },
          warning: {
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
              </svg>
            ),
            label: "Warning",
            className: "callout-warning",
          },
          caution: {
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path>
              </svg>
            ),
            label: "Caution",
            className: "callout-caution",
          },
          important: {
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
              </svg>
            ),
            label: "Important",
            className: "callout-important",
          },
        };

        const callout = config[type] || config.note;

        // Find the content td
        const table = node.children.find(
          (child) => isElement(child) && child.name === "table",
        ) as Element | undefined;
        let contentNode: Element | undefined;
        if (table) {
          const tbody = table.children.find(
            (child) =>
              isElement(child) &&
              (child.name === "tbody" || child.name === "tr"),
          ) as Element | undefined;
          const row =
            tbody?.name === "tr"
              ? tbody
              : (tbody?.children.find(
                  (child) => isElement(child) && child.name === "tr",
                ) as Element | undefined);
          if (row) {
            contentNode = row.children.find(
              (child) =>
                isElement(child) &&
                child.name === "td" &&
                child.attribs?.class === "content",
            ) as Element | undefined;
          }
        }

        return (
          <div className={`github-callout ${callout.className}`}>
            <p className="callout-title">
              {callout.icon}
              {callout.label}
            </p>
            <div className="callout-body">
              {contentNode
                ? domToReact(contentNode.children as DOMNode[], options)
                : domToReact(node.children as DOMNode[], options)}
            </div>
          </div>
        );
      }

      // Hide inline Table of Contents (rendered in sidebar instead)
      if (node.name === "div" && node.attribs?.class === "toc") {
        return <></>;
      }

      // Transform iframe tags
      if (node.name === "iframe") {
        return (
          <iframe
            {...node.attribs}
            className="w-full aspect-video"
            height="400"
          >
            {domToReact(node.children as DOMNode[], options)}
          </iframe>
        );
      }

      // Transform <details> and <summary> tags into Accordion
      if (node.name === "details") {
        const summary = node.children.find(
          (child) => isElement(child) && child.name === "summary",
        ) as Element | undefined;

        const summaryContent = summary
          ? domToReact(summary.children as DOMNode[], options)
          : "Details";

        const detailsContent = node.children.filter(
          (child) => !(isElement(child) && child.name === "summary"),
        );

        return (
          <AccordionItem title={summaryContent}>
            {domToReact(detailsContent as DOMNode[], options)}
          </AccordionItem>
        );
      }

      // Default case - return undefined to keep original element
      return undefined;
    },
  };

  return <div>{parse(content, options)}</div>;
};

export default AsciiDocFormatter;
