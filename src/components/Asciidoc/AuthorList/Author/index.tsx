import React from "react"
import Image from "next/image"

interface Props {
  username: string
  size: number
}

const Author: React.FC<Props> = ({ username, size }) => {
  if (!username) {
    return null
  }
  // Clean up username and build links.
  const githubUserName = username.trim()
  const githubLink = `https://github.com/${githubUserName}`
  const githubImgLink = `https://github.com/${githubUserName}.png?size=${size}`

  return (
    <a
      href={githubLink}
      aria-label={githubUserName}
      key={username}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        className="rounded-full border-solid border-4 border-purple mb-6"
        src={githubImgLink}
        alt={username}
        width={size}
        height={size}
      />
    </a>
  )
}

export default Author
