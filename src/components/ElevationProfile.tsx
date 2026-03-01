import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, Legend } from "recharts";
import { Mountain, AlertTriangle } from "lucide-react";

interface TrackPoint {
  lat: number;
  lon: number;
  ele: number;
}

interface Refuge {
  name: string;
  coordinates: [number, number];
  altitude: number;
  distanceAlongRoute?: number;
}

interface ElevationProfileProps {
  trackPoints: TrackPoint[];
  refuges: Refuge[];
}

// Slope risk thresholds (in degrees)
const SLOPE_THRESHOLDS = {
  safe: 25,        // < 25° - generally safe
  caution: 30,     // 25-30° - caution advised
  dangerous: 35,   // 30-35° - prime avalanche terrain
  extreme: 45,     // > 45° - very steep, often too steep for avalanches
};

const getSlopeColor = (slope: number): string => {
  if (slope < SLOPE_THRESHOLDS.safe) return "hsl(142, 76%, 36%)"; // Green - safe
  if (slope < SLOPE_THRESHOLDS.caution) return "hsl(48, 96%, 53%)"; // Yellow - caution
  if (slope < SLOPE_THRESHOLDS.dangerous) return "hsl(25, 95%, 53%)"; // Orange - dangerous
  if (slope < SLOPE_THRESHOLDS.extreme) return "hsl(0, 84%, 60%)"; // Red - extreme danger
  return "hsl(280, 87%, 65%)"; // Purple - very steep
};

export const ElevationProfile = ({ trackPoints, refuges }: ElevationProfileProps) => {
  // Calculate cumulative distance and slope for each track point
  const profileData: Array<{ 
    distance: number; 
    elevation: number; 
    slope: number;
    slopeSafe: number | null;
    slopeCaution: number | null;
    slopeDangerous: number | null;
    slopeExtreme: number | null;
    lat: number; 
    lon: number;
  }> = [];
  let cumulativeDistance = 0;

  trackPoints.forEach((point, index) => {
    let slope = 0;
    
    if (index === 0) {
      profileData.push({ 
        distance: 0, 
        elevation: point.ele, 
        slope: 0,
        slopeSafe: null,
        slopeCaution: null,
        slopeDangerous: null,
        slopeExtreme: null,
        lat: point.lat, 
        lon: point.lon 
      });
    } else {
      const prevPoint = trackPoints[index - 1];

      // Haversine formula for distance
      const lat1 = prevPoint.lat * Math.PI / 180;
      const lat2 = point.lat * Math.PI / 180;
      const deltaLat = (point.lat - prevPoint.lat) * Math.PI / 180;
      const deltaLon = (point.lon - prevPoint.lon) * Math.PI / 180;

      const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = 6371 * c; // km

      cumulativeDistance += distance;

      // Calculate slope in degrees
      const elevationChange = point.ele - prevPoint.ele;
      const horizontalDistance = distance * 1000; // Convert to meters
      if (horizontalDistance > 0) {
        slope = Math.abs(Math.atan(elevationChange / horizontalDistance) * (180 / Math.PI));
      }

      // Categorize slope for stacked areas
      const slopeSafe = slope < SLOPE_THRESHOLDS.safe ? slope : null;
      const slopeCaution = slope >= SLOPE_THRESHOLDS.safe && slope < SLOPE_THRESHOLDS.caution ? slope : null;
      const slopeDangerous = slope >= SLOPE_THRESHOLDS.caution && slope < SLOPE_THRESHOLDS.extreme ? slope : null;
      const slopeExtreme = slope >= SLOPE_THRESHOLDS.extreme ? slope : null;

      profileData.push({
        distance: cumulativeDistance,
        elevation: point.ele,
        slope: Math.round(slope * 10) / 10,
        slopeSafe,
        slopeCaution,
        slopeDangerous,
        slopeExtreme,
        lat: point.lat,
        lon: point.lon,
      });
    }
  });

  // Smooth slope data with moving average
  const windowSize = 5;
  const smoothedData = profileData.map((point, index) => {
    const start = Math.max(0, index - Math.floor(windowSize / 2));
    const end = Math.min(profileData.length, index + Math.ceil(windowSize / 2));
    const window = profileData.slice(start, end);
    const avgSlope = window.reduce((sum, p) => sum + p.slope, 0) / window.length;
    
    return {
      ...point,
      slope: Math.round(avgSlope * 10) / 10,
      slopeSafe: avgSlope < SLOPE_THRESHOLDS.safe ? avgSlope : 0,
      slopeCaution: avgSlope >= SLOPE_THRESHOLDS.safe && avgSlope < SLOPE_THRESHOLDS.caution ? avgSlope : 0,
      slopeDangerous: avgSlope >= SLOPE_THRESHOLDS.caution && avgSlope < SLOPE_THRESHOLDS.extreme ? avgSlope : 0,
      slopeExtreme: avgSlope >= SLOPE_THRESHOLDS.extreme ? avgSlope : 0,
    };
  });

  // Map refuges to their positions on the profile
  const refugeMarkers = refuges
    .filter(refuge => refuge.distanceAlongRoute !== undefined)
    .map(refuge => ({
      name: refuge.name,
      distance: refuge.distanceAlongRoute!,
      elevation: refuge.altitude,
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const slopeValue = data.slope;
      const riskLevel = slopeValue < SLOPE_THRESHOLDS.safe ? "Safe" :
                        slopeValue < SLOPE_THRESHOLDS.caution ? "Caution" :
                        slopeValue < SLOPE_THRESHOLDS.extreme ? "Avalanche Risk" : "Very Steep";
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">Distance: {data.distance.toFixed(2)} km</p>
          <p className="text-sm text-muted-foreground">Elevation: {Math.round(data.elevation)} m</p>
          <p className="text-sm" style={{ color: getSlopeColor(slopeValue) }}>
            Slope: {slopeValue}° ({riskLevel})
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mountain className="h-5 w-5" />
          Elevation Profile & Slope Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={smoothedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="distance" 
              label={{ value: 'Distance (km)', position: 'insideBottom', offset: -5 }}
              tickFormatter={(value) => value.toFixed(1)}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              yAxisId="elevation"
              label={{ value: 'Elevation (m)', angle: -90, position: 'insideLeft' }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              yAxisId="slope"
              orientation="right"
              label={{ value: 'Slope (°)', angle: 90, position: 'insideRight' }}
              stroke="hsl(var(--muted-foreground))"
              domain={[0, 60]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Slope area chart with risk colors */}
            <Area
              yAxisId="slope"
              type="monotone"
              dataKey="slopeSafe"
              stackId="slope"
              fill="hsl(142, 76%, 36%)"
              fillOpacity={0.6}
              stroke="none"
              name="Safe (<25°)"
            />
            <Area
              yAxisId="slope"
              type="monotone"
              dataKey="slopeCaution"
              stackId="slope"
              fill="hsl(48, 96%, 53%)"
              fillOpacity={0.7}
              stroke="none"
              name="Caution (25-30°)"
            />
            <Area
              yAxisId="slope"
              type="monotone"
              dataKey="slopeDangerous"
              stackId="slope"
              fill="hsl(0, 84%, 60%)"
              fillOpacity={0.8}
              stroke="none"
              name="⚠️ Avalanche Risk (30-45°)"
            />
            <Area
              yAxisId="slope"
              type="monotone"
              dataKey="slopeExtreme"
              stackId="slope"
              fill="hsl(280, 87%, 65%)"
              fillOpacity={0.8}
              stroke="none"
              name="Very Steep (>45°)"
            />
            
            {/* Elevation line */}
            <Line 
              yAxisId="elevation"
              type="monotone" 
              dataKey="elevation" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              name="Elevation"
            />
            
            {refugeMarkers.map((refuge, index) => {
              const dataPoint = smoothedData.find(p => Math.abs(p.distance - refuge.distance) < 0.5);
              if (dataPoint) {
                return (
                  <ReferenceDot
                    key={index}
                    yAxisId="elevation"
                    x={dataPoint.distance}
                    y={refuge.elevation}
                    r={8}
                    fill="hsl(var(--primary))"
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                    label={{
                      value: refuge.name,
                      position: 'top',
                      fill: 'hsl(var(--foreground))',
                      fontSize: 11,
                      fontWeight: 'bold',
                    }}
                  />
                );
              }
              return null;
            })}
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Legend for avalanche risk */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium">Avalanche Risk by Slope Angle</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(142, 76%, 36%)" }} />
              <span>&lt;25° Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(48, 96%, 53%)" }} />
              <span>25-30° Caution</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(0, 84%, 60%)" }} />
              <span>30-45° High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(280, 87%, 65%)" }} />
              <span>&gt;45° Very Steep</span>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-3">
          🏔️ Hover over the chart to see details • Slopes 30-45° present highest avalanche risk
        </p>
      </CardContent>
    </Card>
  );
};
