import React from 'react';
import { vi, expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

// This explicitly adds the accessibility matchers to Vitest
expect.extend(matchers);

// Mock GSAP and ScrollTrigger
vi.mock('gsap', () => {
  const mockGsap = {
    registerPlugin: vi.fn(),
    to: vi.fn(),
    from: vi.fn(),
    fromTo: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn(),
      from: vi.fn(),
      fromTo: vi.fn(),
      add: vi.fn(),
    })),
  };

  return {
    gsap: mockGsap,
    default: mockGsap,
  };
});

// Create a mock for ScrollTrigger before other imports can use it
const mockScrollTrigger = {
  create: vi.fn(() => ({
    kill: vi.fn(),
    progress: 0,
  })),
  refresh: vi.fn(),
  update: vi.fn(),
  getAll: vi.fn(() => []),
  killAll: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

vi.mock('gsap/ScrollTrigger', () => {
  return {
    ScrollTrigger: mockScrollTrigger,
  };
});

// Mock the useTranslations hook to return a simple text value with rich formatting support
vi.mock('next-intl', () => ({
  useTranslations: () => {
    // Create a translator function with rich text support
    const translator = (key: string) => "Text";

    // Add rich method to support rich text formatting with components
    translator.rich = (key: string, options?: Record<string, any>) => {
      if (options) {
        return "Text";
      }
      return "Text";
    };

    return translator;
  },
  // Add other exports that might be used in your app
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

type SwiperProps = {
  children: React.ReactNode
}

vi.mock("swiper/react", () => ({
  Swiper: React.forwardRef<HTMLDivElement, SwiperProps>(({ children }, ref) => {
    // Create a mock swiper object with an init method
    const mockSwiper = {
      init: () => vi.fn(),
      update: () => vi.fn(),
      slideNext: () => vi.fn(),
      slidePrev: () => vi.fn(),
    }

    // Use a callback ref to assign the mock swiper object to the ref
    React.useEffect(() => {
      if (ref && typeof ref !== "function") {
        ; (ref as React.MutableRefObject<any>).current = { swiper: mockSwiper }
      }
    }, [ref])

    return <div data-testid="Swiper">{children}</div>
  }),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="SwiperSlide">{children}</div>
  ),
}))

class IntersectionObserverMock implements IntersectionObserver {
  root: Element | Document | null = null;
  rootMargin: string = '0px';
  thresholds: ReadonlyArray<number> = [0];

  disconnect = vi.fn()
  observe = vi.fn(() => {
    // When observe is called, trigger the callback with a mock entry
    if (typeof this.callback === 'function') {
      // Create a DOMRect
      const rect = {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        x: 0,
        y: 0,
        toJSON: () => { }
      } as DOMRectReadOnly;

      const mockEntry = {
        isIntersecting: true,
        boundingClientRect: rect,
        intersectionRatio: 1,
        intersectionRect: rect,
        rootBounds: null,
        target: document.createElement('div'),
        time: Date.now(),
      } as IntersectionObserverEntry;

      this.callback([mockEntry], this as unknown as IntersectionObserver);
    }
  })
  unobserve = vi.fn()
  takeRecords = vi.fn()
  callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock)

// Mock fetch API to handle network requests
global.fetch = vi.fn().mockImplementation((url) => {
  // Mock response for LTS version API
  if (url === '/api/latest-lts' || url.toString().includes('/api/latest-lts')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ version: '17.0.8+7' }),
    });
  }

  // Mock response for download stats API
  if (url === 'https://api.adoptium.net/v3/stats/downloads/total' ||
    url.toString().includes('api.adoptium.net/v3/stats/downloads/total')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        total_downloads: {
          total: 1234567890
        }
      }),
    });
  }

  // Default mock response
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  });
});

/**
 * fix: `matchMedia` not present, legacy browsers require a polyfill
 */
global.matchMedia =
  global.matchMedia ||
  function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      // Legacy API
      addListener: function () { },
      removeListener: function () { },
      // Modern API used by MUI v6
      addEventListener: function () { },
      removeEventListener: function () { },
      dispatchEvent: function () {
        return false;
      },
    };
  }

/**
 * Mock localStorage
 */
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => {
      return store[key] || null;
    },
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

/**
 * Mock canvas getContext for accessibility tests
 * This prevents the "Not implemented: HTMLCanvasElement.prototype.getContext" error
 */
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({
      data: new Array(4),
    })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => []),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
  }));
}

/**
 * Mock for react-slick to avoid "window is not defined" errors in tests
 */
vi.mock('react-slick', () => {
  const Slider = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <div data-testid="react-slick-mock" className={className || ''}>{children}</div>
  };

  Slider.defaultProps = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return {
    __esModule: true,
    default: Slider
  };
});

// Mock slick-carousel CSS imports that might be required by components
vi.mock('slick-carousel/slick/slick.css', () => ({}));
vi.mock('slick-carousel/slick/slick-theme.css', () => ({}));

// Export everything from testing-library/react
export * from '@testing-library/react';
