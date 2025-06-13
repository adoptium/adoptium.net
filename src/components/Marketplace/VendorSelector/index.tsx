"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { FaCheck } from "react-icons/fa"
import vendors from "@/data/marketplace.json"
import getVendorIdentifier from "@/utils/vendors"
import { shuffle } from "@/utils/shuffle"

export interface Vendor {
    name: string
    icon: string
    iconPadding?: string
}

interface VendorSelectorProps {
    selectedVendorIdentifiers: string[]
    setSelectedVendorIdentifiers: (identifiers: string[]) => void
}

const VendorSelector: React.FC<VendorSelectorProps> = ({
    selectedVendorIdentifiers,
    setSelectedVendorIdentifiers,
}) => {
    const [randomizedVendors, setRandomizedVendors] = useState<Vendor[]>([])
    const t = useTranslations("Marketplace.VendorSelector")

    useEffect(() => {
        const vendorsCpy = [...vendors] // Assuming `vendors` is typed correctly
        setRandomizedVendors(shuffle(vendorsCpy))
        setSelectedVendorIdentifiers(
            vendorsCpy.map(vendor => getVendorIdentifier(vendor)),
        )
    }, [setSelectedVendorIdentifiers])

    const handleChange = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        identifier: string,
    ) => {
        e.preventDefault()
        const newSelectedVendorIdentifiers = [...selectedVendorIdentifiers]
        const idx = newSelectedVendorIdentifiers.indexOf(identifier)
        if (idx >= 0) newSelectedVendorIdentifiers.splice(idx, 1)
        else newSelectedVendorIdentifiers.push(identifier)
        setSelectedVendorIdentifiers(newSelectedVendorIdentifiers)
    }

    return (
        <div className="w-full">
            <div className="relative px-4 py-2">
                {randomizedVendors.length > 0 && (
                    <div className="text-right mb-2 text-sm text-gray-600 dark:text-gray-300">
                        {t("vendors-selected", {
                            selected: selectedVendorIdentifiers.length,
                            total: randomizedVendors.length,
                        })}
                    </div>
                )}

                <div className="flex overflow-x-auto pb-4 no-scrollbar justify-start md:justify-center">
                    <div className="flex space-x-4 min-w-min md:mx-auto pl-4 md:pl-0 pr-4 md:pr-0">
                        {randomizedVendors.map(vendor => {
                            const identifier = getVendorIdentifier(vendor)
                            const isSelected = selectedVendorIdentifiers.includes(identifier)

                            return (
                                <button
                                    key={`vendor-${identifier}`}
                                    onClick={e => handleChange(e, identifier)}
                                    className={`relative group flex flex-col items-center justify-center p-3 
                                        rounded-xl transition-all duration-300 flex-shrink-0
                                        ${isSelected
                                            ? "bg-gradient-to-br from-blue-50 to-purple-50 shadow-md dark:from-blue-900/20 dark:to-purple-900/20"
                                            : "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"}
                                        border ${isSelected ? "border-pink-500" : "border-gray-200 dark:border-gray-700"}`}
                                    title={vendor.name}
                                >
                                    {/* Selection Indicator */}
                                    <div
                                        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center
                                        transition-all duration-300
                                        ${isSelected
                                                ? "bg-pink text-white scale-100"
                                                : "bg-gray-200 dark:bg-gray-700 text-transparent scale-75 opacity-0 group-hover:opacity-50 group-hover:scale-100"}`}
                                    >
                                        <FaCheck className={`text-xs transition-opacity ${isSelected ? "opacity-100" : "opacity-0"}`} />
                                    </div>

                                    {/* Vendor Icon */}
                                    <div className="w-16 h-16 flex items-center justify-center mb-2 relative">
                                        <div className={`
                                            absolute inset-0 rounded-full bg-white
                                            transition-opacity duration-300
                                            ${isSelected
                                                ? "shadow-md dark:shadow-gray-700/50"
                                                : ""}
                                        `}></div>
                                        <Image
                                            src={`/images/vendors/${vendor.icon}`}
                                            className={`mb-0 p-1 relative transition-all duration-300 group-hover:scale-105 
                                            ${isSelected ? "" : "filter grayscale opacity-50 group-hover:opacity-70 group-hover:grayscale-75"}`}
                                            alt={`${vendor.name} icon`}
                                            style={
                                                vendor.iconPadding ? { padding: vendor.iconPadding } : {}
                                            }
                                            width={64}
                                            height={64}
                                        />
                                    </div>

                                    {/* Vendor Name */}
                                    <div className={`text-center text-sm font-medium truncate w-20 px-1 transition-colors duration-300
                                        ${isSelected
                                            ? "text-gray-900 dark:text-gray-100"
                                            : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"}`}>
                                        {vendor.name}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Empty State */}
                {randomizedVendors.length === 0 && (
                    <div className="flex justify-center items-center py-8 text-gray-500 dark:text-gray-400">
                        Loading vendors...
                    </div>
                )}
            </div>
        </div>
    )
}

export default VendorSelector
