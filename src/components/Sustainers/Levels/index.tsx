import React from "react"
import UiMobileScroll from "@/components/UiVirtualScroll/mobile"
import UiVirtualContent from "@/components/UiVirtualScroll/UiVirtualContent"
import BecomeSustainer from "@/components/Sustainers/BecomeSustainer"

const data = [
    {
        title: "Diamond Benefits",
        description: (
            <ul className="text-left lg:list-disc lg:ml-4">
                <li>Logo (max size: 400x179) on our Sustainers page</li>
                <li>Logo location: top section, rotating placement in a row</li>
                <li>Use of the Diamond Sustainer logo for your site</li>
                <li>Joint press release with the Eclipse Foundation</li>
                <li>Listed in Eclipse Foundation Annual Reports</li>
                <li>Listed in all Adoptium Working Group press releases</li>
                <li>Sponsor a co-authored case study</li>
                <li>Media testimonial placement, spokesperson opportunities</li>
                <li>Speaking Opportunity at the Virtual Adoptium Summit</li>
            </ul>
        ),
        image: "diamond-layers.svg",
        subtext: {
            title: "Diamond",
            amount: "€100k/year",
        },
    },
    {
        title: "Platinum Benefits",
        description: (
            <ul className="text-left lg:list-disc lg:ml-4">
                <li>Logo (max size: 300x134) on our Sustainers page</li>
                <li>
                    Logo location: upper-middle section, rotating placement in row
                </li>
                <li>Use of the Platinum Sustainer logo for your site</li>
                <li>Joint press release with the Eclipse Foundation</li>
                <li>Listed in Eclipse Foundation Annual Reports</li>
                <li>Listed in all Adoptium Working Group press releases</li>
                <li>Media testimonial placement, spokesperson opportunities</li>
            </ul>
        ),
        image: "platinum-layers.svg",
        subtext: {
            title: "Platinum",
            amount: "€75k/year",
        },
    },
    {
        title: "Gold Benefits",
        description: (
            <ul className="text-left lg:list-disc lg:ml-4">
                <li>Logo (max size: 223x100) on our Sustainers page </li>
                <li>Logo location: middle section, rotating placement in a row</li>
                <li>Use of the Gold Sustainer logo for your site</li>
                <li>Personal quote for your press release</li>
                <li>Listed in all Adoptium Working Group press releases</li>
                <li>Media testimonial placement, spokesperson opportunities</li>
            </ul>
        ),
        image: "gold-layers.svg",
        subtext: {
            title: "Gold",
            amount: "€50k/year",
        },
    },
    {
        title: "Silver Benefits",
        description: (
            <ul className="text-left lg:list-disc lg:ml-4">
                <li>Logo (max size: 150x67) on our Sustainers page</li>
                <li>
                    Logo location: lower-middle section, rotating placement in a row
                </li>
                <li>Use of the Silver Sustainer logo for your site</li>
                <li>Media testimonial placement, spokesperson opportunities</li>
                <li>Listed in all Adoptium Working Group press releases</li>
            </ul>
        ),
        image: "silver-layers.svg",
        subtext: {
            title: "Silver",
            amount: "€30k/year",
        },
    },
    {
        title: "Bronze Benefits",
        description: (
            <ul className="text-left lg:list-disc lg:ml-4">
                <li>Logo (max size: 150x67) on our Sustainers page</li>
                <li>Logo location: lower section, rotating placement in a row</li>
                <li>Use of the Bronze Sustainer logo for your site</li>
                <li>Listed in all Adoptium Working Group press releases</li>
            </ul>
        ),
        image: "bronze-layers.svg",
        subtext: {
            title: "Bronze",
            amount: "€10k/year",
        },
    },
]

const SustainerLevels: React.FC = () => {
    return (
        <div className="mb-16 mt-8 relative">
            <div className="absolute -left-full -right-full -top-8 -z-10">
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff1464]/20 to-transparent"></div>
            </div>
            <h2 className="text-center text-4xl lg:text-5xl leading-[44px] lg:leading-[56px] font-semibold text-white-900 mb-10 mt-8">
                Sustainer Levels
            </h2>
            <div className="p-4">
                <UiMobileScroll data={data} />
                <div className="lg:block hidden open-animation-wrapper">
                    <UiVirtualContent data={data} />
                </div>
            </div>
            <BecomeSustainer classes="md:mt-10 md:mx-auto" />
        </div>
    )
}

export default SustainerLevels
