import { fetchDownloadStats } from '@/utils/fetchDownloadStats';
import { fetchAvailableReleases } from '@/utils/fetchAvailableReleases';
import HomePageClient from './HomePageClient';

export default async function HomePage() {
    let total_downloads = 1000000000;
    try {
        total_downloads = (await fetchDownloadStats()).total_downloads.total
    } catch { }
    const availableReleases = await fetchAvailableReleases();
    const latestLTS = availableReleases.most_recent_lts;
    return (
        <HomePageClient latestLTS={latestLTS} total_downloads={total_downloads} />
    )
}
