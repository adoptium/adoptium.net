import React from "react"
import Image from "next/image"

interface DataItem {
  image: string;
  title: string;
  description: string;
}

const UiMobileScroll = ({ data }: { data: DataItem[] }) => {
  return data.map((item, index) => (
    // render an image in the center and then the text below it centered
    <div
      key={index}
      className="lg:hidden max-w-[500px] mx-auto flex flex-col text-center items-center"
    >
      <Image
        src={`/images/icons/${item.image}`}
        alt="Description"
        width={366}
        height={366}
        className="w-full mb-0 max-w-[366px] object-cover"
      />
      <Image
        src="/images/icons/scroll-divider.svg"
        width={16}
        height={80}
        className="mb-0"
        alt="scroll divider"
      />
      <div className="flex flex-col flex-1 px-4">
        <h1 className="text-xl my-5 font-bold">{item.title}</h1>
        <p className="text-base text-grey">{item.description}</p>
      </div>
    </div>
  ))
}

export default UiMobileScroll
