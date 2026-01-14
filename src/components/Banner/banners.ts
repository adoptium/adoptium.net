export type BannerProps = {
  title: string;
  description: string;
  cta: string;
  ctaLink: string;
  startDate?: string;
  endDate?: string;
  releaseBanner?: boolean; // Indicates if this is a Release banner (priority banner)
};

// -------------------------------------------------------
// NOTE: Add your list of current banners here
// - Each banner can have optional startDate and endDate in ISO format
//     > an undefined start date is displayed immediately
//     > an undefined end date is displayed indefinitely
// - Banners with dates are only valid within that range
// - Banners are always displayed randomly
// - Banners marked as releaseBanner will be prioritized if within date range
//     > only one releaseBanner will be shown at a time, the most recent one
//     > undefined release banner flag is equivalent to 'false' behavior
// - Do not set releaseBanner to true for non-release banners
// -------------------------------------------------------
export const currentBanners: BannerProps[] = [
  {
    title:
      "Upcoming Adoptium Webinar: GPU-Accelerated Java with TornadoVM and Temurin JDK 21",
    description: "January 22 at 15:00 CET",
    cta: "Register now",
    ctaLink: "https://www.crowdcast.io/c/22jan-26-adoptiumsummit",
    startDate: "2026-01-10T00:00:00Z",
    endDate: "2026-01-22T14:30:00Z",
  },
  {
    title:
      "End of Support: Solaris & Windows 32-bit for Eclipse Temurin in 2026",
    description:
      "Temurin builds for Solaris and Windows 32-bit will be discontinued in 2026. Review the upcoming changes and share your feedback.",
    cta: "Read the full announcement",
    ctaLink: "/news/2025/12/solaris-win32-removal",
    startDate: "2025-12-11T00:00:00Z",
    endDate: "2026-01-06T23:59:59Z",
  },
  {
    title: "Help sustain Adoptium this Giving Tuesday",
    description:
      "Your support helps us maintain the open infrastructure that powers reliable release cycles and secure builds across the Adoptium ecosystem — including Eclipse Temurin.",
    cta: "Become a sponsor today",
    ctaLink:
      "https://www.eclipse.org/sponsor/adoptium/?scope=banner-1&campaign=giving-tuesday",
    startDate: "2025-11-13T00:00:00Z",
    endDate: "2025-12-03T23:59:59Z",
  },
  {
    title: "January 2026 PSU Binaries - In Progress",
    description:
      "We are creating the January 2026 PSU binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2026-01-20T00:00:00Z",
    endDate: "2026-02-03T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "March 2026 Feature Release Binaries - In Progress",
    description:
      "We are creating the March 2026 feature release binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2026-03-17T00:00:00Z",
    endDate: "2026-03-31T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "April 2026 PSU Binaries - In Progress",
    description:
      "We are creating the April 2026 PSU binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2026-04-21T00:00:00Z",
    endDate: "2026-05-05T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "July 2026 PSU Binaries - In Progress",
    description:
      "We are creating the July 2026 PSU binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2026-07-21T00:00:00Z",
    endDate: "2026-08-04T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "September 2026 Feature Release Binaries - In Progress",
    description:
      "We are creating the September 2026 feature release binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2026-09-15T00:00:00Z",
    endDate: "2026-09-29T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "October 2026 PSU Binaries - In Progress",
    description:
      "We are creating the October 2026 PSU binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2026-10-20T00:00:00Z",
    endDate: "2026-11-03T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "January 2027 PSU Binaries - In Progress",
    description:
      "We are creating the January 2027 PSU binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2027-01-19T00:00:00Z",
    endDate: "2027-02-02T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "March 2027 Feature Release Binaries - In Progress",
    description:
      "We are creating the March 2027 feature release binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2027-03-16T00:00:00Z",
    endDate: "2027-03-30T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "April 2027 PSU Binaries - In Progress",
    description:
      "We are creating the April 2027 PSU binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2027-04-20T00:00:00Z",
    endDate: "2027-05-04T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "July 2027 PSU Binaries - In Progress",
    description:
      "We are creating the July 2027 PSU binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2027-07-20T00:00:00Z",
    endDate: "2027-08-03T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "September 2027 Feature Release Binaries - In Progress",
    description:
      "We are creating the September 2027 feature release binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2027-09-21T00:00:00Z",
    endDate: "2027-10-05T23:59:59Z",
    releaseBanner: true,
  },
  {
    title: "October 2027 PSU Binaries - In Progress",
    description:
      "We are creating the October 2027 PSU binaries for Eclipse Temurin",
    cta: "View Progress by Platform",
    ctaLink:
      "https://github.com/adoptium/temurin/issues?q=is%3Aissue%20state%3Aopen%20Release%20Status%20in%3Atitle",
    startDate: "2027-10-19T00:00:00Z",
    endDate: "2027-11-02T23:59:59Z",
    releaseBanner: true,
  },
];
