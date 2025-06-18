import axios from "axios"

const baseUrl = "https://newsroom.eclipse.org/api"

export async function fetchLatestEvents() {
    const url = new URL(`${baseUrl}/events`)
    url.searchParams.append("parameters[publish_to]", "adoptium")
    url.searchParams.append("pagesize", "20")

    return axios
        .get(url.toString())
        .then(function (response) {
            return response.data.events
        })
        .catch(function () {
            return []
        })
}

export interface News {
    news: NewsResponse
    events: EventItem[]
}

export interface NewsResponse {
    news: NewsItem[]
    pager: {
        current_page: number
        items_per_page: number
        total_items: number
        total_pages: number
    } | null
}

export interface NewsItem {
    id: string
    title: string
    body: string
    date: Date
    link: URL
    image?: string  // Optional image URL from the Eclipse Foundation news API
}

export interface EventItem {
    id: string
    title: string
    infoLink: URL
    date: Date
}

export interface EventAPI {
    events: EventItem[]
}
