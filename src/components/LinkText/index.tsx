import { Link } from 'gatsby';
import React from 'react';

const LinkText = ({ href, children }) => {
    return (
        <>
        {href.startsWith('http') ? <a href={href} target='_blank' rel='noreferrer'>{children}</a> : <Link to={href}>{children}</Link>}
        </>
    )
}

export default LinkText