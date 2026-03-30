"use client";

import React, { RefObject, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { sendDownloadEvent } from "@/utils/gtag";
import { useTranslations } from "next-intl";
import { detectOS, UserOS } from "@/utils/detectOS";
import { useFetchLatestForOS, useOnScreen } from "@/hooks";
import OSIcon from "./OSIcon";

let userOSName: string;
let userOSAPIName: string;
let arch: string = "x64";
let isSafari: boolean;

interface DownloadButtonProps {
  latestLTS: number;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ latestLTS }) => {
  const t = useTranslations("HomePage");
  const defaultVersion = latestLTS;

  const userOS = detectOS();
  switch (userOS) {
    case UserOS.MAC:
      userOSName = "macOS";
      userOSAPIName = "mac";
      if (typeof document !== "undefined") {
        const gl = document.createElement("canvas").getContext("webgl");
        const ext = gl && gl.getExtension("WEBGL_debug_renderer_info");
        const param =
          (ext && gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) || "";
        isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        //Detect if the user is using a Apple GPU (M1)
        if (isSafari || (param.match(/Apple/) && !param.match(/Apple GPU/))) {
          arch = "aarch64";
        }
      }
      break;
    case UserOS.LINUX:
    case UserOS.UNIX:
      userOSName = "Linux";
      userOSAPIName = "linux";
      break;
    case UserOS.WIN:
      userOSName = "Windows";
      userOSAPIName = "windows";
      break;
    default:
      break;
  }

  const ref = useRef<HTMLDivElement | null>(null);
  const isVisible = useOnScreen(ref as RefObject<Element>, true);
  const binary = useFetchLatestForOS(
    isVisible,
    defaultVersion,
    userOSAPIName,
    arch
  );

  return (
    <div ref={ref} className="flex flex-col items-center gap-6">
      {binary ? (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#ff1365] to-[#7026b9] rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500 group-hover:duration-200"></div>
          <Link
            href={{
              pathname: "/download",
              query: {
                link: binary.link,
                vendor: "Adoptium",
              },
            }}
            className="relative flex items-center justify-center gap-4 bg-[#14003c] text-white px-10 py-5 rounded-full ring-1 ring-white/20 hover:ring-[#ff1365]/50 transition-all duration-300 hover:scale-[1.02]"
            onClick={() =>
              sendDownloadEvent({
                link: binary.link,
                os: userOSAPIName,
                arch: arch,
                pkg_type: binary.installer_link ? "installer" : "archive",
                version: String(defaultVersion),
                vendor: "Adoptium",
              })
            }
          >
            <span className="w-8 h-8 flex items-center justify-center text-[#ff1365]">
              <OSIcon os={userOS} />
            </span>
            <div className="text-left flex flex-col">
              <span className="text-xl font-bold leading-none tracking-tight">
                {t("download-temurin-button")}
              </span>
              <span className="text-xs text-gray-400 mt-1 font-mono tracking-wide uppercase">
                JDK {defaultVersion} LTS • {userOSName} • {arch}
              </span>
            </div>
            <svg
              className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="relative">
          <a
            href="#"
            className="relative flex items-center justify-center gap-4 bg-gray-800/50 text-gray-500 px-10 py-5 rounded-full ring-1 ring-white/5 cursor-not-allowed"
          >
            <span className="w-8 h-8 flex items-center justify-center opacity-50">
              <OSIcon os={userOS} />
            </span>
            <span className="text-xl font-bold leading-none">
              {t("download-temurin-button")}
            </span>
          </a>
        </div>
      )}

      <Link
        href="/temurin/releases"
        className="text-sm text-gray-400 hover:text-[#ff1365] transition-colors duration-300 flex items-center gap-2 group"
      >
        {t("other-downloads")}
        <span
          className="group-hover:translate-x-0.5 transition-transform"
          aria-hidden="true"
        >
          &rarr;
        </span>
      </Link>
    </div>
  );
};

export default DownloadButton;
