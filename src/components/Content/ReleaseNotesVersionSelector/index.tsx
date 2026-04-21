"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface ReleaseNotesVersionSelectorProps {
  availableVersions: number[];
  availableLTSVersions: number[];
}

const ReleaseNotesVersionSelector: React.FC<
  ReleaseNotesVersionSelectorProps
> = ({ availableVersions, availableLTSVersions }) => {
  const t = useTranslations("ReleaseNotes");
  const router = useRouter();

  const handleVersionSelect = (version: number) => {
    router.push(`?version=${version}`);
  };

  const ltsVersions = availableVersions.filter((v) =>
    availableLTSVersions.includes(v),
  );
  const nonLtsVersions = availableVersions.filter(
    (v) => !availableLTSVersions.includes(v),
  );

  return (
    <div className="max-w-4xl mx-auto px-6 pb-20 pt-4">
      {/* Section: LTS */}
      {ltsVersions.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-white/50">
              {t("selectVersion")}
            </h3>
            <span className="inline-flex items-center rounded-full bg-pink/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-pink uppercase">
              LTS
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ltsVersions.map((version) => (
              <button
                key={version}
                onClick={() => handleVersionSelect(version)}
                className="group relative rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] p-6 text-left transition-all duration-300 hover:bg-white/[0.08] hover:border-white/[0.16] hover:shadow-[0_8px_40px_rgba(255,19,101,0.08)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-[28px] font-semibold tracking-tight text-white">
                    JDK {version}
                  </span>
                  <span className="text-[11px] font-medium tracking-wider uppercase text-pink/80">
                    Long Term Support
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors duration-300">
                    {t("viewReleaseNotes")}
                  </span>
                  <svg
                    className="w-4 h-4 text-white/20 group-hover:text-pink group-hover:translate-x-1 transition-all duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Section: Non-LTS */}
      {nonLtsVersions.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-white/50">
              Feature Releases
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {nonLtsVersions.map((version) => (
              <button
                key={version}
                onClick={() => handleVersionSelect(version)}
                className="group relative rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] px-5 py-4 text-left transition-all duration-300 hover:bg-white/[0.07] hover:border-white/[0.14] hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium tracking-tight text-white/80 group-hover:text-white transition-colors duration-300">
                    JDK {version}
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-white/15 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReleaseNotesVersionSelector;
