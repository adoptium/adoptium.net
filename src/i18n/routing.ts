import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "en-GB", "de", "es", "fr", "pt-BR", "zh-CN"],

  // Used when no locale matches
  defaultLocale: "en",

  // Serve the default locale at the root path
  localePrefix: "as-needed",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
