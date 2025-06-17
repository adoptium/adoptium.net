import { Metadata } from "next"
import React from "react"
import PageHeader from "@/components/Common/PageHeader"

export const metadata: Metadata = {
    title: "Slack",
    description: "Join our Slack community to connect with other Eclipse Adoptium users and contributors.",
}

export default function SlackPage() {
    return (
        <div>
            <PageHeader
                title="Slack Signup"
                subtitle="Join our Slack community"
            />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <p className="text-lg mb-4">
                    Join our Slack community to connect with other Eclipse Adoptium users and contributors.
                    Share your experiences, ask questions, and collaborate on projects.
                </p>
                <a
                    href="https://join.slack.com/t/adoptium/shared_invite/zt-37l2atudg-K8SY_QFkmO8zCsgC7MJcWg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-pink text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                >
                    Join Slack
                </a>
            </div>
        </div>
    )
}
