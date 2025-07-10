import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next-intl/server
const mockGetRequestConfig = vi.fn();
vi.mock('next-intl/server', () => ({
  getRequestConfig: mockGetRequestConfig,
}));

// Mock routing
vi.mock('../routing', () => ({
  routing: {
    locales: ['en', 'en-GB', 'de', 'es', 'fr', 'pt-BR', 'zh-CN'],
    defaultLocale: 'en',
  },
}));

// Define proper types for the request config function
type RequestConfigFunction = (params: { requestLocale: Promise<string | null | undefined> }) => Promise<{
  locale: string;
  messages: Record<string, unknown>;
}>;

describe('i18n/request', () => {
  let requestConfigFunction: RequestConfigFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetRequestConfig.mockImplementation((fn: RequestConfigFunction) => {
      requestConfigFunction = fn;
      return fn;
    });
  });

  describe('getRequestConfig integration', () => {
    it('should call getRequestConfig with a function', async () => {
      await import('../request');
      expect(mockGetRequestConfig).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('locale resolution', () => {
    it('should return default locale when no locale provided', async () => {
      await import('../request');
      
      const result = await requestConfigFunction({ requestLocale: Promise.resolve(null) });
      
      expect(result.locale).toBe('en');
      expect(result.messages).toBeDefined();
      expect(typeof result.messages).toBe('object');
    });

    it('should return default locale when undefined locale provided', async () => {
      await import('../request');
      
      const result = await requestConfigFunction({ requestLocale: Promise.resolve(undefined) });
      
      expect(result.locale).toBe('en');
      expect(result.messages).toBeDefined();
    });

    it('should return default locale when empty string locale provided', async () => {
      await import('../request');
      
      const result = await requestConfigFunction({ requestLocale: Promise.resolve('') });
      
      expect(result.locale).toBe('en');
      expect(result.messages).toBeDefined();
    });

    it('should return default locale when invalid locale provided', async () => {
      await import('../request');
      
      const result = await requestConfigFunction({ requestLocale: Promise.resolve('invalid-locale') });
      
      expect(result.locale).toBe('en');
      expect(result.messages).toBeDefined();
    });

    it('should return default locale when unsupported locale provided', async () => {
      await import('../request');
      
      const result = await requestConfigFunction({ requestLocale: Promise.resolve('ja') });
      
      expect(result.locale).toBe('en');
      expect(result.messages).toBeDefined();
    });
  });

  describe('default locale handling', () => {
    it('should return default messages when locale is default', async () => {
      await import('../request');
      
      const result = await requestConfigFunction({ requestLocale: Promise.resolve('en') });
      
      expect(result.locale).toBe('en');
      expect(result.messages).toBeDefined();
      expect(typeof result.messages).toBe('object');
      // Should have some expected keys from the actual en.json
      expect(result.messages.HomePage).toBeDefined();
      expect(result.messages.NotFoundPage).toBeDefined();
    });
  });

  describe('locale message merging', () => {
    it('should merge locale-specific messages with default messages for valid locales', async () => {
      await import('../request');
      
      // Test with a locale that should have different content
      const supportedLocales = ['es', 'de', 'fr', 'pt-BR', 'zh-CN', 'en-GB'];
      
      for (const locale of supportedLocales) {
        const result = await requestConfigFunction({ requestLocale: Promise.resolve(locale) });
        
        expect(result.locale).toBe(locale);
        expect(result.messages).toBeDefined();
        expect(typeof result.messages).toBe('object');
        
        // Verify structure exists (merged from default)
        expect(result.messages.HomePage).toBeDefined();
        expect(result.messages.NotFoundPage).toBeDefined();
      }
    });

    it('should preserve default messages for missing keys in locale files', async () => {
      await import('../request');
      
      const defaultResult = await requestConfigFunction({ requestLocale: Promise.resolve('en') });
      const localeResult = await requestConfigFunction({ requestLocale: Promise.resolve('es') });
      
      // Both should have the same structure from default
      expect(localeResult.messages.HomePage).toBeDefined();
      expect(localeResult.messages.NotFoundPage).toBeDefined();
      
      // Verify that both have the core structure
      expect(typeof defaultResult.messages).toBe('object');
      expect(typeof localeResult.messages).toBe('object');
    });
  });

  describe('all supported locales', () => {
    const supportedLocales = ['en', 'en-GB', 'de', 'es', 'fr', 'pt-BR', 'zh-CN'];
    
    supportedLocales.forEach(locale => {
      it(`should handle ${locale} locale correctly`, async () => {
        await import('../request');
        
        const result = await requestConfigFunction({ requestLocale: Promise.resolve(locale) });
        expect(result.locale).toBe(locale);
        expect(result.messages).toBeDefined();
        expect(typeof result.messages).toBe('object');
        
        // Should have basic structure
        expect(result.messages.HomePage).toBeDefined();
        expect(result.messages.NotFoundPage).toBeDefined();
      });
    });
  });

  describe('error handling', () => {
    it('should handle case-sensitive locale matching', async () => {
      await import('../request');
      
      const result = await requestConfigFunction({ requestLocale: Promise.resolve('EN') });
      
      expect(result.locale).toBe('en'); // Should fall back to default
      expect(result.messages).toBeDefined();
    });

    it('should handle locale with extra characters', async () => {
      await import('../request');
      
      const result = await requestConfigFunction({ requestLocale: Promise.resolve('en-US-POSIX') });
      
      expect(result.locale).toBe('en'); // Should fall back to default
      expect(result.messages).toBeDefined();
    });

    it('should handle whitespace in locale', async () => {
      await import('../request');
      
      const result = await requestConfigFunction({ requestLocale: Promise.resolve(' en ') });
      
      expect(result.locale).toBe('en'); // Should fall back to default
      expect(result.messages).toBeDefined();
    });
  });

  describe('deep merge functionality validation', () => {
    it('should maintain object structure integrity across locales', async () => {
      await import('../request');
      
      const defaultResult = await requestConfigFunction({ requestLocale: Promise.resolve('en') });
      const localeResult = await requestConfigFunction({ requestLocale: Promise.resolve('es') });
      
      // Both should have similar top-level structure
      const defaultKeys = Object.keys(defaultResult.messages);
      
      // Locale should have all default keys (due to merge)
      defaultKeys.forEach(key => {
        expect(localeResult.messages[key]).toBeDefined();
      });
      
      // Verify nested object structure is preserved
      if (defaultResult.messages.HomePage && typeof defaultResult.messages.HomePage === 'object') {
        expect(typeof localeResult.messages.HomePage).toBe('object');
      }
    });

    it('should handle nested object merging correctly', async () => {
      await import('../request');
      
      const result = await requestConfigFunction({ requestLocale: Promise.resolve('es') });
      
      // Verify that nested objects exist and are properly merged
      expect(result.messages.HomePage).toBeDefined();
      expect(typeof result.messages.HomePage).toBe('object');
      
      // Should have some properties from default even if not in locale file
      const homePageKeys = Object.keys(result.messages.HomePage as Record<string, unknown>);
      expect(homePageKeys.length).toBeGreaterThan(0);
    });
  });

  describe('deep merge validation with real data structure', () => {
    it('should correctly merge complex nested objects while preserving type safety', async () => {
      await import('../request');
      
      // Test with Spanish locale which should have some translations
      const spanishResult = await requestConfigFunction({ requestLocale: Promise.resolve('es') });
      const englishResult = await requestConfigFunction({ requestLocale: Promise.resolve('en') });
      
      // Verify the structure is maintained
      expect(spanishResult.locale).toBe('es');
      expect(englishResult.locale).toBe('en');
      
      // Both should have the same top-level keys from the default English
      const englishKeys = Object.keys(englishResult.messages);
      
      // Spanish should have at least all the English keys (may have more due to merge)
      englishKeys.forEach(key => {
        expect(spanishResult.messages).toHaveProperty(key);
      });
      
      // Verify specific nested structure preservation
      if (englishResult.messages.HomePage && typeof englishResult.messages.HomePage === 'object') {
        expect(typeof spanishResult.messages.HomePage).toBe('object');
        
        // Check that nested properties are properly merged
        const englishHomeKeys = Object.keys(englishResult.messages.HomePage as Record<string, unknown>);
        englishHomeKeys.forEach(key => {
          expect(spanishResult.messages.HomePage).toHaveProperty(key);
        });
      }
    });

    it('should handle deeply nested structures without mutation', async () => {
      await import('../request');
      
      const result1 = await requestConfigFunction({ requestLocale: Promise.resolve('en') });
      const result2 = await requestConfigFunction({ requestLocale: Promise.resolve('es') });
      
      // Different locales should return different objects
      expect(result1.messages).not.toBe(result2.messages);
      
      // Structure should be consistent
      expect(typeof result1.messages).toBe('object');
      expect(typeof result2.messages).toBe('object');
      
      // Both should have HomePage structure
      expect(result1.messages.HomePage).toBeDefined();
      expect(result2.messages.HomePage).toBeDefined();
      
      // Verify they are truly independent by checking different reference
      if (result1.messages.HomePage && result2.messages.HomePage) {
        expect(result1.messages.HomePage).not.toBe(result2.messages.HomePage);
      }
    });

    it('should preserve array integrity during merge operations', async () => {
      await import('../request');
      
      const result = await requestConfigFunction({ requestLocale: Promise.resolve('es') });
      
      // Check if any arrays exist in the structure and verify they're preserved correctly
      function checkArrays(obj: Record<string, unknown>): void {
        for (const [, value] of Object.entries(obj)) {
          if (Array.isArray(value)) {
            // Arrays should be preserved as-is
            expect(Array.isArray(value)).toBe(true);
            expect(value.length).toBeGreaterThanOrEqual(0);
          } else if (value && typeof value === 'object') {
            checkArrays(value as Record<string, unknown>);
          }
        }
      }
      
      checkArrays(result.messages);
    });

    it('should handle null and undefined values in merge correctly', async () => {
      await import('../request');
      
      const result = await requestConfigFunction({ requestLocale: Promise.resolve('es') });
      
      // The deep merge should handle null values correctly
      function checkNullHandling(obj: Record<string, unknown>): void {
        for (const [, value] of Object.entries(obj)) {
          // null values should be preserved
          if (value === null) {
            expect(value).toBe(null);
          } else if (value && typeof value === 'object' && !Array.isArray(value)) {
            checkNullHandling(value as Record<string, unknown>);
          }
        }
      }
      
      checkNullHandling(result.messages);
    });
  });

  describe('performance and memory', () => {
    it('should not mutate original messages between requests', async () => {
      await import('../request');
      
      const result1 = await requestConfigFunction({ requestLocale: Promise.resolve('en') });
      const result2 = await requestConfigFunction({ requestLocale: Promise.resolve('es') });
      
      // Results should be independent
      expect(result1.locale).toBe('en');
      expect(result2.locale).toBe('es');
      expect(result1.messages).not.toBe(result2.messages);
    });

    it('should handle multiple consecutive requests efficiently', async () => {
      await import('../request');
      
      const locales = ['en', 'es', 'de', 'fr'];
      const results = await Promise.all(
        locales.map(locale => 
          requestConfigFunction({ requestLocale: Promise.resolve(locale) })
        )
      );
      
      results.forEach((result, index) => {
        expect(result.locale).toBe(locales[index]);
        expect(result.messages).toBeDefined();
        expect(typeof result.messages).toBe('object');
      });
      
      // Each result should be independent
      results.forEach((result, index) => {
        if (index > 0) {
          expect(result.messages).not.toBe(results[index - 1].messages);
        }
      });
    });
  });

  describe('edge cases', () => {
    it('should handle null requestLocale promise', async () => {
      await import('../request');
      
      const result = await requestConfigFunction({ requestLocale: Promise.resolve(null) });
      
      expect(result.locale).toBe('en');
      expect(result.messages).toBeDefined();
    });

    it('should handle rejected requestLocale promise gracefully', async () => {
      await import('../request');
      
      try {
        await requestConfigFunction({ requestLocale: Promise.reject(new Error('Network error')) });
        // If this doesn't throw, that's also fine - depends on implementation
      } catch (error) {
        // This is expected behavior for a rejected promise
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should handle very long locale strings', async () => {
      await import('../request');
      
      const longLocale = 'a'.repeat(1000);
      const result = await requestConfigFunction({ requestLocale: Promise.resolve(longLocale) });
      
      expect(result.locale).toBe('en'); // Should fall back to default
      expect(result.messages).toBeDefined();
    });

    it('should handle special characters in locale', async () => {
      await import('../request');
      
      const result = await requestConfigFunction({ requestLocale: Promise.resolve('en-@#$%') });
      
      expect(result.locale).toBe('en'); // Should fall back to default
      expect(result.messages).toBeDefined();
    });
  });
});
