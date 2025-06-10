import React from "react"
import CommonSelector from "@/components/Common/CommonSelector"

import { packageTypes } from "@/utils/defaults"
import { capitalize } from "@/utils/capitalize"

interface OSSelectorProps {
  operatingSystem: string
  svgComponent: React.ReactNode
  activeIndex: string
  onActiveChange: (arch: string) => void
  onPackageTypeChange: (newType: string) => void
  buttons: {
    label: string
    active: boolean
  }[]
}

const OSSelector: React.FC<OSSelectorProps> = ({
  operatingSystem,
  svgComponent,
  activeIndex,
  onActiveChange,
  onPackageTypeChange,
  buttons,
}) => {
  return (
    <div>
      <div className="p-6 bg-[#2B1A4F] flex flex-col rounded-[24px] gap-6 ">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 justify-start items-center">
            {svgComponent}
            <h5 className="text-2xl font-semibold leading-[32px]">
              {capitalize(operatingSystem)}
            </h5>
          </div>

          <div className="flex gap-4">
            {buttons.map((button, index) => (
              <button key={index} onClick={() => onActiveChange(button.label)}>
                <span
                  className={`py-3 w-full text-base font-normal leading-6 
                     outline-hidden cursor-pointer transition-all duration-200 ease-in-out ${activeIndex === button.label ? "border-primary  border-b-[2px] text-white" : "text-[#8a809e] border-transparent  border-b"}`}
                >
                  {button.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        <CommonSelector
          list={packageTypes}
          selectorUpdater={onPackageTypeChange}
        />
      </div>
    </div>
  )
}

export default OSSelector
