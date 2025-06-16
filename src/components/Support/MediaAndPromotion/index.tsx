import React from "react"
import { Link } from "@/i18n/navigation"
import CommonHeading from "@/components/Common/CommonHeading"
import CommonCard from "@/components/Common/CommonCard"
import { PinkIcon } from "@/components/Common/Icon"

const MediaAndPromotion = () => {
    const media = [
        {
            title: "Media & Promotion",
            description:
                "Follow and promote the latest updates from the Eclipse Adoptium Project",
            button: "Learn More",
            href: "/news/",
        },
    ]
    return (
        <section className="bg-[#0E002A] pt-16">
            <div className="pt-16   pb-8 md:pb-16 max-w-[1048px] flex-col lg:flex-row mx-auto w-full px-8 lg:px-2 xl:px-0 flex justify-center gap-16 items-center">
                <div className=" w-full lg:w-[55%] text-center lg:text-left">
                    <CommonHeading
                        title={"Help promote Temurin"}
                        description={
                            "If you are one of the millions who download and use Temurin and would like to promote our project and our work, there are several ways you can help."
                        }
                    />
                    <div>
                        <div className="text-grey justify-start inline-flex pt-4"><div className="pt-1"><PinkIcon /></div><div className="pl-4">List your company on our <Link href="/adopters" className="text-pink">Adopters page</Link>, which helps other companies see how Temurin can be used for many workloads in a diverse set of industries.</div></div>
                        <div className="text-grey justify-start inline-flex pt-4"><div className="pt-1"><PinkIcon /></div><div className="pl-4">Write a blog post, article or <a href="https://www.meetup.com/adoptium-summit-series/" className="text-pink" rel="noopener noreferrer" target="_blank">conference talk</a> about the story of your migration to or use of Temurin is helping your company.</div></div>
                        <div className="text-grey justify-start inline-flex pt-4"><div className="pt-1"><PinkIcon /></div><div className="pl-4">Participate in a <a href="https://forms.gle/WyZeYW7SNXpVYpKHA" className="text-pink" rel="noopener noreferrer" target="_blank">case study</a>, if you have a compelling use case that showcases one or more of the benefits of Temurin, such as a more secure supply chain or use of our early-access build to prepare your company to move to best-in-class newer versions of Java(TM).</div></div>
                        <div className="text-grey justify-start inline-flex pt-4"><div className="pt-1"><PinkIcon /></div><div className="pl-4">Follow us in social media, and share the stories you find interesting.</div></div>
                        <div className="text-grey justify-start inline-flex pt-4"><div >We thank you for any of the creative ways you help promote Temurin.</div></div>
                    </div>
                </div>
                <div>
                    {media.map((item, index) => (
                        <div key={index} className="">
                            <CommonCard data={item} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default MediaAndPromotion
