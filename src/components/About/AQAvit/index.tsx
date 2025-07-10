import React from "react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import CommonHeading from "@/components/Common/CommonHeading"
import CommonButton from "@/components/Common/CommonButton"

import "./styles.css"

const AQAvit = () => {
  return (
    <div className="about-aqavit flex justify-center items-center px-6 pt-10 pb-24 md:py-24">
      <div className="aqavit-card gap-4 md:gap-10 flex flex-col md:flex-row justify-between md:items-center max-w-[1000px] mx-auto p-[32px] md:p-[64px]">
        <div className="max-w-[110px] ">
          <Image
            className="w-full"
            src="/images/projects/aqavit-project.svg"
            alt="AQAvit Logo"
            width={110}
            height={110}
          />
        </div>
        <div className="flex flex-col md:gap-3">
          <CommonHeading
            title="About Eclipse AQAvit"
            description="The AQAvit open source test suite (Adoptium Quality Assurance) can be found here. There is also a blog post and brief presentation that explains what testing is run and how it fits into the overall delivery pipeline."
            className={"!mt-0"}
          />
          <Link href="/aqavit">
            <CommonButton className="mt-6" icon={undefined}>
              Learn More
            </CommonButton>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AQAvit
