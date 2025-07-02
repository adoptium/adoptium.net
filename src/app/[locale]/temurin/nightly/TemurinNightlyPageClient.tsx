import React from "react"
import { useTranslations } from "next-intl"
import { FaArrowCircleRight } from "react-icons/fa"
import PageHeader from "@/components/Common/PageHeader"
import LinkText from "@/components/LinkText"
import NightlyVersionSelector from "@/components/Temurin/NightlyVersionSelector"
import { Link } from "@/i18n/navigation"

interface TemurinNightlyPageClientProps {
    allVersions: { name: string; value: string }[];
    latestLTS: number;
}

const TemurinNightlyPageClient: React.FC<TemurinNightlyPageClientProps> = ({ allVersions, latestLTS }) => {
    const t = useTranslations("Temurin.Nightly")
    return (
        <div>
            <PageHeader
                subtitle={t("subtitle")}
                title={t("title")}
                description={t("description")}
            />
            <div className="max-w-[1264px] mx-auto px-2 sm:px-6 py-4 sm:py-8">
                <div className="bg-[#26193F] rounded-2xl p-3 sm:p-6 md:p-8 mb-6 md:mb-10">
                    <div className="prose prose-invert max-w-none text-sm sm:text-base">
                        <p>
                            {t.rich("be-aware", {
                                fullReleaseLink: chunks => (
                                    <LinkText href="/temurin/releases">{chunks}</LinkText>
                                ),
                            })}
                        </p>
                        <h4 className="mt-4 mb-2 sm:mt-6 sm:mb-3 text-base sm:text-lg font-medium">
                            {t("notice-title")}
                        </h4>
                        <blockquote className="border-l-4 border-gray-500 pl-3 sm:pl-4 italic my-3 sm:my-4">
                            {t("quoted-notice")}
                        </blockquote>
                        <div className="bg-amber-900/30 border-l-4 border-amber-600 p-3 sm:p-4 mt-4 sm:mt-6">
                            <p className="text-amber-400 font-medium">
                                {t("unsupported-in-production")}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
                        <Link
                            href="/temurin/releases"
                            className="rounded-[80px] bg-[#FF1464] border transition duration-300 ease-in-out hover:bg-transparent hover:text-[#FF1464] border-[#FF1464] flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 text-white font-bold leading-6 text-sm sm:text-base"
                        >
                            {t("latest-releases")} <FaArrowCircleRight />
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <NightlyVersionSelector allVersions={allVersions} latestLTS={latestLTS} />
                </div>
            </div>
        </div>
    )
}

export default TemurinNightlyPageClient
