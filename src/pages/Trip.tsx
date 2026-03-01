import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";

interface Trip {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  cover_image_url: string | null;
  status: string;
  custom_page_path: string | null;
}

const Trip = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchTrip();
  }, [slug]);

  const fetchTrip = async () => {
    try {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("slug", slug)
        .eq("is_public", true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setNotFound(true);
      } else {
        setTrip(data);
        // Redirect to custom page if one is specified
        if (data.custom_page_path) {
          navigate(data.custom_page_path, { replace: true });
        }
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notFound || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Trip Not Found</CardTitle>
            <CardDescription>
              This trip doesn't exist or is not publicly visible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <article className="space-y-6">
          {trip.cover_image_url && (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={trip.cover_image_url}
                alt={trip.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={`px-3 py-1 rounded-full ${
                trip.status === "completed" 
                  ? "bg-primary/10 text-primary" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {trip.status === "completed" ? "Completed" : "Planned"}
              </span>
            </div>

            <h1 className="text-4xl font-bold">{trip.title}</h1>

            <div className="flex flex-wrap gap-4 text-muted-foreground">
              {trip.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{trip.location}</span>
                </div>
              )}

              {trip.start_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(trip.start_date).toLocaleDateString()}
                    {trip.end_date && ` - ${new Date(trip.end_date).toLocaleDateString()}`}
                  </span>
                </div>
              )}
            </div>

            {trip.description && (
              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-wrap">{trip.description}</p>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default Trip;