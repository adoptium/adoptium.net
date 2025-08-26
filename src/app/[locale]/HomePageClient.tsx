import HeroSection from '@/components/HeroSection';
import LogoCarousel from '@/components/LogoCarousel';
import PowerOfTemurin from '@/components/PowerOfTemurin';
import DownloadCounter from '@/components/DownloadCounter';
import TemurinFeatures from '@/components/TemurinFeatures';
import WGProjects from '@/components/WGProjects';
import Testimonials from '@/components/Testimonials';
import LatestNews from '@/components/News/LatestNews';
import ContributorsHome from '@/components/Contributors/home';
import BlockAnnouncement from '@/components/BlockAnnouncement';

export default function HomePageClient({
    latestLTS,
    total_downloads
}: {
    latestLTS: number
    total_downloads: number
}) {
    return (
        <div>
            <HeroSection latestLTS={latestLTS} />
            <LogoCarousel />
            <BlockAnnouncement />
            <PowerOfTemurin />
            <DownloadCounter total={total_downloads} />
            <TemurinFeatures />
            <WGProjects />
            <Testimonials />
            <LatestNews />
            <ContributorsHome />
        </div>
    );
}
