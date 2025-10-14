import {
    FaDownload,
    FaQuestion,
    FaGithub,
    FaBox,
    FaInfoCircle,
    FaGlobe,
    FaGem,
    FaUserFriends,
    FaLock,
    FaRocket,
} from "react-icons/fa"

import DocumentationHeader from "@/components/Documentation/Header"
import DocumentationCard from "@/components/Documentation/Card"

export default function DocumentationPage() {
    return (
        <div>
            <DocumentationHeader />
            <div className="py-10">
                <div className="container mx-auto px-4">
                    {/* Wrap the flex container in a div that limits the width to 60% on large screens */}
                    <div className="w-full lg:w-4/5 mx-auto py-8">
                        <div className="flex flex-wrap justify-center">
                            <DocumentationCard
                                title="Get Temurin"
                                Icon={FaDownload}
                                links={[
                                    {
                                        name: "Install Temurin",
                                        link: "/installation",
                                    },
                                    {
                                        name: "Download Temurin",
                                        link: "/temurin/releases",
                                    },
                                    {
                                        name: "Container Images",
                                        link: "https://hub.docker.com/_/eclipse-temurin",
                                    },
                                    {
                                        name: "Release Archive",
                                        link: "/temurin/archive",
                                    },
                                ]}
                            />
                            <DocumentationCard
                                title="Temurin Support"
                                Icon={FaQuestion}
                                links={[
                                    {
                                        name: "Support Guide",
                                        link: "/support",
                                    },
                                    {
                                        name: "Commercial Support",
                                        link: "/temurin/commercial-support",
                                    },
                                    {
                                        name: "Migration Guide",
                                        link: "/docs/migration",
                                    },
                                    {
                                        name: "Supported Platforms",
                                        link: "/supported-platforms",
                                    },
                                    {
                                        name: "Submit an Issue",
                                        link: "https://github.com/adoptium/adoptium-support/issues",
                                    },
                                ]}
                            />
                            <DocumentationCard
                                title="AQAvit Quality"
                                Icon={FaGem}
                                links={[
                                    {
                                        name: "About Eclipse AQAvit",
                                        link: "/aqavit",
                                    },
                                    {
                                        name: "AQAvit Quality Verification",
                                        link: "/docs/qvs-policy",
                                    },
                                    {
                                        name: "AQAvit Verification Guide",
                                        link: "/docs/aqavit-verification",
                                    },
                                ]}
                            />
                            <DocumentationCard
                                title="Marketplace"
                                Icon={FaBox}
                                links={[
                                    {
                                        name: "Marketplace Downloads",
                                        link: "/marketplace",
                                    },
                                    {
                                        name: "Marketplace Listing Information",
                                        link: "/docs/marketplace-policy",
                                    },
                                    {
                                        name: "Marketplace Publisher Guide",
                                        link: "/docs/marketplace-guide",
                                    },
                                ]}
                            />
                            <DocumentationCard
                                title="Contributing"
                                Icon={FaUserFriends}
                                links={[
                                    {
                                        name: "How To Contribute",
                                        link: "/contributing",
                                    },
                                    {
                                        name: "First Timer Support",
                                        link: "/docs/first-timer-support",
                                    },
                                    {
                                        name: "Developer Nightly Builds",
                                        link: "/temurin/nightly",
                                    },
                                    {
                                        name: "Join our Slack Channel",
                                        link: "/slack",
                                    },
                                    {
                                        name: "Code of Conduct",
                                        link: "https://github.com/adoptium/.github/blob/main/CODE_OF_CONDUCT.md",
                                    },
                                ]}
                            />
                            <DocumentationCard
                                title="Secure Software"
                                Icon={FaLock}
                                links={[
                                    {
                                        name: "Secure Software Practices",
                                        link: "/docs/secure-software",
                                    },
                                    {
                                        name: "SLSA Secure Supply Chain",
                                        link: "/docs/slsa",
                                    },
                                    {
                                        name: "Vulnerability Reporting",
                                        link: "https://github.com/adoptium/adoptium/security/policy",
                                    },
                                    {
                                        name: "Temurin Security Case Study",
                                        link: 'https://outreach.eclipse.foundation/adoptium-temurin-supply-chain-security?utm_campaign=Temurin%20Case%20Study&utm_source=website&utm_medium=adoptium%20docs'
                                    },
                                    {
                                        name: "Reproducible Verification Builds",
                                        link: '/docs/reproducible-verification-builds'
                                    }
                                ]}
                            />
                            <DocumentationCard
                                title="Governance"
                                Icon={FaGlobe}
                                links={[
                                    {
                                        name: "About Eclipse Adoptium",
                                        link: "/about",
                                    },
                                    {
                                        name: "Working Group Members",
                                        link: "/members",
                                    },
                                    {
                                        name: "Join the Working Group",
                                        link: "/join",
                                    },
                                    {
                                        name: "Sponsor the Project",
                                        link: "https://www.eclipse.org/org/workinggroups/sponsorship/working-group-sponsorship-agreement.pdf",
                                    },
                                ]}
                            />
                            <DocumentationCard
                                title="Source Code"
                                Icon={FaGithub}
                                links={[
                                    {
                                        name: "Adoptium on GitHub",
                                        link: "https://github.com/adoptium",
                                    },
                                    {
                                        name: "Repository Overview",
                                        link: "https://github.com/adoptium/adoptium/blob/main/README.md",
                                    },
                                    {
                                        name: "Build Scripts",
                                        link: "https://github.com/adoptium/temurin-build",
                                    },
                                    {
                                        name: "Installer Code",
                                        link: "https://github.com/adoptium/installer",
                                    },
                                    {
                                        name: "Mission Control Build",
                                        link: "https://github.com/adoptium/jmc-build",
                                    },
                                ]}
                            />
                            <DocumentationCard
                                title="Other Resources"
                                Icon={FaInfoCircle}
                                links={[
                                    {
                                        name: "Frequently Asked Questions",
                                        link: "/docs/faq",
                                    },
                                    {
                                        name: "Adoptium API",
                                        link: "https://api.adoptium.net",
                                    },
                                    {
                                        name: "Adoptium News",
                                        link: "/news",
                                    },
                                    {
                                        name: "Join Us",
                                        link: "/join-us",
                                    },
                                ]}
                            />
                            <DocumentationCard
                                title="Branding"
                                Icon={FaRocket}
                                links={[
                                    {
                                        name: "Brand Guidelines",
                                        link: "https://www.eclipse.org/org/artwork/guidelines/adoptium-brand-guidelines.pdf",
                                    },
                                    {
                                        name: "Google Slide Template",
                                        link: "https://docs.google.com/presentation/d/1ChGhqZrAHCdk5S2Ii5s5RROng1saTaTtjZzsxWJ_MPA/copy",
                                    },
                                    {
                                        name: "Logo and Artwork",
                                        link: "/docs/logo-styleguide/",
                                    },
                                    {
                                        name: "Download Buttons",
                                        link: "/temurin/buttons",
                                    },
                                    {
                                        name: "Marketing Criteria",
                                        link: "/docs/marketing-criteria",
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
