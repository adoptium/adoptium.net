import HeroSection from "@/components/HeroSection"
import LogoCarousel from "@/components/LogoCarousel"
import PowerOfTemurin from "@/components/PowerOfTemurin"
import InstallationGuideCard from "@/components/InstallationGuideCard"
import ImageText from "@/components/ImageText"
import ContactUs from "@/components/ContactUs"

export default function TemurinPageClient({
    latestLTS,
}: {
    latestLTS: number
}) {
    return (
        <div>
            <HeroSection latestLTS={latestLTS} />
            <LogoCarousel />
            <PowerOfTemurin />
            <InstallationGuideCard />
            <ImageText
                title="Want to discuss how Temurin can positively impact your company?"
                description="Whether you are looking for opportunities for cost-savings, or a selection of choices for commercial support, or if you want to bolster security around your software supply chain, we would love to discuss how using Temurin brings a variety of benefits to your enterprise."
                linkText="Contact Us"
                link="/slack"
            />
            <ContactUs
                title="Speak to our team today"
                buttontitle="Contact Us"
                linkTo="/join"
            />
        </div>
    )
}
