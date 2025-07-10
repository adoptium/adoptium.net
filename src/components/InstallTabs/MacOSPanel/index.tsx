import React from "react"
import ShellBox from "@/components/ShellBox"
import "../InstallTabs.css"

export const PureMacOSPanel = (): React.ReactNode => {
  // Hardcoded value for latest LTS, should be replaced with actual data fetching in Next.js
  const mostRecentLts = "21"
  return (
    <div>
      <ShellBox>
        <span className="install__text__no-select">
          # Install the latest LTS version
        </span>
        <br />
        <span className="install__text__no-select">$</span>
        <span className="install-text-command">brew install --cask </span>
        temurin@{mostRecentLts}
      </ShellBox>
      <br />
      <ShellBox>
        <span className="install__text__no-select">
          # Install a specific version
        </span>
        <br />
        <span className="install__text__no-select">$</span>
        <span className="install-text-command">brew install --cask </span>
        temurin@8
        <br />
        <span className="install__text__no-select">$</span>
        <span className="install-text-command">brew install --cask </span>
        temurin@{mostRecentLts}
      </ShellBox>
      <br />
      <br />
      <br />
      <ShellBox>
        <span className="install__text__no-select">
          # Uninstall a specific version
        </span>
        <br />
        <span className="install__text__no-select">$</span>
        <span className="install-text-command">brew uninstall --cask </span>
        temurin@{mostRecentLts}
      </ShellBox>
      <a className="install__docs-button" href="https://docs.brew.sh/Manpage">
        Read documentation
      </a>
    </div>
  )
}

const MacOSPanel = (): React.ReactNode => {
  return <PureMacOSPanel />
}

export default MacOSPanel
