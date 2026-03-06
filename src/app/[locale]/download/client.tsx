"use client";

import { useSearchParams, redirect } from "next/navigation";
import { capitalize } from "@/utils/capitalize";
import { useTranslations } from "next-intl";
import {
  FaGithub,
  FaBuilding,
  FaBook,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Link } from "@/i18n/navigation";

export default function DownloadPageClient() {
  const t = useTranslations("DownloadPage");
  const searchParams = useSearchParams();
  const link = searchParams.get("link") || "";
  const vendor = searchParams.get("vendor") || "Adoptium";

  if (!link) {
    redirect("/temurin/releases");
  }

  // Validate allowed download link origins for security
  const allowedOrigins = [
    "https://github.com/adoptium/temurin",
    "https://cdn.azul.com/zulu/",
    "https://aka.ms/download-jdk/",
    "https://github.com/ibmruntimes/",
    "https://github.com/dragonwell-project/",
    "https://developers.redhat.com/",
  ];

  const isValidLink = allowedOrigins.some((origin) => link.startsWith(origin));
  if (!isValidLink) {
    console.error("Invalid download link:", link);
    redirect("/temurin/releases");
  }

  return (
    <div className="bg-[#14003c] min-h-screen text-white font-sans flex flex-col items-center">
      {/* Meta Redirect for Auto-Download */}
      {link && <meta httpEquiv="refresh" content={`0; url=${link}`} />}

      {/* Hero Section: Download Confirmation */}
      <div className="w-full max-w-5xl px-6 py-12 md:py-16 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-6 bg-green-500/20 rounded-full ring-1 ring-green-500/50">
          <FaCheckCircle className="text-green-400 text-2xl" />
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
          {vendor === "Adoptium" ? (
            <>
              {t("thank-you")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff1365] to-[#ff6b9d]">
                Eclipse Temurin
              </span>
            </>
          ) : (
            <span className="text-white">
              {t.rich("vendor-alert", {
                vendor: capitalize(vendor),
                vendorWrapper: (chunks) => (
                  <span className="text-[#ff1365]">{chunks}</span>
                ),
              })}
            </span>
          )}
        </h1>

        <p className="text-lg md:text-xl text-[#c4bfce] max-w-2xl mx-auto mb-8 leading-relaxed">
          {t("auto-start-p1")}
          <br className="hidden md:block" />
          <span className="text-sm mt-2 block opacity-70">
            {t("auto-start-p2")}
            <a
              href={link}
              className="text-[#ff1365] hover:text-white underline decoration-[#ff1365] underline-offset-4 transition-colors"
            >
              {t("click-here")}
            </a>
            .
          </span>
        </p>
      </div>

      {/* The Appeal Section - The "Sexy" Part */}
      <div className="w-full max-w-6xl px-4 md:px-6 mb-20 relative z-10">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0d002a] border border-[#ff1365]/30 shadow-[0_0_80px_-20px_rgba(255,19,101,0.4)] group hover:shadow-[0_0_100px_-10px_rgba(255,19,101,0.5)] transition-all duration-500">
          {/* Background Effects */}
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-[#ff1365] opacity-[0.07] blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-purple-600 opacity-[0.07] blur-[100px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center p-8 md:p-14 gap-12">
            {/* Left Column: The "Hook" */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff1365]/10 border border-[#ff1365]/20 text-[#ff1365] text-sm font-bold uppercase tracking-wider mb-6">
                <FaExclamationTriangle className="text-sm" />
                {t("community-action")}
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] mb-6">
                {t("free-to-use")}
                <br />
                <span className="text-[#c4bfce]">{t("not-free-to-build")}</span>
              </h2>

              <p className="text-xl md:text-2xl font-bold text-[#ff1365] mb-6 italic">
                {t("appeal-quote")}
              </p>

              <p className="text-[#c4bfce] text-lg leading-relaxed mb-8 max-w-xl">
                {t("appeal-text")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="https://github.com/sponsors/adoptium"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-[#ff1365] hover:bg-[#ff4f8b] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 hover:shadow-lg shadow-[#ff1365]/20"
                >
                  <FaGithub className="text-2xl" />
                  {t("become-sustainer-btn")}
                </a>
                <Link
                  href="/become-a-sustainer"
                  className="inline-flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur-sm"
                >
                  <FaBuilding className="text-xl" />
                  {t("corporate-sponsorship-btn")}
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Reinforcement / Stats (Abstract Representation) */}
            <div className="w-full lg:w-[400px] bg-[#14003c]/50 rounded-2xl p-8 border border-white/5 backdrop-blur-sm lg:self-stretch flex flex-col justify-center">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                {t("why-we-need-you")}
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-[#ff1365]/20 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#ff1365]"></div>
                  </div>
                  <div>
                    <strong className="block text-white">
                      {t("infra-costs-title")}
                    </strong>
                    <span className="text-sm text-[#c4bfce]">
                      {t("infra-costs-desc")}
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-[#ff1365]/20 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#ff1365]"></div>
                  </div>
                  <div>
                    <strong className="block text-white">
                      {t("security-speed-title")}
                    </strong>
                    <span className="text-sm text-[#c4bfce]">
                      {t("security-speed-desc")}
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-[#ff1365]/20 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#ff1365]"></div>
                  </div>
                  <div>
                    <strong className="block text-white">
                      {t("open-source-title")}
                    </strong>
                    <span className="text-sm text-[#c4bfce]">
                      {t("open-source-desc")}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Info Section */}
      <div className="w-full bg-[#0d002a] border-t border-white/5 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-6">
            {t("resources-next-steps")}
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link
              href="/installation"
              className="group p-6 bg-[#14003c] rounded-2xl border border-white/5 hover:border-[#ff1365]/50 transition-all text-left"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 group-hover:text-[#ff1365] transition-colors">
                  <FaBook />
                </div>
                <h4 className="text-lg font-bold text-white">
                  {t("installation-guide-title")}
                </h4>
              </div>
              <p className="text-[#c4bfce] text-sm">
                {t("installation-guide-desc")}
              </p>
            </Link>

            <Link
              href="/docs"
              className="group p-6 bg-[#14003c] rounded-2xl border border-white/5 hover:border-[#ff1365]/50 transition-all text-left"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 group-hover:text-[#ff1365] transition-colors">
                  <FaCheckCircle />
                </div>
                <h4 className="text-lg font-bold text-white">
                  {t("documentation-title")}
                </h4>
              </div>
              <p className="text-[#c4bfce] text-sm">
                {t("documentation-desc")}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
