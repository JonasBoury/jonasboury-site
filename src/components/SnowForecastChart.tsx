import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SnowForecastChartProps {
  trackPoints: Array<{ lat: number; lon: number; ele: number }>;
}

interface ForecastDataPoint {
  date: string;
  startSnowfall?: number;
  midSnowfall?: number;
  endSnowfall?: number;
  startTempMax?: number;
  midTempMax?: number;
  endTempMax?: number;
  startTempMin?: number;
  midTempMin?: number;
  endTempMin?: number;
  startWind?: number;
  midWind?: number;
  endWind?: number;
}

export const SnowForecastChart = ({ trackPoints }: SnowForecastChartProps) => {
  const [data, setData] = useState<ForecastDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<'snowfall' | 'temperature' | 'wind'>('snowfall');

  useEffect(() => {
    const fetchForecastData = async () => {
      if (trackPoints.length === 0) return;

      setLoading(true);

      try {
        // Sample three points: start, middle, and end of route
        const startPoint = trackPoints[0];
        const midPoint = trackPoints[Math.floor(trackPoints.length / 2)];
        const endPoint = trackPoints[trackPoints.length - 1];

        const [startData, midData, endData] = await Promise.all([
          supabase.functions.invoke('open-meteo-weather', {
            body: { latitude: startPoint.lat, longitude: startPoint.lon }
          }),
          supabase.functions.invoke('open-meteo-weather', {
            body: { latitude: midPoint.lat, longitude: midPoint.lon }
          }),
          supabase.functions.invoke('open-meteo-weather', {
            body: { latitude: endPoint.lat, longitude: endPoint.lon }
          })
        ]);

        if (startData.error || midData.error || endData.error) {
          throw new Error('Failed to fetch forecast data');
        }

        // Combine the forecast data
        const dates = startData.data?.daily?.time || [];
        const startSnowfall = startData.data?.daily?.snowfall_sum || [];
        const midSnowfall = midData.data?.daily?.snowfall_sum || [];
        const endSnowfall = endData.data?.daily?.snowfall_sum || [];
        
        const startTempMax = startData.data?.daily?.temperature_2m_max || [];
        const midTempMax = midData.data?.daily?.temperature_2m_max || [];
        const endTempMax = endData.data?.daily?.temperature_2m_max || [];
        
        const startTempMin = startData.data?.daily?.temperature_2m_min || [];
        const midTempMin = midData.data?.daily?.temperature_2m_min || [];
        const endTempMin = endData.data?.daily?.temperature_2m_min || [];
        
        const startWind = startData.data?.daily?.wind_speed_10m_max || [];
        const midWind = midData.data?.daily?.wind_speed_10m_max || [];
        const endWind = endData.data?.daily?.wind_speed_10m_max || [];

        const forecastData: ForecastDataPoint[] = dates.map((date: string, index: number) => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          startSnowfall: startSnowfall[index] || 0,
          midSnowfall: midSnowfall[index] || 0,
          endSnowfall: endSnowfall[index] || 0,
          startTempMax: startTempMax[index] || 0,
          midTempMax: midTempMax[index] || 0,
          endTempMax: endTempMax[index] || 0,
          startTempMin: startTempMin[index] || 0,
          midTempMin: midTempMin[index] || 0,
          endTempMin: endTempMin[index] || 0,
          startWind: startWind[index] || 0,
          midWind: midWind[index] || 0,
          endWind: endWind[index] || 0,
        }));

        setData(forecastData);
      } catch (error) {
        console.error('Error fetching forecast data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, [trackPoints]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>7-Day Snow Forecast</CardTitle>
          <CardDescription>Expected snowfall along the route</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    start: {
      label: "Route Start",
      color: "hsl(var(--chart-1))",
    },
    mid: {
      label: "Route Middle",
      color: "hsl(var(--chart-2))",
    },
    end: {
      label: "Route End",
      color: "hsl(var(--chart-3))",
    },
    startMax: {
      label: "Route Start (Day)",
      color: "hsl(var(--chart-1))",
    },
    midMax: {
      label: "Route Middle (Day)",
      color: "hsl(var(--chart-2))",
    },
    endMax: {
      label: "Route End (Day)",
      color: "hsl(var(--chart-3))",
    },
    startMin: {
      label: "Route Start (Night)",
      color: "hsl(var(--chart-1) / 0.5)",
    },
    midMin: {
      label: "Route Middle (Night)",
      color: "hsl(var(--chart-2) / 0.5)",
    },
    endMin: {
      label: "Route End (Night)",
      color: "hsl(var(--chart-3) / 0.5)",
    },
  };

  const getYAxisLabel = () => {
    if (activeMetric === 'snowfall') return 'Snowfall (cm)';
    if (activeMetric === 'temperature') return 'Temperature (°C)';
    return 'Wind Speed (km/h)';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Weather Forecast</CardTitle>
        <CardDescription>
          Weather forecast at start, middle, and end of route
        </CardDescription>
        <div className="flex gap-2 flex-wrap mt-4">
          <Button
            variant={activeMetric === 'snowfall' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveMetric('snowfall')}
            className="rounded-full"
          >
            Snowfall
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
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
              />
              <YAxis
                label={{ value: getYAxisLabel(), angle: -90, position: "insideLeft" }}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {activeMetric === 'snowfall' && (
                <>
                  <Bar
                    dataKey="startSnowfall"
                    fill="hsl(var(--chart-1))"
                    name="Route Start"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="midSnowfall"
                    fill="hsl(var(--chart-2))"
                    name="Route Middle"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="endSnowfall"
                    fill="hsl(var(--chart-3))"
                    name="Route End"
                    radius={[4, 4, 0, 0]}
                  />
                </>
              )}
              {activeMetric === 'temperature' && (
                <>
                  <Bar
                    dataKey="startTempMax"
                    fill="hsl(var(--chart-1))"
                    name="Route Start (Day)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="startTempMin"
                    fill="hsl(var(--chart-1) / 0.5)"
                    name="Route Start (Night)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="midTempMax"
                    fill="hsl(var(--chart-2))"
                    name="Route Middle (Day)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="midTempMin"
                    fill="hsl(var(--chart-2) / 0.5)"
                    name="Route Middle (Night)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="endTempMax"
                    fill="hsl(var(--chart-3))"
                    name="Route End (Day)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="endTempMin"
                    fill="hsl(var(--chart-3) / 0.5)"
                    name="Route End (Night)"
                    radius={[4, 4, 0, 0]}
                  />
                </>
              )}
              {activeMetric === 'wind' && (
                <>
                  <Bar
                    dataKey="startWind"
                    fill="hsl(var(--chart-1))"
                    name="Route Start"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="midWind"
                    fill="hsl(var(--chart-2))"
                    name="Route Middle"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="endWind"
                    fill="hsl(var(--chart-3))"
                    name="Route End"
                    radius={[4, 4, 0, 0]}
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
