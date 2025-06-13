"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { getAssetsForVersion, TemurinReleases } from "@/hooks"
import TemurinNightlyTable from "@/components/Temurin/NightlyTable"
import { fetchAvailableReleases } from "@/utils/fetchAvailableReleases"
import ChecksumModal from "@/components/ChecksumModal"
const BUILD_NUMS = [1, 5, 10, 20, 50]

export default function NightlyVersionSelector() {
    const t = useTranslations("Temurin.Nightly")
    const [versions, setVersions] = useState<{ name: string; value: string }[]>([])
    const [version, setVersion] = useState<string>("")
    const [numBuilds, setNumBuilds] = useState<number>(5)
    const [buildDate, setBuildDate] = useState<string>(() => {
        const today = new Date()
        return today.toISOString().slice(0, 10)
    })
    const [releases, setReleases] = useState<TemurinReleases[]>([])
    const [checksumModalOpen, setChecksumModalOpen] = useState(false)
    const [selectedChecksum, setSelectedChecksum] = useState("")

    useEffect(() => {
        fetchAvailableReleases().then(vs => {
            setVersions(vs)
            // Find the latest LTS version
            const lts = vs.find(v => v.name.toLowerCase().includes('lts'))
            if (lts) {
                setVersion(lts.value)
            } else if (vs.length > 0) {
                setVersion(vs[0].value)
            }
        })
    }, [])

    useEffect(() => {
        if (!version) return
        getAssetsForVersion(
            Number(version),
            "ea",
            numBuilds,
            new Date(buildDate),
            1
        ).then(result => {
            setReleases(result?.releases || [])
        })
    }, [version, numBuilds, buildDate])

    const openModalWithChecksum = (checksum: string) => {
        setSelectedChecksum(checksum)
        setChecksumModalOpen(true)
    }

    return (
        <div>
            <div className="max-w-3xl mx-auto my-8">
                <h3 className="text-xl text-white mb-4 font-medium text-center">
                    {t('select-options-filter')}
                </h3>
                <div className="bg-[#26193F] rounded-xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-end gap-6 justify-center">
                        <div className="w-full md:w-auto">
                            <label className="block text-gray-300 mb-2 font-medium" htmlFor="version-filter">{t('version')}</label>
                            <select
                                data-testid="version-filter"
                                aria-label="version-filter"
                                id="version-filter"
                                className="w-full md:w-auto px-4 py-2 bg-[#200E46] border border-[#3E3355] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF1464]"
                                value={version}
                                onChange={e => setVersion(e.target.value)}
                            >
                                {versions.map(v => (
                                    <option key={v.value} value={v.value}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-auto">
                            <label className="block text-gray-300 mb-2 font-medium" htmlFor="build-num-filter">{t('number-of-builds')}</label>
                            <select
                                data-testid="build-num-filter"
                                aria-label="Filter by number of builds"
                                id="build-num-filter"
                                className="w-full md:w-auto px-4 py-2 bg-[#200E46] border border-[#3E3355] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF1464]"
                                value={numBuilds}
                                onChange={e => setNumBuilds(Number(e.target.value))}
                            >
                                {BUILD_NUMS.map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-auto">
                            <label className="block text-gray-300 mb-2 font-medium" htmlFor="build-date">{t('builds-prior-to')}</label>
                            <input
                                id="build-date"
                                type="date"
                                className="w-full md:w-auto px-4 py-2 bg-[#200E46] border border-[#3E3355] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF1464] date-picker"
                                max={new Date().toISOString().slice(0, 10)}
                                aria-label="Build Date"
                                value={buildDate}
                                onChange={e => setBuildDate(e.target.value)}
                            />
                            <style>{`.date-picker::-webkit-calendar-picker-indicator { filter: invert(39%) sepia(76%) saturate(7464%) hue-rotate(324deg) brightness(98%) contrast(105%); }`}</style>
                        </div>
                    </div>
                </div>
            </div>
            <TemurinNightlyTable results={{ releases }} openModalWithChecksum={openModalWithChecksum} />
            <ChecksumModal open={checksumModalOpen} setOpen={setChecksumModalOpen} checksum={selectedChecksum} />
        </div>
    )
}
