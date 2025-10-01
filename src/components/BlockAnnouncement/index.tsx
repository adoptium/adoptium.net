'use client'

import React, { useState, useEffect } from "react"

const BlockAnnouncement = () => {

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className='relative w-full'>
      <div className="w-full h-[1px] my-32 lg:my-16 bg-[#3E3355]"></div>
      <div className='absolute w-full top-[-72px]'>
        <div className="relative border border-[#3E3355] md:rounded-lg container mx-auto px-4 bg-purple">
          <div className={`from-[#0E002A] via-[#240b50] to-[#9a227a] py-5 w-full shadow-lg`}>
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center relative">
                <div className={`flex items-center gap-4 mb-3 md:mb-0 ${isMounted ? 'pr-8' : ''}`}>
                  <div>
                    <h2 className="text-[16px] md:text-2xl font-extrabold text-white leading-tight">
                      <span className="text-primary">Become a sustainer!</span> 
                    </h2>
                    <p className="text-[14px] text-gray-200 mt-1 max-w-2xl">
                      Join the Eclipse Temurin Sustainer Program to support Eclipse Temurin, the fastest-growing open source JDK. Your support fuels stronger security, faster releases, ready-to-deploy builds, quality testing and community development. <a href="/sustainers/" target="_blank" rel="noopener noreferrer" className="text-primary">Learn more!</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
  )
}

export default BlockAnnouncement
