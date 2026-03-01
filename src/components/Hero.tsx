import { useState, useEffect } from "react";
import { ArrowRight, Twitter, Linkedin, MessageCircle, Quote } from "lucide-react";
import profilePicture from "@/assets/profile-picture.png";
import { supabase } from "@/integrations/supabase/client";

const Hero = () => {
  const [heroQuote, setHeroQuote] = useState("I love to create new products with a passion for digital solutions bringing us closer to a sustainable world.");

  useEffect(() => {
    const fetchQuote = async () => {
      const { data } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "hero_quote")
        .single();

      if (data) {
        setHeroQuote(data.value);
      }
    };

    fetchQuote();
  }, []);

  const scrollToPortfolio = () => {
    const element = document.getElementById("portfolio");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 md:px-12 py-20">
      <div className="mx-auto max-w-3xl w-full">
        <div className="space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row items-center md:items-center gap-4">
            <img 
              src={profilePicture} 
              alt="Jonas Boury" 
              className="h-20 w-20 rounded-full object-cover flex-shrink-0"
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Jonas Boury
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mt-1">
                Builder, product thinker, AI pragmatist
              </p>
            </div>
          </div>
          
          <p className="text-sm md:text-base text-foreground leading-relaxed">
            Engineering background with 10+ years building digital products, from energy trading platforms to Web3 wallets to AI-powered software. Currently focused on AI and fintech.
          </p>

          <p className="text-sm md:text-base text-foreground leading-relaxed">
            I build AI software that replaces expensive SaaS subscriptions, and payment infrastructure that gives communities financial sovereignty.
          </p>
          
          <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 rounded-[20px] p-6 border border-primary/20">
            <Quote className="h-8 w-8 text-primary/40 mb-3" />
            <p className="text-sm md:text-base text-foreground leading-relaxed italic">
              {heroQuote}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={scrollToPortfolio}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 text-sm font-medium shadow-md"
            >
              View My Work
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="https://cal.com/jonas-boury/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/80 hover:bg-muted text-foreground transition-all duration-200 text-sm font-medium"
            >
              Book a Call
            </a>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <a
              href="https://x.com/JonasBoury"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/80 hover:bg-muted text-foreground transition-all duration-200 text-sm font-medium"
            >
              <Twitter className="h-4 w-4" />
              X
            </a>
            <a
              href="https://www.linkedin.com/in/jonasboury/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/80 hover:bg-muted text-foreground transition-all duration-200 text-sm font-medium"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href="https://farcaster.xyz/jonasboury"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/80 hover:bg-muted text-foreground transition-all duration-200 text-sm font-medium"
            >
              <MessageCircle className="h-4 w-4" />
              Farcaster
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
