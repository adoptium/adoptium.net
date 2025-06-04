'use client';

import { useEffect } from 'react';
import Prism from "prismjs"

// Load specific languages as needed from Prism's components directory
import "prismjs/components/prism-java"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-powershell"
import "prismjs/components/prism-json"
import "prismjs/components/prism-batch"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-markup"

// Import the Shades of Purple theme
import "prism-themes/themes/prism-shades-of-purple.css"

// Export the highlighting function so it can be called directly
export function highlightCode() {
  const codeBlocks = document.querySelectorAll("pre code")
  codeBlocks.forEach(codeBlock => {
    // skip all pre tags with class no-highlight
    if (codeBlock.parentElement?.classList.contains("no-highlight")) {
      return
    }
    if (typeof codeBlock === "object") {
      Prism.highlightElement(codeBlock)
    }
  })
}

// Client component that enhances code blocks with PrismJS
export default function SyntaxHighlighter() {
  useEffect(() => {
    // Run highlighting on every render, just like in the Gatsby implementation
    highlightCode();
    
    // Set up MutationObserver to catch dynamically added code blocks
    const observer = new MutationObserver((mutations) => {
      let shouldHighlight = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          // Check if any added nodes contain code blocks
          mutation.addedNodes.forEach((node) => {
            // Make sure we're dealing with an Element node before accessing Element-specific properties
            if (node.nodeType === Node.ELEMENT_NODE) {
              // TypeScript needs us to cast to Element to access tagName
              const element = node as Element;
              if (element.tagName === 'PRE' || 
                  element.tagName === 'CODE' || 
                  element.querySelector('pre, code')) {
                shouldHighlight = true;
              }
            }
          });
        }
      });
      
      if (shouldHighlight) {
        highlightCode();
      }
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }); // No dependency array means this runs on every render

  return null; // This component doesn't render anything
}
