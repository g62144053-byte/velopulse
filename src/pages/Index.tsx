import { HeroSection } from '@/components/HeroSection';
import { FeaturedCars } from '@/components/FeaturedCars';
import { BrandsSection } from '@/components/BrandsSection';
import { CTASection } from '@/components/CTASection';

const Index = () => {
  return (
    <main className="overflow-hidden">
      <HeroSection />
      <BrandsSection />
      <FeaturedCars />
      <CTASection />
    </main>
  );
};

export default Index;
