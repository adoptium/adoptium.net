import React from "react"
import { useTranslations } from "next-intl"
import { FaDocker, FaGithub, FaCalendarAlt } from "react-icons/fa";
import { FcLinux, FcPackage } from "react-icons/fc";
import { Link } from "@/i18n/navigation"
import {
  RestApiIcon,
} from "@/components/Common/Icon"
import CommonHeading from "@/components/Common/CommonHeading"

const DownloadMethods = () => {
  const t = useTranslations('Temurin.DownloadMethods');
  const TemurinMethod = [
    {
      icon: <FaDocker size={35} color="#1D63ED" />,
      title: "Temurin Containers",
      buttons: [
        {
          "Docker Hub": "https://hub.docker.com/_/eclipse-temurin",
        }
      ]
    },
    {
      icon: <FcLinux size={35} />,
      title: "Linux Repositories",
      buttons: [
        {
          "Debian": "/installation/linux/#_deb_installation_on_debian_or_ubuntu",
        },
        {
          "RPM": "/installation/linux/#_centosrhelfedora_instructions",
        },
        {
          "Alpine": "/installation/linux/#_alpine_linux_instructions",
        },
        {
          "SLES": "/installation/linux/#_opensusesles_instructions",
        }
      ]
    },
    {
      icon: <FcPackage size={35} />,
      title: "Package Managers",
      buttons: [
        {
          "Homebrew": "https://formulae.brew.sh/cask/temurin",
        },
        {
          "SDKMAN": "https://sdkman.io/jdks/#tem",
        },
        {
          "WinGet": "https://docs.microsoft.com/en-us/windows/package-manager/winget/"
        }
      ]
    },
    {
      icon: <RestApiIcon />,
      title: "REST API",
      buttons: [
        {
          "REST API": "https://api.adoptium.net",
        },
        {
          "Swagger Docs": "https://api.adoptium.net/q/swagger-ui/"
        }
      ]
    },
    {
      icon: <FaGithub size={35} />,
      title: "GitHub Actions",
      buttons: [
        {
          "setup-java": "https://github.com/actions/setup-java",
        }
      ]
    },
    {
      icon: <FaCalendarAlt size={35} color="#FF1365" />,
      title: "Other Downloads",
      buttons: [
        {
          "Nightly Builds": "/temurin/nightly",
        }
      ]
    }
  ]
  return (
    <section className="py-16 md:py-32 bg-[#0E002A] px-6">
      <CommonHeading
        title={t('other-ways-to-download-temurin')}
        description={t('description')}
        className={"text-center max-w-[680px] mx-auto"}
      />
      <div className=" mt-8 md:mt-16">
        <div className=" justify-between max-w-[1064px] mx-auto grid  gap-8 md:gap-12 w-full grid-cols-1 md:grid-cols-2  lg:grid-cols-3 ">
          {TemurinMethod.map((method, index) => (
            <div key={index} className="flex gap-4 max-w-[366px] xl:max-w-[322px]">
              <span className="p-6 rounded-full cursor-pointer flex justify-center items-center w-fit bg-[#2B1A4F] border border-[#5A4D76]">
                {method.icon}
              </span>
              <div>
                <h3 className="max-w-[270px] text-xl font-normal xl:max-w-[226px]">
                  {method.title}
                </h3>
                <div className="flex gap-4 mt-2 ">
                  {method.buttons.map((button, buttonIndex) => {
                    const [name, url] = Object.entries(button)[0] as [string, string];
                    return url.startsWith('https://') ? (
                      <a
                        key={buttonIndex}
                        href={url}
                        className="text-[#FF1464] text-sm font-normal border-b-[1px] border-[#FF1464]"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {name}
                      </a>
                    ) : (
                      <Link
                        key={buttonIndex}
                        href={url}
                        className="text-[#FF1464] text-sm font-normal border-b-[1px] border-[#FF1464]"
                      >
                        {name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DownloadMethods
