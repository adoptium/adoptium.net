"use client"

import React, { Fragment, useMemo, useState, useEffect } from "react"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react"
import { FaChevronDown } from "react-icons/fa"

export interface ListItem {
  name: string
  value: string
}

interface ListBoxSelectProps {
  list: ListItem[]
  defaultValue?: ListItem | undefined
  selectorUpdater: (value: string) => void
}

export default function CommonSelector({
  list,
  defaultValue,
  selectorUpdater,
}: ListBoxSelectProps) {

  const initialSelected = useMemo(() => {
    // First try to use defaultValue if provided
    if (defaultValue) return defaultValue
    // If list has items, use the first one as default
    if (list && list.length > 0) return list[0]
    // Fallback to a safe default
    return { name: "Select an option", value: "" }
  }, [defaultValue, list])

  const [selected, setSelected] = useState<ListItem | null>(initialSelected)

  // Update selected when defaultValue changes (controlled from parent)
  useEffect(() => {
    if (defaultValue && selected && defaultValue.value !== selected.value) {
      setSelected(defaultValue)
    } else if (defaultValue && !selected) {
      setSelected(defaultValue)
    }
  }, [defaultValue, selected])

  const handleChange = (newValue: ListItem) => {
    setSelected(newValue)
    if (newValue && newValue.value !== undefined) {
      selectorUpdater(newValue.value)
    }
  }

  if (list.length === 0) return null

  return (
    <Listbox value={selected} onChange={handleChange}>
      <div className="relative mt-1">
        <ListboxButton className="relative w-full flex items-center justify-between  rounded-[80px] border-[2px] bg-transparent py-3 pl-8 pr-4 border-[#3E3355]">
          <span className="flex items-center justify-between text-nowrap">
            {selected?.name || "Select an option"}
          </span>
          <span>
            <FaChevronDown />
          </span>
        </ListboxButton>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="origin-top-left absolute overflow-auto left-0 mt-2 w-full max-h-60 sm:max-h-80 rounded-[16px] bg-[#200D46] border-[2px] text-white z-10 border-[#3E3355]">
            {list.map((obj, index) => (
              <ListboxOption
                key={index}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-1 px-3 sm:py-2 sm:px-4 text-sm sm:text-base ${active
                    ? "text-white bg-[#3E3355]"
                    : "text-white hover:bg-[#2a223a]"
                  }`
                }
                value={obj}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${selected ? "font-medium" : "font-normal"
                        }`}
                    >
                      {obj.name}
                    </span>
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  )
}
