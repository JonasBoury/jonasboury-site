import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Dumbbell, Calendar, Plus, Compass, GraduationCap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TripOpeningAnimation } from "@/components/TripOpeningAnimation";
import { TourAnalysis } from "@/components/TourAnalysis";
import { TravelRoute } from "@/components/TravelRoute";
import { RefugesList } from "@/components/RefugesList";
import { ElevationProfile } from "@/components/ElevationProfile";
import { AvalancheRisk } from "@/components/AvalancheRisk";
import type { Json } from "@/integrations/supabase/types";

interface PackingItem {
  name: string;
  description?: string;
  canBorrow?: boolean;
  checked?: Record<string, boolean>; // person name -> checked status
}

interface PackingCategory {
  name: string;
  items: PackingItem[];
}

interface PackingListData {
  common?: {
    categories: PackingCategory[];
  };
  perPerson?: {
    categories: PackingCategory[];
  };
}

interface Trip {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  cover_image_url: string | null;
  packing_list_data: Json | null;
}

const PEOPLE = ["Stan", "Nero", "Jonas"];

const TripToerskiMoelleux = () => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("packing");
  const [selectedPerson, setSelectedPerson] = useState(PEOPLE[0]);
  const [newItemName, setNewItemName] = useState("");
  const [showAnimation, setShowAnimation] = useState(() => {
    // Check if animation was already shown in this session
    return !sessionStorage.getItem("tripAnimationShown");
  });
  const [trackPoints, setTrackPoints] = useState<Array<{ lat: number; lon: number; ele: number }>>([]);
  const isMobile = useIsMobile();

  const calculateRefugeDistance = (refugeCoords: [number, number], points: Array<{ lat: number; lon: number; ele: number }>) => {
    let minDistance = Infinity;
    let totalDistance = 0;
    let refugeDistance = 0;

    for (let i = 0; i < points.length; i++) {
      if (i > 0) {
        const prevPoint = points[i - 1];
        const lat1 = prevPoint.lat * Math.PI / 180;
        const lat2 = points[i].lat * Math.PI / 180;
        const deltaLat = (points[i].lat - prevPoint.lat) * Math.PI / 180;
        const deltaLon = (points[i].lon - prevPoint.lon) * Math.PI / 180;
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        totalDistance += 6371 * c;
      }

      const distToRefuge = Math.sqrt(
        Math.pow(points[i].lat - refugeCoords[1], 2) +
        Math.pow(points[i].lon - refugeCoords[0], 2)
      );

      if (distToRefuge < minDistance) {
        minDistance = distToRefuge;
        refugeDistance = totalDistance;
      }
    }

    return refugeDistance;
  };

  useEffect(() => {
    fetchTrip();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["packing", "training", "schedule", "learning", "research"];
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

  const fetchTrip = async () => {
    try {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("slug", "toerski-moelleux-club")
        .eq("is_public", true)
        .maybeSingle();

      if (error) throw error;
      if (data) setTrip(data);
    } catch (error) {
      console.error("Error fetching trip:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id); // Immediately update active section
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleItem = async (person: string, categoryIdx: number, itemIdx: number) => {
    if (!trip?.packing_list_data) return;
    
    const packingData = trip.packing_list_data as PackingListData;
    const updatedData = JSON.parse(JSON.stringify(packingData));
    
    if (updatedData.perPerson?.categories[categoryIdx]?.items[itemIdx]) {
      const item = updatedData.perPerson.categories[categoryIdx].items[itemIdx];
      if (!item.checked) item.checked = {};
      item.checked[person] = !item.checked[person];
      
      const { error } = await supabase
        .from("trips")
        .update({ packing_list_data: updatedData as unknown as Json })
        .eq("slug", "toerski-moelleux-club");
      
      if (!error) {
        setTrip({ ...trip, packing_list_data: updatedData as unknown as Json });
      }
    }
  };

  const addCustomItem = async (person: string) => {
    if (!newItemName.trim() || !trip?.packing_list_data) return;
    
    const packingData = trip.packing_list_data as PackingListData;
    const updatedData = JSON.parse(JSON.stringify(packingData));
    
    if (!updatedData.perPerson) {
      updatedData.perPerson = { categories: [] };
    }
    
    // Find or create "Custom Items" category
    let customCategory = updatedData.perPerson.categories.find(c => c.name === "Custom Items");
    if (!customCategory) {
      customCategory = { name: "Custom Items", items: [] };
      updatedData.perPerson.categories.push(customCategory);
    }
    
    customCategory.items.push({ name: newItemName.trim(), checked: {} });
    
    const { error } = await supabase
      .from("trips")
      .update({ packing_list_data: updatedData as unknown as Json })
      .eq("slug", "toerski-moelleux-club");
    
    if (!error) {
      setTrip({ ...trip, packing_list_data: updatedData as unknown as Json });
      setNewItemName("");
    }
  };

  const isItemChecked = (item: PackingItem, person: string) => {
    return item.checked?.[person] || false;
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    sessionStorage.setItem("tripAnimationShown", "true");
  };

  const menuItems = [
    { id: "packing", label: "Packing List", icon: Package },
    { id: "training", label: "Training", icon: Dumbbell },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "learning", label: "Learning", icon: GraduationCap },
    { id: "research", label: "Research", icon: Compass },
  ];

  const CommonPackingSection = ({ category }: { category: PackingCategory }) => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
      <ul className="space-y-2">
        {category.items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <div className="h-4 w-4 rounded-full bg-primary/20 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-foreground">{item.name}</span>
              {item.description && (
                <span className="text-muted-foreground">: {item.description}</span>
              )}
              {item.canBorrow && (
                <span className="text-primary ml-2 text-xs">(Te lenen)</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  const PersonalPackingSection = ({ category, person, categoryIdx }: { category: PackingCategory; person: string; categoryIdx: number }) => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
      <ul className="space-y-2">
        {category.items.map((item, idx) => {
          return (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <Checkbox
                checked={isItemChecked(item, person)}
                onCheckedChange={() => toggleItem(person, categoryIdx, idx)}
                className="mt-0.5"
              />
              <div className={isItemChecked(item, person) ? "line-through opacity-60" : ""}>
                <span className="font-medium text-foreground">{item.name}</span>
                {item.description && (
                  <span className="text-muted-foreground">: {item.description}</span>
                )}
                {item.canBorrow && (
                  <span className="text-primary ml-2 text-xs">(Te lenen)</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Mobile floating dock
  const TripSidebar = () => {
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

  return (
    <div className="min-h-screen bg-background">
      {showAnimation && <TripOpeningAnimation onComplete={handleAnimationComplete} />}
      <TripSidebar />
      <div className={isMobile ? "" : "ml-[var(--sidebar-width)]"}>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {trip?.cover_image_url && (
            <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
              <img
                src={trip.cover_image_url}
                alt={trip.title || "Trip cover"}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">{trip?.title || "Toerski Moelleux Club"}</h1>
            {trip?.description && (
              <p className="text-muted-foreground text-lg">{trip.description}</p>
            )}
          </div>

          {/* Packing List Section */}
          <section id="packing" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6">Packing List</h2>
            <div className="space-y-6">
              {trip?.packing_list_data && typeof trip.packing_list_data === 'object' && 'common' in trip.packing_list_data && (
                <Card>
                  <CardHeader>
                    <CardTitle>Groepsmateriaal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {((trip.packing_list_data as PackingListData).common?.categories || []).map((category, idx) => (
                      <CommonPackingSection key={idx} category={category} />
                    ))}
                  </CardContent>
                </Card>
              )}

              {trip?.packing_list_data && typeof trip.packing_list_data === 'object' && 'perPerson' in trip.packing_list_data && (
                <Card>
                  <CardHeader>
                    <CardTitle>Persoonlijke Packing List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={selectedPerson} onValueChange={setSelectedPerson}>
                      <TabsList className="grid w-full grid-cols-3 mb-6">
                        {PEOPLE.map((person) => (
                          <TabsTrigger key={person} value={person}>
                            {person}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {PEOPLE.map((person) => (
                        <TabsContent key={person} value={person} className="space-y-6">
                          {((trip.packing_list_data as PackingListData).perPerson?.categories || []).map((category, idx) => (
                            <PersonalPackingSection key={idx} category={category} person={person} categoryIdx={idx} />
                          ))}
                          
                          <div className="pt-4 border-t">
                            <h3 className="text-lg font-semibold text-foreground mb-3">Voeg item toe</h3>
                            <div className="flex gap-2">
                              <Input
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder="Nieuw item..."
                                onKeyDown={(e) => e.key === "Enter" && addCustomItem(person)}
                              />
                              <Button onClick={() => addCustomItem(person)} size="icon">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {!trip?.packing_list_data && (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No packing list available yet.
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          {/* Training Section */}
          <section id="training" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6">Training Plan</h2>
            <Card>
              <CardHeader>
                <CardTitle>Get Ready for the Slopes</CardTitle>
              </CardHeader>
              <CardContent className="py-8 text-center text-muted-foreground">
                Training information coming soon...
              </CardContent>
            </Card>
          </section>

          {/* Schedule Section */}
          <section id="schedule" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6">Trip Schedule</h2>
            <Card>
              <CardHeader>
                <CardTitle>Itinerary</CardTitle>
              </CardHeader>
              <CardContent className="py-8 text-center text-muted-foreground">
                Schedule details coming soon...
              </CardContent>
            </Card>
          </section>

          {/* Learning Resources Section */}
          <section id="learning" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6">Learning Resources</h2>
            <p className="text-muted-foreground mb-6">
              Essential resources to learn about tourski safety and avalanche awareness
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a 
                href="https://www.ortovox.com/uk/safety-academy-lab-snow/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img 
                      src="/images/ortovox-academy.png" 
                      alt="Ortovox Safety Academy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      Ortovox Academy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive safety training from Ortovox covering avalanche awareness and ski touring fundamentals.
                    </p>
                  </CardContent>
                </Card>
              </a>

              <a 
                href="https://www.youtube.com/watch?v=ZFWII5bAlQI&list=PLpNJNTd93SblL447belxr2-t0JTCC-P-z" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img 
                      src="/images/youtube-playlist.png" 
                      alt="Ortovox YouTube Playlist"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      YouTube Playlist
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Video series on avalanche types, safety equipment, and risk assessment methods.
                    </p>
                  </CardContent>
                </Card>
              </a>

              <a 
                href="https://rise.articulate.com/share/VqrSFzGPcodpt7vHnCXIS42DuuliF4ep#/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img 
                      src="/images/nz-course.png" 
                      alt="New Zealand Avalanche Course"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      NZ Online Cursus
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Free online avalanche training module from New Zealand's Avalanche Advisory service.
                    </p>
                  </CardContent>
                </Card>
              </a>

              <a 
                href="https://portaal.klimenbergsportfederatie.be/events/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img 
                      src="/images/kbf-events.png" 
                      alt="KBF Events"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      KBF Opleiding
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      In-person training course 'Basis sneeuw- en lawinekunde' via the Belgian mountaineering federation.
                    </p>
                  </CardContent>
                </Card>
              </a>
            </div>
          </section>

          {/* Research Section */}
          <section id="research" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6">Trip Research</h2>
            <p className="text-muted-foreground mb-8">
              Analyze potential tour options with 3D terrain visualization, weather data, and detailed metrics
            </p>
            
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-6">Travel Route from Aalst</h3>
              <TravelRoute 
                origin={{ lat: 50.9366, lon: 4.0417, name: "Aalst, Belgium" }}
                destination={{ lat: 45.3765, lon: 6.7237, name: "Pralognan-la-Vanoise, France" }}
              />
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-6">Tour Option: Rondje Vanoise</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <TourAnalysis 
                    gpxUrl="/gpx/rondje-vanoise.gpx" 
                    onTrackPointsLoaded={setTrackPoints}
                  />
                </div>
                <div>
                  <AvalancheRisk region="AT-07" />
                </div>
              </div>
              
              {trackPoints.length > 0 && (
                <div className="mt-6">
                  <ElevationProfile 
                    trackPoints={trackPoints}
                    refuges={[
                      { name: "Péclet-Polset", coordinates: [6.6950, 45.3167] as [number, number], altitude: 2474 },
                      { name: "Roc de la Pêche", coordinates: [6.6882, 45.3233] as [number, number], altitude: 2542 },
                      { name: "Fond d'Aussois", coordinates: [6.7024, 45.2768] as [number, number], altitude: 2324 },
                      { name: "Dent Parrachée", coordinates: [6.7189, 45.2697] as [number, number], altitude: 2511 },
                      { name: "L'Arpont", coordinates: [6.7892, 45.3182] as [number, number], altitude: 2309 },
                      { name: "Col de la Vanoise", coordinates: [6.7911, 45.3919] as [number, number], altitude: 2517 },
                      { name: "Barmettes", coordinates: [6.7350, 45.3650] as [number, number], altitude: 2006 },
                    ].map(refuge => ({
                      ...refuge,
                      distanceAlongRoute: calculateRefugeDistance(refuge.coordinates, trackPoints),
                    }))}
                  />
                </div>
              )}
            </div>

            <div>
              <RefugesList trackPoints={trackPoints} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TripToerskiMoelleux;
