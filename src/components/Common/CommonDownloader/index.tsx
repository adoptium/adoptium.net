import React from "react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { BsCopy, BsDownload } from "react-icons/bs"
import { MdVerifiedUser } from "react-icons/md"

interface DownloadItem {
  link: string;
  checksum: string;
  os: string;
  arch: string;
  pkg_type: string;
  java_version: string;
  label: string;
}

const CommonDownloader = ({ openModalWithChecksum, obj }: { openModalWithChecksum: (checksum: string) => void, obj: DownloadItem }) => {
  return (
    <div className="text-white  w-[100%] py-6 border-b-[1px]  border-[#3E3355]">
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center gap-2">
          <span className="cursor-pointer group">
            <Link
              href={{
                pathname: "/download",
                query: {
                  link: obj.link,
                  checksum: obj.checksum,
                  os: obj.os,
                  arch: obj.arch,
                  pkg_type: obj.pkg_type,
                  java_version: obj.java_version,
                }
              }}
            >
              <BsDownload size={20} />
            </Link>
          </span>
          <h5 className="text-base font-normal">{obj.label}</h5>
          <MdVerifiedUser
            data-toggle="tooltip"
            data-placement="bottom"
            title="This build is JCK certified"
            size={30}
            style={{ color: "#537FB9" }}
          />
          <Link href="/aqavit">
            <Image
              src="/images/icons/aqavit-icon.png"
              width={25}
              height={25}
              alt="AQAvit logo"
              data-toggle="tooltip"
              data-placement="bottom"
              title="This build is AQAvit Verified"
              className="img-fluid mb-0"
            />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="cursor-pointer group">
            <a
              href="#"
              onClick={e => {
                e.preventDefault()
                openModalWithChecksum(obj.checksum)
              }}
            >
              <BsCopy size={20} />
            </a>
          </span>
          <h5 className="text-base font-normal">
            Checksum
          </h5>
        </div>
      </div>
    </div>
  )
}

export default CommonDownloader
