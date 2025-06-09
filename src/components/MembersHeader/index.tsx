'use client';

import Link from 'next/link';
import { scrollToSection } from '@/utils/scrollToView';

export const MembersHeader = () => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full py-6 md:py-8 px-4">
            <Link href="/join" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg shadow-lg hover:shadow-xl shadow-pink-500/30 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                    Become a Member
                </button>
            </Link>
            <button
                onClick={e => scrollToSection(e, "strategic-sec")}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold text-lg border border-white/20 hover:border-white/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
                Our Members
            </button>
        </div>
    )
}