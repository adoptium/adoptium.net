import axios from "axios"

const baseUrl = "https://newsroom.eclipse.org/api"

export async function fetchLatestNews() {
  const url = new URL(`${baseUrl}/news`)
  url.searchParams.append("parameters[publish_to]", "adoptium")
  url.searchParams.append("page", "1")
  url.searchParams.append("pagesize", "100")

  return axios
    .get(url.toString())
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      return { news: [], pager: null }
    })
}
