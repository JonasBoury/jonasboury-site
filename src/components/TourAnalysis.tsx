import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Mountain, TrendingUp, Ruler, Clock, CloudRain, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrackPoint {
  lat: number;
  lon: number;
  ele: number;
}

interface TourMetrics {
  totalDistance: number;
  elevationGain: number;
  elevationLoss: number;
  minElevation: number;
  maxElevation: number;
  estimatedTime: number;
}

interface Refuge {
  name: string;
  coordinates: [number, number]; // [lon, lat]
  altitude: number;
}

// Silvretta Traverse refuges (Austria trip)
const refuges: Refuge[] = [
  { name: "Heidelberger Hütte", coordinates: [10.2594, 46.9097], altitude: 2264 },
  { name: "Jamtalhütte", coordinates: [10.1764, 46.8865], altitude: 2165 },
  { name: "Wiesbadener Hütte", coordinates: [10.1163, 46.8681], altitude: 2443 },
  { name: "Silvrettahütte", coordinates: [10.0416, 46.8545], altitude: 2341 },
  { name: "Bieler Höhe", coordinates: [10.0995, 46.9174], altitude: 2036 },
];

interface TourAnalysisProps {
  gpxUrl: string;
  onTrackPointsLoaded?: (points: TrackPoint[]) => void;
  disableAnimation?: boolean;
}

// Slope risk thresholds (in degrees)
const SLOPE_THRESHOLDS = {
  safe: 25,        // < 25° - generally safe
  caution: 30,     // 25-30° - caution advised
  dangerous: 35,   // 30-35° - prime avalanche terrain
  extreme: 45,     // > 45° - very steep
};

const getSlopeCategory = (slope: number): string => {
  if (slope < SLOPE_THRESHOLDS.safe) return "safe";
  if (slope < SLOPE_THRESHOLDS.caution) return "caution";
  if (slope < SLOPE_THRESHOLDS.extreme) return "dangerous";
  return "extreme";
};

const calculateSlopeSegments = (points: TrackPoint[]): GeoJSON.Feature[] => {
  const features: GeoJSON.Feature[] = [];
  
  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const point = points[i];
    
    // Calculate horizontal distance using Haversine
    const lat1 = prevPoint.lat * Math.PI / 180;
    const lat2 = point.lat * Math.PI / 180;
    const deltaLat = (point.lat - prevPoint.lat) * Math.PI / 180;
    const deltaLon = (point.lon - prevPoint.lon) * Math.PI / 180;
    
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const horizontalDistance = 6371 * 1000 * c; // meters
    
    // Calculate slope in degrees
    const elevationChange = point.ele - prevPoint.ele;
    let slope = 0;
    if (horizontalDistance > 0) {
      slope = Math.abs(Math.atan(elevationChange / horizontalDistance) * (180 / Math.PI));
    }
    
    const category = getSlopeCategory(slope);
    
    features.push({
      type: "Feature",
      properties: {
        slope,
        slopeCategory: category,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [prevPoint.lon, prevPoint.lat],
          [point.lon, point.lat],
        ],
      },
    });
  }
  
  return features;
};

export const TourAnalysis = ({ gpxUrl, onTrackPointsLoaded, disableAnimation = false }: TourAnalysisProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([]);
  const [metrics, setMetrics] = useState<TourMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapView, setMapView] = useState<'route' | 'precipitation' | 'temperature' | 'cloudCover'>('route');
  const [mapStyle, setMapStyle] = useState<'gray' | 'satellite'>('satellite');
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const { toast } = useToast();

  // When gpxUrl changes, clean up the old map and re-parse
  useEffect(() => {
    // Destroy existing map when gpxUrl changes
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    setTrackPoints([]);
    setMetrics(null);
    setLoading(true);
    parseGPX();
  }, [gpxUrl]);

  useEffect(() => {
    if (trackPoints.length > 0 && mapContainer.current && !map.current) {
      initializeMap();
    }
  }, [trackPoints]);

  const parseGPX = async () => {
    try {
      const response = await fetch(gpxUrl);
      const gpxText = await response.text();
      const parser = new DOMParser();
      const gpxDoc = parser.parseFromString(gpxText, "text/xml");
      
      const trkpts = gpxDoc.querySelectorAll("trkpt");
      const points: TrackPoint[] = [];
      
      trkpts.forEach((trkpt) => {
        const lat = parseFloat(trkpt.getAttribute("lat") || "0");
        const lon = parseFloat(trkpt.getAttribute("lon") || "0");
        const eleNode = trkpt.querySelector("ele");
        const ele = eleNode ? parseFloat(eleNode.textContent || "0") : 0;
        
        points.push({ lat, lon, ele });
      });
      
      setTrackPoints(points);
      calculateMetrics(points);
      setLoading(false);
      
      // Notify parent component
      if (onTrackPointsLoaded) {
        onTrackPointsLoaded(points);
      }
    } catch (error) {
      console.error("Error parsing GPX:", error);
      setLoading(false);
    }
  };

  const calculateMetrics = (points: TrackPoint[]) => {
    if (points.length < 2) return;

    let totalDistance = 0;
    let elevationGain = 0;
    let elevationLoss = 0;
    let minElevation = points[0].ele;
    let maxElevation = points[0].ele;

    for (let i = 1; i < points.length; i++) {
      // Calculate distance using Haversine formula
      const lat1 = points[i - 1].lat * Math.PI / 180;
      const lat2 = points[i].lat * Math.PI / 180;
      const deltaLat = (points[i].lat - points[i - 1].lat) * Math.PI / 180;
      const deltaLon = (points[i].lon - points[i - 1].lon) * Math.PI / 180;

      const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = 6371 * c; // Earth's radius in km

      totalDistance += distance;

      // Calculate elevation changes
      const elevDiff = points[i].ele - points[i - 1].ele;
      if (elevDiff > 0) {
        elevationGain += elevDiff;
      } else {
        elevationLoss += Math.abs(elevDiff);
      }

      minElevation = Math.min(minElevation, points[i].ele);
      maxElevation = Math.max(maxElevation, points[i].ele);
    }

    // Estimate time: 4 km/h horizontal + 300m elevation/hour
    const estimatedTime = (totalDistance / 4) + (elevationGain / 300);

    setMetrics({
      totalDistance,
      elevationGain,
      elevationLoss,
      minElevation,
      maxElevation,
      estimatedTime,
    });
  };

  const initializeMap = async () => {
    if (!mapContainer.current) return;

    // Get Mapbox public token from edge function (works without auth)
    const { data, error } = await supabase.functions.invoke("mapbox-public-config");

    if (error) {
      console.error("Error fetching Mapbox public token:", error);
      return;
    }

    const mapboxToken = (data as any)?.publicToken as string | undefined;
    if (!mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    const bounds = new mapboxgl.LngLatBounds();
    trackPoints.forEach((point) => {
      bounds.extend([point.lon, point.lat]);
    });
    // Also include all refuge locations in bounds
    refuges.forEach((refuge) => {
      bounds.extend(refuge.coordinates);
    });

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle === 'satellite' ? "mapbox://styles/mapbox/satellite-streets-v12" : "mapbox://styles/mapbox/light-v11",
      pitch: disableAnimation ? 0 : (mapStyle === 'satellite' ? 70 : 0),
      bearing: disableAnimation ? 0 : (mapStyle === 'satellite' ? -20 : 0),
    });

    map.current.fitBounds(bounds, { padding: 50, duration: disableAnimation ? 0 : 1000 });

    map.current.on("load", () => {
      if (!map.current) return;

      if (mapStyle === 'satellite') {
        // Add terrain only for satellite view
        map.current.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });

        map.current.setTerrain({ source: "mapbox-dem", exaggeration: 2 });

        // Add sky with better lighting
        map.current.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 0.0],
            "sky-atmosphere-sun-intensity": 5,
          },
        });

        // Add 3D buildings for scale reference
        const layers = map.current.getStyle().layers;
        const labelLayerId = layers?.find(
          (layer) => layer.type === 'symbol' && (layer as any).layout?.['text-field']
        )?.id;

        map.current.addLayer(
          {
            id: "3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 15,
            paint: {
              "fill-extrusion-color": "#aaa",
              "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                15.05,
                ["get", "height"]
              ],
              "fill-extrusion-base": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                15.05,
                ["get", "min_height"]
              ],
              "fill-extrusion-opacity": 0.6,
            },
          },
          labelLayerId
        );
      }

      // Calculate slope for each segment and create colored route
      const slopeSegments = calculateSlopeSegments(trackPoints);
      
      // Add route segments colored by slope grade
      map.current.addSource("route-segments", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: slopeSegments,
        },
      });

      // Add layer for each slope category (bottom to top)
      map.current.addLayer({
        id: "route-safe",
        type: "line",
        source: "route-segments",
        filter: ["==", ["get", "slopeCategory"], "safe"],
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#22c55e", "line-width": 5, "line-opacity": 0.9 },
      });

      map.current.addLayer({
        id: "route-caution",
        type: "line",
        source: "route-segments",
        filter: ["==", ["get", "slopeCategory"], "caution"],
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#eab308", "line-width": 5, "line-opacity": 0.9 },
      });

      map.current.addLayer({
        id: "route-dangerous",
        type: "line",
        source: "route-segments",
        filter: ["==", ["get", "slopeCategory"], "dangerous"],
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#ef4444", "line-width": 5, "line-opacity": 0.9 },
      });

      map.current.addLayer({
        id: "route-extreme",
        type: "line",
        source: "route-segments",
        filter: ["==", ["get", "slopeCategory"], "extreme"],
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#a855f7", "line-width": 5, "line-opacity": 0.9 },
      });

      // Add start marker
      new mapboxgl.Marker({ color: "#22c55e" })
        .setLngLat([trackPoints[0].lon, trackPoints[0].lat])
        .setPopup(new mapboxgl.Popup().setText("Start"))
        .addTo(map.current);

      // Add end marker
      new mapboxgl.Marker({ color: "#ef4444" })
        .setLngLat([trackPoints[trackPoints.length - 1].lon, trackPoints[trackPoints.length - 1].lat])
        .setPopup(new mapboxgl.Popup().setText("Finish"))
        .addTo(map.current);

      // Add refuge markers
      refuges.forEach((refuge) => {
        const el = document.createElement("div");
        el.className = "refuge-marker";
        el.style.backgroundColor = "#8B4513";
        el.style.width = "20px";
        el.style.height = "20px";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid white";
        el.style.cursor = "pointer";
        
        new mapboxgl.Marker({ element: el })
          .setLngLat(refuge.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<strong>${refuge.name}</strong><br/>${refuge.altitude}m`)
          )
          .addTo(map.current!);
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    });
  };

  const toggleMapStyle = () => {
    if (!map.current) return;
    
    const newStyle = mapStyle === 'satellite' ? 'gray' : 'satellite';
    setMapStyle(newStyle);
    
    // Store current map state
    const center = map.current.getCenter();
    const zoom = map.current.getZoom();
    
    // Change style
    map.current.setStyle(
      newStyle === 'satellite' 
        ? "mapbox://styles/mapbox/satellite-streets-v12" 
        : "mapbox://styles/mapbox/light-v11"
    );
    
    // Wait for style to load, then restore layers
    map.current.once('style.load', () => {
      if (!map.current) return;
      
      // Restore pitch and bearing
      map.current.setPitch(newStyle === 'satellite' ? 70 : 0);
      map.current.setBearing(newStyle === 'satellite' ? -20 : 0);
      
      // Add terrain and 3D effects for satellite
      if (newStyle === 'satellite') {
        map.current.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
        map.current.setTerrain({ source: "mapbox-dem", exaggeration: 2 });
        
        map.current.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 0.0],
            "sky-atmosphere-sun-intensity": 5,
          },
        });
      }
      
      // Re-add slope-colored route segments
      const slopeSegments = calculateSlopeSegments(trackPoints);
      
      map.current.addSource("route-segments", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: slopeSegments,
        },
      });

      map.current.addLayer({
        id: "route-safe",
        type: "line",
        source: "route-segments",
        filter: ["==", ["get", "slopeCategory"], "safe"],
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#22c55e", "line-width": 5, "line-opacity": 0.9 },
      });

      map.current.addLayer({
        id: "route-caution",
        type: "line",
        source: "route-segments",
        filter: ["==", ["get", "slopeCategory"], "caution"],
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#eab308", "line-width": 5, "line-opacity": 0.9 },
      });

      map.current.addLayer({
        id: "route-dangerous",
        type: "line",
        source: "route-segments",
        filter: ["==", ["get", "slopeCategory"], "dangerous"],
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#ef4444", "line-width": 5, "line-opacity": 0.9 },
      });

      map.current.addLayer({
        id: "route-extreme",
        type: "line",
        source: "route-segments",
        filter: ["==", ["get", "slopeCategory"], "extreme"],
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#a855f7", "line-width": 5, "line-opacity": 0.9 },
      });

      // Re-add markers
      new mapboxgl.Marker({ color: "#22c55e" })
        .setLngLat([trackPoints[0].lon, trackPoints[0].lat])
        .setPopup(new mapboxgl.Popup().setText("Start"))
        .addTo(map.current);

      new mapboxgl.Marker({ color: "#ef4444" })
        .setLngLat([trackPoints[trackPoints.length - 1].lon, trackPoints[trackPoints.length - 1].lat])
        .setPopup(new mapboxgl.Popup().setText("Finish"))
        .addTo(map.current);

      refuges.forEach((refuge) => {
        const el = document.createElement("div");
        el.className = "refuge-marker";
        el.style.backgroundColor = "#8B4513";
        el.style.width = "20px";
        el.style.height = "20px";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid white";
        el.style.cursor = "pointer";
        
        new mapboxgl.Marker({ element: el })
          .setLngLat(refuge.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<strong>${refuge.name}</strong><br/>${refuge.altitude}m`)
          )
          .addTo(map.current!);
      });
      
      // Re-add weather layer if active
      if (mapView !== 'route' && weatherData) {
        addWeatherLayer(mapView as any, weatherData);
      }
    });
  };

  const toggleWeatherLayer = async (viewType: 'route' | 'precipitation' | 'temperature' | 'cloudCover') => {
    if (!map.current || viewType === mapView) return;
    
    setMapView(viewType);
    
    // Remove existing weather layers
    const weatherLayers = ['precipitation-heatmap', 'temperature-heatmap', 'cloudcover-heatmap'];
    weatherLayers.forEach(layerId => {
      if (map.current?.getLayer(layerId)) {
        map.current.removeLayer(layerId);
      }
    });
    if (map.current?.getSource('weather-data')) {
      map.current.removeSource('weather-data');
    }
    
    if (viewType === 'route') {
      return; // Just show the route, no weather layers
    }
    
    // Fetch weather data if not already loaded
    if (!weatherData) {
      setWeatherLoading(true);
      
      try {
        const centerLat = trackPoints.reduce((sum, p) => sum + p.lat, 0) / trackPoints.length;
        const centerLon = trackPoints.reduce((sum, p) => sum + p.lon, 0) / trackPoints.length;
        
        console.log('Fetching weather data for:', { centerLat, centerLon });
        
        const { data, error } = await supabase.functions.invoke('tomorrow-io-forecast', {
          body: { 
            latitude: centerLat, 
            longitude: centerLon,
            location: 'Route Area'
          }
        });

        if (error) {
          console.error('Weather fetch error:', error);
          throw error;
        }
        
        console.log('Weather data received:', data);
        setWeatherData(data);
        
        // Now add the layer with the fetched data
        addWeatherLayer(viewType, data);

      } catch (error: any) {
        console.error('Error loading weather data:', error);
        toast({
          title: "Weather Data Error",
          description: error.message || "Failed to load weather data",
          variant: "destructive",
        });
        setMapView('route');
      } finally {
        setWeatherLoading(false);
      }
    } else {
      // Use cached weather data
      addWeatherLayer(viewType, weatherData);
    }
  };

  const addWeatherLayer = (viewType: 'precipitation' | 'temperature' | 'cloudCover', data: any) => {
    if (!map.current || !data) return;

    try {
      // Extract today's forecast values
      const todayForecast = data?.timelines?.daily?.[0]?.values;
      
      if (!todayForecast) {
        console.error('No forecast data found in response:', data);
        toast({
          title: "No Weather Data",
          description: "Unable to find forecast data in response",
          variant: "destructive",
        });
        return;
      }

      console.log('Today forecast values:', todayForecast);

      let intensity = 0;
      let layerId = '';
      let colorStops: any[] = [];
      let maxValue = 1;
      let minValue = 0;
      let normalizedIntensity = 0;

      switch (viewType) {
        case 'precipitation':
          intensity = todayForecast.rainIntensityAvg || todayForecast.snowIntensityAvg || 0;
          layerId = 'precipitation-heatmap';
          minValue = 0;
          maxValue = 5;
          normalizedIntensity = intensity;
          colorStops = [
            0, 'rgba(0, 0, 255, 0)',
            0.2, 'rgba(0, 150, 255, 0.5)',
            0.4, 'rgba(0, 255, 255, 0.6)',
            0.6, 'rgba(0, 255, 0, 0.7)',
            0.8, 'rgba(255, 255, 0, 0.8)',
            1, 'rgba(255, 0, 0, 0.9)'
          ];
          break;
        case 'temperature':
          intensity = todayForecast.temperatureAvg || 0;
          layerId = 'temperature-heatmap';
          minValue = -20;
          maxValue = 20;
          // Normalize temperature to 0-40 range (shift by 20)
          normalizedIntensity = intensity + 20;
          colorStops = [
            0, 'rgba(75, 0, 130, 0.8)',      // Deep purple for very cold
            0.2, 'rgba(0, 0, 255, 0.7)',     // Blue for cold
            0.4, 'rgba(0, 150, 255, 0.7)',   // Light blue
            0.5, 'rgba(0, 255, 255, 0.7)',   // Cyan for around 0°C
            0.6, 'rgba(0, 255, 0, 0.7)',     // Green for mild
            0.7, 'rgba(255, 255, 0, 0.8)',   // Yellow for warm
            0.8, 'rgba(255, 150, 0, 0.8)',   // Orange
            1, 'rgba(255, 0, 0, 0.9)'        // Red for hot
          ];
          break;
        case 'cloudCover':
          intensity = todayForecast.cloudCoverAvg || 0;
          layerId = 'cloudcover-heatmap';
          minValue = 0;
          maxValue = 100;
          normalizedIntensity = intensity;
          colorStops = [
            0, 'rgba(255, 255, 255, 0)',
            0.2, 'rgba(200, 200, 255, 0.3)',
            0.4, 'rgba(150, 150, 200, 0.5)',
            0.6, 'rgba(100, 100, 150, 0.7)',
            0.8, 'rgba(50, 50, 100, 0.8)',
            1, 'rgba(20, 20, 50, 0.9)'
          ];
          break;
      }

      console.log(`Adding ${viewType} layer with intensity:`, intensity, 'normalized:', normalizedIntensity);

      // Get map bounds for sampling points
      const bounds = map.current.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      // Base normalized intensity (0-1) from the forecast value
      const baseNormalizedIntensity = Math.max(
        0,
        Math.min(1, (normalizedIntensity - 0) / (maxValue - minValue || 1))
      );

      // Helper to compute distance from a point to the closest point on the route (in km)
      const distanceToRouteKm = (lat: number, lon: number) => {
        if (!trackPoints || trackPoints.length === 0) return 0;

        let minDist = Infinity;
        const toRad = (deg: number) => (deg * Math.PI) / 180;

        for (const p of trackPoints) {
          const lat1 = toRad(lat);
          const lat2 = toRad(p.lat);
          const dLat = toRad(p.lat - lat);
          const dLon = toRad(p.lon - lon);

          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const dist = 6371 * c; // Earth radius in km

          if (dist < minDist) minDist = dist;
        }

        return minDist;
      };

      // Create a random scatter of points across the map
      const pointCount = 800; // Higher = smoother overlay
      const weatherPoints = [];

      for (let i = 0; i < pointCount; i++) {
        const latValue = sw.lat + (ne.lat - sw.lat) * Math.random();
        const lngValue = sw.lng + (ne.lng - sw.lng) * Math.random();

        // Fade intensity with distance from the route so the overlay hugs the track
        const distanceKm = distanceToRouteKm(latValue, lngValue);
        const sigma = 5; // Controls how quickly intensity falls off with distance
        const falloff = Math.exp(-(distanceKm * distanceKm) / (2 * sigma * sigma));

        weatherPoints.push({
          type: 'Feature' as const,
          properties: {
            intensity:
              baseNormalizedIntensity * falloff * (0.9 + Math.random() * 0.2),
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [lngValue, latValue],
          },
        });
      }

      map.current.addSource('weather-data', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: weatherPoints,
        },
      });

      map.current.addLayer({
        id: layerId,
        type: 'heatmap',
        source: 'weather-data',
        paint: {
          'heatmap-weight': ['get', 'intensity'],
          'heatmap-intensity': 1.5,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            ...colorStops
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 100,  // Large radius at low zoom
            10, 150, // Even larger at medium zoom
            15, 200  // Maximum radius at high zoom
          ],
          'heatmap-opacity': 0.7,
        },
      }, 'route');

      const labels: Record<string, string> = {
        precipitation: `Rain: ${intensity.toFixed(2)} mm/h`,
        temperature: `Temperature: ${intensity.toFixed(1)}°C`,
        cloudCover: `Cloud Cover: ${intensity.toFixed(0)}%`
      };

      toast({
        title: "Weather Layer Added",
        description: labels[viewType],
      });

    } catch (error: any) {
      console.error('Error adding weather layer:', error);
      toast({
        title: "Visualization Error",
        description: "Failed to add weather layer to map",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 3D Map */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2">
              <Mountain className="h-5 w-5" />
              Route Overview
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-2 border-r pr-2">
                <Button
                  variant={mapStyle === 'gray' ? 'default' : 'outline'}
                  size="sm"
                  onClick={toggleMapStyle}
                  className="rounded-full"
                >
                  Gray
                </Button>
                <Button
                  variant={mapStyle === 'satellite' ? 'default' : 'outline'}
                  size="sm"
                  onClick={toggleMapStyle}
                  className="rounded-full"
                >
                  3D Satellite
                </Button>
              </div>
              <Button
                variant={mapView === 'route' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleWeatherLayer('route')}
                disabled={weatherLoading}
                className="rounded-full"
              >
                <Navigation className="h-4 w-4 mr-1" />
                Route
              </Button>
              <Button
                variant={mapView === 'precipitation' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleWeatherLayer('precipitation')}
                disabled={weatherLoading}
                className="rounded-full"
              >
                <CloudRain className="h-4 w-4 mr-1" />
                Rain
              </Button>
              <Button
                variant={mapView === 'temperature' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleWeatherLayer('temperature')}
                disabled={weatherLoading}
                className="rounded-full"
              >
                <Mountain className="h-4 w-4 mr-1" />
                Temp
              </Button>
              <Button
                variant={mapView === 'cloudCover' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleWeatherLayer('cloudCover')}
                disabled={weatherLoading}
                className="rounded-full"
              >
                <CloudRain className="h-4 w-4 mr-1" />
                Clouds
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div 
              ref={mapContainer} 
              className="w-full h-[500px] rounded-lg overflow-hidden"
            />
            
            {/* Weather Legend */}
            {mapView !== 'route' && (
              <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border">
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {mapView === 'precipitation' && 'PRECIPITATION'}
                      {mapView === 'temperature' && 'TEMPERATURE'}
                      {mapView === 'cloudCover' && 'CLOUD COVER'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {mapView === 'precipitation' && 'mm/h'}
                      {mapView === 'temperature' && '°C'}
                      {mapView === 'cloudCover' && '%'}
                    </span>
                  </div>
                  
                  {/* Gradient Bar */}
                  <div className="relative h-3 rounded overflow-hidden"
                    style={{
                      background: mapView === 'precipitation' 
                        ? 'linear-gradient(to right, rgb(0, 0, 255), rgb(0, 150, 255), rgb(0, 255, 255), rgb(0, 255, 0), rgb(255, 255, 0), rgb(255, 0, 0))'
                        : mapView === 'temperature'
                        ? 'linear-gradient(to right, rgb(0, 0, 255), rgb(100, 0, 255), rgb(0, 100, 255), rgb(255, 255, 0), rgb(255, 100, 0), rgb(255, 0, 0))'
                        : 'linear-gradient(to right, rgb(255, 255, 255), rgb(200, 200, 255), rgb(150, 150, 200), rgb(100, 100, 150), rgb(50, 50, 100), rgb(20, 20, 50))'
                    }}
                  />
                  
                  {/* Value Labels */}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {mapView === 'precipitation' && (
                      <>
                        <span>0</span>
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                      </>
                    )}
                    {mapView === 'temperature' && (
                      <>
                        <span>-20</span>
                        <span>-10</span>
                        <span>0</span>
                        <span>10</span>
                        <span>20</span>
                      </>
                    )}
                    {mapView === 'cloudCover' && (
                      <>
                        <span>0</span>
                        <span>20</span>
                        <span>40</span>
                        <span>60</span>
                        <span>80</span>
                        <span>100</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            {mapView === 'route' && '🟢 Start • 🔴 Finish • 🟤 Refuges • Interactive 3D terrain view'}
            {mapView === 'precipitation' && 'Weather overlay showing precipitation intensity across the region'}
            {mapView === 'temperature' && 'Weather overlay showing temperature distribution across the region'}
            {mapView === 'cloudCover' && 'Weather overlay showing cloud cover across the region'}
          </p>
        </CardContent>
      </Card>

      {/* Tour Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Ruler className="h-4 w-4 text-primary" />
                Distance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalDistance.toFixed(1)} km</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Elevation Gain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{Math.round(metrics.elevationGain)} m</div>
              <p className="text-xs text-muted-foreground mt-1">
                -{Math.round(metrics.elevationLoss)} m descent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Est. Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(metrics.estimatedTime)}h {Math.round((metrics.estimatedTime % 1) * 60)}m
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Mountain className="h-4 w-4 text-primary" />
                Elevation Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(metrics.minElevation)} - {Math.round(metrics.maxElevation)} m
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
