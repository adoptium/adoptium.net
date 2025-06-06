import React from "react"
import Link from "next/link"
import ProfilePicInline from "@/components/ProfilePicInline"

interface IBylineProps {
  author: string
  date: string
  identifier: string
}

const Byline: React.FC<IBylineProps> = props => {
  const { author, date, identifier } = props
  return (
    <div className="flex justify-center items-center gap-5">
      <ProfilePicInline identifier={identifier} name={author} />
      <span className="text-[16px] font-bold leading-[150%] text-white">
        <Link href={`/news/author/${identifier}`}>
          <span className="text-primary pr-2">{author},</span> {date}
        </Link>
      </span>
    </div>
  )
}

export default Byline
