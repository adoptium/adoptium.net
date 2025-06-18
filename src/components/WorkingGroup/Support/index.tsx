import { Link } from "@/i18n/navigation"
import CommonHeading from "@/components/Common/CommonHeading"
import CommonCard from "@/components//Common/CommonCard"
import { PinkIcon } from "@/components/Common/Icon"

import "./styles.css"

const Support = () => {
    const media =
    {
        title: "Media & Promotion",
        description:
            "Follow and promote the latest updates from the Eclipse Adoptium Project",
        button: "Learn More",
        href: "/news/",
    }


    return (
        <section className="pt-0 md:pt-14 md:pb-28">
            <div className="pt-12 pb-8 md:pb-16 max-w-[1048px] flex-col lg:flex-row mx-auto w-full px-6 lg:px-2 xl:px-0 flex justify-center gap-16 items-center">
                <div className=" w-full lg:w-[55%] text-center lg:text-left">
                    <CommonHeading
                        title={"Support Temurin & Secure Open Source Java for Everyone!"}
                        description={
                            "Eclipse Temurin provides high-quality, open-source Java runtimes trusted by millions. By becoming a Temurin Sustainer, you are ensuring continued innovation, security, and accessibility for Java developers worldwide."
                        }
                        className={undefined}
                    />
                    <h2 className="text-2xl leading-[122%] md:text-2xl md:[116%] text-white font-semibold pt-8">Why Fund Temurin?</h2>
                    <div>
                        <div className="text-grey justify-start inline-flex pt-2"><div className="pt-1"><PinkIcon /></div><div className="pl-2">Help keep Eclipse Temurin free and accessible to all.</div></div>
                        <div className="text-grey justify-start inline-flex pt-2"><div className="pt-1"><PinkIcon /></div><div className="pl-2">Maintain and grow infrastructure, security updates, and testing for the Java community.</div></div>
                        <div className="text-grey justify-start inline-flex pt-2"><div className="pt-1"><PinkIcon /></div><div className="pl-2">Support open source contributors maintaining Temurin.</div></div>
                    </div>
                    <h2 className="text-2xl leading-[122%] md:text-2xl md:[116%] text-white font-semibold pt-8">How You Can Help</h2>
                    <div>
                        <div className="text-grey justify-start inline-flex pt-2"><div className="pt-1"><PinkIcon /></div><div className="pl-2">Monthly Sustainer: Contribute as an individual sustainer to ensure via <a href="https://github.com/sponsors/adoptium" className="text-pink" rel="noopener noreferrer" target="_blank">**GitHub**</a> Sponsorship Temurin’s long-term viability, enhance security, and accelerate faster releases for the Java community</div></div>
                        <div className="text-grey justify-start inline-flex pt-2"><div className="pt-1"><PinkIcon /></div><div className="pl-2">One-Time Contributions – Help us scale our testing and infrastructure.</div></div>
                        <div className="text-grey justify-start inline-flex pt-2"><div className="pt-1"><PinkIcon /></div><div className="pl-2">Corporate Sustainer – Looking to make a bigger impact? Join as a <Link href="/become-a-sustainer/" className="text-pink">Corporate Sustainer</Link>.</div></div>
                    </div>
                </div>
                <CommonCard data={media} />
            </div>
        </section>
    )
}

export default Support