import React from "react"
import { Link } from "../../Link"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

interface PaginationProps {
  previousPageNumber?: number | null
  previousPageLink?: string | null
  nextPage?: string | number | null
  currentPage: number
  totalPages: number
  baseUrl?: string
  onNavigate?: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  previousPageNumber,
  previousPageLink,
  nextPage,
  currentPage,
  totalPages,
  baseUrl,
  onNavigate,
}) => {
  // Helper to build a link for a given page number.
  // If page 1, return the baseUrl; otherwise append "/page/{page}".
  const createPageLink = (page: number): string =>
    page === 1 ? `${baseUrl}` : `${baseUrl}/page/${page}`

  // Build an array of page numbers and ellipses.
  const pages: (number | string)[] = []
  if (totalPages <= 7) {
    // If few pages, show them all.
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Always show the first page.
    pages.push(1)

    // Determine the range around the current page.
    let start = Math.max(2, currentPage - 2)
    let end = Math.min(totalPages - 1, currentPage + 2)

    // Adjust range if near the beginning.
    if (currentPage <= 3) {
      start = 2
      end = 5
    }
    // Adjust range if near the end.
    if (currentPage >= totalPages - 2) {
      start = totalPages - 4
      end = totalPages - 1
    }

    // Add ellipsis if there's a gap between 1 and the start.
    if (start > 2) {
      pages.push("...")
    }

    // Add the page numbers in the range.
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis if there's a gap between end and the last page.
    if (end < totalPages - 1) {
      pages.push("...")
    }

    // Always show the last page.
    pages.push(totalPages)
  }

  return (
    <div className="flex justify-center items-center gap-8 md:gap-14 my-8">
      {/* Previous arrow using your passed parameters */}
      {previousPageNumber && onNavigate ? (
        <button
          type="button"
          rel="prev"
          disabled={!previousPageNumber}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onNavigate(previousPageNumber)}
        >
          <span className="cursor-pointer">
            <FaChevronLeft />
          </span>
          <p className="tab-button-text mb-0 hidden md:block">Previous</p>
        </button>
      ) : (
        previousPageLink && (
          <Link
            to={previousPageLink}
            rel="prev"
            className="flex items-center gap-3"
          >
            <span className="cursor-pointer">
              <FaChevronLeft />
            </span>
            <p className="tab-button-text mb-0 hidden md:block">Previous</p>
          </Link>
        )
      )}

      {/* Numbered pagination */}
      <div className="flex items-center gap-5">
        <div className="flex items-center justify-between gap-6 border border-[#3E3355] rounded-[80px] px-6 py-3">
          {pages.map((page, index) =>
            page === "..." ? (
              <p key={index} className="tab-button-text mb-0">
                ...
              </p>
            ) : onNavigate ? (
              <span
                key={index}
                onClick={() => onNavigate(page as number)}
                className="cursor-pointer"
              >
                <p
                  className={`tab-button-text mb-0 ${
                    page === currentPage ? "font-bold text-pink" : ""
                  }`}
                >
                  {page}
                </p>
              </span>
            ) : (
              <Link key={index} to={createPageLink(page as number)}>
                <p
                  className={`tab-button-text mb-0 cursor-pointer ${
                    page === currentPage ? "font-bold text-pink" : ""
                  }`}
                >
                  {page}
                </p>
              </Link>
            ),
          )}
        </div>
      </div>
      {/* Next arrow using your passed parameters */}
      {onNavigate ? (
        <button
          type="button"
          rel="next"
          disabled={!nextPage}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onNavigate(nextPage as number)}
        >
          <p className="tab-button-text mb-0 hidden md:block">Next</p>
          <span>
            <FaChevronRight />
          </span>
        </button>
      ) : (
        <Link to={nextPage as string} className="flex items-center gap-3">
          <p className="tab-button-text mb-0 hidden md:block">Next</p>
          <span className="cursor-pointer">
            <FaChevronRight />
          </span>
        </Link>
      )}
    </div>
  )
}

export default Pagination
