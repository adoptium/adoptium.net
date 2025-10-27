import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock next-intl/middleware
const mockCreateProxy = vi.fn();
const mockIntlProxy = vi.fn();

vi.mock("next-intl/middleware", () => ({
  default: mockCreateProxy,
}));

// Mock the routing config      expect(config.matcher).toBe("/((?!api|trpc|_next|_vercel|.*\\..*).*)/");ration
vi.mock("../i18n/routing", () => ({
  routing: {
    locales: ["en", "en-GB", "de", "es", "fr", "pt-BR", "zh-CN"],
    defaultLocale: "en",
    pathnames: {
      "/": "/",
      "/about": "/about",
    },
  },
}));

describe("proxy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateProxy.mockReturnValue(mockIntlProxy);
  });

  describe("proxy setup", () => {
    it("should create intl proxy with correct configuration and enable automatic locale detection", async () => {
      await import("../proxy");

      expect(mockCreateProxy).toHaveBeenCalledWith({
        locales: ["en", "en-GB", "de", "es", "fr", "pt-BR", "zh-CN"],
        defaultLocale: "en",
        pathnames: {
          "/": "/",
          "/about": "/about",
        },
        localeDetection: true,
      });

      // Verify that automatic locale detection is enabled
      const callArgs = mockCreateProxy.mock.calls[0][0];
      expect(callArgs.localeDetection).toBe(true);
    });
  });

  describe("proxy function", () => {
    it("should call intl proxy with the request", async () => {
      const { default: proxy } = await import("../proxy");

      const mockRequest = new NextRequest("https://example.com/test");
      const mockResponse = new Response();
      mockIntlProxy.mockResolvedValue(mockResponse);

      const result = await proxy(mockRequest);

      expect(mockIntlProxy).toHaveBeenCalledWith(mockRequest);
      expect(result).toBe(mockResponse);
    });

    it("should handle requests for different paths", async () => {
      const { default: proxy } = await import("../proxy");

      const paths = [
        "https://example.com/",
        "https://example.com/about",
        "https://example.com/en/about",
        "https://example.com/es/about",
        "https://example.com/some/nested/path",
      ];

      for (const path of paths) {
        const mockRequest = new NextRequest(path);
        const mockResponse = new Response();
        mockIntlProxy.mockResolvedValue(mockResponse);

        const result = await proxy(mockRequest);

        expect(mockIntlProxy).toHaveBeenCalledWith(mockRequest);
        expect(result).toBe(mockResponse);
      }
    });

    it("should preserve request headers and method", async () => {
      const { default: proxy } = await import("../proxy");

      const mockRequest = new NextRequest("https://example.com/test", {
        method: "POST",
        headers: {
          "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
          "User-Agent": "Test User Agent",
          "X-Custom-Header": "custom-value",
        },
      });

      const mockResponse = new Response();
      mockIntlProxy.mockResolvedValue(mockResponse);

      await proxy(mockRequest);

      expect(mockIntlProxy).toHaveBeenCalledWith(mockRequest);

      // Verify the request passed to intl middleware has the same properties
      const passedRequest = mockIntlProxy.mock.calls[0][0];
      expect(passedRequest.method).toBe("POST");
      expect(passedRequest.headers.get("Accept-Language")).toBe(
        "es-ES,es;q=0.9,en;q=0.8"
      );
      expect(passedRequest.headers.get("User-Agent")).toBe("Test User Agent");
      expect(passedRequest.headers.get("X-Custom-Header")).toBe("custom-value");
    });

    it("should handle different HTTP methods", async () => {
      const { default: proxy } = await import("../proxy");

      const methods = [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "HEAD",
        "OPTIONS",
      ];

      for (const method of methods) {
        const mockRequest = new NextRequest("https://example.com/test", {
          method,
        });
        const mockResponse = new Response();
        mockIntlProxy.mockResolvedValue(mockResponse);

        const result = await proxy(mockRequest);

        expect(mockIntlProxy).toHaveBeenCalledWith(mockRequest);
        expect(result).toBe(mockResponse);
      }
    });
  });

  describe("error handling", () => {
    it("should handle intl middleware errors gracefully", async () => {
      const { default: proxy } = await import("../proxy");

      const mockRequest = new NextRequest("https://example.com/test");
      const error = new Error("Intl middleware error");
      mockIntlProxy.mockRejectedValue(error);

      await expect(proxy(mockRequest)).rejects.toThrow("Intl middleware error");
    });

    it("should handle malformed URLs", async () => {
      const { default: proxy } = await import("../proxy");

      // Create a request with a malformed URL-like string
      const mockRequest = new NextRequest(
        "https://example.com/test with spaces"
      );
      const mockResponse = new Response();
      mockIntlProxy.mockResolvedValue(mockResponse);

      const result = await proxy(mockRequest);

      expect(mockIntlProxy).toHaveBeenCalledWith(mockRequest);
      expect(result).toBe(mockResponse);
    });
  });

  describe("locale detection scenarios", () => {
    it("should handle requests with Accept-Language header", async () => {
      const { default: proxy } = await import("../proxy");

      const mockRequest = new NextRequest("https://example.com/test", {
        headers: {
          "Accept-Language": "de-DE,de;q=0.9,en;q=0.8",
        },
      });

      const mockResponse = new Response();
      mockIntlProxy.mockResolvedValue(mockResponse);

      await proxy(mockRequest);

      expect(mockIntlProxy).toHaveBeenCalledWith(mockRequest);

      // Verify Accept-Language header is preserved
      const passedRequest = mockIntlProxy.mock.calls[0][0];
      expect(passedRequest.headers.get("Accept-Language")).toBe(
        "de-DE,de;q=0.9,en;q=0.8"
      );
    });

    it("should handle requests without Accept-Language header", async () => {
      const { default: proxy } = await import("../proxy");

      const mockRequest = new NextRequest("https://example.com/test");
      const mockResponse = new Response();
      mockIntlProxy.mockResolvedValue(mockResponse);

      await proxy(mockRequest);

      expect(mockIntlProxy).toHaveBeenCalledWith(mockRequest);
    });

    it("should handle requests with multiple language preferences", async () => {
      const { default: proxy } = await import("../proxy");

      const mockRequest = new NextRequest("https://example.com/test", {
        headers: {
          "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6",
        },
      });

      const mockResponse = new Response();
      mockIntlProxy.mockResolvedValue(mockResponse);

      await proxy(mockRequest);

      expect(mockIntlProxy).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe("edge cases", () => {
    it("should handle requests with query parameters", async () => {
      const { default: proxy } = await import("../proxy");

      const mockRequest = new NextRequest(
        "https://example.com/test?param=value&other=123"
      );
      const mockResponse = new Response();
      mockIntlProxy.mockResolvedValue(mockResponse);

      const result = await proxy(mockRequest);

      expect(mockIntlProxy).toHaveBeenCalledWith(mockRequest);
      expect(result).toBe(mockResponse);
    });

    it("should handle requests with hash fragments", async () => {
      const { default: proxy } = await import("../proxy");

      const mockRequest = new NextRequest("https://example.com/test#section");
      const mockResponse = new Response();
      mockIntlProxy.mockResolvedValue(mockResponse);

      const result = await proxy(mockRequest);

      expect(mockIntlProxy).toHaveBeenCalledWith(mockRequest);
      expect(result).toBe(mockResponse);
    });

    it("should handle requests with special characters in path", async () => {
      const { default: proxy } = await import("../proxy");

      const mockRequest = new NextRequest(
        "https://example.com/test-path_with/special%20chars"
      );
      const mockResponse = new Response();
      mockIntlProxy.mockResolvedValue(mockResponse);

      const result = await proxy(mockRequest);

      expect(mockIntlProxy).toHaveBeenCalledWith(mockRequest);
      expect(result).toBe(mockResponse);
    });

    it("should handle requests to root path", async () => {
      const { default: proxy } = await import("../proxy");

      const mockRequest = new NextRequest("https://example.com/");
      const mockResponse = new Response();
      mockIntlProxy.mockResolvedValue(mockResponse);

      const result = await proxy(mockRequest);

      expect(mockIntlProxy).toHaveBeenCalledWith(mockRequest);
      expect(result).toBe(mockResponse);
    });
  });

  describe("performance considerations", () => {
    it("should handle multiple concurrent requests", async () => {
      const { default: proxy } = await import("../proxy");

      const requests = Array.from(
        { length: 10 },
        (_, i) => new NextRequest(`https://example.com/test-${i}`)
      );

      const responses = requests.map(() => new Response());
      mockIntlProxy.mockImplementation((req) => {
        const index = parseInt(req.url.split("-")[1]);
        return Promise.resolve(responses[index]);
      });

      const results = await Promise.all(
        requests.map((request) => proxy(request))
      );

      expect(mockIntlProxy).toHaveBeenCalledTimes(10);
      results.forEach((result, index) => {
        expect(result).toBe(responses[index]);
      });
    });

    it("should not cache responses inappropriately", async () => {
      const { default: proxy } = await import("../proxy");

      const mockRequest1 = new NextRequest("https://example.com/test1");
      const mockRequest2 = new NextRequest("https://example.com/test2");

      const mockResponse1 = new Response("Response 1");
      const mockResponse2 = new Response("Response 2");

      mockIntlProxy
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      const result1 = await proxy(mockRequest1);
      const result2 = await proxy(mockRequest2);

      expect(result1).toBe(mockResponse1);
      expect(result2).toBe(mockResponse2);
      expect(result1).not.toBe(result2);
    });
  });

  describe("config object", () => {
    it("should export the correct matcher configuration", async () => {
      const { config } = await import("../proxy");

      expect(config).toBeDefined();
      expect(config.matcher).toBe("/((?!api|trpc|_next|_vercel|.*\\..*).*)");
    });

    it("should match expected paths with the matcher regex", () => {
      // Next.js matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)"
      // This is a path pattern that matches paths NOT starting with the excluded patterns
      const matcherPattern = "((?!api|trpc|_next|_vercel|.*\\..*).*)";
      const regex = new RegExp(`^${matcherPattern}$`);

      // Paths that should match (should be handled by middleware)
      const shouldMatch = [
        "", // root after removing leading slash
        "about",
        "en/about",
        "es/products",
        "fr/contact",
        "some/deep/path",
        "dashboard/user/123",
        "blog/post-title",
        "search",
        "en-GB/documentation",
      ];

      // Paths that should NOT match (should be excluded from middleware)
      const shouldNotMatch = [
        "api/users",
        "api/auth/signin",
        "trpc/getUser",
        "_next/static/css/app.css",
        "_vercel/insights",
        "favicon.ico",
        "robots.txt",
        "sitemap.xml",
        "image.png",
        "style.css",
        "script.js",
        "manifest.json",
      ];

      shouldMatch.forEach((path) => {
        expect(regex.test(path)).toBe(true);
      });

      shouldNotMatch.forEach((path) => {
        expect(regex.test(path)).toBe(false);
      });
    });

    it("should exclude API routes from middleware processing", () => {
      const matcherPattern = "((?!api|trpc|_next|_vercel|.*\\..*).*)";
      const regex = new RegExp(`^${matcherPattern}$`);

      const apiRoutes = [
        "api",
        "api/",
        "api/users",
        "api/auth/signin",
        "api/posts/123",
        "api/v1/data",
        "api/internal/health",
      ];

      apiRoutes.forEach((route) => {
        expect(regex.test(route)).toBe(false);
      });
    });

    it("should exclude static files from middleware processing", () => {
      const matcherPattern = "((?!api|trpc|_next|_vercel|.*\\..*).*)";
      const regex = new RegExp(`^${matcherPattern}$`);

      const staticFiles = [
        "favicon.ico",
        "robots.txt",
        "sitemap.xml",
        "manifest.json",
        "logo.png",
        "styles.css",
        "script.js",
        "font.woff2",
        "image.jpg",
        "document.pdf",
        "data.json",
        "config.yaml",
      ];

      staticFiles.forEach((file) => {
        expect(regex.test(file)).toBe(false);
      });
    });

    it("should exclude Next.js internal routes from middleware processing", () => {
      const matcherPattern = "((?!api|trpc|_next|_vercel|.*\\..*).*)";
      const regex = new RegExp(`^${matcherPattern}$`);

      const nextRoutes = [
        "_next",
        "_next/",
        "_next/static/css/app.css",
        "_next/static/js/main.js",
        "_next/image",
        "_vercel",
        "_vercel/",
        "_vercel/insights",
        "_vercel/speed-insights",
      ];

      nextRoutes.forEach((route) => {
        expect(regex.test(route)).toBe(false);
      });
    });

    it("should exclude tRPC routes from middleware processing", () => {
      const matcherPattern = "((?!api|trpc|_next|_vercel|.*\\..*).*)";
      const regex = new RegExp(`^${matcherPattern}$`);

      const trpcRoutes = [
        "trpc",
        "trpc/",
        "trpc/getUser",
        "trpc/posts.getById",
        "trpc/auth.signin",
      ];

      trpcRoutes.forEach((route) => {
        expect(regex.test(route)).toBe(false);
      });
    });

    it("should handle edge cases in path matching", () => {
      const matcherPattern = "((?!api|trpc|_next|_vercel|.*\\..*).*)";
      const regex = new RegExp(`^${matcherPattern}$`);

      // Edge cases that should match (paths that don't start with excluded patterns and don't have dots)
      const shouldMatch = [
        "my-trpc-app", // Contains 'trpc' but doesn't start with 'trpc'
        "app_next", // Contains '_next' but doesn't start with '_next'
        "data-api/endpoint", // Contains 'api' but starts with 'data-api'
        "well-known/security", // Hidden directories should still match if no file extension in the path part that matters
        "about-apis", // Contains 'api' but doesn't start with 'api'
      ];

      // Edge cases that should not match
      const shouldNotMatch = [
        "file.with.multiple.dots.txt",
        "path/file.ext",
        ".env", // File with dot
        ".gitignore", // File with dot
        "apitest", // Starts with 'api' - should be excluded
        "api-docs", // Starts with 'api' - should be excluded
      ];

      shouldMatch.forEach((path) => {
        expect(regex.test(path)).toBe(true);
      });

      shouldNotMatch.forEach((path) => {
        expect(regex.test(path)).toBe(false);
      });
    });
  });
});
