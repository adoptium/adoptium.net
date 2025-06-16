'use client'

import { useTranslations } from 'next-intl'
import RandomContributor from "@/components/RandomContributor"
import { CSSProperties } from 'react'
import "./styles.css"

const ContributorsHome = () => {
  const t = useTranslations('RandomContributors');
  const contributorStyles: CSSProperties[] = [
    {
      marginBottom: "100px",
      width: "305px",
    },
    {
      height: "fit-content",
      width: "305px",
    },
    {
      left: "-80px",
      top: "0px",
      position: "absolute",
    },
    {
      right: "-80px",
      bottom: "0px",
      position: "absolute",
    },
    {
      height: "fit-content",
    },
    {
      marginTop: "40px",
    },
  ]

  const set1 = contributorStyles.slice(0, 2)
  const set2 = contributorStyles.slice(2, 4)
  const set3 = contributorStyles.slice(4, 6)

  return (
    <div className="xl:px-0 lg:px-8 px-0 w-full overflow-hidden flex flex-col items-center justify-cente contributors mx-auto">
      {/* ==========================================SET-1=============================================== */}
      {/* Contributors cards for Set 1 */}
      <div className="flex w-fit space-x-4 sm:space-x-[210px] md:mx-auto justify-between items-end mt-[81px] xl:ml-[461px] overflow-hidden">
        {set1.map((style, index) => (
          <RandomContributor key={`set-1-${index}`} style={style} />
        ))}
      </div>

      {/* ==========================================SET-2=============================================== */}
      <div className="mx-auto max-w-[848px] w-full lg:space-x-8 xl:space-x-16 xl:hidden flex flex-col justify-center items-center text-center z-10 ">
        <h2 className="font-semibold text-white text-[64px] leading-[72px]">
          {t.rich('thank-you-mobile', {
            highlight: (chunks) => <span className="text-pink">{chunks}</span>,
            linebreak: () => <br />
          })}
        </h2>
      </div>

      <div className="xl:flex hidden w-full justify-center items-center relative">
        {/* Centered content for Set 2 */}
        <div className="mx-auto max-w-[848px] w-full lg:space-x-8 xl:space-x-16 flex flex-col justify-center items-center text-center z-10">
          <h2 className="font-semibold text-white text-[104px] leading-[120px]">
            {t.rich('thank-you', {
              highlight: (chunks) => <span className="text-pink">{chunks}</span>
            })}
          </h2>
        </div>

        {/* Contributors cards for Set 2 */}
        <div className="absolute flex justify-between h-full w-full">
          {set2.map((style, index) => (
            <RandomContributor key={`set-2-${index}`} style={style} />
          ))}
        </div>
      </div>

      {/* ==========================================SET-3=============================================== */}
      <div className="flex w-fit xl:ml-[244px] justify-between mt-10 mb-[87px] sm:space-x-[233px] space-x-10 md:mx-auto overflow-hidden sm:ml-0">
        {set3.map((style, index) => (
          <RandomContributor key={`set-3-${index}`} style={style} />
        ))}
      </div>
    </div>
  )
}

export default ContributorsHome
