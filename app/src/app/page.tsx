import { FeatureDiagnose } from "@/components/site/FeatureDiagnose";
import { Hero } from "@/components/site/Hero";
import { HowItWorks } from "@/components/site/HowItWorks";
import { PlantDoctor } from "@/components/site/PlantDoctor";
import { Pricing } from "@/components/site/Pricing";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";

/** The Verdant marketing site — a single landing page driving app installs. */
export default function HomePage() {
  return (
    <>
      <SiteNav />
      <Hero />
      <HowItWorks />
      <FeatureDiagnose />
      <PlantDoctor />
      <Pricing />
      <SiteFooter />
    </>
  );
}
