import React from "react"
import Link from "next/link"
import Image from "next/image"

type ImageTextProps = {
  title: string,
  description: string,
  link: string,
  linkText: string,
}

const ImageText: React.FC<ImageTextProps> = ({ title, description, link, linkText }) => {
  return (
    <>
      <section className="py-16 max-w-[1048px] w-full mx-auto flex justify-center lg:justify-between xl:px-0 px-6">
        <div className="max-w-[400px] w-full hidden lg:block">
          <Image
            src="/images/icons/experience.png"
            className="mb-0"
            alt="scroll-divider"
            width={400}
            height={400}
          />
        </div>
        <div className="lg:max-w-[560px] w-full  ">
          <h2 className="md:text-5xl text-[40px] font-normal leading-[48px] md:leading-[56px]">
            {title}
          </h2>
          <p className="md:mt-6 my-10 text-grey text-base leading-6 font-normal">
            {description}
          </p>
          <Link href={link}>
            <button className="bg-transparent mt-10 border-2 border-pink-500/0 text-white text-base leading-6 font-normal w-[150px] h-[48px] rounded-2xl gradient-border lg:block hidden">
              {linkText}
            </button>{" "}
          </Link>
          <Link href={link}>
            <button className="bg-transparent mt-10 border-2 border-pink-500/0 text-white text-base leading-6 font-normal w-[151px] h-[48px] rounded-2xl gradient-border block lg:hidden">
              {linkText}
            </button>
          </Link>
        </div>
      </section>
    </>
  )
}

export default ImageText
