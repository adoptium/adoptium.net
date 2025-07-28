"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

interface ReleaseNotesVersionSelectorProps {
  availableVersions: number[]
  availableLTSVersions: number[]
}

const ReleaseNotesVersionSelector: React.FC<ReleaseNotesVersionSelectorProps> = ({
  availableVersions,
  availableLTSVersions
}) => {
  const t = useTranslations("ReleaseNotes")
  const router = useRouter()

  const handleVersionSelect = (version: number) => {
    // Navigate to the release notes page with the selected version
    router.push(`?version=${version}`)
  }

  return (
    <div className="release-notes-version-selector max-w-6xl mx-auto p-6 lg:px-0">
      <div className="bg-gradient-to-br from-[#200E46]/90 to-[#2B1A4F]/90 rounded-3xl border border-white/20 shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          {t('selectVersion')}
        </h2>
        <p className="text-white/80 text-center mb-8">
          {t('selectVersionDescription')}
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {availableVersions.map((version) => {
            const isLTS = availableLTSVersions.includes(version)
            return (
              <button
                key={version}
                onClick={() => handleVersionSelect(version)}
                className={`${
                  isLTS 
                    ? 'bg-purple hover:bg-pink border-pink/50' 
                    : 'bg-blue hover:bg-purple border-white/20'
                } transition-colors duration-200 rounded-lg p-4 border hover:border-pink text-center group`}
              >
                <div className="text-white text-xl font-bold mb-1">
                  JDK {version}
                </div>
                <div className={`text-xs mb-2 ${isLTS ? 'text-pink' : 'text-grey'}`}>
                  {isLTS ? 'LTS' : 'Non-LTS'}
                </div>
                <div className="text-pink text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {t('viewReleaseNotes')}
                </div>
              </button>
            )
          })}
        </div>
        
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple rounded border border-pink/50"></div>
              <span className="text-white/80">LTS Version</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue rounded border border-white/20"></div>
              <span className="text-white/80">Non-LTS Version</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReleaseNotesVersionSelector
