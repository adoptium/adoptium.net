import React, { memo, useMemo, useState } from "react"
import Pagination from "../News/Pagination"

const TimeLine = ({ data }) => {
  const totalCount = data?.length
  const postsPerPage = 6
  const totalPages = Math.ceil(totalCount / postsPerPage)
  const [currentPage, setCurrentPage] = useState(1)

  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const paginatedData = data.slice(startIndex, endIndex)

  const previousPageNumber = useMemo(
    () => (Boolean(currentPage - 1) ? currentPage - 1 : 1),
    [currentPage],
  )
  const previousPageLink = null

  const nextPageNumber = currentPage < totalPages ? currentPage + 1 : null
  return (
    <div className="relative">
      {paginatedData.map((event, index) => {
        const isRight = index % 2 === 0
        return (
          <div
            key={index}
            className={`relative my-4 flex justify-between items-start w-full ${
              isRight ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div className="absolute left-1/2 top-0 mt-[30px] bottom-0 w-0.5 bg-[#ff1464] -translate-x-1/2" />

            <div className="w-5/12">
              <div className={`text-${isRight ? "right" : "left"}`}>
                <span className="text-base text-grey">
                  {formatDate(event.date)}
                </span>
                <a
                  href={event.infoLink}
                  target="_blank"
                  style={{
                    textDecoration: "underline",
                    textUnderlineOffset: "5px",
                  }}
                >
                  <h1 className="text-xl mt-5 mb-2 font-bold hover:transform hover:-translate-y-[2px] transition-transform duration-200">
                    {event.title}
                  </h1>
                </a>
                <p className="text-base text-grey ">
                  {truncateIfLonger(event.description)}
                </p>
              </div>
            </div>

            <div className="relative z-10 flex justify-center">
              <div className="w-4 h-4 border-4 border-[#ff1464] bg-purple rounded-full" />
            </div>

            {/* Empty side for alignment */}
            <div className="w-5/12" />
          </div>
        )
      })}
      <Pagination
        previousPageNumber={previousPageNumber}
        previousPageLink={previousPageLink}
        nextPage={nextPageNumber}
        currentPage={currentPage}
        totalPages={totalPages}
        onNavigate={page => setCurrentPage(page)}
      />
      <div className="flex items-center gap-5 mb-15">
        <a
          href="https://events.eclipse.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3"
        >
          View all
        </a>
        |
        <a
          href="https://newsroom.eclipse.org/node/add/events"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3"
        >
          Submit an event
        </a>
      </div>
    </div>
  )
}

export default memo(TimeLine)

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  const date = new Date(dateString)
  return date.toLocaleDateString("en-UK", options)
}

function truncateIfLonger(description) {
  const referenceWordCount = 40 // Number of words to keep
  const descriptionWords = description.trim().split(/\s+/)

  if (descriptionWords.length > referenceWordCount) {
    return descriptionWords.slice(0, referenceWordCount).join(" ") + "..."
  }

  return description
}
