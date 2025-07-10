import React from "react"
import { FaGithub, FaLinkedin, FaSlack, FaYoutube } from "react-icons/fa"
import { FaXTwitter, FaBluesky, FaMastodon } from "react-icons/fa6"

interface IconSocialProps {
  link?: string;
  icon?: string;
  className?: string;
}

// Renders a single social media icon based on props, or the full list if no props are provided
const IconSocial: React.FC<IconSocialProps> = ({ link, icon, className }) => {
  // If no props are provided, render the full social icons list
  if (!link && !icon) {
    return <SocialIcons />;
  }

  // Render a single icon based on the provided props
  return renderSocialIcon(icon || 'twitter', link || '', className || '');
};

// Helper function to render the appropriate icon based on the icon name
const renderSocialIcon = (iconName: string, link: string, className: string) => {
  const iconClassName = `${className || 'h-6 w-6'}`;

  return (
    <a
      href={link}
      rel="noreferrer"
      target="_blank"
      className="leading-6 transition hover:opacity-75 dark:text-gray-200"
    >
      <span className="sr-only">{iconName}</span>
      {iconName === 'twitter' && <FaXTwitter className={iconClassName} />}
      {iconName === 'linkedin' && <FaLinkedin className={iconClassName} />}
      {iconName === 'youtube' && <FaYoutube className={iconClassName} />}
      {iconName === 'github' && <FaGithub className={iconClassName} />}
      {iconName === 'slack' && <FaSlack className={iconClassName} />}
      {iconName === 'mastodon' && <FaMastodon className={iconClassName} />}
      {iconName === 'bluesky' && <FaBluesky className={iconClassName} />}
    </a>
  );
};

const SocialIcons = () => {
  return (
    <>
      <li>
        <a
          href="https://x.com/adoptium"
          rel="noreferrer"
          target="_blank"
          className="leading-6 transition hover:opacity-75 dark:text-gray-200"
        >
          <span className="sr-only">X.com</span>
          <FaXTwitter className="h-6 w-6" />
        </a>
      </li>

      <li>
        <a
          href="https://www.linkedin.com/showcase/adoptium/"
          rel="noreferrer"
          target="_blank"
          className="leading-6 transition hover:opacity-75 dark:text-gray-200"
        >
          <span className="sr-only">LinkedIn</span>
          <FaLinkedin className="h-6 w-6" />
        </a>
      </li>

      <li>
        <a
          href="https://www.youtube.com/c/EclipseAdoptium"
          rel="noreferrer"
          target="_blank"
          className="leading-6 transition hover:opacity-75 dark:text-gray-200"
        >
          <span className="sr-only">YouTube</span>
          <FaYoutube className="h-6 w-6" />
        </a>
      </li>

      <li>
        <a
          href="https://github.com/adoptium"
          rel="noreferrer"
          target="_blank"
          className="leading-6 transition hover:opacity-75 dark:text-gray-200"
        >
          <span className="sr-only">GitHub</span>
          <FaGithub className="h-6 w-6" />
        </a>
      </li>

      <li>
        <a
          href="https://adoptium.net/slack"
          rel="noreferrer"
          target="_blank"
          className="leading-6 transition hover:opacity-75 dark:text-gray-200"
        >
          <span className="sr-only">Slack</span>
          <FaSlack className="h-6 w-6" />
        </a>
      </li>

      <li>
        <a
          href="https://fosstodon.org/@adoptium"
          rel="noreferrer"
          target="_blank"
          className="leading-6 transition hover:opacity-75 dark:text-gray-200"
        >
          <span className="sr-only">Mastodon</span>
          <FaMastodon className="h-6 w-6" />
        </a>
      </li>

      <li>
        <a
          href="https://bsky.app/profile/adoptium.net"
          rel="noreferrer"
          target="_blank"
          className="leading-6 transition hover:opacity-75 dark:text-gray-200"
        >
          <span className="sr-only">Bluesky</span>
          <FaBluesky className="h-6 w-6" />
        </a>
      </li>
    </>
  )
}

export default IconSocial
