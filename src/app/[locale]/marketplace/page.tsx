import { Metadata } from "next"
import { useTranslations } from "next-intl"
import PageHeader from "@/components/Common/PageHeader"
import DownloadTable from "@/components/Marketplace/DownloadTable"
import AboutAQAvit from "@/components/About/AQAvit"

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Java™ is the world's leading programming language and platform. The Adoptium Marketplace promotes high-quality, TCK certified and AQAvit verified runtimes for use across the Java ecosystem.",
}

export default function MarketplacePage() {
  const t = useTranslations("Marketplace")

  return (
    <div>
      <PageHeader
        subtitle={t("subtitle")}
        title={t("title")}
        description={t("description")}
      />
      <DownloadTable />
      <AboutAQAvit />
    </div>
  )
}
