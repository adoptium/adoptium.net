import { Metadata } from "next"
import PageHeader from "@/components/Common/PageHeader"
import DownloadTable from "@/components/Marketplace/DownloadTable"

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Java™ is the world's leading programming language and platform. The Adoptium Marketplace promotes high-quality, TCK certified and AQAvit verified runtimes for use across the Java ecosystem.",
}

export default function MarketplacePage() {
  return (
    <div>
      <PageHeader
        subtitle="Marketplace"
        title="Adoptium® Marketplace"
        description="Java™ is the world's leading programming language and platform. The Adoptium Marketplace promotes high-quality, TCK certified and AQAvit verified runtimes for use across the Java ecosystem."
      />
      <DownloadTable />
      {/* <AboutAQAvit /> */}
    </div>
  )
}
