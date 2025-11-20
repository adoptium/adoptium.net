import CommonHeading from "@/components/Common/CommonHeading"
import CommonCard from "@/components/Common/CommonCard"

const WaysToSupport = () => {
    const data = [
        {
            title: "Contribute to Adoptium Projects",
            description:
                "Contribute to our projects with technical and non-technical development.",
            button: "How to contribute",
            href: "/contributing/",
        },
        {
            title: "Become a sustainer",
            description: "Help ensure Temurin remains a trusted, high-performance runtime for users everywhere.",
            button: "Become a sustainer",
            href: "/sustainers",
        },
        {
            title: "Become a member",
            description: "Membership connects you with industry leaders and the vibrant Adoptium ecosystem, shaping the future of our projects. Take an active role in driving innovation, gaining access to strategic and technical resources, and raising your organisation’s visibility.",
            button: "Become a member",
            href: "/members",
        },
    ]
    return (
        <section className="py-16 md:py-32 mx-auto bg-[#14003C] max-w-[1264px] w-full lg:px-2   xl:px-0 px-8">
            <CommonHeading
                className="text-center"
                title={"Ways to support us"}
                description={
                    "Your involvement keeps Eclipse Temurin enterprise-ready, secure, and accessible for all. Whether through contributions, sponsorship, or membership, together we can drive the evolution of Adoptium and strengthen the Java ecosystem for years to come."
                }
            />

            <div className="mt-16  gap-4 md:gap-8  flex flex-wrap justify-center items-center ">
                {data.map((item, index) => (
                    <div key={index} className="">
                        <CommonCard data={item} />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default WaysToSupport
