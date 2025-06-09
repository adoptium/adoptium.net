'use client'

import React from "react"
import { Link } from "@/i18n/navigation"

type LinkTextProps = {
  href: string
  children?: React.ReactNode
}

const LinkText = ({ href, children }: LinkTextProps) => {
  return href.startsWith("http") ? (
    <a href={href} target="_blank" rel="noreferrer" className="border-b border-white">
      {children}
    </a>
  ) : (
    <Link href={href} className="border-b border-white">{children}</Link>
  )
}

export default LinkText
