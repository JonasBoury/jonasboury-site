import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TripLocation {
  id: string;
  trip_slug: string;
  participant_name: string;
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
  speed: number | null;
  heading: number | null;
  timestamp: string;
  created_at: string;
}

interface ParticipantLocation {
  participant_name: string;
  latitude: number;
  longitude: number;
  altitude: number | null;
  timestamp: string;
  speed: number | null;
}

export const useTripLocations = (tripSlug: string) => {
  const [locations, setLocations] = useState<ParticipantLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch latest location per participant
  const fetchLatestLocations = async () => {
    try {
      // Get all locations from last 24 hours, ordered by timestamp
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error: fetchError } = await supabase
        .from("trip_locations")
        .select("*")
        .eq("trip_slug", tripSlug)
        .gte("timestamp", since)
        .order("timestamp", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Group by participant and get latest location for each
      const latestByParticipant = new Map<string, ParticipantLocation>();
      
      for (const loc of data || []) {
        if (!latestByParticipant.has(loc.participant_name)) {
          latestByParticipant.set(loc.participant_name, {
            participant_name: loc.participant_name,
            latitude: Number(loc.latitude),
            longitude: Number(loc.longitude),
            altitude: loc.altitude ? Number(loc.altitude) : null,
            timestamp: loc.timestamp,
            speed: loc.speed ? Number(loc.speed) : null,
          });
        }
      }

      setLocations(Array.from(latestByParticipant.values()));
      setError(null);
    } catch (err) {
      console.error("Error fetching trip locations:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestLocations();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`trip-locations-${tripSlug}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "trip_locations",
          filter: `trip_slug=eq.${tripSlug}`,
        },
        (payload) => {
          const newLoc = payload.new as TripLocation;
          setLocations((prev) => {
            // Update or add participant location
            const existing = prev.findIndex(
              (l) => l.participant_name === newLoc.participant_name
            );
            
            const newParticipantLoc: ParticipantLocation = {
              participant_name: newLoc.participant_name,
              latitude: Number(newLoc.latitude),
              longitude: Number(newLoc.longitude),
              altitude: newLoc.altitude ? Number(newLoc.altitude) : null,
              timestamp: newLoc.timestamp,
              speed: newLoc.speed ? Number(newLoc.speed) : null,
            };

            if (existing >= 0) {
              const updated = [...prev];
              updated[existing] = newParticipantLoc;
              return updated;
            }
            
            return [...prev, newParticipantLoc];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tripSlug]);

  return { locations, loading, error, refetch: fetchLatestLocations };
};