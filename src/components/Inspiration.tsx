import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Loader2, Quote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Inspiration {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
}

const Inspiration = () => {
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<Array<{ text: string; author: string }>>([]);
  const { toast } = useToast();

  // Notion database ID
  const NOTION_DATABASE_ID = "2fd2415334ca4aa8b37d351c33d85729";

  useEffect(() => {
    const fetchQuotes = async () => {
      const { data } = await supabase
        .from("inspiration_quotes")
        .select("text, author")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (data) {
        setQuotes(data);
      }
    };

    fetchQuotes();
  }, []);

  useEffect(() => {
    const fetchInspirations = async () => {
      try {
        setLoading(true);
        console.log("Fetching inspirations from Notion...");

        const { data, error } = await supabase.functions.invoke('fetch-notion-inspiration', {
          body: { 
            databaseId: NOTION_DATABASE_ID,
            filterProperty: 'Favorite',
            filterValue: 'true'
          }
        });

        if (error) {
          console.error("Error fetching inspirations:", error);
          throw error;
        }

        console.log("Inspirations fetched:", data);
        setInspirations(data.inspirations || []);
      } catch (error) {
        console.error("Failed to fetch inspirations:", error);
        toast({
          title: "Error",
          description: "Failed to load inspiration items. Please check your Notion database configuration.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInspirations();
  }, [toast]);

  return (
    <section id="inspiration" className="min-h-screen px-6 md:px-12 py-20">
      <div className="mx-auto max-w-3xl w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="text-muted-foreground">#</span>
            Inspiration
          </h2>
          <p className="text-sm text-muted-foreground">
            Resources, ideas, and projects that inspire my work and thinking
          </p>
        </div>

        <Carousel className="w-full mb-12">
          <CarouselContent>
            {quotes.length > 0 ? (
              quotes.map((quote, index) => (
                <CarouselItem key={index}>
                  <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 rounded-[20px] p-6 border border-primary/20">
                    <Quote className="h-8 w-8 text-primary/40 mb-3" />
                    <p className="text-sm md:text-base text-foreground leading-relaxed italic mb-3">
                      {quote.text}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      — {quote.author}
                    </p>
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 rounded-[20px] p-6 border border-primary/20">
                  <p className="text-sm text-muted-foreground text-center">
                    No quotes available
                  </p>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : inspirations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No inspiration items found. Please configure your Notion database ID.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {inspirations.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="group hover:shadow-sm transition-all duration-200 cursor-pointer border-border bg-card rounded-[20px]">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <CardTitle className="text-lg font-semibold group-hover:text-foreground/80 transition-colors">
                            {item.title}
                          </CardTitle>
                          <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </div>
                        {item.description && (
                          <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                            {item.description}
                          </CardDescription>
                        )}
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Inspiration;
