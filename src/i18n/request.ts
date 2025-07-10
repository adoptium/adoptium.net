import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (
    !locale ||
    !routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    locale = routing.defaultLocale;
  }

  // Load default English messages for fallback
  const defaultMessages = (await import('../../locales/en.json')).default;
  
  // If the locale is English, just return those messages
  if (locale === routing.defaultLocale) {
    return {
      locale,
      messages: defaultMessages,
    };
  }
  
  try {
    // Load the locale-specific messages
    const localeMessages = (await import(`../../locales/${locale}.json`)).default;
    
    // Merge with the default messages, with locale-specific messages taking precedence
    return {
      locale,
      messages: deepMerge(defaultMessages, localeMessages),
    };
  } catch {
    console.warn(`Could not load messages for locale ${locale}, falling back to default locale.`);
    return {
      locale,
      messages: defaultMessages,
    };
  }
});

// Type definitions for locale messages
interface LocaleMessages {
  [key: string]: LocaleMessages | string;
}

// Helper function to deeply merge objects for locales
function deepMerge(target: LocaleMessages, source: LocaleMessages): LocaleMessages {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key] as LocaleMessages, source[key] as LocaleMessages);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

function isObject(item: unknown): boolean {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}
