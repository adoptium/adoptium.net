import React from "react"
import ShellBox from "@/components/ShellBox"
import "../InstallTabs.css"

export const PureWindowsPanel = (): React.ReactNode => {
  // Hardcoded value for latest LTS, should be replaced with actual data fetching in Next.js
  const mostRecentLts = "21"
  return (
    <div>
      <ShellBox>
        <span className="install__text__no-select">
          # Install the latest version
        </span>
        <br />
        <span className="install__text__no-select">$</span>
        <span className="install-text-command">winget install </span>
        EclipseAdoptium.Temurin.{mostRecentLts}.JDK
      </ShellBox>
      <br />
      <ShellBox>
        <span className="install__text__no-select">
          # Install a different version
        </span>
        <br />
        <span className="install__text__no-select">$</span>
        <span className="install-text-command">winget install </span>
        EclipseAdoptium.Temurin.11.JDK
      </ShellBox>
      <br />
      <ShellBox>
        <span className="install__text__no-select">
          # Upgrade the Winget package
        </span>
        <br />
        <span className="install__text__no-select">$</span>
        <span className="install-text-command">winget upgrade </span>
        EclipseAdoptium.Temurin.{mostRecentLts}.JDK
      </ShellBox>
      <br />
      <ShellBox>
        <span className="install__text__no-select">
          # Uninstall the Winget package
        </span>
        <br />
        <span className="install__text__no-select">$</span>
        <span className="install-text-command">winget uninstall </span>
        EclipseAdoptium.Temurin.{mostRecentLts}.JDK
      </ShellBox>
      <a
        className="install__docs-button"
        href="https://docs.microsoft.com/en-us/windows/package-manager/winget/"
      >
        Read documentation
      </a>
    </div>
  )
}

const WindowsPanel = (): React.ReactNode => {
  return <PureWindowsPanel />
}

export default WindowsPanel
