"use client";

import { useSearchParams, redirect } from "next/navigation"
import { capitalize } from "@/utils/capitalize"
import PageHeader from "@/components/Common/PageHeader"
import ImageText from "@/components/ImageText"
import Support from "@/components/WorkingGroup/Support"

export default function DownloadPageClient() {
    const searchParams = useSearchParams()
    const link = searchParams.get("link") || "";
    const vendor = searchParams.get("vendor") || "Adoptium";

    if (!link || !link.startsWith("https://github.com/adoptium/temurin")) {
        redirect("/temurin/releases");
    }

    return (
        <div>
            <PageHeader
                title="Thank you for your download!"
                subtitle="Download Success"
                description={
                    <>
                        {link && (
                            <>
                                <meta httpEquiv="refresh" content={`0; url=${link}`} />
                                {vendor === "Adoptium" ? (
                                    <>
                                        You are downloading an Eclipse Temurin build, the open-source
                                        community build from the Eclipse Adoptium Working Group. If the
                                        download doesn&apos;t start in a few seconds, please{" "}
                                        <span className="text-primary underline !underline-offset-[1px]">
                                            <a href={link}>click here</a>
                                        </span>{" "}
                                        to start the download.
                                    </>
                                ) : (
                                    <>
                                        You are downloading a build from <strong>{capitalize(vendor)}</strong>,
                                        a member of the Eclipse Adoptium Working Group. If the download
                                        doesn&apos;t start in a few seconds, please{" "}
                                        <span className="text-primary underline !underline-offset-[1px]">
                                            <a href={link}>click here</a>
                                        </span>{" "}
                                        to start the download.
                                    </>
                                )}
                            </>
                        )}
                    </>
                }
            />
            <ImageText
                title="What to do now?"
                description="You have successfully downloaded Temurin. For more details on usage and configuration, please take a look at our Installation Guide."
                linkText="Installation Guide"
                link="/installation"
            />
            <Support />
        </div>
    )
}
