import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  style?: string;
  className?: string;
  enableGlobe?: boolean;
  markers?: Array<{
    coordinates: [number, number];
    title?: string;
    description?: string;
  }>;
}

const Map: React.FC<MapProps> = ({
  center = [0, 0],
  zoom = 2,
  style = 'mapbox://styles/mapbox/light-v11',
  className = 'w-full h-[500px]',
  enableGlobe = false,
  markers = [],
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      try {
        // Fetch Mapbox public token via edge function
        const { data, error } = await supabase.functions.invoke("mapbox-public-config");

        if (error) throw error;

        const publicToken = (data as any)?.publicToken as string | undefined;

        if (!publicToken) {
          toast({
            variant: 'destructive',
            title: 'Mapbox Not Configured',
            description: 'Mapbox public token is missing in Supabase function secrets',
          });
          setLoading(false);
          return;
        }

        // Initialize map
        mapboxgl.accessToken = publicToken;

        const mapConfig: mapboxgl.MapboxOptions = {
          container: mapContainer.current,
          style: style,
          center: center,
          zoom: zoom,
        };

        if (enableGlobe) {
          mapConfig.projection = 'globe' as any;
          mapConfig.pitch = 45;
        }

        map.current = new mapboxgl.Map(mapConfig);

        // Add navigation controls
        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );

        // Add markers if provided
        markers.forEach((marker) => {
          if (!map.current) return;

          const popup = marker.title || marker.description
            ? new mapboxgl.Popup({ offset: 25 }).setHTML(
                `${marker.title ? `<h3 class="font-semibold">${marker.title}</h3>` : ''}
                 ${marker.description ? `<p class="text-sm">${marker.description}</p>` : ''}`
              )
            : undefined;

          new mapboxgl.Marker()
            .setLngLat(marker.coordinates)
            .setPopup(popup)
            .addTo(map.current);
        });

        // Globe-specific effects
        if (enableGlobe) {
          map.current.on('style.load', () => {
            map.current?.setFog({
              color: 'rgb(255, 255, 255)',
              'high-color': 'rgb(200, 200, 225)',
              'horizon-blend': 0.2,
            });
          });

          // Optional: Add spinning globe animation
          const secondsPerRevolution = 240;
          const maxSpinZoom = 5;
          const slowSpinZoom = 3;
          let userInteracting = false;

          function spinGlobe() {
            if (!map.current) return;

            const currentZoom = map.current.getZoom();
            if (!userInteracting && currentZoom < maxSpinZoom) {
              let distancePerSecond = 360 / secondsPerRevolution;
              if (currentZoom > slowSpinZoom) {
                const zoomDif = (maxSpinZoom - currentZoom) / (maxSpinZoom - slowSpinZoom);
                distancePerSecond *= zoomDif;
              }
              const currentCenter = map.current.getCenter();
              currentCenter.lng -= distancePerSecond;
              map.current.easeTo({ center: currentCenter, duration: 1000, easing: (n) => n });
            }
          }

          map.current.on('mousedown', () => {
            userInteracting = true;
          });

          map.current.on('dragstart', () => {
            userInteracting = true;
          });

          map.current.on('mouseup', () => {
            userInteracting = false;
            spinGlobe();
          });

          map.current.on('touchend', () => {
            userInteracting = false;
            spinGlobe();
          });

          map.current.on('moveend', () => {
            spinGlobe();
          });

          spinGlobe();
        }

        setLoading(false);
      } catch (error: any) {
        console.error('Error initializing map:', error);
        toast({
          variant: 'destructive',
          title: 'Map Error',
          description: error.message || 'Failed to initialize map',
        });
        setLoading(false);
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [center, zoom, style, enableGlobe, markers, toast]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      {enableGlobe && !loading && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
      )}
    </div>
  );
};

export default Map;
