'use client';

import { useTranslations } from "next-intl";
import PageHeader from "@/components/Common/PageHeader";
import SitemapClient from "./SitemapClient";
import { SitemapData } from "@/types/sitemap";

interface SitemapPageClientProps {
  sitemapData: SitemapData;
}

export default function SitemapPageClient({ sitemapData }: SitemapPageClientProps) {
  const t = useTranslations("Sitemap");

  return (
    <div>
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        description={t("description")}
      />
      <SitemapClient sitemapData={sitemapData} />
    </div>
  );
}
