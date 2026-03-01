import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudRain, Snowflake } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface WeatherData {
  current?: {
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
}

interface CurrentWeatherProps {
  lat: number;
  lon: number;
}

export const CurrentWeather = ({ lat, lon }: CurrentWeatherProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, [lat, lon]);

  const fetchWeather = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("open-meteo-weather", {
        body: { latitude: lat, longitude: lon },
      });

      if (error) throw error;
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherDescription = (code: number): string => {
    const weatherCodes: { [key: number]: string } = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    return weatherCodes[code] || "Unknown";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5" />
            Current Weather Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudRain className="h-5 w-5" />
          Current Weather Conditions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Temperature</span>
            <span className="text-2xl font-bold">
              {weather?.current?.temperature_2m?.toFixed(1) || "-"}°C
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Conditions</span>
            <span className="text-lg font-medium">
              {weather?.current?.weather_code !== undefined
                ? getWeatherDescription(weather.current.weather_code)
                : "-"}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Humidity</span>
            <span className="text-lg font-medium">
              {weather?.current?.relative_humidity_2m?.toFixed(0) || "-"}%
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Wind Speed</span>
            <span className="text-lg font-medium">
              {weather?.current?.wind_speed_10m?.toFixed(1) || "-"} km/h
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Precipitation</span>
            <span className="text-lg font-medium flex items-center gap-1">
              {weather?.current?.precipitation !== undefined &&
              weather.current.precipitation > 0 ? (
                <>
                  <Snowflake className="h-4 w-4" />
                  {weather.current.precipitation.toFixed(1)} mm
                </>
              ) : (
                "None"
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
