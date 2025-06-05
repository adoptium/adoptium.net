"use client"

import {
  TwitterShareButton,
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  BlueskyShareButton,
} from "react-share"

import {
  FaLinkedin,
  FaFacebook,
  FaReddit,
} from "react-icons/fa";

import {
  FaXTwitter,
  FaBluesky,
  FaEnvelope,
} from "react-icons/fa6";


interface SocialProps {
  twitter: string;
}

interface SiteMetadata {
  siteUrl: string;
  social: SocialProps;
}

interface PostProps {
  title: string;
  tags?: string[];
}

interface ShareButtonProps {
  location: string;
  siteMetadata: SiteMetadata;
  post: PostProps;
}

const ShareButton: React.FC<ShareButtonProps> = props => {
  const { location, siteMetadata, post } = props
  const twitter = [siteMetadata.social.twitter]
  const url = siteMetadata.siteUrl + location

  return (
    <div id="share-buttons">
      <TwitterShareButton
        aria-label="Share on X (Twitter)"
        url={url}
        className="mr-2"
        title={post.title}
        hashtags={post.tags}
        related={twitter}
      >
        <FaXTwitter size={25} />
      </TwitterShareButton>

      <LinkedinShareButton
        aria-label="Share on Linkedin"
        url={url}
        className="mr-2"
        title={post.title}
        source={siteMetadata.siteUrl}
      >
        <FaLinkedin size={25} />
      </LinkedinShareButton>

      <FacebookShareButton
        aria-label="Share on Facebook"
        url={url}
        className="mr-2"
      >
        <FaFacebook size={25} />
      </FacebookShareButton>

      <RedditShareButton
        aria-label="Share on Reddit"
        url={url}
        className="mr-2"
        title={post.title}
      >
        <FaReddit size={25} />
      </RedditShareButton>

      <BlueskyShareButton
        aria-label="Share on Bluesky"
        url={url}
        className="mr-2"
        title={post.title}
      >
        <FaBluesky size={25} />
      </BlueskyShareButton>

      <EmailShareButton
        aria-label="Share via Email"
        url={url}
        className="mr-2"
        subject={post.title}
      >
        <FaEnvelope size={25} />
      </EmailShareButton>
    </div>
  )
}

export default ShareButton
