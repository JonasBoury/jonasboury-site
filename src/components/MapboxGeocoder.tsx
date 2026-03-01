import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin } from "lucide-react";

interface GeocodingResult {
  name: string;
  coordinates: [number, number];
  bbox?: [number, number, number, number];
  placeType: string[];
}

const MapboxGeocoder = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const { toast } = useToast();

  const handleGeocode = async () => {
    if (!query.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a location to search",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("mapbox-geocode", {
        body: { query: query.trim() },
      });

      if (error) throw error;

      if (data.success) {
        setResults(data.results);
        toast({
          title: "Success",
          description: `Found ${data.results.length} locations`,
        });
      } else {
        throw new Error(data.error || "Geocoding failed");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to geocode location",
      });
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter location (e.g., San Francisco, CA)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGeocode()}
          className="flex-1"
        />
        <Button onClick={handleGeocode} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Results:</h3>
          {results.map((result, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{result.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Coordinates: {result.coordinates[1].toFixed(4)}, {result.coordinates[0].toFixed(4)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Type: {result.placeType.join(", ")}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${result.coordinates[1]}, ${result.coordinates[0]}`
                      );
                      toast({
                        title: "Copied",
                        description: "Coordinates copied to clipboard",
                      });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapboxGeocoder;
