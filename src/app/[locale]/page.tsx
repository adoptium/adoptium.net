import HeroSection from '@/components/HeroSection';
import LogoCarousel from '@/components/LogoCarousel';
import PowerOfTemurin from '@/components/PowerOfTemurin';
import DownloadCounter from '@/components/DownloadCounter';
import TemurinFeatures from '@/components/TemurinFeatures';
import ContributorsHome from '@/components/Contributors/home'

export default function HomePage() {
    return (
        <div>
            <HeroSection />
            <LogoCarousel />
            <div className="w-full h-[1px] my-8 lg:my-16 bg-[#3E3355]"></div>
            <PowerOfTemurin />
            <DownloadCounter />
            <TemurinFeatures />
            <ContributorsHome />
        </div>
    );
}
