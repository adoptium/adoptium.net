'use client'

import Image from "next/image"
import { motion } from "framer-motion"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

interface LogoData {
  name: string
  logo: string
  url: string
  tier?: string
}

interface LogosGridProps {
  logos: LogoData[]
  type: string
}

const LogosGrid = ({ logos, type }: LogosGridProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-3">
      <div id={type} className="w-full">
        <div className={classNames("w-full")}>
          <div className="overflow-hidden px-2">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {logos.map((data, index) => (
                <motion.a 
                  key={data.name} 
                  href={data.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: "easeOut" 
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
                  }}
                  className="flex"
                >
                  <div className="relative w-full h-[86px] sm:h-[100px] md:h-[112px] flex justify-center items-center bg-white/90 hover:bg-white/100 rounded-2xl border border-white/50 backdrop-blur-xl shadow-md hover:shadow-xl transition-all duration-300 px-3 py-4 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Image
                      width={200}
                      height={100}
                      src={`/images/${data.logo}`}
                      alt={data.name}
                      className="max-h-16 md:max-h-20 m-0 relative z-10 transform group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogosGrid
