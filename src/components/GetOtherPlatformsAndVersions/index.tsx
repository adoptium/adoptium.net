import type { Metadata } from "next";
import { Link } from "@/i18n/navigation"
import { PinkIcon } from "@/components/Common/Icon"

export const metadata: Metadata = {
    title: "License(s)",
    description: "Information about the licenses for Adoptium build scripts, website, and OpenJDK code.",
};

const GetOtherPlatformsAndVersions = () => (
    <section className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-white mb-6">
            Get other platforms and versions
            &nbsp;
            <Link href="temurin/releases">
                <button className="bg-transparent border-2 mt-8 sm:mt-10 border-pink-500/0 text-white text-base leading-6 font-bold w-[148px] h-[48px] rounded-2xl gradient-border">
                    See all Releases
                </button>
            </Link>
        </h1>
    </section>
);

export default GetOtherPlatformsAndVersions;