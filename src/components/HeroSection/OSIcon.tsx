'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { UserOS } from "@/utils/detectOS"

// Import the icons lazily without using require
import { FaApple, FaWindows, FaLinux } from "react-icons/fa"

// Create a client-only component wrapper with no SSR
const ClientOnlyOSIcon = ({ os, size = 25 }: { os: UserOS; size?: number }) => {
  // Only run in client
  if (typeof window === 'undefined') {
    return <span style={{ display: 'inline-block', width: size, height: size }}></span>;
  }
  
  switch (os) {
    case UserOS.MAC:
      return <FaApple size={size} />;
    case UserOS.WIN:
      return <FaWindows size={size} />;
    case UserOS.LINUX:
    case UserOS.UNIX:
      return <FaLinux size={size} />;
    default:
      return <span style={{ display: 'inline-block', width: size, height: size }}></span>;
  }
};

// Create a dynamic import without the require syntax
const OSIcon = dynamic(() => Promise.resolve(ClientOnlyOSIcon), { ssr: false })

export default OSIcon;
