import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Portfolio from "@/components/Portfolio";
import Inspiration from "@/components/Inspiration";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={isMobile ? "" : "ml-[var(--sidebar-width)]"}>
        <Hero />
        <Portfolio />
        <Inspiration />
        <Blog />
        <Skills />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
