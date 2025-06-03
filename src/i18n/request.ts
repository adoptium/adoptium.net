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

  // For en-GB, we'll merge the messages with en (default) messages as fallback
  if (locale === 'en-GB') {
    const defaultMessages = (await import('../../locales/en.json')).default;
    const gbMessages = (await import('../../locales/en-GB.json')).default;
    
    // Deep merge the messages, with en-GB overriding en when both define the same key
    return {
      locale,
      messages: deepMerge(defaultMessages, gbMessages),
    };
  }

  return {
    locale,
    messages: (await import(`../../locales/${locale}.json`)).default,
  };
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
