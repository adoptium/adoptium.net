'use client'

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

export default function ContributorsSection() {
  // During tests, usePathname() may return null or undefined
  // In a real browser environment, it would return a string
  const pathname = usePathname() || '';
  
  // Don't render Contributors on the homepage (root or locale root paths)
  // Matches /, /en, /en/, /zh-CN, /zh-CN/ etc.
  const isHomePage = pathname === '/' || 
                     pathname === '/index' || 
                     pathname === '' || // For test environment
                     /^\/([a-z]{2}(-[A-Z]{2})?)\/?$/.test(pathname);
  
  if (isHomePage) {
    return null;
  }
  
  // Dynamic import to avoid loading Contributors on the client if not needed
  const Contributors = dynamic(() => import('@/components/Contributors'), {
    loading: () => <div className="h-20" /> // Height placeholder while loading
  });
  
  return <Contributors />;
}
