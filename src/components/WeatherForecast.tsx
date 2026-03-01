import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Cloud, CloudRain, CloudSnow, Sun, Wind } from "lucide-react";

interface WeatherForecastProps {
  latitude: number;
  longitude: number;
  location?: string;
}

interface DailyForecast {
  time: string;
  values: {
    temperatureMax: number;
    temperatureMin: number;
    precipitationProbability: number;
    windSpeed: number;
    weatherCode: number;
  };
}

const getWeatherIcon = (code: number) => {
  // Tomorrow.io weather codes
  if (code >= 5000 && code <= 5101) return <CloudSnow className="h-6 w-6" />;
  if (code >= 4000 && code <= 4201) return <CloudRain className="h-6 w-6" />;
  if (code >= 2000 && code <= 2100) return <Cloud className="h-6 w-6" />;
  if (code === 1000) return <Sun className="h-6 w-6" />;
  return <Cloud className="h-6 w-6" />;
};

const getWeatherDescription = (code: number) => {
  if (code >= 5000 && code <= 5101) return "Snow";
  if (code >= 4000 && code <= 4201) return "Rain";
  if (code >= 2000 && code <= 2100) return "Cloudy";
  if (code === 1000) return "Clear";
  return "Cloudy";
};

export const WeatherForecast = ({ latitude, longitude, location }: WeatherForecastProps) => {
  const [data, setData] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: response, error: fetchError } = await supabase.functions.invoke('tomorrow-io-forecast', {
          body: { latitude, longitude }
        });

        if (fetchError) {
          throw fetchError;
        }

        if (response.error) {
          throw new Error(response.error);
        }

        // Extract daily forecasts (limit to 7 days)
        const dailyData = response.timelines?.daily?.slice(0, 7) || [];
        console.log('Daily data received:', dailyData);
        console.log('First day sample:', dailyData[0]);
        setData(dailyData);
      } catch (err) {
        console.error('Error fetching forecast:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch weather forecast');
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [latitude, longitude]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>7-Day Weather Forecast</CardTitle>
          {location && <CardDescription>{location}</CardDescription>}
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>7-Day Weather Forecast</CardTitle>
          {location && <CardDescription>{location}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Weather Forecast</CardTitle>
        {location && <CardDescription>{location}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {data.map((day, index) => {
            const date = new Date(day.time);
            const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayMonth = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return (
              <div key={day.time} className="flex flex-col items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <p className="text-sm font-medium">{dayName}</p>
                <p className="text-xs text-muted-foreground mb-2">{dayMonth}</p>
                
                <div className="my-3 text-primary">
                  {getWeatherIcon(day.values.weatherCode)}
                </div>
                
                <p className="text-xs text-muted-foreground mb-1">
                  {getWeatherDescription(day.values.weatherCode)}
                </p>
                
                <div className="text-center mb-2">
                  <p className="text-lg font-semibold">
                    {Math.round(day.values.temperatureMax)}°
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(day.values.temperatureMin)}°
                  </p>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <CloudRain className="h-3 w-3" />
                  <span>{day.values.precipitationProbability != null ? Math.round(day.values.precipitationProbability) : 0}%</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Wind className="h-3 w-3" />
                  <span>{day.values.windSpeed != null ? Math.round(day.values.windSpeed) : 0} km/h</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
