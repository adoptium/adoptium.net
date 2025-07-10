"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";

const StatsNav: React.FC = () => {
    const pathname = usePathname() || "";
    const isDownload = pathname.includes("/stats/download") || (!pathname.includes("/stats/trends") && !pathname.includes("/stats/download"));
    const isTrends = pathname.includes("/stats/trends");
    return (
        <nav className="flex justify-center m-8">
            <div className="inline-flex rounded-xl bg-white/10 border border-white/20 shadow-sm overflow-hidden">
                <Link
                    href="/stats/download"
                    className={`px-5 py-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:z-10 ${isDownload ? "bg-blue-600 text-white" : "text-blue-200 hover:bg-blue-700/30"}`}
                    aria-current={isDownload ? "page" : undefined}
                >
                    Download Stats
                </Link>
                <Link
                    href="/stats/trends"
                    className={`px-5 py-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:z-10 ${isTrends ? "bg-blue-600 text-white" : "text-blue-200 hover:bg-blue-700/30"}`}
                    aria-current={isTrends ? "page" : undefined}
                >
                    Trends
                </Link>
            </div>
        </nav>
    );
}

export default StatsNav;