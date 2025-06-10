import React from "react"
import { Link } from "@/i18n/navigation"
import { BsDownload } from "react-icons/bs"
import { FaApple, FaWindows, FaRegFileCode } from "react-icons/fa"
import { GrNotes, GrInstall } from "react-icons/gr";
import { GiFlatPlatform } from "react-icons/gi";
import { ReleaseAsset } from "@/types/temurin";

interface CardData {
  icon: React.ReactNode
  title: string
  description: string
  link: string
  os: string
  arch: string
  pkg_type: string
  checksum: string
  java_version: string
}

// Define a special extension of ReleaseAsset[] for ButtonContent's needs
interface ResultsData extends Array<ReleaseAsset> {
  source?: {
    release_name: string;
    binary: {
      package: {
        link: string;
      }
    }
  };
}

const ButtonContent = ({ results }: { results: ResultsData }) => {
  const navigationItem = [
    {
      icon: <GrNotes />,
      title: "Release notes",
      link: results && results['source'] ? `/temurin/release-notes?version=${results['source'].release_name}` : "/temurin/release-notes"
    },
    {
      icon: <GrInstall />,
      title: "Installation guide",
      link: "/installation"
    },
    {
      icon: <GiFlatPlatform />,
      title: "Supported Platforms",
      link: "/supported-platforms"
    },
    {
      icon: <FaRegFileCode />,
      title: "Source Code",
      link: results && results['source'] ? results['source'].binary.package.link : "/temurin/source-code" // Provide a fallback URL
    }
  ]

  const CardData: CardData[] = []
  let foundmacos = false

  // loop through results and find macOS and Windows installers
  if (results && results.length > 0) {
    results.forEach(result => {
      if (result.os === "mac" && result.architecture === "aarch64" &&
        result.binaries[0] && result.binaries[0].installer_link && result.binaries[0].installer_extension) {
        foundmacos = true
        CardData.push({
          icon: <FaApple size={30} />,
          title: "macOS",
          os: result.os,
          arch: result.architecture,
          checksum: result.binaries[0].installer_checksum || "",
          java_version: result.release_name,
          pkg_type: result.binaries[0].type,
          description: `Temurin ${result.release_name}, macOS aarch64 (M1) (${result.binaries[0].installer_extension.toUpperCase()})`,
          link: result.binaries[0].installer_link,
        })
      } else if (result.os === "mac" && result.architecture === "x64" && !foundmacos &&
        result.binaries[0] && result.binaries[0].installer_link && result.binaries[0].installer_extension) {
        // Fall back to x64 if aarch64 is not found
        CardData.push({
          icon: <FaApple size={30} />,
          title: "macOS",
          os: result.os,
          arch: result.architecture,
          checksum: result.binaries[0].installer_checksum || "",
          java_version: result.release_name,
          pkg_type: result.binaries[0].type,
          description: `Temurin ${result.release_name}, macOS 64 bit (${result.binaries[0].installer_extension.toUpperCase()})`,
          link: result.binaries[0].installer_link,
        })
      }
      if (result.os === "windows" && result.architecture === "x64" &&
        result.binaries[0] && result.binaries[0].installer_link && result.binaries[0].installer_extension) {
        CardData.push({
          icon: <FaWindows size={30} />,
          title: "Windows",
          os: result.os,
          arch: result.architecture,
          checksum: result.binaries[0].installer_checksum || "",
          java_version: result.release_name,
          pkg_type: result.binaries[0].type,
          description: `Temurin ${result.release_name}, Windows 64 bit (${result.binaries[0].installer_extension.toUpperCase()})`,
          link: result.binaries[0].installer_link,
        })
      }
    })
  }

  return (
    <>
      <div className=" w-full max-w-[1264px] mx-auto">
        <ul className="flex md:flex-row flex-col gap-4 lg:gap-8 items-start  w-full  justify-start sm:justify-center sm:items-center  my-8 lg:my-16">
          {navigationItem.map((item, index) => (
            <li
              key={index}
              className="flex gap-3 group items-center text-white hover:text-primary transition-all duration-300 ease-in-out text-xl font-normal cursor-pointer"
            >
              {item.link ? (
                <Link href={item.link} className="flex items-center gap-2">
                  <span className="group flex items-center">
                    {item.icon}
                  </span>
                  {item.title}
                </Link>
              ) : (
                <>
                  <span className="group flex items-center">
                    {item.icon}
                  </span>
                  {item.title}
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="flex justify-between flex-col md:flex-row  w-full items-center  gap-8">
          {CardData.map((card, index) => (
            <div
              key={index}
              className="p-8 bg-[#200E46]  justify-between w-full border rounded-[24px] border-[#564873] h-[264px] flex flex-col   transition-all duration-300 ease-in-out hover:border-primary shadow-[0_2px_4px_rgba(255,20,100,0.2)]"
            >
              <span className="p-6 rounded-full w-fit bg-[#2B1A4F] border border-[#5A4D76]">
                {card.icon}
              </span>
              <div className="flex justify-between items-center gap-8">
                <div className="flex flex-col  space-y-2">
                  <h4 className="text-4xl font-semibold">{card.title}</h4>
                  <h5 className="text-base font-normal text-grey">
                    {card.description}
                  </h5>
                </div>
                <span className="p-3 group cursor-pointer rounded-full w-fit bg-[#2B1A4F] border border-[#5A4D76] hover:border-primary transition-all duration-300 ease-in-out">
                  <Link
                    href={{
                      pathname: "/download",
                      query: {
                        link: card.link,
                        checksum: card.checksum,
                        os: card.os,
                        arch: card.arch,
                        pkg_type: card.pkg_type,
                        java_version: card.java_version,
                      }
                    }}
                  >
                    <BsDownload size={25} />
                  </Link>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ButtonContent
