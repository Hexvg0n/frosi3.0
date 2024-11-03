import MainSection from "@/components/MainSection";
import NavbarSection from "@/components/NavbarSection";
import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";
import BestSellersSection from "@/components/BestSellerSection";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen overflow-hidden">
      <div className="flex-grow bg-cover bg-fixed min-w-[100vw] overflow-hidden">
        <NavbarSection />
        <MainSection />
        <BestSellersSection />
        <AboutSection />
      </div>
      <FooterSection />
      <FooterTwoSection />
    </main>
  );
}