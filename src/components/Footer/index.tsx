"use client"

import { Link } from "@/i18n/navigation"
import Image from "next/image"
import { FooterIcon } from "@/components/Common/Icon"
import IconSocial from "@/components/IconSocial"

interface FooterData {
  title: {
    key: string
    defaultText: string
  }
  links: Array<{
    text: {
      key: string
      defaultText: string
    }
    url: string
    disclaimerMessage?: {
      key: string
      defaultText: string
    }
  }>
}

const footerData: FooterData[] = [
  {
    title: {
      key: "footer.eclipse.foundation",
      defaultText: "Eclipse Foundation",
    },
    links: [
      {
        text: { key: "footer.about.us", defaultText: "About Us" },
        url: "https://www.eclipse.org/org/",
      },
      {
        text: { key: "footer.contact.us", defaultText: "Contact Us" },
        url: "https://www.eclipse.org/org/foundation/contact.php",
      },
      {
        text: { key: "footer.donate", defaultText: "Donate" },
        url: "https://www.eclipse.org/donate/adoptium",
      },
      {
        text: { key: "footer.members", defaultText: "Members" },
        url: "https://www.eclipse.org/membership",
      },
      {
        text: { key: "footer.governance", defaultText: "Governance" },
        url: "https://www.eclipse.org/org/documents/",
      },
      {
        text: { key: "footer.code.of.conduct", defaultText: "Code of Conduct" },
        url: "https://www.eclipse.org/org/documents/Community_Code_of_Conduct.php",
      },
      {
        text: {
          key: "footer.logo.and.artwork",
          defaultText: "Logo and Artwork",
        },
        url: "https://www.eclipse.org/artwork/",
      },
      {
        text: {
          key: "footer.board.of.directors",
          defaultText: "Board of Directors",
        },
        url: "https://www.eclipse.org/org/foundation/directors.php",
      },
    ],
  },
  {
    title: { key: "footer.legal", defaultText: "Legal" },
    links: [
      {
        text: { key: "footer.privacy.policy", defaultText: "Privacy Policy" },
        url: "https://www.eclipse.org/legal/privacy.php",
      },
      {
        text: { key: "footer.terms.of.use", defaultText: "Terms of Use" },
        url: "https://www.eclipse.org/legal/termsofuse.php",
      },
      {
        text: { key: "footer.copyright.agent", defaultText: "Copyright Agent" },
        url: "https://www.eclipse.org/legal/copyright.php",
      },
      {
        text: {
          key: "footer.eclipse.public.license",
          defaultText: "Eclipse Public License",
        },
        url: "https://www.eclipse.org/legal/epl-2.0/",
      },
      {
        text: { key: "footer.legal.resources", defaultText: "Legal Resources" },
        url: "https://www.eclipse.org/legal/",
      },
    ],
  },
  {
    title: { key: "footer.useful.links", defaultText: "Useful Links" },
    links: [
      {
        text: { key: "footer.report.a.bug", defaultText: "Report a Bug" },
        url: "https://github.com/adoptium/adoptium-support/issues",
      },
      {
        text: { key: "footer.documentation", defaultText: "Documentation" },
        url: "/docs",
      },
      {
        text: {
          key: "footer.how.to.contribute",
          defaultText: "How to Contribute",
        },
        url: "/contributing",
      },
      {
        text: { key: "footer.mailing.lists", defaultText: "Mailing Lists" },
        url: "https://www.eclipse.org/mail/",
      },
      {
        text: { key: "footer.forums", defaultText: "Forums" },
        url: "https://www.eclipse.org/forums/",
      },
      {
        text: { key: "footer.marketplace", defaultText: "Marketplace" },
        url: "https://marketplace.eclipse.org/",
      },
      {
        text: { key: "footer.swag.store", defaultText: "Swag Store" },
        url: "https://eclipse-foundation.store/collections/eclipse-adoptium",
        disclaimerMessage: {
          key: 'swag.store.disclaimer',
          defaultText: 'By clicking the continue button, you will leave our website. Please be aware that new terms of use will apply to the Eclipse Foundation store, powered by Fourthwall: https://eclipse-foundation.store/.'
        }
      },
    ],
  },
  {
    title: { key: "footer.useful.other", defaultText: "Other" },
    links: [
      {
        text: { key: "footer.ide.and.tools", defaultText: "IDE and Tools" },
        url: "https://www.eclipse.org/ide/",
      },
      {
        text: { key: "footer.projects", defaultText: "Projects" },
        url: "https://www.eclipse.org/projects",
      },
      {
        text: { key: "footer.working.groups", defaultText: "Working Groups" },
        url: "https://www.eclipse.org/org/workinggroups/",
      },
      {
        text: {
          key: "footer.research.eclipse",
          defaultText: "Research@Eclipse",
        },
        url: "https://www.eclipse.org/org/research/",
      },
      {
        text: {
          key: "footer.report.a.vulnerability",
          defaultText: "Report a Vulnerability",
        },
        url: "https://www.eclipse.org/security/",
      },
      {
        text: { key: "footer.service.status", defaultText: "Service Status" },
        url: "https://status.eclipse.org/",
      },
    ],
  },
]

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue">
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-8 md:py-16 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="hidden md:block">
          <div className="grid grid-cols-1 gap-8 border-b border-gray-800 mb-3 pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:pt-16 pb-6">
            {footerData.map((section, index) => (
              <div key={index}>
                <p className="font-medium text-pink">
                  {section.title.defaultText}
                </p>
                <ul className="mt-6 space-y-2 text-sm">
                  {section.links.map((link, linkIndex) => {
                    const isInternalLink = !/^https?:\/\//.test(link.url)

                    return (
                      <li key={linkIndex}>
                        {isInternalLink ? (
                          <Link
                            href={link.url}
                            className="text-white text-base font-normal leading-6 transition hover:opacity-75 dark:text-gray-200"
                          >
                            {link.text.defaultText}
                          </Link>
                        ) : link.disclaimerMessage ? (
                          <a
                            href="#"
                            onClick={e => {
                              e.preventDefault()
                              // TODO: Implement leaving site disclaimer modal
                              if (link.disclaimerMessage && window.confirm(link.disclaimerMessage.defaultText)) {
                                window.open(link.url, '_blank')
                              }
                            }}
                            className="text-white text-base font-normal leading-6 transition hover:opacity-75 dark:text-gray-200"
                          >
                            {link.text.defaultText}
                          </a>
                        ) : (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white text-base font-normal leading-6 transition hover:opacity-75 dark:text-gray-200"
                          >
                            {link.text.defaultText}
                          </a>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="sm:flex sm:items-center sm:justify-between pt-4">
            <div className="text-teal-600 flex dark:text-teal-300">
              <FooterIcon />
              <p className="text-sm ml-3 flex items-center gap-4 text-white font-normal leading-5">
                Copyright © Eclipse Foundation. All Rights Reserved.
              </p>
            </div>

            <ul className="mt-8 flex justify-start gap-6 sm:mt-0 sm:justify-end">
              <li>
                <a
                  href="https://www.netlify.com"
                  rel="noreferrer"
                  target="_blank"
                  className="leading-6 transition hover:opacity-75 dark:text-gray-200"
                >
                  <Image
                    src="/images/netlify-light.svg"
                    alt="Deploys by Netlify"
                    width={60}
                    height={10}
                  />
                </a>
              </li>

              <IconSocial />
            </ul>
          </div>
        </div>
        {/* TODO: Add mobile footer component */}
        <div className="w-full px-4 md:hidden block">
          <div className="space-y-8">
            {footerData.map((section, index) => (
              <div key={index}>
                <p className="font-medium text-pink mb-4">
                  {section.title.defaultText}
                </p>
                <ul className="space-y-2 text-sm">
                  {section.links.map((link, linkIndex) => {
                    const isInternalLink = !/^https?:\/\//.test(link.url)
                    return (
                      <li key={linkIndex}>
                        {isInternalLink ? (
                          <Link
                            href={link.url}
                            className="text-white text-base font-normal leading-6 transition hover:opacity-75"
                          >
                            {link.text.defaultText}
                          </Link>
                        ) : (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white text-base font-normal leading-6 transition hover:opacity-75"
                          >
                            {link.text.defaultText}
                          </a>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
            <div className="pt-4">
              <div className="text-teal-600 flex dark:text-teal-300 mb-4">
                <FooterIcon />
                <p className="text-sm ml-3 flex items-center gap-4 text-white font-normal leading-5">
                  Copyright © Eclipse Foundation. All Rights Reserved.
                </p>
              </div>
              <ul className="flex justify-start gap-6">
                <IconSocial />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
