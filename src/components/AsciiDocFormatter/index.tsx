'use client';

import React from 'react';
import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';
import parse, { domToReact, HTMLReactParserOptions, Element, DOMNode } from "html-react-parser";
import AccordionItem from "@/components/Asciidoc/AccordionItem";

interface AsciiDocFormatterProps {
  content: string;
}

const AsciiDocFormatter: React.FC<AsciiDocFormatterProps> = ({ content }) => {
  const isBrowser = typeof window !== "undefined";
  const t = useTranslations("Asciidoc");

  const options: HTMLReactParserOptions = {
    replace: (node) => {
      if (!(node instanceof Element)) {
        return undefined;
      }

      // Transform <a> tags
      if (node.name === "a" && node.attribs) {
        let isExternal = false;
        if (isBrowser && node.attribs.href) {
          isExternal =
            node.attribs.href.startsWith("http") &&
            !node.attribs.href.includes(window.location.host);
        }
        if (isExternal) {
          return (
            <a
              href={node.attribs.href}
              target="_blank"
              rel="noopener noreferrer"
              className={node.attribs.class}
            >
              {domToReact(node.children as DOMNode[], options)}
              <i className="fa fa-external-link fa-xs p-1" />
            </a>
          );
        } else {
          return (
            <Link href={node.attribs.href} className={node.attribs.class}>
              {domToReact(node.children as DOMNode[], options)}
            </Link>
          );
        }
      }

      // Transform <i> tags
      if (
        node.name === "i" &&
        node.attribs?.class &&
        node.attribs.class.includes("fa-docker")
      ) {
        return <i className={node.attribs.class.replace("fa", "fab")} />;
      }

      // Transform <td> tags
      if (
        node.name === "td" &&
        node.attribs?.class === "icon"
      ) {
        return (
          <td>
            {domToReact(node.children as DOMNode[], options)}
            <i className="fa fa-circle-info fa-xl" aria-hidden="true" />
          </td>
        );
      }

      // Transform Table of Contents
      if (
        node.name === "div" &&
        node.attribs?.class === "toc"
      ) {
        // Get the ul element class="sectlevel1"
        const tocList = node.children.find(
          (child) =>
            child instanceof Element &&
            child.attribs &&
            child.attribs.class &&
            typeof child.attribs.class === 'string' &&
            child.attribs.class.includes("sectlevel1")
        ) as Element | undefined;

        return (
          <div className="my-6 rounded-lg shadow-md overflow-hidden border border-gray-300 dark:border-gray-700">
            <details className="group">
              <summary className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 cursor-pointer hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300">
                <div className="flex items-center">
                  <i className="fa fa-list-ul mr-3 text-pink dark:text-purple-400" aria-hidden="true" />
                  <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                    {t('table-of-contents')}
                  </span>
                </div>
                <i className="fa fa-chevron-down text-pink dark:text-purple-400 group-open:rotate-180 transition-transform duration-300" aria-hidden="true" />
              </summary>
              <div className="p-4 bg-gray-50 dark:bg-gray-800">
                {tocList ? (
                  <div className="toc-container pl-2 not-prose [&_a]:text-gray-700 [&_a:hover]:text-gray-900 dark:[&_a]:text-gray-200 dark:[&_a:hover]:text-white">
                    <ul className="space-y-1">
                      {domToReact(tocList.children as DOMNode[], options)}
                    </ul>
                  </div>
                ) : null}
              </div>
            </details>
          </div>
        );
      }

      // Transform iframe tags
      if (node.name === "iframe") {
        return (
          <iframe {...node.attribs} className="w-full aspect-video" height="400">
            {domToReact(node.children as DOMNode[], options)}
          </iframe>
        );
      }

      // Transform <details> and <summary> tags into Accordion
      if (node.name === "details") {
        const summary = node.children.find(
          (child) =>
            child instanceof Element &&
            child.name === "summary"
        ) as Element | undefined;

        const summaryContent = summary
          ? domToReact(summary.children as DOMNode[], options)
          : "Details";

        const detailsContent = node.children.filter(
          child => !(child instanceof Element && child.name === "summary")
        );

        return (
          <AccordionItem title={summaryContent}>
            {domToReact(detailsContent as DOMNode[], options)}
          </AccordionItem>
        );
      }

      // Default case - return undefined to keep original element
      return undefined;
    }
  };

  return (
    <div className="prose prose-invert lg:prose-lg max-w-none">
      {parse(content, options)}
    </div>
  );
};

export default AsciiDocFormatter;
