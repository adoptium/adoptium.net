"use client"

import React, { memo, useState, useEffect } from "react"
import { useLocale } from "next-intl"
import ClientPagination from "./ClientPagination"
import { truncateIfLonger } from "@/utils/truncateLonger"
import { fetchLatestEvents } from "@/hooks"

// Define a type for events
interface TimelineEvent {
    date: string;
    title: string;
    description: string;
    infoLink: string;
}

// Accept data as a prop for testing, fallback to fetchLatestEvents if not provided
interface TimeLineProps {
    data?: TimelineEvent[]
}

const TimeLine = ({ data }: TimeLineProps) => {
    const locale = useLocale()
    const [events, setEvents] = useState<TimelineEvent[]>(data || [])

    useEffect(() => {
        if (!data) {
            // Fetch actual events from API
            const getEvents = async () => {
                const response = await fetchLatestEvents()
                setEvents(response)
            }
            getEvents()
        }
    }, [data])

    const validEvents = events?.filter(
        event => !!event.date && !isNaN(new Date(event.date).getTime()),
    )

    const totalCount = validEvents?.length || 0
    const postsPerPage = 6
    const totalPages = Math.ceil(totalCount / postsPerPage)
    const [currentPage, setCurrentPage] = useState<number>(1)

    const startIndex = (currentPage - 1) * postsPerPage
    const endIndex = startIndex + postsPerPage
    const paginatedData = validEvents.slice(startIndex, endIndex)

    // Helper for date formatting
    const newDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric"
        })
    }

    return (
        <div className="relative">
            {paginatedData.map((event, index) => {
                const isRight = index % 2 === 0
                return (
                    <div
                        key={index}
                        className={`relative my-4 flex justify-between items-start w-full ${isRight ? "flex-row" : "flex-row-reverse"
                            }`}
                    >
                        <div className="absolute left-1/2 top-0 mt-[30px] bottom-0 w-0.5 bg-[#ff1464] -translate-x-1/2" />

                        <div className="w-5/12">
                            <div className={`text-${isRight ? "right" : "left"}`}>
                                <span className="text-base text-grey">
                                    {newDate(event.date)}
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
            <ClientPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onNavigate={setCurrentPage}
            />
            <div className="flex items-center gap-5 mb-15 justify-center">
                <a
                    href="https://events.eclipse.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                >
                    View all Eclipse Foundation events
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
