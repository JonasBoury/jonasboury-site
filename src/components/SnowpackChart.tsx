import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SnowpackChartProps {
  trackPoints: Array<{ lat: number; lon: number; ele: number }>;
}

interface SnowpackDataPoint {
  distance: number;
  snowDepth?: number;
  temperature?: number;
  windSpeed?: number;
  elevation: number;
  location: string;
}

export const SnowpackChart = ({ trackPoints }: SnowpackChartProps) => {
  const [data, setData] = useState<SnowpackDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<'snowpack' | 'temperature' | 'wind'>('snowpack');

  useEffect(() => {
    const fetchSnowpackData = async () => {
      if (trackPoints.length === 0) return;

      setLoading(true);
      
      // Create detailed elevation profile from all track points
      const elevationData: SnowpackDataPoint[] = [];
      let cumulativeDistance = 0;

      for (let i = 0; i < trackPoints.length; i++) {
        const point = trackPoints[i];
        
        if (i > 0) {
          const prevPoint = trackPoints[i - 1];
          const distance = calculateDistance(
            prevPoint.lat,
            prevPoint.lon,
            point.lat,
            point.lon
          );
          cumulativeDistance += distance;
        }

        elevationData.push({
          distance: parseFloat(cumulativeDistance.toFixed(2)),
          elevation: Math.round(point.ele),
          location: `${cumulativeDistance.toFixed(1)}km`,
          snowDepth: undefined,
          temperature: undefined,
          windSpeed: undefined
        });
      }

      // Sample points for snowpack data (every ~10 points)
      const samplingInterval = Math.floor(trackPoints.length / 10) || 1;
      
      for (let i = 0; i < trackPoints.length; i += samplingInterval) {
        const point = trackPoints[i];
        
        try {
          const { data: weatherData, error } = await supabase.functions.invoke('open-meteo-weather', {
            body: { latitude: point.lat, longitude: point.lon }
          });

          if (!error && weatherData) {
            // Use current snow_depth (meters -> cm) if available, fallback to daily snow_depth_max
            const snowDepthMeters = weatherData?.current?.snow_depth ?? weatherData?.daily?.snow_depth_max?.[0] ?? 0;
            const snowDepth = snowDepthMeters * 100; // Convert meters to cm
            const temperature = weatherData?.current?.temperature_2m || 0;
            const windSpeed = weatherData?.current?.wind_speed_10m || 0;
            
            // Add weather data to the corresponding elevation data point
            if (elevationData[i]) {
              elevationData[i].snowDepth = snowDepth;
              elevationData[i].temperature = temperature;
              elevationData[i].windSpeed = windSpeed;
            }
          }
        } catch (error) {
          console.error('Error fetching snowpack data:', error);
        }
      }

      setData(elevationData);
      setLoading(false);
    };

    fetchSnowpackData();
  }, [trackPoints]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Snowpack Analysis</CardTitle>
          <CardDescription>Snow depth along the route</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    snowDepth: {
      label: "Snow Depth (cm)",
      color: "hsl(var(--chart-1))",
    },
    temperature: {
      label: "Temperature (°C)",
      color: "hsl(var(--chart-3))",
    },
    windSpeed: {
      label: "Wind Speed (km/h)",
      color: "hsl(var(--chart-4))",
    },
    elevation: {
      label: "Elevation (m)",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Snowpack & Elevation Analysis</CardTitle>
        <CardDescription>
          Snow depth and elevation profile along the route
        </CardDescription>
        <div className="flex gap-2 flex-wrap mt-4">
          <Button
            variant={activeMetric === 'snowpack' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveMetric('snowpack')}
            className="rounded-full"
          >
            Snowpack
          </Button>
          <Button
            variant={activeMetric === 'temperature' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveMetric('temperature')}
            className="rounded-full"
          >
            Temperature
          </Button>
          <Button
            variant={activeMetric === 'wind' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveMetric('wind')}
            className="rounded-full"
          >
            Wind
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="distance"
                label={{ value: "Distance (km)", position: "insideBottom", offset: -5 }}
                className="text-xs"
              />
              <YAxis
                yAxisId="left"
                label={{ 
                  value: activeMetric === 'snowpack' 
                    ? "Snow Depth (cm)" 
                    : activeMetric === 'temperature' 
                    ? "Temperature (°C)" 
                    : "Wind Speed (km/h)", 
                  angle: -90, 
                  position: "insideLeft" 
                }}
                className="text-xs"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: "Elevation (m)", angle: 90, position: "insideRight" }}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="elevation"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                name="Elevation"
                dot={false}
                isAnimationActive={false}
              />
              {activeMetric === 'snowpack' && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="snowDepth"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  name="Snow Depth"
                  dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              )}
              {activeMetric === 'temperature' && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  name="Temperature"
                  dot={{ fill: "hsl(var(--chart-3))", r: 4 }}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              )}
              {activeMetric === 'wind' && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="windSpeed"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  name="Wind Speed"
                  dot={{ fill: "hsl(var(--chart-4))", r: 4 }}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
