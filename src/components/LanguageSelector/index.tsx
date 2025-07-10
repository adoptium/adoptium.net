'use client'

import React, { Fragment } from "react"
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import { FaChevronDown } from "react-icons/fa"
import Flag from "react-world-flags"
import ISO6391 from "iso-639-1"
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from "@/i18n/routing"

function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

// Helper functions for locale display
function getCountryCode(locale: string): string {
  switch (locale) {
    case "en":
      return "us"
    case "en-GB":
      return "gb"
    case "zh-CN":
      return "cn"
    case "de":
      return "de"
    case "pt-BR":
      return "br"
    default:
      return locale
  }
}

function getLanguageCode(locale: string): string {
  switch (locale) {
    case "zh-CN":
      return "zh"
    case "en-GB":
      return "en"
    case "pt-BR":
      return "pt"
    default:
      return locale
  }
}

interface LanguageSelectorProps {
  locale: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ locale }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Function to change the language - uses next-intl router
  const changeLanguage = (newLocale: string) => {

    // Navigate to the same pathname but with the new locale
    router.push(pathname, { locale: newLocale });
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-3 rounded-3xl bg-transparent h-full px-4 py-3 text-sm text-white shadow-xs border-2 border-gray-700">
          <Flag className="mb-0 h-5" code={getCountryCode(locale)} />
          <span>{ISO6391.getNativeName(getLanguageCode(locale))}</span>
          <FaChevronDown
            className="-mr-1 h-5 w-5 text-white"
            aria-hidden="true"
            size={15}
          />
        </MenuButton>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden">
          <div className="py-1">
            {routing.locales.map((lng) => (
              <MenuItem key={lng}>
                {({ active }) => (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      changeLanguage(lng);
                    }}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      lng === locale ? "font-bold" : "",
                      "block w-full text-left px-4 py-2 text-sm"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <Flag className="mb-0" code={getCountryCode(lng)} width="35" />
                      <span className="ml-2">{ISO6391.getNativeName(getLanguageCode(lng))}</span>
                    </div>
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default LanguageSelector;
