import { VersionMetaData } from "."
import axios from "axios"
import { ReleaseAsset } from "@/types/temurin"

// Define a type that extends ReleaseAsset[] to include the binary property
export interface MarketplaceReleaseAsset extends ReleaseAsset {
    binary: {
        distribution: string
    }
}

const baseUrl = "https://marketplace-api.adoptium.net"

export async function getAllPkgsForVersion(
    version: number,
    os: string,
    architecture: string,
    package_type: string,
    vendors: string[] = [],
): Promise<MarketplaceRelease[] | null> {
    let params = "?"
    params += "feature_version=" + version

    if (os !== "any") {
        if (os === "alpine-linux") {
            params += "&os=alpine_linux"
        } else {
            params += "&os=" + os
        }
    }

    // loop through vendors and add to params
    if (vendors.length > 0) {
        vendors.forEach(vendor => {
            params += "&vendor=" + vendor
        })
    }

    if (package_type !== "any") {
        params += "&image_type=" + package_type
    }

    if (architecture !== "any") {
        params += "&architecture=" + architecture
    }

    const url = baseUrl + "/v1/assets/latestForVendors" + params
    const data = await axios
        .get(url)
        .then(function (response) {
            return response.data
        })
        .catch(function () {
            return null
        })

    return data
}

export function getImageForDistribution(distribution: string) {
    switch (distribution) {
        case "temurin":
            return "/images/vendors/adoptium-logo.png"
        case "redhat":
            return "/images/members/redhat.svg"
        case "zulu":
            return "/images/vendors/azul-logo.png"
        case "semeru":
            return "/images/members/ibm-logo.png"
        case "microsoft":
            return "/images/members/microsoft.svg"
        default:
            return `/images/vendors/${distribution}-logo.png`
    }
}

export interface MarketplaceRelease {
    release_name: string
    vendor: string
    binary: {
        os: string
        architecture: string
        image_type: string
        jvm_impl: string
        package: {
            name: string
            link: URL
            sha256sum: string
            sha256sum_link: URL
            signature_link: URL
        }
        installer?: [
            {
                name: string
                link: URL
                sha256sum: string
                sha256sum_link: URL
                signature_link: URL
            },
        ]
        timestamp: Date
        scm_ref: string
        openjdk_scm_ref: string
        distribution: string
        aqavit_results_link: URL
        tck_affidavit_link: URL
    }
    version: VersionMetaData
}
