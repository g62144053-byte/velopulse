import { HeroSection } from '@/components/HeroSection';
import { FeaturedCars } from '@/components/FeaturedCars';
import { BrandsSection } from '@/components/BrandsSection';
import { CTASection } from '@/components/CTASection';
import { RecentlyViewedCars } from '@/components/RecentlyViewedCars';

const Index = () => {
  return (
    <main className="overflow-hidden">
      <HeroSection />
      <BrandsSection />
      <FeaturedCars />
      <RecentlyViewedCars />
      <CTASection />
    </main>
  );
};

export default Index;
