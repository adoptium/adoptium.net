import React, { useState, useEffect, Fragment } from "react"
import { Link } from "../Link"
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react"
import { FaChevronDown, FaRegBell } from "react-icons/fa"
import { BsXLg, BsList } from "react-icons/bs"
import { GrRevert } from "react-icons/gr"

import IconSocial from "../IconSocial"
import LanguageSelector from "../LanguageSelector"

// @ts-ignore
import Logo from "../../images/adoptium-logo-dark.svg"
import Announcements from "../Announcements"

interface NavItem {
  name: string
  href?: string
  children?: NavItem[]
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

const navigation: NavItem[] = [
  {
    name: "About Us",
    children: [
      { name: "What We do", href: "/what-we-do" },
      { name: "Business Benefits", href: "/business-benefits" },
      { name: "Our Members", href: "/members" },
      { name: "Our Sustainers", href: "/sustainers" },
      { name: "Our Adopters", href: "/adopters" },
      { name: "Support Us", href: "/support-us" },
    ],
  },
  { name: "Latest Releases", href: "/temurin/releases" },
  { name: "Marketplace", href: "/marketplace" },
  {
    name: "Projects",
    children: [
      { name: "Eclipse Temurin", href: "/temurin" },
      { name: "Eclipse AQAvit", href: "/aqavit" },
      { name: "Eclipse Mission Control", href: "/jmc" },
      { name: "Eclipse Migration Toolkit", href: "/emt" },
    ],
  },
  {
    name: "Resources",
    children: [
      { name: "Status", href: "https://status.adoptium.net" },
      { name: "Release Notes", href: "/temurin/release-notes" },
      { name: "Installation Guide", href: "/installation" },
      { name: "Documentation", href: "/docs" },
      // { name: "Resource Directory", href: "" },
      { name: "FAQs", href: "/docs/faq" },
      { name: "Brand & Promotion", href: "/docs/logo-styleguide" },
    ],
  },
  {
    name: "Community",
    children: [
      // { name: "Our Community", href: "" },
      { name: "Support", href: "/support" },
      { name: "News", href: "/news" },
      { name: "Events", href: "/events" },
      { name: "Slack", href: "/slack" },
    ],
  },
]

/**
 * A reusable mobile link component that renders a Link (if the href starts with "/")
 * or a regular <a> element. Both get the same classes.
 */
const MobileLink: React.FC<{
  href?: string
  name: string
  onClick?: () => void
}> = ({ href, name, onClick }) => {
  const commonClasses = classNames(
    "-mx-3 block rounded-lg px-3 py-2 text-[20px] font-normal leading-7 text-white-900 hover:bg-white-50",
    isActivePath(href) ? "text-rose-600" : "",
  )
  if (href && href.startsWith("/")) {
    return (
      <Link to={href} onClick={onClick} className={commonClasses}>
        {name}
      </Link>
    )
  }
  return (
    <a href={href} onClick={onClick} className={commonClasses}>
      {name}
    </a>
  )
}

/**
 * A tiny divider used between mobile nav items.
 */
const MobileDivider: React.FC = () => (
  <div className="w-full px-3 bg-[#3E3355] h-[1px]"></div>
)

function isActivePath(path: string | undefined): boolean {
  if (!path) return false
  if (typeof window === "undefined") return false

  const currentPath = window.location.pathname

  // Remove locale prefix from current path (e.g., /en-GB/docs/faq -> /docs/faq)
  const removeLocalePrefix = (pathname: string): string => {
    // Match patterns like /en-GB/, /de/, /es/, /fr/, /zh-CN/, etc.
    const localePattern = /^\/[a-z]{2}(-[A-Z]{2})?\//
    return pathname.replace(localePattern, "/")
  }

  const pathWithoutLocale = removeLocalePrefix(currentPath)
  const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path
  const normalizedCurrentPath = pathWithoutLocale.endsWith("/")
    ? pathWithoutLocale.slice(0, -1)
    : pathWithoutLocale

  // Get all navigation paths to find the most specific match
  const allPaths: string[] = []

  navigation.forEach(item => {
    if (item.href) {
      allPaths.push(item.href)
    }
    if (item.children) {
      item.children.forEach(child => {
        if (child.href) {
          allPaths.push(child.href)
        }
      })
    }
  })

  // Find all matching paths
  const matchingPaths = allPaths.filter(navPath => {
    const normalizedNavPath = navPath.endsWith("/")
      ? navPath.slice(0, -1)
      : navPath
    return (
      normalizedCurrentPath === normalizedNavPath ||
      normalizedCurrentPath.startsWith(normalizedNavPath + "/")
    )
  })

  // If no matches, return false
  if (matchingPaths.length === 0) return false

  // Find the longest (most specific) matching path
  const longestMatch = matchingPaths.reduce((longest, current) =>
    current.length > longest.length ? current : longest,
  )

  // Only highlight if this path is the most specific match
  const normalizedLongestMatch = longestMatch.endsWith("/")
    ? longestMatch.slice(0, -1)
    : longestMatch
  return normalizedPath === normalizedLongestMatch
}

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLastSlide, setShowLastSlide] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(false)
  const [activeLastSlide, setActiveLastSlide] = useState<NavItem | null>(null)

  // Function to go back to the old site
  const goToOldSite = () => {
    if (typeof window !== "undefined") {
      // Set cookie to view the old site
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + 30)

      // Set the Netlify cookie to 'oldsite' branch
      document.cookie = `nf_ab=oldsite; expires=${expirationDate.toUTCString()}; path=/`

      // Reload the page to apply changes
      window.location.reload()
    }
  }

  useEffect(() => {
    if (!mobileMenuOpen) {
      setShowLastSlide(false)
    }
  }, [mobileMenuOpen])

  const openLastSlideHandler = (item: NavItem) => {
    setShowLastSlide(true)
    setActiveLastSlide(item)
  }

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`sticky inset-x-0 top-0 z-50 ${
        scrolled
          ? "bg-[#200E46] border-b-2 border-[#3E3355]/85 backdrop-blur-xl"
          : ""
      }`}
    >
      {showAnnouncement && (
        <Announcements handleClose={() => setShowAnnouncement(false)} />
      )}
      {/* Container div to center the nav content */}
      <div className="max-w-[1288px] w-full mx-auto px-3">
        <nav
          className="flex items-center gap-5 justify-between py-6"
          aria-label="Global"
        >
          <Link to="/" placeholder="homepage">
            <Logo alt="Adoptium Logo" className="h-10" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex lg:gap-6 xl:gap-x-12">
              {navigation.map(item =>
                item.children ? (
                  <Menu
                    as="div"
                    key={`desktop-${item.name}`}
                    className="relative inline-block text-left"
                  >
                    <div>
                      <MenuButton className="inline-flex w-full gap-2 justify-center rounded-md text-sm font-semibold text-white-900 hover:bg-white-50">
                        {item.name}
                        <FaChevronDown
                          className="-mr-1 mt-1"
                          aria-hidden="true"
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
                      <MenuItems
                        className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-[#0E002A] shadow-lg ring-1 ring-black/5 focus:outline-hidden"
                        style={{ minWidth: "max-content" }}
                      >
                        <div className="py-6 px-4">
                          {item.children.map(child => (
                            <MenuItem key={`mobile-${child.name}`}>
                              {({ focus }) => (
                                <MobileLink
                                  href={child.href}
                                  name={child.name}
                                  onClick={() => {}}
                                />
                              )}
                            </MenuItem>
                          ))}
                        </div>
                      </MenuItems>
                    </Transition>
                  </Menu>
                ) : item.href ? (
                  <Link
                    key={`desktop-${item.name}`}
                    to={item.href}
                    className={classNames(
                      "text-sm font-semibold leading-6 text-white-900",
                      isActivePath(item.href) ? "text-rose-600" : "",
                    )}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={`desktop-${item.name}`}
                    href={item.href}
                    className={classNames(
                      "text-sm font-semibold leading-6 text-white-900",
                      isActivePath(item.href) ? "text-rose-600" : "",
                    )}
                  >
                    {item.name}
                  </a>
                ),
              )}
            </div>
            <div className="flex space-x-3 h-12">
              <div className="hidden sm:block">
                <LanguageSelector />
              </div>
              <div className="p-3 h-full rounded-3xl border-2 border-gray-700 justify-start items-center gap-3 inline-flex cursor-pointer">
                <div
                  aria-label="checksum"
                  onClick={() => setShowAnnouncement(!showAnnouncement)}
                  className="relative"
                >
                  <FaRegBell size={20} />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white font-bold flex items-center justify-center">
                    1 {/* TODO: calculate the notification count */}
                  </span>
                </div>
              </div>
              <div className="hidden lg:flex items-center">
                <div className="relative group">
                  <button
                    onClick={goToOldSite}
                    className="text-gray-300 rounded-full p-1.5 hover:bg-[#3E3355] transition-all border border-gray-600"
                    aria-label="View classic site"
                  >
                    <GrRevert size={20} />
                  </button>
                  <span className="absolute -left-12 bottom-full mb-2 hidden group-hover:block whitespace-nowrap rounded bg-[#3E3355] p-1 px-2 text-xs text-gray-300">
                    View classic site
                  </span>
                </div>
              </div>
            </div>
            <div className="flex lg:hidden ml-3">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md text-white-700"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <div className="border-2 border-[#3e3355] p-3 rounded-full">
                  <BsList className="text-2xl" />
                </div>
              </button>
            </div>
          </div>
        </nav>
      </div>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed flex-col h-full flex inset-y-0 right-0 z-50 w-full overflow-y-auto bg-purple px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" placeholder="home" className="-m-1.5 p-1.5">
              <span className="sr-only">Eclipse Adoptium</span>
              <img
                className="h-8 mb-0 w-auto"
                src="https://raw.githubusercontent.com/adoptium/adoptium.net/main/src/images/adoptium-logo-dark.svg"
                alt=""
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-white-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <div className="border-2 border-[#3e3355] p-3 rounded-full">
                <BsXLg className="text-xl" />
              </div>
            </button>
          </div>
          <div className="mt-6 grow relative w-full h-full overflow-hidden flow-root">
            {/* Mobile menu – main navigation */}
            <div
              className={`-my-6 absolute duration-200 h-full left-0 w-full divide-y divide-white-500/10 ${
                showLastSlide ? "left-[-100%]" : ""
              }`}
            >
              <div className="space-y-2 py-6">
                {navigation.map((item, index) => (
                  <div key={item.name}>
                    {item.children ? (
                      <div
                        onClick={() => openLastSlideHandler(item)}
                        className="flex items-center justify-between"
                      >
                        <div className="-mx-3 block rounded-lg px-3 py-2 text-[20px] font-normal leading-7 text-white-900 hover:bg-white-50">
                          {item.name}
                        </div>
                        <svg
                          width="8"
                          height="12"
                          viewBox="0 0 8 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.5 11L6.5 6L1.5 1"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <MobileLink
                          href={item.href}
                          name={item.name}
                          onClick={() => setMobileMenuOpen(false)}
                        />
                      </div>
                    )}
                    {navigation.length !== index + 1 && <MobileDivider />}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile menu – last slide (child links) */}
            <div
              className={`absolute duration-200 w-full h-full ${
                showLastSlide ? "left-0" : "left-full"
              }`}
            >
              <div
                onClick={() => setShowLastSlide(false)}
                className="flex items-center space-x-3"
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="1"
                    y="1"
                    width="46"
                    height="46"
                    rx="23"
                    stroke="#3E3355"
                    strokeWidth="2"
                  />
                  <path
                    d="M31 24H17"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M24 31L17 24L24 17"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[20px] text-white font-[400]">
                  {activeLastSlide && activeLastSlide.name}
                </span>
              </div>

              <div className="space-y-2 w-full py-6">
                {activeLastSlide &&
                  activeLastSlide.children?.map((item, index) => (
                    <div key={index}>
                      <div className="flex w-full justify-between">
                        <MobileLink
                          href={item.href}
                          name={item.name}
                          onClick={() => setMobileMenuOpen(false)}
                        />
                      </div>
                      {activeLastSlide.children &&
                        index !== activeLastSlide.children.length - 1 && (
                          <MobileDivider />
                        )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className="py-6">
              <a
                href="#"
                className="bg-primary w-full text-base flex justify-center items-center text-white font-bold h-[48px] rounded-full"
              >
                Contact Us
              </a>
            </div>
            <ul className="flex mb-0 space-x-8 justify-center">
              <IconSocial />
            </ul>
            <div className="mt-4 flex justify-center">
              <div className="relative flex items-center">
                <button
                  onClick={goToOldSite}
                  className="text-gray-300 rounded-full p-2 border border-gray-600 hover:bg-[#3E3355] transition-all"
                  aria-label="View classic site"
                >
                  <GrRevert size={20} />
                </button>
                <span className="ml-2 text-xs text-gray-400">
                  View classic site
                </span>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}

export default NavBar
