import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TravelRoute } from "@/components/TravelRoute";
import { Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export const Schedule = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const tripStartDate = new Date("2026-02-13T00:00:00");
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = tripStartDate.getTime() - now.getTime();

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Trip Schedule</h1>
        <div className="flex items-center gap-2 text-lg text-muted-foreground">
          <Calendar className="h-5 w-5" />
          <span>February 13 - 21, 2026</span>
        </div>
      </div>

      {/* Countdown Timer */}
      <Card className="mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center justify-center">
            <Clock className="h-5 w-5" />
            Countdown to Trip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-bold text-primary">
                {countdown.days}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Days</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-bold text-primary">
                {countdown.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Hours</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-bold text-primary">
                {countdown.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Minutes</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-bold text-primary">
                {countdown.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Seconds</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-8">
        <TravelRoute 
          origin={{ lat: 50.9366, lon: 4.0417, name: "Aalst, Belgium" }}
          destination={{ lat: 45.3765, lon: 6.7237, name: "Pralognan-la-Vanoise, France" }}
        />
        <Card>
          <CardHeader>
            <CardTitle>Daily Itinerary</CardTitle>
          </CardHeader>
          <CardContent className="py-8 text-center text-muted-foreground">
            Detailed daily schedule coming soon...
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
