"use client"

import React, { useEffect } from "react"
import Image from "next/image"

const keyInitiatives = [
    {
        header: "Enhanced Security",
        image: "security.svg",
        description:
            "Contribute to rigorous security practices, including regular audits and vulnerability management. Your support ensures the continuation of our Secure Development efforts, encompassing SBOM, reproducible builds, SLSA, OpenChain Conformance, security audits, and vulnerability reports.",
    },
    {
        header: "Faster Release Cycles",
        image: "release.svg",
        description:
            "Ensure your Java environments stay up-to-date with the latest advancements by sponsoring additional infrastructure services. This support will enable us to publish feature and CPU releases within our ambitious delivery targets, keeping your systems at the forefront of innovation.",
    },
    {
        header: "Ready-to-deploy Builds",
        image: "deploy.svg",
        description:
            "Ensure access to Java versions tailored to your specific architecture and operating system needs. Get the precise build for your software services and save money by avoiding the costs of creating your own builds. Your funding allows us to deliver across a broad range of platforms and architectures",
    },
    {
        header: "Sustained Innovation",
        image: "innovation.svg",
        description:
            "Support the continuous improvement of Temurin and other Adoptium projects. We are leaders in Secure Development, Quality Assurance, Migration Tools, and many other areas where we have been developing bleeding-edge, innovative solutions. Your funding allows us to continue to develop improvements that benefit the entire Java ecosystem.",
    },
    {
        header: "Quality Testing",
        image: "testing.svg",
        description:
            "Help us maintain and optimize our testing infrastructure across all necessary platforms and versions, ensuring robust and reliable releases. Your funding allows us to assess and include tests that your organization cares about and proactively discover and mitigate defects before they land in your domain.",
    },
    {
        header: "Community Development and Engagement",
        image: "community.svg",
        description:
            "Support the growth of a diverse and vibrant Java community. Your sponsorship helps maintain and enhance Adoptium projects, ensuring a stable, scalable, and interoperable Java ecosystem. Additionally, you will have the opportunity to support events and marketing initiatives and actively participating in community activities, spreading awareness and fostering collaboration.",
    },
]

const KeyInitiatives: React.FC = () => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            keyInitiatives.forEach((_, i) => {
                const container = document.getElementById(`card-container-${i}`)
                const checkbox = document.getElementById(
                    `toggle-${i}`,
                ) as HTMLInputElement

                if (container && !container.contains(event.target as Node)) {
                    if (checkbox && checkbox.checked) checkbox.checked = false
                }
            })
        }

        document.addEventListener("click", handleClickOutside)

        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [])

    return (
        <div className="p-4 border-t border-[#39314a] mt-[60px] pt-[40px] md:pt-[80px] w-full">
            <h2 className="text-center text-4xl lg:text-5xl leading-[44px] lg:leading-[56px] font-semibold text-white-900">
                How Your Support Fuels Key Initiatives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full item-center mt-10 p-4 mx-auto max-w-[1180px]">
                {keyInitiatives.map(({ image, header, description }, i) => {
                    const isNthValue = i >= 3
                    return(
                    <div
                        className="relative max-w-[382px] w-full"
                        id={`card-container-${i}`}
                        key={i}
                    >
                        <input
                            type="checkbox"
                            id={`toggle-${i}`}
                            className="peer hidden"
                        />
                        <span className="peer-checked:hidden absolute bottom-[10px] right-[20px] text-[#ff1464]">+</span>
                        <div
                            role="button"
                            className={`relative transform  ${ isNthValue && "lg:peer-checked:translate-y-[-236px]"}  group h-[212px] w-full border-[1px] border-[#39314a] hover:border-[#ff1464]/40 rounded-[20px] cursor-pointer overflow-visible transition-all duration-300 lg:peer-checked:border-[#ff1464]/70 lg:peer-checked:border-b-0 lg:peer-checked:rounded-bl-none lg:peer-checked:rounded-br-none bg-gradient-to-b from-[#1e1133]/60 to-[#0d0129]/60 lg:peer-checked:backdrop-blur-sm shadow-lg hover:shadow-[#ff1464]/5`}
                        >
                            <label htmlFor={`toggle-${i}`}>
                                <div className="flex flex-col justify-center items-center gap-6 h-full cursor-pointer p-6">
                                    <div className="bg-gradient-to-br from-[#281645] to-[#39194d] p-4 rounded-full">
                                        <Image
                                            src={`/images/initiatives/${image}`}
                                            className="mb-0 w-16 h-16"
                                            alt=""
                                            aria-hidden="true"
                                            width={64}
                                            height={64}
                                        />
                                    </div>
                                    <h3 className="text-2xl font-medium text-center px-4 text-white">
                                        {header}
                                    </h3>
                                </div>
                            </label>
                        </div>
                        <div className={`hidden transform ${ isNthValue && "lg:peer-checked:translate-y-[-236px]"} lg:peer-checked:block absolute backdrop-blur-xl h-auto min-h-[236px] top-full left-0 w-full mt-[-1px] border-[1px] border-t-0 border-[#ff1464]/70 rounded-b-[20px] z-10 p-6 bg-gradient-to-b from-[#1e1133]/60 to-[#0d0129]/60 shadow-lg shadow-[#ff1464]/10`}>
                            <p className="text-white text-sm px-4 text-center leading-relaxed">
                                {description}
                            </p>
                            <span className="absolute bottom-[10px] right-[20px] text-[#ff1464]">_</span>
                        </div>
                    </div>
                )})}
            </div>
            <p className="text-[16px] text-[#c4bfce] p-6 max-w-[900px] text-center mx-auto mt-6 leading-relaxed">
                Join the Eclipse Temurin Sustainer Program and play a crucial role
                in maintaining the vitality and reliability of the world&apos;s
                fastest-growing open source Java SE runtime. Your support
                accelerates our initiatives, driving greater impact and innovation
                within the Java ecosystem.
            </p>
        </div>
    )
}

export default KeyInitiatives
