import { Metadata } from "next"
import React from "react"
import PageHeader from "@/components/Common/PageHeader"
import Timeline from "@/components/Timeline"
import Calendar from "@/components/Calendar"

export const metadata: Metadata = {
    title: "Events",
    description: "Learn about upcoming events and how to participate in the Eclipse Adoptium community.",
}

export default function EventsPage() {
    return (
        <div>
            <PageHeader
                subtitle="Events"
                title="Eclipse  Foundation Events"
                description="Follow the latest Eclipse Foundation Events"
                className="mx-auto max-w-[860px] px-2 w-full"
            />
            <div className="bg-purple pt-8 px-4 max-w-[1000px] mx-auto">
                <div className="mx-auto max-w-3xl px-6 lg:px-8 flex flex-col items-center justify-center mb-16">
                    <h2 className="text-center text-4xl lg:text-5xl leading-[44px] lg:leading-[56px] font-semibold text-white-900">
                        Upcoming Events
                    </h2>
                </div>
                <Calendar />
                <Timeline />
            </div>
        </div>
    )
}