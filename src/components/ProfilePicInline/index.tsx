import React from "react"
import Image from "next/image"

interface ProfilePicInlineProps {
  identifier: string
  name: string
}

const ProfilePicInline: React.FC<ProfilePicInlineProps> = props => {
  return (
    <Image
      src={`/images/authors/${props.identifier}.jpg`}
      alt={props.name}
      width={30}
      height={30}
      className="ml-2 mb-0 rounded-full"
    />
  )
}

export default ProfilePicInline
