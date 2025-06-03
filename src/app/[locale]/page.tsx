import HeroSection from '@/components/HeroSection';
import LogoCarousel from '@/components/LogoCarousel';
import PowerOfTemurin from '@/components/PowerOfTemurin';
import DownloadCounter from '@/components/DownloadCounter';
import TemurinFeatures from '@/components/TemurinFeatures';
import WGProjects from '@/components/WGProjects';
import Testimonials from '@/components/Testimonials';
import ContributorsHome from '@/components/Contributors/home'

const LatestNews = () => {
    return (
        <div className="w-full h-[500px] flex items-center justify-center">
            <h1 className="text-2xl font-bold">TODO - implement LatestNews</h1>
        </div>
    );
}

export default function HomePage() {
    return (
        <div>
            <HeroSection />
            <LogoCarousel />
            <div className="w-full h-[1px] my-8 lg:my-16 bg-[#3E3355]"></div>
            <PowerOfTemurin />
            <DownloadCounter />
            <TemurinFeatures />
            <WGProjects />
            <Testimonials />
            <LatestNews />
            <ContributorsHome />
        </div>
    );
}
