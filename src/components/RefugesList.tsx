import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mountain, Phone, Globe, Users, Bed } from "lucide-react";

interface Refuge {
  name: string;
  altitude: number;
  phone?: string;
  website?: string;
  capacity?: number;
  services: string[];
  description: string;
  coordinates: [number, number]; // [lon, lat]
  distanceAlongRoute?: number;
}

const refuges: Refuge[] = [
  {
    name: "Refuge de Péclet-Polset",
    altitude: 2474,
    phone: "+33 4 79 00 02 66",
    website: "https://www.refuges-vanoise.com/fiche-hebergement-peclet-polset-R7371pec.html",
    capacity: 84,
    services: ["Restaurant", "Dortoir", "Lac Blanc"],
    description: "Located near Lac Blanc, at the foot of the Gébroulaz glacier. Modern refuge with excellent facilities.",
    coordinates: [6.6592, 45.2893] // [lon, lat]
  },
  {
    name: "Refuge du Roc de la Pêche",
    altitude: 2542,
    phone: "+33 4 79 08 71 93",
    capacity: 60,
    services: ["Restaurant", "Dortoir", "Douches"],
    description: "Perched high in the mountains, offering stunning panoramic views of the Vanoise massif.",
    coordinates: [6.6882, 45.3233]
  },
  {
    name: "Refuge du Fond d'Aussois",
    altitude: 2324,
    phone: "+33 4 79 20 30 63",
    website: "https://refugefonddaussois.ffcam.fr",
    capacity: 80,
    services: ["Restaurant", "Dortoir", "Douches chaudes"],
    description: "Located in the heart of Vanoise National Park, at the foot of the Aussois peaks in a peaceful environment.",
    coordinates: [6.7024, 45.2768]
  },
  {
    name: "Refuge de la Dent Parrachée",
    altitude: 2511,
    phone: "+33 4 79 20 31 87",
    website: "https://www.aussois.com/en/hebergement-collectif/refuge-la-dent-parrachee-aussois-2/",
    capacity: 70,
    services: ["Restaurant", "Dortoir", "Vue panoramique"],
    description: "Spectacular location with views of the Dent Parrachée and surrounding glaciers.",
    coordinates: [6.7189, 45.2697]
  },
  {
    name: "Refuge de l'Arpont",
    altitude: 2309,
    phone: "+33 4 79 20 31 31",
    website: "https://refuge-arpont.vanoise.com",
    capacity: 70,
    services: ["Restaurant", "Dortoir", "Chambres privées"],
    description: "A comfortable refuge in the heart of the Vanoise, perfect stop on the tour.",
    coordinates: [6.7892, 45.3182]
  },
  {
    name: "Refuge du Col de la Vanoise",
    altitude: 2517,
    phone: "+33 4 79 08 25 23",
    website: "https://www.refugevanoise.com",
    capacity: 100,
    services: ["Restaurant", "Dortoir", "Douches", "Boutique"],
    description: "Located at the Col de la Vanoise, this popular refuge offers stunning views of the Grande Casse.",
    coordinates: [6.7911, 45.3919]
  },
  {
    name: "Refuge des Barmettes",
    altitude: 2006,
    phone: "+33 4 79 08 71 49",
    capacity: 50,
    services: ["Restaurant", "Dortoir", "Bar"],
    description: "Small family refuge at the entrance of Vanoise National Park with warm atmosphere and panoramic views.",
    coordinates: [6.7528, 45.3895]
  }
];

interface RefugesListProps {
  trackPoints?: Array<{ lat: number; lon: number; ele: number }>;
}

export const RefugesList = ({ trackPoints }: RefugesListProps) => {
  // Calculate distance along route for each refuge
  const calculateRouteDistance = (refugeCoords: [number, number]) => {
    if (!trackPoints || trackPoints.length === 0) return null;
    
    let minDistance = Infinity;
    let closestIndex = 0;
    
    // Find closest point on route to refuge
    trackPoints.forEach((point, index) => {
      const distance = Math.sqrt(
        Math.pow(point.lat - refugeCoords[1], 2) + 
        Math.pow(point.lon - refugeCoords[0], 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    // Calculate cumulative distance from start to this point
    let cumulativeDistance = 0;
    for (let i = 1; i <= closestIndex; i++) {
      const lat1 = trackPoints[i - 1].lat * Math.PI / 180;
      const lat2 = trackPoints[i].lat * Math.PI / 180;
      const deltaLat = (trackPoints[i].lat - trackPoints[i - 1].lat) * Math.PI / 180;
      const deltaLon = (trackPoints[i].lon - trackPoints[i - 1].lon) * Math.PI / 180;

      const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = 6371 * c; // Earth's radius in km

      cumulativeDistance += distance;
    }
    
    return cumulativeDistance;
  };
  
  // Add distances to refuges and sort by distance from start
  const refugesWithDistances = refuges
    .map(refuge => ({
      ...refuge,
      distanceAlongRoute: calculateRouteDistance(refuge.coordinates)
    }))
    .sort((a, b) => {
      // Sort by distance (null values go to end)
      if (a.distanceAlongRoute === null) return 1;
      if (b.distanceAlongRoute === null) return -1;
      return a.distanceAlongRoute - b.distanceAlongRoute;
    });
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Mountain className="h-6 w-6 text-primary" />
        <h3 className="text-2xl font-semibold">Refuges & Gîtes Along the Route</h3>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {refugesWithDistances.map((refuge, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{refuge.name}</CardTitle>
                  <CardDescription className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mountain className="h-4 w-4" />
                      {refuge.altitude}m
                    </span>
                    {refuge.distanceAlongRoute !== null && (
                      <Badge variant="outline" className="text-xs">
                        {refuge.distanceAlongRoute.toFixed(1)} km from start
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                {refuge.capacity && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {refuge.capacity}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{refuge.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {refuge.services.map((service, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                {refuge.phone && (
                  <a 
                    href={`tel:${refuge.phone}`}
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    {refuge.phone}
                  </a>
                )}
                {refuge.website && (
                  <a 
                    href={refuge.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Visit website
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Bed className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Booking Recommendation</p>
              <p className="text-sm text-muted-foreground">
                It's highly recommended to book refuges in advance, especially during peak season (February-April). 
                Most refuges require half-board (demi-pension) which includes dinner and breakfast.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                For more information and reviews, visit{" "}
                <a 
                  href="https://www.refuges.info/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  refuges.info
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
