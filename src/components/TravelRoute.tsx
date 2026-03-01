import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Car, Clock, Ruler, Navigation } from "lucide-react";

interface TravelRouteProps {
  origin: { lat: number; lon: number; name: string };
  destination: { lat: number; lon: number; name: string };
}

interface RouteData {
  distance: number; // in meters
  duration: number; // in seconds
  geometry: {
    coordinates: [number, number][];
  };
}

export const TravelRoute = ({ origin, destination }: TravelRouteProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoute();
  }, [origin, destination]);

  useEffect(() => {
    if (routeData && mapContainer.current && !map.current) {
      initializeMap();
    }
  }, [routeData]);

  // Clean up map instance on unmount
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const fetchRoute = async () => {
    try {
      const originCoords = `${origin.lon},${origin.lat}`;
      const destCoords = `${destination.lon},${destination.lat}`;

      const { data, error } = await supabase.functions.invoke("mapbox-directions", {
        body: {
          origin: originCoords,
          destination: destCoords,
        },
      });

      if (error) throw error;

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        setRouteData({
          distance: route.distance,
          duration: route.duration,
          geometry: route.geometry,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching route:", error);
      setLoading(false);
    }
  };

  const initializeMap = async () => {
    if (!mapContainer.current || !routeData) return;

    // Get Mapbox public token from edge function
    const { data, error } = await supabase.functions.invoke("mapbox-public-config");

    if (error) {
      console.error("Error fetching Mapbox public token:", error);
      return;
    }

    const mapboxToken = (data as any)?.publicToken as string | undefined;
    if (!mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    // Calculate bounds
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([origin.lon, origin.lat]);
    bounds.extend([destination.lon, destination.lat]);
    routeData.geometry.coordinates.forEach((coord) => {
      bounds.extend(coord);
    });

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
    });

    // Add navigation controls immediately after creating the map (only once)
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      if (!map.current || !routeData) return;

      // Fit bounds after map has loaded with responsive padding
      const isMobile = window.innerWidth < 768;
      const padding = isMobile ? { top: 40, bottom: 40, left: 20, right: 20 } : 80;
      
      const boundsToFit = new mapboxgl.LngLatBounds();
      boundsToFit.extend([origin.lon, origin.lat]);
      boundsToFit.extend([destination.lon, destination.lat]);
      routeData.geometry.coordinates.forEach((coord) => {
        boundsToFit.extend(coord);
      });
      
      map.current.fitBounds(boundsToFit, { 
        padding,
        maxZoom: 15,
        duration: 0 // Instant fit on initial load
      });
      // Check if source already exists, remove it first
      if (map.current.getSource("route")) {
        if (map.current.getLayer("route")) {
          map.current.removeLayer("route");
        }
        map.current.removeSource("route");
      }

      // Add route line
      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: routeData.geometry.coordinates,
          },
        },
      });

      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#4F46E5",
          "line-width": 5,
          "line-opacity": 0.8,
        },
      });

      // Add start marker
      new mapboxgl.Marker({ color: "#22c55e" })
        .setLngLat([origin.lon, origin.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>Start</strong><br>${origin.name}`))
        .addTo(map.current);

      // Add end marker
      new mapboxgl.Marker({ color: "#ef4444" })
        .setLngLat([destination.lon, destination.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>Destination</strong><br>${destination.name}`))
        .addTo(map.current);
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDistance = (meters: number) => {
    const km = meters / 1000;
    return `${km.toFixed(0)} km`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!routeData) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Unable to calculate route. Please try again.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Driving Route
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={mapContainer} 
            className="w-full h-[400px] rounded-lg overflow-hidden"
          />
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>🟢 {origin.name}</span>
            <Navigation className="h-4 w-4" />
            <span>🔴 {destination.name}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Ruler className="h-4 w-4 text-primary" />
              Total Distance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDistance(routeData.distance)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Estimated Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(routeData.duration)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Without stops or traffic
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
