type DownloadStats = {
  date: string;
  docker_pulls: {
    [key: string]: number;
  };
  github_downloads: {
    [key: string]: number;
  };
  total_downloads: {
    docker_pulls: number;
    github_downloads: number;
    total: number;
  };
};

export async function fetchDownloadStats(): Promise<DownloadStats> {
  const res = await fetch("https://api.adoptium.net/v3/stats/downloads/total", {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  if (!res.ok) throw new Error("Failed to fetch download data");
  const data = await res.json();
  return data;
}
