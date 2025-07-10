'use client'

import { useEffect, useState } from "react"
import axios from "axios"

// List of repos that will be checked for contributions
const repositories = [
  "temurin-build",
  "ci-jenkins-pipelines",
  "infrastructure",
  "aqa-tests",
  "adoptium.net",
  "api.adoptium.net",
  "containers",
  "installer",
  "STF",
  "run-aqa",
  "TKG",
  "aqa-test-tools",
  "aqa-systemtest",
  "bumblebench",
  "jenkins-helper",
]

// List of users to exclude from random contributor
const excludedContributors = [
  "dependabot-preview[bot]",
  "dependabot[bot]",
  "github-actions[bot]",
  "eclipse-temurin-bot",
  "eclipse-otterdog[bot]",
]

/**
 * Parses "Link" response header from node/contributors API
 * Returns page values for "next" and "last" API URLs
 * @param linkHeader
 */
function linkParser(linkHeader: string): {
  [key: string]: {
    url: string
    page: number
  }
} {
  const regex = /<([^?]+\?per_page=1&[a-z]+=([\d]+))>;[\s]*rel="([a-z]+)"/g
  let array: RegExpExecArray | null = null
  const object: Record<string, { url: string; page: number }> = {}

  do {
    array = regex.exec(linkHeader)

    if (array) {
      object[array[3]] = {
        url: array[1],
        page: parseInt(array[2], 10),
      }
    }
  } while (array !== null)

  return object
}

/**
 * Retrieves max amount of contributors for Adoptium repos.
 * Returns array with random contributor index and max contributors found.
 */
async function getMaxContributors(repository: string): Promise<[number, number]> {
  const repositoryURI = `https://api.github.com/repos/adoptium/${repository}/contributors?per_page=1`

  // this call is used to know how many contributors there are in this repo
  // check the Link header to compute first and last
  const linksHeaderValue = await axios
    .get(repositoryURI)
    .then(function (response) {
      return response.headers.link
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch(function (error) {
      return undefined
    })

  if (linksHeaderValue) {
    const links = linkParser(linksHeaderValue)
    const randomPage = Math.floor(Math.random() * Math.floor(links.last.page)) + 1
    return [randomPage, links.last.page]
  }

  throw new Error("Failed to get amount of max contributors")
}

/**
 * Retrieves a contributor's object by it's index in API
 * only return 'type: User' to filter out Bot
 * @param randomPage
 */
async function getContributor(repository: string, randomPage: number): Promise<Contributor | null> {
  const repositoryURI = `https://api.github.com/repos/adoptium/${repository}/contributors?per_page=1&page=${randomPage}`

  const contributor = await axios
    .get(repositoryURI)
    .then(function (response) {
      return response.data[0] as ContributorApiResponse
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch(function (error) {
      return undefined
    })

  if (!contributor) {
    return null
  }

  return {
    avatarUri: contributor.avatar_url,
    commitsListUri: `https://github.com/adoptium/${repository}/commits?author=${contributor.login}`,
    repo: repository,
    contributionsCount: contributor.contributions,
    login: contributor.login,
    profileUri: contributor.html_url,
  }
}

/**
 * Calls relative APIs and returns random contributor for Adoptium repos.
 * Trying to store cached data in localStorage in order to do less consequent requests
 */
async function fetchRandomContributor() {
  if (typeof window === 'undefined') {
    return null; // Early return on server side
  }

  // choose a random repo from the list
  const repository = repositories[Math.floor(Math.random() * repositories.length)]

  let maxContributors: number | null = null
  let fetchDate: number | null = null
  let needToRefetch = false
  const ONE_MONTH_MS = 2592000000

  const wlsMaxContributors = `${repository}_max_contributors`
  const wlsFetchDate = `${repository}_fetch_date`

  if (window.localStorage) {
    const maxContributorsStored = window.localStorage.getItem(wlsMaxContributors)
    const fetchDateStored = window.localStorage.getItem(wlsFetchDate)

    maxContributors = maxContributorsStored
      ? parseInt(maxContributorsStored, 10)
      : null
    fetchDate = fetchDateStored ? parseInt(fetchDateStored, 10) : null
  }

  if (fetchDate && Date.now() - fetchDate >= ONE_MONTH_MS) {
    needToRefetch = true
  }

  try {
    let randomPage = 0

    // If no localStorage or data is more than 1 month old
    if (!maxContributors || needToRefetch) {
      // get fresh data
      const [randomPageUpdate, lastPageUpdate] = await getMaxContributors(repository)
      if (!randomPageUpdate || !lastPageUpdate) return null

      if (window.localStorage) {
        window.localStorage.setItem(wlsFetchDate, String(Date.now()))
        window.localStorage.setItem(wlsMaxContributors, String(lastPageUpdate))
      }

      randomPage = randomPageUpdate
    } else {
      randomPage = Math.floor(Math.random() * Math.floor(maxContributors)) + 1
    }

    // get a random contributor from the repo
    let contributor = await getContributor(repository, randomPage)

    // retry if the contributor is in the excluded list (or an error occurred)
    let maxAttempts = 2

    while ((!contributor || excludedContributors.includes(contributor.login)) && maxAttempts-- > 0) {
      randomPage = Math.floor(Math.random() * Math.floor(maxContributors || 1)) + 1
      contributor = await getContributor(repository, randomPage)
    }

    return contributor
  } catch {
    return null
  }
}

export function useAdoptiumContributorsApi(
  isVisible: boolean,
): Contributor | null {
  const [contributor, setContributor] = useState<Contributor | null>(null)

  useEffect(() => {
    // Check for window first to prevent issues in test environments
    if (typeof window === 'undefined') {
      return;
    }

    // Only proceed if the component is visible
    if (!isVisible) {
      return;
    }

    // Create an abort controller to handle cleanup
    const abortController = new AbortController();

    // Fetch data with proper cleanup handling
    (async () => {
      try {
        const data = await fetchRandomContributor();

        // Check if the request was aborted before updating state
        if (!abortController.signal.aborted) {
          setContributor(data);
        }
      } catch (error) {
        // Only log error if not aborted
        if (!abortController.signal.aborted && error instanceof Error) {
          console.error('Error fetching contributor:', error.message);
        }
      }
    })();

    // Cleanup function to prevent state updates after unmount
    return () => {
      abortController.abort();
    };
  }, [isVisible])

  return contributor
}

export interface ContributorApiResponse {
  login: string
  id: number
  url: string
  type: string
  contributions: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  site_admin: boolean
}

export interface Contributor {
  avatarUri: string
  profileUri: string
  login: string
  contributionsCount: number
  commitsListUri: string
  repo: string
}
