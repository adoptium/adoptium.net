import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock next-intl functions
const mockDefineRouting = vi.fn();
const mockCreateNavigation = vi.fn();

vi.mock('next-intl/routing', () => ({
  defineRouting: mockDefineRouting,
}));

vi.mock('next-intl/navigation', () => ({
  createNavigation: mockCreateNavigation,
}));

describe('i18n/routing', () => {
  beforeAll(() => {
    // Set up mock return values
    mockDefineRouting.mockReturnValue({
      locales: ["en", "en-GB", "de", "es", "fr", "pt-BR", "zh-CN"],
      defaultLocale: "en",
      localePrefix: "as-needed",
    });
    
    mockCreateNavigation.mockReturnValue({
      Link: 'MockedLink',
      redirect: vi.fn(),
      usePathname: vi.fn(),
      useRouter: vi.fn(),
    });
  });

  it('should call defineRouting with correct configuration', async () => {
    await import('../routing');
    
    expect(mockDefineRouting).toHaveBeenCalledWith({
      locales: ["en", "en-GB", "de", "es", "fr", "pt-BR", "zh-CN"],
      defaultLocale: "en",
      localePrefix: "as-needed",
    });
  });

  it('should export routing configuration', async () => {
    const { routing } = await import('../routing');
    
    expect(routing).toBeDefined();
    expect(routing.locales).toContain("en");
    expect(routing.locales).toContain("en-GB");
    expect(routing.locales).toContain("de");
    expect(routing.locales).toContain("es");
    expect(routing.locales).toContain("fr");
    expect(routing.locales).toContain("pt-BR");
    expect(routing.locales).toContain("zh-CN");
    expect(routing.defaultLocale).toBe("en");
    expect(routing.localePrefix).toBe("as-needed");
  });

  it('should call createNavigation with routing config', async () => {
    const routingModule = await import('../routing');
    
    expect(mockCreateNavigation).toHaveBeenCalledWith(routingModule.routing);
  });

  it('should export navigation functions', async () => {
    const { Link, redirect, usePathname, useRouter } = await import('../routing');
    
    expect(Link).toBeDefined();
    expect(redirect).toBeDefined();
    expect(usePathname).toBeDefined();
    expect(useRouter).toBeDefined();
  });

  it('should include all expected locales', async () => {
    const { routing } = await import('../routing');
    
    const expectedLocales = ["en", "en-GB", "de", "es", "fr", "pt-BR", "zh-CN"];
    expect(routing.locales).toEqual(expectedLocales);
    expect(routing.locales).toHaveLength(7);
  });
});
