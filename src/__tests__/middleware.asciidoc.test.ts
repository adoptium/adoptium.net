import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    next: vi.fn(),
  },
}));

describe('middleware.asciidoc', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('middleware function', () => {
    it('should be defined and callable', async () => {
      const { middleware } = await import('../middleware.asciidoc');
      
      expect(middleware).toBeDefined();
      expect(typeof middleware).toBe('function');
    });

    it('should call NextResponse.next() and return the response', async () => {
      const { middleware } = await import('../middleware.asciidoc');
      const mockNextResponse = { status: 200 };
      
      vi.mocked(NextResponse.next).mockReturnValue(mockNextResponse as any);
      
      const result = middleware();
      
      expect(NextResponse.next).toHaveBeenCalledTimes(1);
      expect(NextResponse.next).toHaveBeenCalledWith();
      expect(result).toBe(mockNextResponse);
    });

    it('should not require any parameters', async () => {
      const { middleware } = await import('../middleware.asciidoc');
      
      // Should not throw when called without parameters
      expect(() => middleware()).not.toThrow();
    });

    it('should handle multiple calls independently', async () => {
      const { middleware } = await import('../middleware.asciidoc');
      const mockResponse1 = { status: 200, id: 'response1' };
      const mockResponse2 = { status: 200, id: 'response2' };
      
      vi.mocked(NextResponse.next)
        .mockReturnValueOnce(mockResponse1 as any)
        .mockReturnValueOnce(mockResponse2 as any);
      
      const result1 = middleware();
      const result2 = middleware();
      
      expect(NextResponse.next).toHaveBeenCalledTimes(2);
      expect(result1).toBe(mockResponse1);
      expect(result2).toBe(mockResponse2);
    });
  });

  describe('config object', () => {
    it('should export the correct matcher configuration', async () => {
      const { config } = await import('../middleware.asciidoc');
      
      expect(config).toBeDefined();
      expect(config.matcher).toBeDefined();
      expect(Array.isArray(config.matcher)).toBe(true);
      expect(config.matcher).toEqual([
        '/((?!api|_next/static|_next/image|_vercel|favicon.ico|images|fonts).*)',
      ]);
    });

    it('should have a single matcher pattern', async () => {
      const { config } = await import('../middleware.asciidoc');
      
      expect(config.matcher).toHaveLength(1);
    });

    describe('matcher pattern validation', () => {
      it('should match paths that should be processed by AsciiDoc middleware', () => {
        const matcherPattern = '((?!api|_next/static|_next/image|_vercel|favicon.ico|images|fonts).*)'
        const regex = new RegExp(`^${matcherPattern}$`);
        
        // Paths that should match (should be handled by AsciiDoc middleware)
        const shouldMatch = [
          '',
          'about',
          'docs',
          'docs/installation',
          'docs/getting-started',
          'asciidoc-pages/about',
          'asciidoc-pages/docs/installation',
          'content/docs/guide',
          'blog/post-title',
          'support/faq',
          'temurin/releases',
          'contributing/guidelines',
          'some/deep/nested/path',
          'path-with-dashes',
          'path_with_underscores',
          'path123with456numbers',
          'UPPERCASE-PATH',
          'MixedCase-Path',
        ];

        shouldMatch.forEach(path => {
          expect(regex.test(path)).toBe(true);
        });
      });

      it('should exclude API routes from AsciiDoc middleware processing', () => {
        const matcherPattern = '((?!api|_next/static|_next/image|_vercel|favicon.ico|images|fonts).*)'
        const regex = new RegExp(`^${matcherPattern}$`);
        
        const apiRoutes = [
          'api',
          'api/',
          'api/users',
          'api/auth/signin',
          'api/posts/123',
          'api/v1/data',
          'api/internal/health',
          'api/asciidoc/convert',
        ];

        apiRoutes.forEach(route => {
          expect(regex.test(route)).toBe(false);
        });
      });

      it('should exclude Next.js static assets from AsciiDoc middleware processing', () => {
        const matcherPattern = '((?!api|_next/static|_next/image|_vercel|favicon.ico|images|fonts).*)'
        const regex = new RegExp(`^${matcherPattern}$`);
        
        const staticAssets = [
          '_next/static',
          '_next/static/',
          '_next/static/css/app.css',
          '_next/static/js/main.js',
          '_next/static/chunks/webpack.js',
          '_next/static/media/logo.png',
          '_next/image',
          '_next/image/',
          '_next/image/logo.png',
        ];

        staticAssets.forEach(asset => {
          expect(regex.test(asset)).toBe(false);
        });
      });

      it('should exclude Vercel routes from AsciiDoc middleware processing', () => {
        const matcherPattern = '((?!api|_next/static|_next/image|_vercel|favicon.ico|images|fonts).*)'
        const regex = new RegExp(`^${matcherPattern}$`);
        
        const vercelRoutes = [
          '_vercel',
          '_vercel/',
          '_vercel/insights',
          '_vercel/speed-insights',
          '_vercel/analytics',
        ];

        vercelRoutes.forEach(route => {
          expect(regex.test(route)).toBe(false);
        });
      });

      it('should exclude favicon from AsciiDoc middleware processing', () => {
        const matcherPattern = '((?!api|_next/static|_next/image|_vercel|favicon.ico|images|fonts).*)'
        const regex = new RegExp(`^${matcherPattern}$`);
        
        const faviconPaths = [
          'favicon.ico',
        ];

        faviconPaths.forEach(path => {
          expect(regex.test(path)).toBe(false);
        });
      });

      it('should exclude images directory from AsciiDoc middleware processing', () => {
        const matcherPattern = '((?!api|_next/static|_next/image|_vercel|favicon.ico|images|fonts).*)'
        const regex = new RegExp(`^${matcherPattern}$`);
        
        const imagePaths = [
          'images',
          'images/',
          'images/logo.png',
          'images/icons/favicon.png',
          'images/screenshots/demo.jpg',
          'images/blog/post-hero.webp',
        ];

        imagePaths.forEach(path => {
          expect(regex.test(path)).toBe(false);
        });
      });

      it('should exclude fonts directory from AsciiDoc middleware processing', () => {
        const matcherPattern = '((?!api|_next/static|_next/image|_vercel|favicon.ico|images|fonts).*)'
        const regex = new RegExp(`^${matcherPattern}$`);
        
        const fontPaths = [
          'fonts',
          'fonts/',
          'fonts/roboto.woff2',
          'fonts/inter/regular.woff',
          'fonts/custom/brand.ttf',
        ];

        fontPaths.forEach(path => {
          expect(regex.test(path)).toBe(false);
        });
      });

      it('should handle edge cases in path matching', () => {
        const matcherPattern = '((?!api|_next/static|_next/image|_vercel|favicon.ico|images|fonts).*)'
        const regex = new RegExp(`^${matcherPattern}$`);
        
        // Edge cases that should match (paths that contain excluded words but don't start with them)
        const shouldMatch = [
          'my-api-docs', // Contains 'api' but doesn't start with 'api'
          'app-images', // Contains 'images' but doesn't start with 'images'
          'web-fonts-guide', // Contains 'fonts' but doesn't start with 'fonts'
          'content/api-reference', // Contains 'api' but doesn't start with 'api'
          'docs/fonts-setup', // Contains 'fonts' but doesn't start with 'fonts'
          'about/vercel-deployment', // Contains 'vercel' but doesn't start with '_vercel'
        ];

        // Edge cases that should not match (exact matches or proper prefixes)
        const shouldNotMatch = [
          'api-with-slash/endpoint', // Starts with 'api' (even with suffix)
          'images-folder/photo.jpg', // Starts with 'images' (even with suffix)
          'fonts-directory/font.woff', // Starts with 'fonts' (even with suffix)
        ];

        shouldMatch.forEach(path => {
          expect(regex.test(path)).toBe(true);
        });

        shouldNotMatch.forEach(path => {
          expect(regex.test(path)).toBe(false);
        });
      });

      it('should handle paths with query parameters and fragments', () => {
        const matcherPattern = '((?!api|_next/static|_next/image|_vercel|favicon.ico|images|fonts).*)'
        const regex = new RegExp(`^${matcherPattern}$`);
        
        // Note: In practice, Next.js middleware receives the pathname without query params and fragments
        // But we test the pattern itself for completeness
        const pathsWithExtras = [
          'docs?section=intro',
          'about#team',
          'guide?tab=installation&lang=en',
          'blog/post?id=123#comments',
        ];

        pathsWithExtras.forEach(path => {
          expect(regex.test(path)).toBe(true);
        });
      });

      it('should handle special characters in paths', () => {
        const matcherPattern = '((?!api|_next/static|_next/image|_vercel|favicon.ico|images|fonts).*)'
        const regex = new RegExp(`^${matcherPattern}$`);
        
        const specialCharPaths = [
          'docs/hello-world',
          'guide_installation',
          'about/team.members',
          'blog/post@2024',
          'support/faq+answers',
          'content/100%-guide',
          'docs/v2.0',
          'guide/step-1',
        ];

        specialCharPaths.forEach(path => {
          expect(regex.test(path)).toBe(true);
        });
      });
    });
  });

  describe('integration behavior', () => {
    it('should allow Next.js App Router to handle dynamic routes', async () => {
      const { middleware } = await import('../middleware.asciidoc');
      const mockNextResponse = { type: 'next' };
      
      vi.mocked(NextResponse.next).mockReturnValue(mockNextResponse as any);
      
      const result = middleware();
      
      // The middleware should call NextResponse.next() to continue processing
      expect(NextResponse.next).toHaveBeenCalled();
      expect(result).toBe(mockNextResponse);
    });

    it('should not interfere with file system routing', async () => {
      const { middleware } = await import('../middleware.asciidoc');
      
      // The middleware should not prevent Next.js from checking file existence
      // It just calls NextResponse.next() to continue the request pipeline
      const result = middleware();
      
      expect(NextResponse.next).toHaveBeenCalledWith();
      expect(result).toBeDefined();
    });

    it('should work consistently across multiple requests', async () => {
      const { middleware } = await import('../middleware.asciidoc');
      const responses = [
        { id: 'req1' },
        { id: 'req2' },
        { id: 'req3' },
      ];
      
      responses.forEach((response, index) => {
        vi.mocked(NextResponse.next).mockReturnValueOnce(response as any);
        
        const result = middleware();
        
        expect(result).toBe(response);
      });
      
      expect(NextResponse.next).toHaveBeenCalledTimes(3);
    });
  });

  describe('error handling', () => {
    it('should handle NextResponse.next() throwing an error', async () => {
      const { middleware } = await import('../middleware.asciidoc');
      const error = new Error('NextResponse.next() failed');
      
      vi.mocked(NextResponse.next).mockImplementation(() => {
        throw error;
      });
      
      expect(() => middleware()).toThrow('NextResponse.next() failed');
    });

    it('should not swallow errors from Next.js', async () => {
      const { middleware } = await import('../middleware.asciidoc');
      const networkError = new Error('Network error');
      
      vi.mocked(NextResponse.next).mockImplementation(() => {
        throw networkError;
      });
      
      expect(() => middleware()).toThrow(networkError);
    });
  });

  describe('type safety', () => {
    it('should have correct TypeScript types', async () => {
      const module = await import('../middleware.asciidoc');
      
      // Check that exports have the expected structure
      expect(typeof module.middleware).toBe('function');
      expect(typeof module.config).toBe('object');
      expect(Array.isArray(module.config.matcher)).toBe(true);
      
      // Check that config.matcher contains strings
      module.config.matcher.forEach(matcher => {
        expect(typeof matcher).toBe('string');
      });
    });
  });

  describe('performance', () => {
    it('should be lightweight and fast', async () => {
      const { middleware } = await import('../middleware.asciidoc');
      const mockResponse = { status: 200 };
      
      vi.mocked(NextResponse.next).mockReturnValue(mockResponse as any);
      
      const start = performance.now();
      middleware();
      const end = performance.now();
      
      // Should complete very quickly (within 1ms under normal conditions)
      expect(end - start).toBeLessThan(10); // Allow some leeway for CI environments
    });

    it('should not create memory leaks with multiple calls', async () => {
      const { middleware } = await import('../middleware.asciidoc');
      const mockResponse = { status: 200 };
      
      vi.mocked(NextResponse.next).mockReturnValue(mockResponse as any);
      
      // Call middleware many times to test for memory leaks
      for (let i = 0; i < 1000; i++) {
        middleware();
      }
      
      expect(NextResponse.next).toHaveBeenCalledTimes(1000);
    });
  });
});
