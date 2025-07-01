import React from "react"
import { PinkIcon } from "@/components/Common/Icon"
import DocumentationSearch from "@/components/Documentation/Search"

const DocumentationHeader: React.FC = () => {
  return (
    <div className="relative pt-20 pb-8 md:pb-16 md:pt-32 overflow-hidden">
      <div className="w-full relative">
        <div className="absolute z-[-1] w-[2396px] h-[1340px] left-[23px] md:left-[112px] top-[21px] md:top-[71px] bg-[#410170] shadow-[0_0_400px_rgba(65,1,112,1)] rounded-full blur-[400px]"></div>
        <div className="absolute z-[-1] w-[1487px] h-[893px] left-[120px] md:left-[676px] top-[60px] md:top-[195px] bg-[#B62987] shadow-[0_0_400px_rgba(182,41,135,1)] rounded-full blur-[400px]"></div>
        <div className="absolute z-[-1] w-[688px] h-[446px] left-[400px] md:left-[1131px] top-[318px] bg-[#FE8492] shadow-[0_0_400px_rgba(254,132,146,1)] rounded-full blur-[400px]"></div>
      </div>

      <div className="mx-auto max-w-[1048px] w-full px-6 lg:px-0 flex flex-col items-center justify-center pb-10">
        <div className="self-stretch flex-col justify-center items-center gap-6 flex">
          <div className="self-stretch  flex-col justify-center items-center gap-4 flex">
            <div className="justify-start items-center gap-3 inline-flex">
              <PinkIcon />
              <div className="text-rose-600 text-base font-bold leading-normal">
                Documentation
              </div>
            </div>
            <div
              className={`self-stretch text-center text-white text-[56px] lg:text-[80px] leading-[114.286%] md:leading-[120%] font-semibold`}
            >
              Documentation
            </div>
          </div>
          <div
            className="self-stretch text-center text-lightgrey text-[20px] font-normal leading-[140%]"
          >
            Everything you need to get started with Adoptium technology
          </div>
        </div>
      </div>
      <DocumentationSearch />
    </div>
  )
}

export default DocumentationHeader
