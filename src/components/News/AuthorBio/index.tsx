import React from "react"
import { FaGithub, FaLinkedin } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import ProfilePic from "@/components/ProfilePic"


interface GitHubLinkProps {
  name?: string
}

export const GitHubLink: React.FC<GitHubLinkProps> = (props) => {
  if (!props.name) {
    return null
  }

  return (
    <a
      className="px-1"
      aria-label="GitHub Profile"
      href={`https://github.com/${props.name}`}
      target="blank"
      rel="noopener noreferrer"
    >
      <FaGithub size={25} />
    </a>
  )
}

interface TwitterLinkProps {
  name?: string
}

export const TwitterLink: React.FC<TwitterLinkProps> = (props) => {
  if (!props.name) {
    return null
  }

  return (
    <a
      className="px-1"
      aria-label="Twitter Profile"
      href={`https://x.com/${props.name}`}
      target="blank"
      rel="noopener noreferrer"
    >
      <FaXTwitter size={25} />
    </a>
  )
}

interface LinkedinLinkProps {
  name?: string
}

export const LinkedinLink: React.FC<LinkedinLinkProps> = (props: LinkedinLinkProps) => {
  if (!props.name) {
    return null
  }

  return (
    <a
      className="px-1"
      aria-label="LinkedIn Profile"
      href={`https://www.linkedin.com/in/${props.name}`}
      target="blank"
      rel="noopener noreferrer"
    >
      <FaLinkedin size={25} />
    </a>
  )
}


interface Author {
  name: string;
  summary?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
}

interface AuthorBioProps {
  author: Author;
  identifier: string;
}

const AuthorBio: React.FC<AuthorBioProps> = ({ author, identifier }) => {

  return (
    <>
    <div className="flex flex-wrap justify-center items-center gap-5 space-x-4 pb-4">
    <ProfilePic identifier={identifier} name={author.name} />
    </div>
    <div className="flex flex-wrap justify-center items-center gap-5 space-x-4">
      <span className="text-[16px] font-bold leading-[150%] text-white flex items-center">
      <span className="pr-2">{author.summary && <>{author.summary}</>}</span>
      <GitHubLink name={author.github} />
      <TwitterLink name={author.twitter} />
      <LinkedinLink name={author.linkedin} />
      </span>
    </div>
    </>
  )
}

export default AuthorBio
