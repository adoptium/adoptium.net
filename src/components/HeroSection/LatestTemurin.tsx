'use client'

import React, { MutableRefObject, useRef } from "react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from 'next-intl';
import { detectOS, UserOS } from "@/utils/detectOS"
import { useFetchLatestForOS, useOnScreen } from "@/hooks"
import OSIcon from './OSIcon'

let userOSName: string
let userOSAPIName: string
let arch: string = "x64"
let isSafari: boolean

interface LatestTemurinProps {
  latestLTS: string | number;
}

const LatestTemurin: React.FC<LatestTemurinProps> = ({ latestLTS }) => {
  const t = useTranslations('HomePage');
  const defaultVersion = latestLTS

  const userOS = detectOS()
  switch (userOS) {
    case UserOS.MAC:
      userOSName = "macOS"
      userOSAPIName = "mac"
      if (typeof document !== "undefined") {
        const gl = document.createElement("canvas").getContext("webgl")
        const ext = gl && gl.getExtension("WEBGL_debug_renderer_info")
        const param = (ext && gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) || ""
        isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
        //Detect if the user is using a Apple GPU (M1)
        if (isSafari || (param.match(/Apple/) && !param.match(/Apple GPU/))) {
          arch = "aarch64"
        }
      }
      break
    case UserOS.LINUX:
    case UserOS.UNIX:
      userOSName = "Linux"
      userOSAPIName = "linux"
      break
    case UserOS.WIN:
      userOSName = "Windows"
      userOSAPIName = "windows"
      break
    default:
      break
  }

  const ref = useRef<HTMLDivElement | null>(null)
  const isVisible = useOnScreen(ref as MutableRefObject<Element>, true)
  const binary = useFetchLatestForOS(
    isVisible,
    defaultVersion,
    userOSAPIName,
    arch,
  )

  return (
    <div ref={ref} className="text-center w-full">
      <h1 className="font-semibold leading-[72px] lg:leading-[120px] text-white-900 text-[64px] lg:text-[104px] mb-8">
        {t("the-power")}
      </h1>
      <p className="lg:my-10 mt-6 mb-10 text-2xl leading-8 text-white-600 font-semibold">
        {binary ? (
          t("download-temurin-for", { defaultVersion: String(defaultVersion), userOSName, arch })
        ) : (
          t("download-temurin-short", { defaultVersion: String(defaultVersion) })
        )}
      </p>
      <div className="mt-10 flex items-center sm:flex-row flex-col-reverse justify-center gap-6">
        <Link
          href="/temurin/releases"
          className="text-base underline transition duration-300 ease-in-out font-bold leading-6 text-white-900"
        >
          {t("other-downloads")}
        </Link>
        {binary ? (
          <Link
            href={{
              pathname: "/download",
              query: {
                link: binary.link,
                checksum: binary.checksum,
                os: userOSName,
                arch: arch,
                pkg_type: "JDK",
                java_version: binary.release_name,
              },
            }}
            className="rounded-[80px] hover:shadow-2xl transition-all duration-300 bg-[#FF1464] border ease-in-out border-[#FF1464] flex items-center justify-center gap-3 w-[244px] h-[56px] text-white font-bold leading-6 text-base"
          >
            {/* Icon will only render on client-side */}
            <span className="w-6 h-6 flex items-center justify-center">
              <OSIcon os={userOS} />
            </span>
            {t("download-temurin-button")}
          </Link>
        ) : (
          <a
            href="#"
            className="rounded-[80px] bg-[#FF1464] cursor-not-allowed hover:bg-transparent border transition duration-300 ease-in-out hover:text-[#FF1464] border-[#FF1464] flex items-center justify-center gap-3 w-[244px] h-[56px] text-white font-bold leading-6 text-base"
          >
            {/* Icon will only render on client-side */}
            <span className="w-6 h-6 flex items-center justify-center">
              <OSIcon os={userOS} />
            </span>
            {t("download-temurin-button")}
          </a>
        )}
      </div>
    </div>
  )
}

export default LatestTemurin
