import { Metadata } from 'next'
import Image from "next/image"
import Link from 'next/link'

import { Error404Icon, PinkIcon } from "@/components/Common/Icon"

export const metadata: Metadata = {
  title: '404 - Page Not Found | Adoptium',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className="relative pt-24 pb-24 md:pt-32 md:pb-32 flex flex-col justify-center items-center">
      <Image
        className="absolute top-0 left-0 w-full h-full -z-10 hidden md:block"
        src="/images/backgrounds/404-error-bg.png"
        alt="Background 404 image"
        layout="fill"
        objectFit="cover"
      />
      <Image
        className="absolute top-0 left-0 w-full h-full -z-10 block md:hidden"
        src="/images/backgrounds/404-error-bg-mobile.png"
        alt="Background 404 image"
        layout="fill"
        objectFit="cover"
      />
      <div className="max-w-[280px] sm:max-w-[470px] mx-auto px-2">
        <Error404Icon />
      </div>

      <div className="mx-auto max-w-[848px] w-full px-6 lg:px-0 flex flex-col items-center justify-center md:mt-14">
        <div className="self-stretch flex-col justify-center items-center gap-6 flex">
          <div className="self-stretch  flex-col justify-center items-center gap-4 flex">
            <div className="justify-start items-center gap-3 inline-flex">
              <PinkIcon />
              <div className="text-rose-600 text-base font-bold leading-normal">
                404 Error
              </div>
            </div>
            <div
              className="self-stretch text-center text-white text-[48px] md:text-[56px] leading-[116.667%] md:leading-[114.286%] font-semibold"
            >
              <h1>Sorry, we couldn’t find this page</h1>
            </div>
          </div>
          {/* <div
            className="self-stretch text-center text-white text-[20px] font-normal leading-[140%]"
          >
            Bloggosfär vithetsnorm jeren. Frimester ev kompetensutvisning.
            Förarstödjare rejinat eftersom wiki. Sore kronde, virtuell våldtäkt.
            Preras poneligen sprängbälte.
          </div> */}
          <Link href="/">
            <button className="bg-primary text-white tab-button-text px-6 py-4 rounded-[80px] mt-3">
              {" "}
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
