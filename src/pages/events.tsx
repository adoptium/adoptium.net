import React, { useEffect, useState } from "react"

import Layout from "../components/Layout"
import Seo from "../components/Seo"
import PageHeader from "../components/PageHeader"
import { fetchLatestEvents } from "../hooks"
import Timeline from "../components/Timeline"

const Events = () => {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const getEvents = async () => {
      const response = await fetchLatestEvents()
      setEvents(response)
    }
    getEvents()
  }, [])

  return (
    <Layout>
      <PageHeader
        subtitle="Events"
        title="News & Events"
        description="Follow the latest Eclipse Foundation Events"
        className="mx-auto max-w-[860px] px-2 w-full"
      />
      <div className="bg-purple pt-8 px-4 max-w-[1000px] mx-auto">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 flex flex-col items-center justify-center mb-16">
          <h2 className="text-center text-4xl lg:text-5xl leading-[44px] lg:leading-[56px] font-semibold text-white-900">
            Upcoming Events
          </h2>
        </div>
        <Timeline data={events} />
      </div>
    </Layout>
  )
}

export default Events

export const Head = () => <Seo title="Events" />
