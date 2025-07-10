import { useTranslations } from "next-intl"
import PageHeader from "@/components/Common/PageHeader"
import DownloadTable from "@/components/Marketplace/DownloadTable"
import AboutAQAvit from "@/components/About/AQAvit"

export default function MarketplacePageClient({
    ltsVersions,
    latestLTS,
}: {
    ltsVersions: { name: string; value: string }[]
    latestLTS: number
}) {
    const t = useTranslations("Marketplace")

    return (
        <div>
            <PageHeader
                subtitle={t("subtitle")}
                title={t("title")}
                description={t("description")}
            />
            <DownloadTable ltsVersions={ltsVersions} latestLTS={latestLTS} />
            <AboutAQAvit />
        </div>
    )
}
