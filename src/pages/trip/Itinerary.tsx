import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mountain, 
  MapPin, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Home,
  AlertTriangle,
  Calendar,
  Car
} from "lucide-react";
import { TourAnalysis } from "@/components/TourAnalysis";
import { ElevationProfile } from "@/components/ElevationProfile";
import { TravelRoute } from "@/components/TravelRoute";
import { AvalancheRisk } from "@/components/AvalancheRisk";
import { SnowpackChart } from "@/components/SnowpackChart";

interface DayRoute {
  day: number;
  date: string;
  title: string;
  from: string;
  to: string;
  gpxUrl: string | null;
  distance?: number;
  ascent?: number;
  descent?: number;
  duration?: string;
  refuge: {
    name: string;
    altitude: number;
    coordinates: [number, number];
  } | null;
  status: "confirmed" | "pending" | "rest" | "travel";
  notes?: string;
  isTravelDay?: boolean;
}

const TRIP_DAYS: DayRoute[] = [
  {
    day: 0,
    date: "2026-02-14",
    title: "Travel Day — Aalst → Galtür",
    from: "Aalst, Belgium",
    to: "Galtür, Austria",
    gpxUrl: null,
    duration: "~9h drive",
    refuge: null,
    status: "travel",
    isTravelDay: true,
    notes: "Departure early morning. Approx. 900km drive to Galtür.",
  },
  {
    day: 1,
    date: "2026-02-15",
    title: "Galtür → Heidelberger Hütte",
    from: "Galtür",
    to: "Heidelberger Hütte",
    gpxUrl: "/gpx/day-1-galtur-heidelberg.gpx",
    distance: 12.5,
    ascent: 1100,
    descent: 370,
    duration: "5-6h",
    refuge: { name: "Heidelberger Hütte", altitude: 2264, coordinates: [10.2594, 46.9097] },
    status: "confirmed",
  },
  {
    day: 2,
    date: "2026-02-16",
    title: "Heidelberger Hütte → Jamtalhütte",
    from: "Heidelberger Hütte",
    to: "Jamtalhütte",
    gpxUrl: "/gpx/day-2-heidelberg-jamtal.gpx",
    distance: 10.4,
    ascent: 723,
    descent: 835,
    duration: "4-5h",
    refuge: { name: "Jamtalhütte", altitude: 2165, coordinates: [10.1764, 46.8865] },
    status: "confirmed",
  },
  {
    day: 3,
    date: "2026-02-17",
    title: "Jamtalhütte → Wiesbadener Hütte",
    from: "Jamtalhütte",
    to: "Wiesbadener Hütte",
    gpxUrl: "/gpx/day-3-jamtal-wiesbadener.gpx",
    distance: 10.9,
    ascent: 1355,
    descent: 1072,
    duration: "5-6h",
    refuge: { name: "Wiesbadener Hütte", altitude: 2443, coordinates: [10.1163, 46.8681] },
    status: "confirmed",
  },
  {
    day: 4,
    date: "2026-02-18",
    title: "Rest Day / Summit Day",
    from: "Wiesbadener Hütte",
    to: "Wiesbadener Hütte",
    gpxUrl: null,
    refuge: { name: "Wiesbadener Hütte", altitude: 2443, coordinates: [10.1163, 46.8681] },
    status: "pending",
    notes: "Route TBD - Options: Piz Buin summit attempt or rest day depending on conditions",
  },
  {
    day: 5,
    date: "2026-02-19",
    title: "Wiesbadener Hütte → Silvrettahütte",
    from: "Wiesbadener Hütte",
    to: "Silvrettahütte",
    gpxUrl: "/gpx/day-5-wiesbadener-silvretta.gpx",
    distance: 11.6,
    ascent: 911,
    descent: 992,
    duration: "4-5h",
    refuge: { name: "Silvrettahütte", altitude: 2341, coordinates: [10.0416, 46.8545] },
    status: "confirmed",
  },
  {
    day: 6,
    date: "2026-02-20",
    title: "Silvrettahütte → Bieler Höhe",
    from: "Silvrettahütte",
    to: "Bieler Höhe",
    gpxUrl: "/gpx/day-6-silvretta-bielerhohe.gpx",
    distance: 14.2,
    ascent: 952,
    descent: 1274,
    duration: "5-6h",
    refuge: { name: "Bieler Höhe", altitude: 2036, coordinates: [10.0995, 46.9174] },
    status: "confirmed",
    notes: "Final day - bus transfer back to Galtür from Bieler Höhe",
  },
];

const DayCard = ({ 
  route, 
  isSelected, 
  onClick 
}: { 
  route: DayRoute; 
  isSelected: boolean;
  onClick: () => void;
}) => {
  const getStatusBadge = () => {
    switch (route.status) {
      case "confirmed":
        return <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">Confirmed</Badge>;
      case "pending":
        return <Badge variant="default" className="bg-amber-500/20 text-amber-400 border-amber-500/30">Route TBD</Badge>;
      case "rest":
        return <Badge variant="default" className="bg-blue-500/20 text-blue-400 border-blue-500/30">Rest Day</Badge>;
      case "travel":
        return <Badge variant="default" className="bg-purple-500/20 text-purple-400 border-purple-500/30">Travel</Badge>;
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? "ring-2 ring-primary shadow-lg" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${
              route.isTravelDay ? "bg-purple-500/10 text-purple-500" : "bg-primary/10 text-primary"
            }`}>
              {route.isTravelDay ? (
                <Car className="h-5 w-5" />
              ) : (
                <>
                  <span className="text-xs font-medium">Day</span>
                  <span className="text-lg font-bold">{route.day}</span>
                </>
              )}
            </div>
            <div>
              <CardTitle className="text-base">{route.title}</CardTitle>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" />
                {new Date(route.date).toLocaleDateString("en-US", { 
                  weekday: "short", 
                  month: "short", 
                  day: "numeric" 
                })}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {route.gpxUrl ? (
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-sm">
            <div className="flex flex-col items-center p-1.5 sm:p-2 rounded-lg bg-muted/50">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mb-0.5 sm:mb-1" />
              <span className="font-medium text-xs sm:text-sm">{route.distance?.toFixed(1)}km</span>
            </div>
            <div className="flex flex-col items-center p-1.5 sm:p-2 rounded-lg bg-muted/50">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mb-0.5 sm:mb-1" />
              <span className="font-medium text-xs sm:text-sm">+{route.ascent}m</span>
            </div>
            <div className="flex flex-col items-center p-1.5 sm:p-2 rounded-lg bg-muted/50">
              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mb-0.5 sm:mb-1" />
              <span className="font-medium text-xs sm:text-sm">-{route.descent}m</span>
            </div>
            <div className="flex flex-col items-center p-1.5 sm:p-2 rounded-lg bg-muted/50">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mb-0.5 sm:mb-1" />
              <span className="font-medium text-xs sm:text-sm">{route.duration}</span>
            </div>
          </div>
        ) : route.isTravelDay ? (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-500/10 text-purple-600">
            <Car className="h-4 w-4" />
            <span className="text-sm">{route.notes}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{route.notes}</span>
          </div>
        )}
        
        {route.refuge && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
            <Home className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Night at <span className="font-medium text-foreground">{route.refuge.name}</span>
              <span className="text-xs ml-1">({route.refuge.altitude}m)</span>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const Itinerary = () => {
  const [selectedDay, setSelectedDay] = useState<DayRoute>(TRIP_DAYS[0]);
  const [trackPoints, setTrackPoints] = useState<Array<{ lat: number; lon: number; ele: number }>>([]);

  // Reset trackPoints when day changes
  const handleDaySelect = (day: DayRoute) => {
    setTrackPoints([]);
    setSelectedDay(day);
  };
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const tripStartDate = new Date("2026-02-14T06:00:00");
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = tripStartDate.getTime() - now.getTime();

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const totalStats = TRIP_DAYS.filter(d => !d.isTravelDay).reduce(
    (acc, day) => ({
      distance: acc.distance + (day.distance || 0),
      ascent: acc.ascent + (day.ascent || 0),
      descent: acc.descent + (day.descent || 0),
    }),
    { distance: 0, ascent: 0, descent: 0 }
  );

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl pb-24 md:pb-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Trip Itinerary</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Silvretta Ski Traverse — February 14-20, 2026
        </p>
        
        {/* Countdown Timer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 rounded-lg bg-purple-500/20 shrink-0">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Countdown to departure</p>
                  <div className="flex gap-2 sm:gap-4 text-center">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-lg sm:text-2xl font-bold text-purple-500">{countdown.days}</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">d</span>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-lg sm:text-2xl font-bold text-purple-500">{countdown.hours.toString().padStart(2, '0')}</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">h</span>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-lg sm:text-2xl font-bold text-purple-500">{countdown.minutes.toString().padStart(2, '0')}</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">m</span>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-lg sm:text-2xl font-bold text-purple-500">{countdown.seconds.toString().padStart(2, '0')}</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">s</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Avalanche Risk Summary */}
          <AvalancheRisk region="AT-07" />
        </div>
        {/* Trip summary stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-2 sm:p-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/20">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-lg sm:text-2xl font-bold">{totalStats.distance.toFixed(1)}km</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Distance</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10">
            <CardContent className="p-2 sm:p-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/20">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-lg sm:text-2xl font-bold">+{totalStats.ascent.toLocaleString()}m</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Ascent</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500/5 to-red-500/10">
            <CardContent className="p-2 sm:p-4 flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-red-500/20">
                <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-lg sm:text-2xl font-bold">-{totalStats.descent.toLocaleString()}m</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Descent</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile: horizontal scrollable day selector */}
      <div className="lg:hidden mb-4">
        <h2 className="text-base font-semibold mb-3">Select Day</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 scrollbar-hide">
          {TRIP_DAYS.map((day) => (
            <button
              key={day.day}
              onClick={() => handleDaySelect(day)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                selectedDay.day === day.day 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-card border-border hover:bg-muted"
              }`}
            >
              {day.isTravelDay ? (
                <Car className="h-4 w-4" />
              ) : (
                <span className="font-bold">D{day.day}</span>
              )}
              <span className="text-sm whitespace-nowrap">
                {day.isTravelDay ? "Travel" : day.to.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Day selector sidebar - hidden on mobile */}
        <div className="hidden lg:block space-y-3">
          <h2 className="text-lg font-semibold mb-4">Daily Routes</h2>
          {TRIP_DAYS.map((day) => (
            <DayCard
              key={day.day}
              route={day}
              isSelected={selectedDay.day === day.day}
              onClick={() => handleDaySelect(day)}
            />
          ))}
        </div>

        {/* Selected day details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="text-lg sm:text-xl leading-tight">
                    {selectedDay.isTravelDay ? selectedDay.title : `Day ${selectedDay.day}: ${selectedDay.title}`}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(selectedDay.date).toLocaleDateString("en-US", { 
                      weekday: "long", 
                      year: "numeric",
                      month: "long", 
                      day: "numeric" 
                    })}
                  </p>
                </div>
                {selectedDay.isTravelDay ? (
                  <Car className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 shrink-0" />
                ) : (
                  <Mountain className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedDay.isTravelDay ? (
                <TravelRoute 
                  origin={{ lat: 50.9366, lon: 4.0417, name: "Aalst, Belgium" }}
                  destination={{ lat: 46.9691, lon: 10.1869, name: "Galtür, Austria" }}
                />
              ) : selectedDay.gpxUrl ? (
                <Tabs defaultValue="map" key={selectedDay.day} className="w-full">
                  <TabsList className="mb-4 w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
                    <TabsTrigger value="map" className="text-xs sm:text-sm">Map</TabsTrigger>
                    <TabsTrigger value="elevation" className="text-xs sm:text-sm">Elevation</TabsTrigger>
                    <TabsTrigger value="snowpack" className="text-xs sm:text-sm">Snow</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="map">
                    <TourAnalysis 
                      gpxUrl={selectedDay.gpxUrl} 
                      onTrackPointsLoaded={setTrackPoints}
                      disableAnimation
                    />
                  </TabsContent>
                  
                  <TabsContent value="elevation">
                    {trackPoints.length > 0 && selectedDay.refuge && (
                      <ElevationProfile 
                        trackPoints={trackPoints} 
                        refuges={[{
                          ...selectedDay.refuge,
                          distanceAlongRoute: selectedDay.distance || 0
                        }]}
                      />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="snowpack">
                    {trackPoints.length > 0 ? (
                      <SnowpackChart trackPoints={trackPoints} />
                    ) : (
                      <Card>
                        <CardContent className="flex items-center justify-center py-12">
                          <p className="text-muted-foreground">Loading track data...</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 sm:py-16 text-center px-4">
                  <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-amber-500 mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Route To Be Determined</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {selectedDay.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedDay.notes && selectedDay.gpxUrl && (
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Note:</span> {selectedDay.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
