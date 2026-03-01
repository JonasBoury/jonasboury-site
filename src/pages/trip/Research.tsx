import { useState } from "react";
import { TourAnalysis } from "@/components/TourAnalysis";
import { RefugesList } from "@/components/RefugesList";
import { ElevationProfile } from "@/components/ElevationProfile";
import { SnowpackChart } from "@/components/SnowpackChart";
import { SnowForecastChart } from "@/components/SnowForecastChart";
import { CurrentWeather } from "@/components/CurrentWeather";
import { WeatherForecast } from "@/components/WeatherForecast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Refuge {
  name: string;
  coordinates: [number, number];
  altitude: number;
}

interface RouteOption {
  id: string;
  name: string;
  description: string;
  gpxUrl: string;
  weatherCoords: { lat: number; lon: number };
  refuges: Refuge[];
}

// Archived routes (Option 1: Rondje Vanoise removed - decided on Austria trip)
const ROUTE_OPTIONS: RouteOption[] = [
  {
    id: "silvretta",
    name: "Silvretta Traverse",
    description: "Classic ski touring traverse through the Silvretta Alps",
    gpxUrl: "/gpx/silvretta-skidurchquerung.gpx",
    weatherCoords: { lat: 46.886389, lon: 10.176389 },
    refuges: [
      { name: "Jamtalhütte", coordinates: [10.176389, 46.886389], altitude: 2165 },
      { name: "Wiesbadener Hütte", coordinates: [10.11625, 46.86825], altitude: 2443 },
      { name: "Bieler Höhe", coordinates: [10.097204, 46.918214], altitude: 2036 },
    ],
  },
];

const calculateRefugeDistance = (
  refugeCoords: [number, number],
  points: Array<{ lat: number; lon: number; ele: number }>
) => {
  let minDistance = Infinity;
  let totalDistance = 0;
  let refugeDistance = 0;

  for (let i = 0; i < points.length; i++) {
    if (i > 0) {
      const prevPoint = points[i - 1];
      const lat1 = (prevPoint.lat * Math.PI) / 180;
      const lat2 = (points[i].lat * Math.PI) / 180;
      const deltaLat = ((points[i].lat - prevPoint.lat) * Math.PI) / 180;
      const deltaLon = ((points[i].lon - prevPoint.lon) * Math.PI) / 180;
      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(deltaLon / 2) *
          Math.sin(deltaLon / 2);
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

interface RouteContentProps {
  routeOption: RouteOption;
  trackPoints: Array<{ lat: number; lon: number; ele: number }>;
  setTrackPoints: (points: Array<{ lat: number; lon: number; ele: number }>) => void;
}

const RouteContent = ({ routeOption, trackPoints, setTrackPoints }: RouteContentProps) => {
  return (
    <Tabs defaultValue="route" className="w-full">
      <TabsList className="flex gap-2 bg-transparent h-auto p-0 max-w-md mx-auto mb-8">
        <TabsTrigger
          value="route"
          className="rounded-full px-6 py-2 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-muted/80 data-[state=inactive]:hover:bg-muted transition-all duration-200"
        >
          Route
        </TabsTrigger>
        <TabsTrigger
          value="conditions"
          className="rounded-full px-6 py-2 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-muted/80 data-[state=inactive]:hover:bg-muted transition-all duration-200"
        >
          Conditions
        </TabsTrigger>
      </TabsList>

      <TabsContent value="route" className="space-y-8">
        <TourAnalysis gpxUrl={routeOption.gpxUrl} onTrackPointsLoaded={setTrackPoints} />
        {trackPoints.length > 0 && (
          <>
            <ElevationProfile
              trackPoints={trackPoints}
              refuges={routeOption.refuges.map((refuge) => ({
                ...refuge,
                distanceAlongRoute: calculateRefugeDistance(refuge.coordinates, trackPoints),
              }))}
            />
            <RefugesList trackPoints={trackPoints} />
          </>
        )}
      </TabsContent>

      <TabsContent value="conditions" className="space-y-8">
        <CurrentWeather lat={routeOption.weatherCoords.lat} lon={routeOption.weatherCoords.lon} />
        <WeatherForecast
          latitude={routeOption.weatherCoords.lat}
          longitude={routeOption.weatherCoords.lon}
          location="Silvretta Region"
        />
        {trackPoints.length > 0 && (
          <>
            <SnowpackChart trackPoints={trackPoints} />
            <SnowForecastChart trackPoints={trackPoints} />
          </>
        )}
      </TabsContent>
    </Tabs>
  );
};

export const Research = () => {
  const [trackPoints, setTrackPoints] = useState<Array<{ lat: number; lon: number; ele: number }>>([]);
  const routeOption = ROUTE_OPTIONS[0]; // Single route now

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Trip Research & Analysis</h1>
      <p className="text-muted-foreground mb-8">{routeOption.name} — {routeOption.description}</p>

      <RouteContent
        routeOption={routeOption}
        trackPoints={trackPoints}
        setTrackPoints={setTrackPoints}
      />
    </div>
  );
};
