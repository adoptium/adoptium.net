import React from "react"
import Image from "next/image"

interface ProfilePicProps {
  identifier: string
  name: string
}

const ProfilePic = (props: ProfilePicProps) => {
  return (
    <Image
      src={`/images/authors/${props.identifier}.jpg`}
      alt={props.name}
      width={50}
      height={50}
      className="ml-2 mb-0 rounded-full"
    />
  )
}

export default ProfilePic
