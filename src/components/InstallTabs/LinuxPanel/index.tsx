import React from "react"
import { Link } from "@/i18n/navigation"
import ShellBox from "@/components/ShellBox"
import "../InstallTabs.css"

export const PureLinuxPanel = (): React.ReactNode => {
  // Hardcoded value for latest LTS, should be replaced with actual data fetching in Next.js
  const mostRecentLts = "25"
  return (
    <div>
      <ShellBox>
        <span className="install__text__no-select">
          # Install the latest LTS version (Debian or Ubuntu)
        </span>
        <br />
        <span className="install__text__no-select">$</span>
        <span className="install-text-command">apt-get install </span>temurin-
        {mostRecentLts}-jdk
      </ShellBox>
      <br />
      <ShellBox>
        <span className="install__text__no-select">
          # Install the latest LTS version (CentOS/RHEL/Fedora)
        </span>
        <br />
        <span className="install__text__no-select">$</span>
        <span className="install-text-command">yum install </span>temurin-
        {mostRecentLts}-jdk
      </ShellBox>
      <br />
      <ShellBox>
        <span className="install__text__no-select">
          # Install the latest LTS version (openSUSE/SLES)
        </span>
        <br />
        <span className="install__text__no-select">$</span>
        <span className="install-text-command">zypper install </span>temurin-
        {mostRecentLts}-jdk
      </ShellBox>
      <Link className="install__docs-button" href="/installation/linux">
        Read documentation
      </Link>
    </div>
  )
}

const LinuxPanel = (): React.ReactNode => {
  return <PureLinuxPanel />
}

export default LinuxPanel
