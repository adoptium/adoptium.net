import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// Create the standard next-intl middleware
const intlMiddleware = createMiddleware({
  ...routing,
  // Enable automatic locale detection
  localeDetection: true,
});

// Extend the middleware to handle non-existent routes
export default async function middleware(request: NextRequest) {
  // Let the intl middleware do its job for locale handling
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
