"use client";

import { RefObject, useEffect, useState } from "react";

/**
 * Reusable hook detecting whether passed ref is visible on screen.
 * In case observeOnce=true - stops observing after first intersection.
 * @param ref
 * @param observeOnce
 */
export function useOnScreen(
  ref: RefObject<Element>,
  observeOnce: boolean
): boolean {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);

      if (observeOnce && entry.isIntersecting) {
        observer.disconnect();
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [observeOnce, ref]);

  return isIntersecting;
}
