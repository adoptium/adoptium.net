import React from "react"
import Image from "next/image"

const UsingTemurin = () => {
  return (
    <>
      <section className="py-16 max-w-[1048px] w-full mx-auto lg:flex justify-center lg:justify-between xl:px-0 px-6 ">
        <div className="lg:max-w-[560px] w-full">
          <h2 className="md:text-5xl text-[40px] font-normal leading-[48px] md:leading-[56px]">
            How other companies are using Temurin
          </h2>
            <p className="md:mt-6 my-10 text-grey text-base leading-6 font-normal">
            Discover how industry leaders leverage Temurin to enhance performance and drive innovation in their development processes.
            </p>
        </div>
        <div className="max-w-[400px] w-full hidden lg:block">
          <Image
            src="/images/icons/experience.png"
            className="mb-0"
            alt="scroll-divider"
            width={400}
            height={400}
          />
        </div>
      </section>
    </>
  )
}

export default UsingTemurin
