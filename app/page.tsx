import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyVoyyara } from "@/components/home/WhyVoyyara";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <WhyVoyyara />
      <FeaturedDestinations />
      <WhyChooseUs />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
