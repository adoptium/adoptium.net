import React from "react"
import { Link } from "@/i18n/navigation"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

interface BecomeSustainerProps {
  classes?: string
}

const BecomeSustainer: React.FC<BecomeSustainerProps> = ({ classes = "" }) => (
  <div
    className={classNames(
      "flex flex-col md:flex-row gap-6 justify-center absolute items-center mt-[30px] md:-mt-[98px] w-full z-10",
      classes,
    )}
  >
    <a href="https://github.com/sponsors/adoptium" target="_blank" className="transform transition-transform duration-300 hover:scale-105">
      <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg shadow-lg hover:shadow-xl shadow-pink-500/30 hover:shadow-pink-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
        Become an Individual Sustainer
      </button>
    </a>
    <Link href="/become-a-sustainer" className="transform transition-transform duration-300 hover:scale-105">
      <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold text-lg border border-white/20 hover:border-white/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
        Become a Corporate Sustainer
      </button>
    </Link>
  </div>
)

export default BecomeSustainer
