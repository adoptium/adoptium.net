import React from "react"
import CommonHeading from "@/components/Common/CommonHeading"
import CommonCard from "@/components/Common/CommonCard"

const WaysToSupport = () => {
  const data = [
    {
      title: "How to contribute",
      description:
        "Contribute to our projects with technical and non-technical development",
      button: "How to contribute",
      href: "/contributing/",
    },
    {
      title: "Become a sustainer",
      description: "Join us in strengthening the future of Eclipse Temurin",
      button: "Become a sustainer",
      href: "/sustainers",
    },
    {
      title: "Become a member",
      description: "Join us shaping the future of Eclipse Adoptium",
      button: "Become a member",
      href: "/join",
    },
  ]
  return (
    <section className="py-16 md:py-32 mx-auto bg-[#14003C] max-w-[1264px] w-full lg:px-2 xl:px-0 px-8">
      <CommonHeading
        className="text-center"
        title={"Ways to support us"}
        description={
          "If you value Eclipse technologies, please consider becoming a sponsor through the Eclipse Foundation. Contributions from users like you help fund the operations of the Adoptium working group. All money contributed to the Eclipse Foundation will be used to support the Eclipse community through the Adoptium working group"
        }
      />

      <div className="mt-16 gap-4 md:gap-8 flex flex-wrap justify-center items-center">
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
