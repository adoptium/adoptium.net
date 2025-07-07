import { Metadata } from "next"
import React from "react"
import startCase from 'lodash/startCase'
import { IoCloudDownloadOutline } from "react-icons/io5";
import PageHeader from "@/components/Common/PageHeader"
import { fetchDownloadStats } from "@/utils/fetchDownloadStats"
import { fetchAvailableReleases } from "@/utils/fetchAvailableReleases";
import BarChart from "@/components/Dashboard/BarChart"
import PieChart from "@/components/Dashboard/PieChart"
import ColumnDrilldown from "@/components/Dashboard/ColumnDrilldown"
import StatsNav from "@/components/Dashboard/Nav";

export const metadata: Metadata = {
    title: "Download Dashboard",
    description: "View download statistics for Temurin releases",
}

export default async function DownloadStatsPage() {
    const availableReleases = await fetchAvailableReleases();
    availableReleases.available_releases.sort((a, b) => a - b);

    const data = await fetchDownloadStats();
    const total = data.total_downloads.total;
    let totalPieChartData: Array<{ name: string, y: number }> = []
    if (data && data.total_downloads) {
        totalPieChartData = Object.keys(data.total_downloads)
            .filter(key => key !== 'total')
            .map(key => ({
                name: startCase(key),
                y: data.total_downloads[key as keyof typeof data.total_downloads]
            }))
    }

    return (
        <div>
            <PageHeader
                title="Adoptium Download Stats"
                subtitle="Live download and Docker pull statistics for all Adoptium releases."
                className="max-w-3xl text-center mb-8"
            />
            <StatsNav />
            <div className="flex flex-col items-center min-h-screen py-8 px-2">
                <div className="flex flex-col items-center bg-white/5 rounded-2xl shadow-lg p-6 min-w-[260px] mb-8 w-full max-w-5xl">
                    <IoCloudDownloadOutline style={{ fontSize: 36, color: '#6ba4e7' }} />
                    <h2 className="text-3xl font-bold text-white mt-2 mb-1">{total.toLocaleString()}</h2>
                    <p className="text-base text-gray-300">Total Downloads / Docker Pulls Ever</p>
                </div>
                <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mb-8">
                    <div className="bg-white/5 rounded-2xl shadow-lg p-4 flex-1 min-w-[320px]">
                        <BarChart data={data.total_downloads} name='Total Downloads' startCaseKeys />
                    </div>
                    <div className="bg-white/5 rounded-2xl shadow-lg p-4 flex-1 min-w-[320px]">
                        <PieChart data={totalPieChartData} name='Total Downloads' showInLegend dataLabels colors={['#6c6de3', '#feae62', '#2caffe', '#a259f7', '#f67280', '#43e97b']} />
                    </div>
                </div>
                <div className="w-full max-w-5xl bg-white/5 rounded-2xl shadow-lg p-6 mt-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Github Release Downloads</h3>
                    <ColumnDrilldown availableReleases={{ available_releases: availableReleases.available_releases.map(String) }} name='Github Release Downloads' />
                </div>
            </div>
        </div>
    )
}
