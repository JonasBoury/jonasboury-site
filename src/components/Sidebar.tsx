import { Home, Briefcase, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState("home");
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "portfolio", "skills"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "portfolio", label: "Projects", icon: Briefcase },
    { id: "skills", label: "Skills", icon: User },
  ];

  // Mobile floating dock
  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 pb-6 px-4 flex justify-center pointer-events-none">
        <div className="flex gap-2 bg-background/80 backdrop-blur-md rounded-full p-2 shadow-lg border border-border pointer-events-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`p-3 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-foreground text-background shadow-md"
                    : "bg-muted/80 hover:bg-muted text-foreground"
                }`}
                aria-label={item.label}
              >
                <Icon className="h-5 w-5" />
              </button>
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
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-full transition-all duration-200 backdrop-blur-sm ${
                isActive
                  ? "bg-foreground text-background shadow-md"
                  : "bg-muted/80 hover:bg-muted text-foreground"
              }`}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isActive ? "bg-background/20" : "bg-muted"
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
