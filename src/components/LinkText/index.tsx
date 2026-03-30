'use client'

import React from "react"
import { Link } from "@/i18n/navigation"

type LinkTextProps = {
  href: string
  children?: React.ReactNode
  className?: string
}

const LinkText = ({ href, children, className }: LinkTextProps) => {
  const finalClassName = className || "border-b border-white"
  return href.startsWith("http") ? (
    <a href={href} target="_blank" rel="noreferrer" className={finalClassName}>
      {children}
    </a>
  ) : (
    <Link href={href} className={finalClassName}>{children}</Link>
  )
}

export default LinkText
