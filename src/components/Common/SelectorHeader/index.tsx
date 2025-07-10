"use client"

import React, { useState } from "react"
import CommonSelector, { ListItem } from "@/components/Common/CommonSelector"

interface SelectorHeaderProps {
  title: string[]
  data: ListItem[][]
  selectorUpdater: ((value: string) => void)[]
  defaultValues?: string[]
}

const SelectorHeader: React.FC<SelectorHeaderProps> = ({
  title,
  data,
  selectorUpdater,
  defaultValues,
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen)
  }

  return (
    <div className="max-w-[1264px] mx-auto w-full">
      <button
        onClick={toggleMobileFilters}
        className="sm:hidden flex justify-between items-center w-full text-[16px] font-normal leading-[24px] px-4 py-3 rounded-[80px] border-[2px] border-[#3E3355] transition-all duration-200"
      >
        Filter
        <span className={`transition-transform duration-200 ${mobileFiltersOpen ? 'rotate-45' : ''}`}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 4.16699V15.8337"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.16602 10H15.8327"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div className={`w-full overflow-visible transition-all duration-300 ${mobileFiltersOpen ? 'block' : 'hidden'} sm:block`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 sm:justify-between sm:flex-nowrap sm:min-w-[1039px]">
          {data.map((list, index) => {
            let defaultVal: ListItem | undefined
            if (defaultValues && defaultValues[index]) {
              defaultVal = list.find(item => item.value === defaultValues[index])
            }
            return (
              <div key={index} className="flex flex-col gap-4 w-full">
                <h3 className="text-[16px] font-normal leading-[24px] text-grey">
                  {title[index]}
                </h3>
                <CommonSelector
                  list={list}
                  defaultValue={defaultVal}
                  selectorUpdater={selectorUpdater[index]}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SelectorHeader
