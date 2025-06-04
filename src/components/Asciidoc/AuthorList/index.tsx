'use client';

import React from "react"
import { useTranslations } from "next-intl"
import Author from "./Author"

interface Props {
  authors: string[]
}

const AuthorList: React.FC<Props> = ({ authors = [] }) => {
  const t = useTranslations("AuthorList")
  if (authors.length) {
    return (
      <div className="mt-10 flex-col justify-center items-start gap-4">
        <div className="self-stretch text-white my-5 text-lg font-semibold leading-normal">
          {t("documentation-authors")}
        </div>
        <div className="flex flex-wrap justify-start items-center space-x-[-12px]">
          {authors.map((author) => (
            <Author username={author} key={author} size={55} />
          ))}
        </div>
      </div>
    )
  }

  return null
}

export default AuthorList
