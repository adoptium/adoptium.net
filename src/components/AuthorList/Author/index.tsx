import React from 'react';
import styles from './index.module.scss';

interface Props {
  index: number;
  username: string;
  size: string;
}

const Author = ({
  index,
  username,
  size = '64',
}: Props): null | JSX.Element => {
  if (!username) {
    return null;
  }
  // Clean up username and build links.
  const githubUserName = username.trim();
  const githubLink = `https://github.com/${githubUserName}`;
  const githubImgLink = `https://github.com/${githubUserName}.png?size=${size}`;

  // If it's the first author then no margin left.
  const mleft = index === 0 ? { marginLeft: 0 } : {};

  return (
    <li>
      <a
        className={styles.link + ' author-icon'}
        href={githubLink}
        aria-label={githubUserName}
        key={username}
        target="_blank"
        rel="noopener noreferrer"
        style={mleft}
      >
        <img src={githubImgLink} alt={username} />
      </a>
    </li>
  );
};

export default Author;
