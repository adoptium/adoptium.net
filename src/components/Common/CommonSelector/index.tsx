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

  const initialSelected = useMemo(() => defaultValue ? defaultValue : list[0], [defaultValue, list])
  const [selected, setSelected] = useState<ListItem>(initialSelected)

  // Update selected when defaultValue changes (controlled from parent)
  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue)
    }
  }, [defaultValue])

  const handleChange = (newValue: ListItem) => {
    setSelected(newValue)
    selectorUpdater(newValue.value)
  }

  if (!selected || list.length === 0) return

  return (
    <Listbox value={selected} onChange={handleChange}>
      <div className="relative mt-1">
        <ListboxButton className="relative w-full flex items-center justify-between  rounded-[80px] border-[2px] bg-transparent py-3 pl-8 pr-4 border-[#3E3355]">
          <span className="flex items-center justify-between text-nowrap">
            {selected.name}
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
          <ListboxOptions className="origin-top-left absolute overflow-hidden left-0 mt-2 w-full rounded-[16px] bg-[#200D46] border-[2px] text-white z-10 border-[#3E3355]">
            {list.map((obj, index) => (
              <ListboxOption
                key={index}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 px-4 ${active
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
