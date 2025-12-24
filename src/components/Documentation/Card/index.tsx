import React from "react"
import { Link } from "@/i18n/navigation"
import { FaExternalLinkAlt } from "react-icons/fa"

interface LinkItem {
  link: string
  name: string
}

interface Props {
  links: LinkItem[]
  title: string
  Icon: React.ComponentType<{ className?: string }>
  link: string
}

const DocumentationCard: React.FC<Props> = ({ links, title, Icon, link }) => {
  if (!title || !Icon || !links || typeof links !== "object") {
    return null
  }

  return (
    <Link href={link} className="w-full lg:w-1/3 p-3 group">
      <div className="bg-gradient-to-br from-[#200E46]/90 to-[#2B1A4F]/90 rounded-3xl border border-white/20 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#FF1464]/10 hover:border-[#FF1464]/30 h-full transform hover:-translate-y-1">
        <div className="relative p-6">
          {/* Decorative element */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-[#FF1464]/30 to-[#FF4B54]/20 rounded-full blur-xl opacity-50"></div>

          <div className="relative">
            <p className="mb-5 text-xl font-semibold flex items-center">
              <span className="inline-flex items-center justify-center bg-[#2B1A4F] p-3 rounded-xl mr-3 shadow-inner border border-white/10">
                <Icon className="text-[#FF1464] h-5 w-5" />
              </span>
              <span className="text-white/90">{title}</span>
            </p>
            <div className="divide-y divide-white/10">
              {links.map((link: LinkItem) =>
                // Check if the link is external or internal
                link.link.includes("http") ? (
                  <a
                    href={link.link}
                    key={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 flex justify-between items-center text-white/80 hover:text-white hover:bg-white/10 rounded-lg my-1 transition-all duration-200"
                  >
                    {link.name} <FaExternalLinkAlt size={13} className="ml-2 text-[#FF1464]/80" />
                  </a>
                ) : (
                  <Link
                    href={link.link}
                    key={link.link}
                    className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg my-1 transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default DocumentationCard
