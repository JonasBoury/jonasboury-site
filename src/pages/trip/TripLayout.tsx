import { Outlet, useLocation, Link } from "react-router-dom";
import { Package, Dumbbell, GraduationCap, Compass, Mountain, AlertTriangle, MapPin } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { TripOpeningAnimation } from "@/components/TripOpeningAnimation";
import niDenisAvatar from "@/assets/ni-denise-avatar.png";

const menuItems = [
  { id: "itinerary", label: "Itinerary", icon: Compass, path: "/trip/toerski-moelleux-club/itinerary" },
  { id: "research", label: "Research", icon: Mountain, path: "/trip/toerski-moelleux-club/research" },
  { id: "packing", label: "Packing List", icon: Package, path: "/trip/toerski-moelleux-club/packing" },
  { id: "training", label: "Training", icon: Dumbbell, path: "/trip/toerski-moelleux-club/training" },
  { id: "learning", label: "Learning", icon: GraduationCap, path: "/trip/toerski-moelleux-club/learning" },
  { id: "tracking", label: "Tracking", icon: MapPin, path: "/trip/toerski-moelleux-club/tracking" },
  { id: "emergency", label: "Emergency", icon: AlertTriangle, path: "/trip/toerski-moelleux-club/emergency" },
  { id: "guide", label: "Ni Denis", icon: Compass, path: "https://t.me/Nidenis_bot", isAvatar: true, isExternal: true },
];
export const TripLayout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [showAnimation, setShowAnimation] = useState(() => {
    return !sessionStorage.getItem("tripAnimationShown");
  });

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    sessionStorage.setItem("tripAnimationShown", "true");
  };

  // Update page title and meta tags for moelleuxclub.be domain
  useEffect(() => {
    const isMoelleuxDomain = 
      window.location.hostname === 'moelleuxclub.be' || 
      window.location.hostname === 'www.moelleuxclub.be';

    if (isMoelleuxDomain) {
      // Update title
      document.title = "Toerski Moelleux Club - Vanoise Skiing Trip";
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Planning and research for our ski touring trip in the Vanoise region. Track route analysis, weather conditions, and trip preparation.');
      }
      
      // Update og:title
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', 'Toerski Moelleux Club - Vanoise Skiing Trip');
      }
      
      // Update og:description
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', 'Planning and research for our ski touring trip in the Vanoise region');
      }
    }

    // Cleanup: restore original values when component unmounts
    return () => {
      if (isMoelleuxDomain) {
        document.title = "Jonas Boury - Product Manager & Digital Product Developer";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', 'Engineering background with 7 years in digital product development. Passionate about sustainable impact and financial systems.');
        }
      }
    };
  }, []);

  const TripSidebar = () => {
    if (isMobile) {
      return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 pb-6 px-4 flex justify-center pointer-events-none">
          <div className="flex gap-2 bg-background/80 backdrop-blur-md rounded-full p-2 shadow-lg border border-border pointer-events-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = !item.isExternal && location.pathname === item.path;
              
              if (item.isExternal) {
                return (
                  <a
                    key={item.id}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full transition-all duration-200 bg-muted/80 hover:bg-muted text-foreground"
                    aria-label={item.label}
                  >
                    {item.isAvatar ? (
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={niDenisAvatar} alt="Ni Denis" />
                        <AvatarFallback>
                          <Icon className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </a>
                );
              }
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-foreground text-background shadow-md"
                      : "bg-muted/80 hover:bg-muted text-foreground"
                  }`}
                  aria-label={item.label}
                >
                  {item.isAvatar ? (
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={niDenisAvatar} alt="Ni Denis" />
                      <AvatarFallback>
                        <Icon className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      );
    }

    // Desktop sidebar
    return (
      <aside className="fixed left-0 top-0 h-screen w-[var(--sidebar-width)] p-6">
        <nav className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = !item.isExternal && location.pathname === item.path;
            
            const content = (
              <>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isActive ? "bg-background/20" : "bg-muted"
                }`}>
                  {item.isAvatar ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={niDenisAvatar} alt="Ni Denis" />
                      <AvatarFallback>
                        <Icon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </>
            );
            
            if (item.isExternal) {
              return (
                <a
                  key={item.id}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-full transition-all duration-200 backdrop-blur-sm bg-muted/80 hover:bg-muted text-foreground"
                >
                  {content}
                </a>
              );
            }
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-full transition-all duration-200 backdrop-blur-sm ${
                  isActive
                    ? "bg-foreground text-background shadow-md"
                    : "bg-muted/80 hover:bg-muted text-foreground"
                }`}
              >
                {content}
              </Link>
            );
          })}
        </nav>
      </aside>
    );
  };

  return (
    <>
      {showAnimation && <TripOpeningAnimation onComplete={handleAnimationComplete} />}
      <div className="min-h-screen bg-background">
        <TripSidebar />
        <div className={isMobile ? "" : "ml-[var(--sidebar-width)]"}>
          <Outlet />
        </div>
      </div>
    </>
  );
};
