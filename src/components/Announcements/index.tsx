import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Common/Sidebar";
import TabContent from "./TabContent";
import { fetchLatestEvents } from "@/hooks";

interface AnnouncementsProps {
  handleClose: () => void;
}

const Announcements = ({ handleClose }: AnnouncementsProps) => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [latestReleases, setLatestReleases] = useState([]);
  const [latestEvents, setLatestEvents] = useState([]);
  const [active, setActive] = useState("Updates");

  useEffect(() => {
    // Fetch latest news posts
    fetch("/api/news?numPosts=4")
      .then((res) => res.json())
      .then((data) => setLatestPosts(data.posts || []))
      .catch(() => setLatestPosts([]));
    // Fetch latest releases (tagged 'release-notes')
    fetch("/api/news/byTag?tag=release-notes&numPosts=4")
      .then((res) => res.json())
      .then((data) => setLatestReleases(data.posts || []))
      .catch(() => setLatestReleases([]));
    // Fetch latest events (existing hook)
    const getEvents = async () => {
      const events = await fetchLatestEvents();
      setLatestEvents(events.slice(0, 6));
    };
    getEvents();
  }, []);

  return (
    <Sidebar onClose={handleClose} header="Announcements">
      <div className="flex items-center gap-8 border-b border-white/10 mb-6">
        {["Updates", "Events", "Releases"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className="relative pb-3 px-1"
          >
            <span
              className={`text-sm font-medium transition-colors duration-200 ${
                active === tab ? "text-pink" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </span>
            {active === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink shadow-[0_0_8px_rgba(255,19,101,0.5)] rounded-full" />
            )}
          </button>
        ))}
      </div>
      <div className="grow overflow-hidden h-full pb-24">
        <div className="overflow-y-auto h-full pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {active === "Updates" && <TabContent posts={latestPosts} />}
          {active === "Events" && (
            <TabContent posts={latestEvents} isEvents={true} />
          )}
          {active === "Releases" && <TabContent posts={latestReleases} />}
        </div>
      </div>
    </Sidebar>
  );
};

export default Announcements;
