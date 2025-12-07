import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyVoyyara } from "@/components/home/WhyVoyyara";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { FinalCTA } from "@/components/home/FinalCTA";
import { GlobalFloatingImages } from "@/components/shared/GlobalFloatingImages";
import { getHomepageContent } from "@/lib/contentstack/homepage";

export default async function Home() {
  // Fetch homepage content from CMS
  const cmsContent = await getHomepageContent();

  return (
    <>
      <GlobalFloatingImages />
      <div className="relative z-10">
        <HeroSection content={cmsContent?.hero} />
        <HowItWorks content={cmsContent?.how_it_works} />
        <WhyVoyyara content={cmsContent?.why_voyyara} />
        <FeaturedDestinations />
        <WhyChooseUs content={cmsContent?.why_choose_us} />
        <Testimonials content={cmsContent?.testimonials} />
        <FinalCTA content={cmsContent?.final_cta} />
      </div>
    </>
  );
}
