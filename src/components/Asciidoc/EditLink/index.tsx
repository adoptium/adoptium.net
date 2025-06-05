import React from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { IoMdGitPullRequest } from "react-icons/io"

type Props = {
  relativePath?: string
}

const EditLink: React.FC<Props> = ({ relativePath }) => {
  const t = useTranslations("EditLink")
  if (!relativePath) {
    return null
  }

  const href = `https://github.com/adoptium/adoptium.net/edit/main/content/asciidoc-pages/${relativePath}`

  return (
    <div className="w-full backdrop-blur-sm bg-gradient-to-br from-[#20114D]/30 to-[#2A0845]/40 px-8 py-6 rounded-2xl border border-white/10 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:border-white/20 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-5">
        <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full opacity-30 blur-md"></div>
          <Image
            fill
            className="relative w-full h-full p-3 bg-[#200D46]/60 border border-white/20 rounded-full shadow-md"
            src="/images/icons/edit.svg"
            alt="edit icon"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-white text-xl md:text-2xl font-bold leading-tight">
            {t("help-us-make-these-docs-great")}
          </h3>
          <p className="text-white/90 text-sm md:text-base font-normal leading-relaxed max-w-lg">
            {t("all-adoptium-docs-are-open-source")}
          </p>
        </div>
      </div>
      <a href={href} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
        <button className="group relative px-6 py-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#FF3366] to-[#9933FF] text-white text-base leading-6 font-medium shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
          <span className="relative z-10 flex items-center gap-2">
            <IoMdGitPullRequest className="h-5 w-5" />
            {t("edit-this-page")}
          </span>
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </a>
    </div>
  )
}

export default EditLink
