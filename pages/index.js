import MainSection from "@/components/MainSection";
import NavbarSection from "@/components/NavbarSection";
import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";
import BestSellersSection from "@/components/BestSellerSection";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <div className="relative min-h-screen">

    <div className="fixed inset-0 -z-30 opacity-30">
    <div 
        className="absolute w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,#4F46E5_0%,transparent_60%)]"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'gradient-pulse 15s infinite alternate'
        }}
      />
    </div>

    {/* Globalne style dla animacji */}
    <style jsx global>{`
      @keyframes gradient-pulse {
        0% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
        50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.2); }
        100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
      }
    `}</style>

    {/* Sekcje strony */}
    <div className="relative z-10">
    <NavbarSection/>
      <MainSection />
      <BestSellersSection />
      <AboutSection />
      <FooterSection/>  
      <FooterTwoSection/>
    </div>
  </div>
  );
}