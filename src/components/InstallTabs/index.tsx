"use client"

import React from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { detectOS, UserOS } from "@/utils/detectOS"
import "./InstallTabs.css"

import WindowsPanel from "./WindowsPanel"
import MacOSPanel from "./MacOSPanel"
import LinuxPanel from "./LinuxPanel"

const InstallTabs = (): React.ReactNode => {
  const userOS = detectOS()

  const os = {
    win: "Windows (Winget)",
    mac: "macOS (Homebrew)",
    linux: "Linux (RPM/DEB)",
  }

  const installTabSystems: Record<UserOS, string[]> = {
    [UserOS.WIN]: [os.win, os.mac, os.linux],
    [UserOS.MAC]: [os.mac, os.win, os.linux],
    [UserOS.LINUX]: [os.linux, os.mac, os.win],
    [UserOS.UNIX]: [os.linux, os.mac, os.win],
    [UserOS.MOBILE]: [os.win, os.mac, os.linux],
    [UserOS.UNKNOWN]: [os.win, os.mac, os.linux],
  }

  function panelSwitch(): React.ReactNode {
    switch (userOS) {
      case UserOS.MAC:
        return (
          <>
            <TabPanel>
              <MacOSPanel />
            </TabPanel>
            <TabPanel>
              <WindowsPanel />
            </TabPanel>
            <TabPanel>
              <LinuxPanel />
            </TabPanel>
          </>
        )
      case UserOS.LINUX:
      case UserOS.UNIX:
        return (
          <>
            <TabPanel>
              <LinuxPanel />
            </TabPanel>
            <TabPanel>
              <MacOSPanel />
            </TabPanel>
            <TabPanel>
              <WindowsPanel />
            </TabPanel>
          </>
        )
      default:
        return (
          <>
            <TabPanel>
              <WindowsPanel />
            </TabPanel>
            <TabPanel>
              <MacOSPanel />
            </TabPanel>
            <TabPanel>
              <LinuxPanel />
            </TabPanel>
          </>
        )
    }
  }

  return installTabSystems[userOS] !== undefined ? (
    <div className="install">
      <Tabs>
        <div className="install__header">
          <div className="install__header-circles">
            <div className="install__header-grey-circle red" />
            <div className="install__header-grey-circle yellow" />
            <div className="install__header-grey-circle green" />
          </div>
          <div className="install__header-text">
            {userOS === "MAC" ? "zsh" : "bash"}
          </div>
        </div>
        <TabList>
          {installTabSystems[userOS].map((system: string) => (
            <Tab key={system.toString()}>{system}</Tab>
          ))}
        </TabList>
        {panelSwitch()}
      </Tabs>
    </div>
  ) : null
}

export default InstallTabs
