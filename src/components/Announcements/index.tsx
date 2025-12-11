import React, { useState, useEffect } from "react"
import Sidebar from "@/components/Common/Sidebar"
import TabContent from "./TabContent"
import { fetchLatestEvents } from "@/hooks"

interface AnnouncementsProps {
    handleClose: () => void;
    onNotificationRead: () => void; 
}

const Announcements = ({ handleClose , onNotificationRead }: AnnouncementsProps) => {
    const [latestPosts, setLatestPosts] = useState([])
    const [latestReleases, setLatestReleases] = useState([])
    const [latestEvents, setLatestEvents] = useState([])
    const [active, setActive] = useState("Updates")
    const handleNotificationClick = () => {
    onNotificationRead(); 
  };


    useEffect(() => {
        // Fetch latest news posts
        fetch("/api/news?numPosts=4")
            .then(res => res.json())
            .then(data => setLatestPosts(data.posts || []))
            .catch(() => setLatestPosts([]))
        // Fetch latest releases (tagged 'release-notes')
        fetch("/api/news/byTag?tag=release-notes&numPosts=4")
            .then(res => res.json())
            .then(data => setLatestReleases(data.posts || []))
            .catch(() => setLatestReleases([]))
        // Fetch latest events (existing hook)
        const getEvents = async () => {
            const events = await fetchLatestEvents()
            setLatestEvents(events.slice(0, 6))
        }
        getEvents()
    }, [])

    return (
        <Sidebar onClose={handleClose} header="Announcements">
            <div className="flex items-center gap-12 relative">
                <span className="h-[1px] w-full bg-[#3E3355] inline-block absolute bottom-[0.7px] z-[-1]"></span>
                <div className="flex space-x-10 whitespace-nowrap   py-3">
                    <button onClick={() => setActive("Updates")}>
                        <span
                            className={`py-3 w-full tab-button-text
                outline-hidden cursor-pointer transition-all duration-200 ease-in-out ${active === "Updates" ? "border-primary border-b-2 text-white" : "text-[#8a809e] border-transparent border-b"}`}
                        >
                            Updates
                        </span>
                    </button>
                    <button onClick={() => setActive("Events")}>
                        <span
                            className={`py-3 w-full tab-button-text
                outline-hidden cursor-pointer transition-all duration-200 ease-in-out ${active === "Events" ? "border-primary border-b-2 text-white" : "text-[#8a809e] border-transparent border-b"}`}
                        >
                            Events
                        </span>
                    </button>
                    <button onClick={() => setActive("Releases")}>
                        <span
                            className={`py-3 w-full tab-button-text
                outline-hidden cursor-pointer transition-all duration-200 ease-in-out ${active === "Releases" ? "border-primary border-b-2 text-white" : "text-[#8a809e] border-transparent border-b"}`}
                        >
                            Releases
                        </span>
                    </button>
                </div>
            </div>
            <div className="mt-6 grow overflow-hidden h-full pb-28">
                <div className="overflow-auto h-[88%] scroll-sidebar">
                    {active === "Updates" && <TabContent posts={latestPosts} onItemClick={handleNotificationClick}/>}
                    {active === "Events" && <TabContent posts={latestEvents} isEvents={true} onItemClick={handleNotificationClick}/>}
                    {active === "Releases" && <TabContent posts={latestReleases} onItemClick={handleNotificationClick}/>}
                </div>
            </div>
        </Sidebar>
    )
}

export default Announcements