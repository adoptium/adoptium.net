import React from "react"
import Image from "next/image"

const sustainerProgram = [
    {
        image: "projects/temurin-light.png",
        description:
            "Runtime binaries High performance Cross-platform Open source licenses (GPLv2 + CE) Spec compliant",
    },
    {
        image: "projects/aqavit-light.png",
        description:
            "Verification program, running a large pool of tests Assuring security durability, scalability, and performance requirements",
    },
    {
        image: "projects/emt4j.svg",
        description:
            "This migration toolkit helps organizations with the migration from Java 8 to 11+",
    },
    {
        image: "projects/mission-control.svg",
        description:
            "Low-overhead monitoring and management of running Java applications",
    },
]

const SustainerProgramSection: React.FC = () => {
    return (
        <div className="w-full flex flex-col justify-center items-center relative">
            <div className="w-full ">
                <div className="absolute z-[-1] w-full h-[20px] bottom-0 right-0 bg-[#410170] shadow-[0_0_400px_rgba(65,1,112,1)] rounded-full blur-[400px]"></div>
                <div className="absolute z-[-1] w-full h-[20px] bottom-0 right-0 bg-[#B62987] shadow-[0_0_400px_rgba(182,41,135,1)] rounded-full blur-[400px]"></div>
                <div className="absolute z-[-1] w-full h-[20px] bottom-0 right-0 bg-[#FE8492] shadow-[0_0_400px_rgba(254,132,146,1)] rounded-full blur-[400px]"></div>
            </div>
            <div className="w-full max-w-[1180px] px-6 py-8 relative">
                <div className="absolute -left-full -right-full -bottom-20 -z-10">
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff1464]/20 to-transparent"></div>
                </div>
                <h2 className="text-center text-4xl lg:text-5xl leading-[44px] lg:leading-[56px] font-semibold text-white-900 mb-6">
                    Eclipse Temurin Sustainer Program
                </h2>
                <p className="text-center text-[#c4bfce] px-4 py-6 max-w-[900px] mx-auto text-lg leading-relaxed">
                    The Eclipse Temurin Sustainer Program invites enterprises to
                    invest in the long-term sustainment of Eclipse Temurin and other
                    Adoptium projects. By becoming a Sustainer, your company ensures
                    that Temurin remains the industry&apos;s leading community-driven open
                    source JDK for mission-critical Java workloads. This program
                    supports the vendor-neutral development of runtimes and
                    development kits, infrastructure and tools, quality assurance,
                    enhanced security practices, community engagement, and more.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-10 w-full max-w-[1180px] px-4 mb-16">
                {sustainerProgram.map(({ image, description }, index) => (
                    <div
                        key={index}
                        className="max-w-[250px] w-full flex flex-col justify-start items-center bg-gradient-to-b from-[#1e1133]/40 to-[#0d0129]/40 backdrop-blur-sm rounded-xl border border-[#39314a]/50 p-6 transform transition-all duration-300 hover:translate-y-[-8px] hover:border-[#ff1464]/30 hover:shadow-lg hover:shadow-[#ff1464]/10"
                    >
                        <div className="flex flex-col justify-center items-center gap-[6px] bg-white rounded-2xl w-[140px] h-[140px] mb-6 shadow-lg">
                            <Image
                                src={`/images/${image}`}
                                alt="project logo"
                                className="w-[110px] mb-0"
                                width={110}
                                height={110}
                            />
                        </div>
                        <p className="text-center text-[#c4bfce] text-base leading-relaxed">
                            {description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SustainerProgramSection
