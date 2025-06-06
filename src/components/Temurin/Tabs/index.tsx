import React, { useEffect, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { useLocation } from "@gatsbyjs/reach-router"
import queryString from "query-string"

import VersionSelector from "../VersionSelector"
import ButtonContent from "../ButtonContent"
import ReleaseSelector from "../ReleaseSelector"

import { fetchOses, fetchArches} from '../../../hooks/fetchConstants'
import { setURLParam } from "../../../util/setURLParam"
import { packageTypes } from "../../../util/defaults"

const Tabs = ({ updaterAction, Table, openModalWithChecksum }) => {

  const data = useStaticQuery(graphql`
    query TabVersionsQuery {
      allVersions(sort: { version: DESC }) {
        edges {
          node {
            version
            label
            lts
          }
        }
      }
      mostRecentLts {
        version
      }
    }
  `)

  const LTSVersions = data.allVersions.edges.filter(
    version => version.node.lts === true,
  )

  // load OS and Arches from API
  const oses = fetchOses(true)
  const arches = fetchArches(true)
  const [ready, setReady] = useState(false)

  const queryStringParams = queryString.parse(useLocation().search)

  const [os, updateOS] = useState("any")
  const [arch, updateArch] = useState("any")
  const [version, udateVersion] = useState("any")

  const [activeVersionSelectorTab, setActiveVersionSelectorTab] = useState(data.mostRecentLts.version)

  const [releases, setReleases] = useState(null)

  /**
   * This useEffect() is called when OS and arches are finaly loaded
   */ 
  useEffect(() => {
    // do nothing while OS and arches are not loaded
    if(oses.length === 0 || arches.length === 0) return;

    let paramMatches = 0;

    (async () => {
      // init the default selected Operation System, if any from the param 'os'
      let defaultSelectedOS = "any"
      const osParam = queryStringParams.os
      if (osParam) {
        let osParamStr = osParam.toString().toLowerCase()
        if (oses.findIndex(os => os.value === osParamStr) >= 0) {
          defaultSelectedOS = osParamStr
          paramMatches++
        }
      }

      // init the default selected Architecture, if any from the param 'arch'
      let defaultSelectedArch = "any"
      const archParam = queryStringParams.arch
      if (archParam) {
        let archParamStr = archParam.toString().toLowerCase()
        if (arches.findIndex(a => a.value === archParamStr) >= 0) {
          defaultSelectedArch = archParamStr
          paramMatches++
        }
      }

      // init the default selected Package Type, if any from the param 'package'
      let defaultSelectedPackageType = "any"
      const packageParam = queryStringParams.package
      if (packageParam) {
        let packageParamStr = packageParam.toString().toLowerCase()
        if (packageTypes.findIndex(p => p.value === packageParamStr) >= 0) {
          defaultSelectedPackageType = packageParamStr
        }
      }

      // init the default selected Version, if any from the param 'version' or from 'variant'
      let defaultSelectedVersion = data.mostRecentLts.version
      let defaultActiveVersionSelectorTab = data.mostRecentLts.version
      const versionParam = queryStringParams.version
      if (versionParam) {
        let versionParamStr = versionParam.toString()
        let versionParamNum = Number(versionParamStr)

        if (versionParamStr.toLowerCase() === "latest") {
          // get the latest version of the list
          defaultSelectedVersion = LTSVersions.sort((a, b) => b.node.version - a.node.version,)[0].node.version;
          defaultActiveVersionSelectorTab = defaultSelectedVersion;
        } else if (LTSVersions.findIndex(version => version.node.version === versionParamNum) >= 0) {
          // it is a valid LTS version
          defaultSelectedVersion = versionParamNum;
          defaultActiveVersionSelectorTab = versionParamNum;
        } else {
          // it is another valid version
          defaultSelectedVersion = versionParamNum;
        }
        paramMatches++
      }

      // init the default selected Version, if any from the param 'variant'
      const variantParam = queryStringParams.variant
      if (variantParam) {
        // convert openjdk11 to 11
        const parsedVersion = variantParam.toString().replace(/\D/g, "")
        let variantParamNum = Number(parsedVersion)

        if (LTSVersions.findIndex(version => version.node.version === variantParamNum) >= 0) {
          defaultSelectedVersion = variantParamNum
        }
      }

      osUpdater(defaultSelectedOS);
      archUpdater(defaultSelectedArch);
      versionUpdater(defaultSelectedVersion);
      setActiveVersionSelectorTab(paramMatches === 3 ? 1 : defaultActiveVersionSelectorTab);

      // OK we can loaded elements
      setReady(true)
  })();
  }, [ready, oses, arches]);

  const versionUpdater = version => {
    setURLParam("version", version)
    udateVersion(version)
  }

  const archUpdater = arch => {
    setURLParam("arch", arch)
    updateArch(arch)
  }

  const osUpdater = os => {
    setURLParam("os", os)
    updateOS(os)
  }

  // Reset function to clear all filters and return to defaults
  const handleReset = () => {
    const defaultVersion = data.mostRecentLts.version
    versionUpdater(defaultVersion)
    osUpdater("any")
    archUpdater("any")
    setActiveVersionSelectorTab(defaultVersion)
  }

  /**
   * This useEffect() is called when a parameter is changed
   */
  useEffect(() => {
    // do nothing while params are not ready
    if(!ready) return

    (async () => {
      setReleases(await updaterAction(version, os, arch))
    })()
  }, [version, os, arch])

  return (
    <>
      <section className="py-8 md:pt-16 px-6 w-full">
        <div className="w-full flex flex-col items-start justify-start sm:items-center sm:justify-center">
          <VersionSelector
            activeVersionTab={activeVersionSelectorTab}
            setActiveVersionTab={setActiveVersionSelectorTab}
            versions={LTSVersions}
            updateVersion={udateVersion}
            defaultVersion={data.mostRecentLts.version}
            updateOS={osUpdater}
            updateArch={archUpdater}
          />
          {activeVersionSelectorTab === 1 ? (
            <ReleaseSelector
              versions={data.allVersions}
              updateVersion={versionUpdater}
              defaultVersion={version}
              updateOS={osUpdater}
              defaultOS={os}
              updateArch={archUpdater}
              defaultArch={arch}
            />
          ) : (
            <ButtonContent results={releases} />
          )}
        </div>
      </section>
      <Table results={releases} openModalWithChecksum={openModalWithChecksum} onReset={handleReset} />
    </>
  )
}

export default Tabs
