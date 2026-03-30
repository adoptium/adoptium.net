export type BannerMiddleProps = {
  title: string;
  description: string;
  cta: string;
  ctaLink: string;
  startDate?: string;
  endDate?: string;
};

// -------------------------------------------------------
// NOTE: Add your list of current announcements here
// -------------------------------------------------------
export const currentAnnouncements: BannerMiddleProps[] = [
  {
    title: "Become an Adoptium member",
    description:
      "Join the Adoptium Working Group and support the future of open source Java. Explore our membership options and benefits.",
    cta: "Learn more",
    ctaLink: "/members/",
  },
  {
    title: "Become a sustainer!",
    description:
      "Join the Eclipse Temurin Sustainer Program to support Eclipse Temurin, the fastest-growing open source JDK. Your support fuels stronger security, faster releases, ready-to-deploy builds, quality testing and community development.",
    cta: "Learn more!",
    ctaLink: "/sustainers/",
  },
  {
    title: "Case Study: Bloomberg’s shift to Open Source Java",
    description:
      "Discover how Eclipse Temurin helps power global financial infrastructure.",
    cta: "Read the Case Study",
    ctaLink:
      "https://outreach.eclipse.foundation/bloomberg-temurin-case-study?utm_campaign=22235449-Bloomberg%20Adoptium%20Case%20Study&utm_source=banner&utm_medium=adoptium%20website",
    startDate: "2025-11-16T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
  },
];
