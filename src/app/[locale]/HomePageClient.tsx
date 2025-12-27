import HeroSection from "@/components/HeroSection";
import PowerOfTemurin from "@/components/PowerOfTemurin";
import DownloadCounter from "@/components/DownloadCounter";
import BentoGrid from "@/components/TemurinFeatures/BentoGrid";
import WGProjects from "@/components/WGProjects";
import Testimonials from "@/components/Testimonials";
import LatestNews from "@/components/News/LatestNews";
import ContributorsHome from "@/components/Contributors/home";
import BannerMiddle from "@/components/BannerMiddle";

export default function HomePageClient({
  latestLTS,
  total_downloads,
}: {
  latestLTS: number;
  total_downloads: number;
}) {
  return (
    <div className="bg-[#14003c]">
      <HeroSection latestLTS={latestLTS} />
      <BannerMiddle />
      <PowerOfTemurin />
      <DownloadCounter total={total_downloads} />
      <BentoGrid />
      <WGProjects />
      <Testimonials type="member" />
      <LatestNews />
      <ContributorsHome />
    </div>
  );
}
