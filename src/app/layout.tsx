import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import Script from 'next/script'
import { getLocale } from 'next-intl/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://adoptium.net'),
  title: {
    default: 'Home | Adoptium',
    template: '%s | Adoptium'
  },
  description: 'Eclipse Adoptium provides prebuilt OpenJDK binaries from a fully open source set of build scripts and infrastructure.',
  authors: [{ name: 'Eclipse Adoptium' }],
  keywords: ['adoptium', 'openjdk', 'java', 'jdk', 'eclipse', 'temurin'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://adoptium.net',
    siteName: 'Adoptium',
    title: 'Adoptium',
    description: 'Eclipse Adoptium provides prebuilt OpenJDK binaries from a fully open source set of build scripts and infrastructure.',
    images: [
      {
        url: '/images/adoptium-icon.png',
        width: 1200,
        height: 630,
        alt: 'Adoptium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Adoptium',
    creator: '@Adoptium',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/images/favicon-32x32.png',
    apple: '/images/adoptium-icon.png',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get locale dynamically - this will work for both the root path (/)
  // and localized paths (/[locale])
  const locale = await getLocale();
  
  return (
    <html lang={locale}>
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5WLCZXC');
          `}
        </Script>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-9HHPS5RX9D"
        />
        <Script
          id="gtag-inline-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9HHPS5RX9D', {
                anonymize_ip: true
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5WLCZXC"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
          {children}
      </body>
    </html>
  )
}
