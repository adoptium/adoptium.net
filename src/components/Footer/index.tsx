"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { FooterIcon } from "@/components/Common/Icon";
import IconSocial from "@/components/IconSocial";
import { useState } from "react";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";

interface FooterData {
  title: {
    key: string;
    defaultText: string;
  };
  links: Array<{
    text: {
      key: string;
      defaultText: string;
    };
    url: string;
    disclaimerMessage?: {
      key: string;
      defaultText: string;
    };
  }>;
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
        text: { key: "footer.marketplace", defaultText: "Marketplace" },
        url: "https://marketplace.eclipse.org/",
      },
      {
        text: { key: "footer.sitemap", defaultText: "Sitemap" },
        url: "/sitemap",
      },
      {
        text: { key: "footer.swag.store", defaultText: "Swag Store" },
        url: "https://eclipse-foundation.store/collections/eclipse-adoptium",
        disclaimerMessage: {
          key: "swag.store.disclaimer",
          defaultText:
            "By clicking the continue button, you will leave our website. Please be aware that new terms of use will apply to the Eclipse Foundation store, powered by Fourthwall: https://eclipse-foundation.store/.",
        },
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
];

// Plus/Minus icon component
const ToggleIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <div
    className={`transition-transform duration-300 ${
      isOpen ? "rotate-180" : ""
    }`}
  >
    {isOpen ? (
      <CiCircleMinus size={32} className="text-pink" />
    ) : (
      <CiCirclePlus
        size={32}
        className="text-gray-400 group-hover:text-white transition-colors"
      />
    )}
  </div>
);

// Mobile footer section component
const MobileFooterSection: React.FC<{ section: FooterData }> = ({
  section,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        className="flex justify-between w-full items-center py-4 group"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-expanded={isOpen}
      >
        <span
          className={`text-lg font-bold transition-colors duration-200 ${
            isOpen ? "text-pink" : "text-white group-hover:text-pink"
          }`}
        >
          {section.title.defaultText}
        </span>
        <ToggleIcon isOpen={isOpen} />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mb-6"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="space-y-3 pl-2 border-l-2 border-white/10 ml-1">
            {section.links.map((link, linkIndex) => {
              const isInternalLink = !/^https?:\/\//.test(link.url);
              const linkClasses =
                "text-gray-400 text-base hover:text-white transition-colors duration-200 block py-1";

              return (
                <li key={linkIndex}>
                  {isInternalLink ? (
                    <Link href={link.url} className={linkClasses}>
                      {link.text.defaultText}
                    </Link>
                  ) : link.disclaimerMessage ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          link.disclaimerMessage &&
                          window.confirm(link.disclaimerMessage.defaultText)
                        ) {
                          window.open(link.url, "_blank");
                        }
                      }}
                      className={linkClasses}
                    >
                      {link.text.defaultText}
                    </a>
                  ) : (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClasses}
                    >
                      {link.text.defaultText}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0024] border-t border-white/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink via-purple to-blue opacity-50"></div>
      <div className="absolute -top-[400px] -right-[400px] w-[800px] h-[800px] bg-purple/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-20 sm:px-6 lg:px-8 relative z-10">
        <div className="hidden md:block">
          <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-16 sm:grid-cols-2 lg:grid-cols-4">
            {footerData.map((section, index) => (
              <div key={index} className="group">
                <h3 className="font-bold text-lg text-white mb-6 relative inline-block">
                  {section.title.defaultText}
                  <span className="absolute -bottom-2 left-0 w-12 h-1 bg-pink rounded-full transition-all duration-300 group-hover:w-full opacity-50 group-hover:opacity-100"></span>
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => {
                    const isInternalLink = !/^https?:\/\//.test(link.url);
                    const linkClasses =
                      "text-gray-400 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-block";

                    return (
                      <li key={linkIndex}>
                        {isInternalLink ? (
                          <Link href={link.url} className={linkClasses}>
                            {link.text.defaultText}
                          </Link>
                        ) : link.disclaimerMessage ? (
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (
                                link.disclaimerMessage &&
                                window.confirm(
                                  link.disclaimerMessage.defaultText
                                )
                              ) {
                                window.open(link.url, "_blank");
                              }
                            }}
                            className={linkClasses}
                          >
                            {link.text.defaultText}
                          </a>
                        ) : (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClasses}
                          >
                            {link.text.defaultText}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-start gap-6 max-w-2xl">
              <div className="shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                <FooterIcon />
              </div>
              <div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Copyright © Eclipse Foundation. All Rights Reserved.
                </p>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Java and OpenJDK are trademarks or registered trademarks of
                  Oracle and/or its affiliates. Other names may be trademarks of
                  their respective owners.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-6">
              <ul className="flex gap-5">
                <IconSocial />
              </ul>
              <a
                href="https://www.netlify.com"
                rel="noreferrer"
                target="_blank"
                className="opacity-50 hover:opacity-100 transition-opacity duration-300"
              >
                <Image
                  src="/images/netlify-light.svg"
                  alt="Deploys by Netlify"
                  width={80}
                  height={25}
                />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile footer with accordion */}
        <div className="md:hidden block">
          <div className="flex flex-col space-y-2">
            {footerData.map((section, index) => (
              <MobileFooterSection key={index} section={section} />
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col gap-8 items-center text-center">
              <div className="flex justify-center">
                <ul className="flex gap-5">
                  <IconSocial />
                </ul>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-300">
                  Copyright © Eclipse Foundation. All Rights Reserved.
                </p>
                <p className="text-xs text-gray-500 px-4">
                  Java and OpenJDK are trademarks or registered trademarks of
                  Oracle and/or its affiliates. Other names may be trademarks of
                  their respective owners.
                </p>
              </div>

              <a
                href="https://www.netlify.com"
                rel="noreferrer"
                target="_blank"
                className="opacity-50 hover:opacity-100 transition-opacity duration-300 mt-4"
              >
                <Image
                  src="/images/netlify-light.svg"
                  alt="Deploys by Netlify"
                  width={80}
                  height={25}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
