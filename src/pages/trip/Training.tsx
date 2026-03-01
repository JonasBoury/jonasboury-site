import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Calendar, ExternalLink, FileText, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";

interface TrainingItem {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'link';
  url: string;
  thumbnail?: string;
}

interface CompletionStatus {
  [itemId: string]: {
    jonas: boolean;
    stan: boolean;
    nero: boolean;
  };
}

const trainingItems: TrainingItem[] = [
  {
    id: 'cursus-sneeuw',
    title: 'Cursus Sneeuw- en Lawinekunde',
    description: 'Comprehensive Dutch course material covering snow science and avalanche safety fundamentals',
    type: 'pdf',
    url: '/docs/cursus-sneeuw-en-lawinekunde.pdf',
  },
  {
    id: 'ski-touring-intro',
    title: 'Introduction to Ski Touring',
    description: 'Essential video guide covering the basics of ski touring, equipment, and safety',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=ALxye0ipGH8',
    thumbnail: 'https://img.youtube.com/vi/ALxye0ipGH8/maxresdefault.jpg',
  },
];

const PERSONS = ['jonas', 'stan', 'nero'] as const;
type Person = typeof PERSONS[number];

export const Training = () => {
  const { slug } = useParams<{ slug: string }>();
  const [daysUntilTrip, setDaysUntilTrip] = useState<number>(0);
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus>({});
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [currentPdf, setCurrentPdf] = useState<TrainingItem | null>(null);
  const tripSlug = slug || 'toerski-moelleux-club';

  useEffect(() => {
    const calculateDaysRemaining = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tripDate = new Date('2026-02-13');
      tripDate.setHours(0, 0, 0, 0);
      
      const diffTime = tripDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysUntilTrip(diffDays);
    };

    calculateDaysRemaining();
    const interval = setInterval(calculateDaysRemaining, 1000 * 60 * 60 * 24);
    return () => clearInterval(interval);
  }, []);

  // Fetch completion status from Supabase
  useEffect(() => {
    const fetchCompletions = async () => {
      const { data, error } = await supabase
        .from('training_completions')
        .select('*')
        .eq('trip_slug', tripSlug);

      if (error) {
        console.error('Error fetching completions:', error);
        return;
      }

      const status: CompletionStatus = {};
      data?.forEach((row) => {
        if (!status[row.training_item_id]) {
          status[row.training_item_id] = { jonas: false, stan: false, nero: false };
        }
        if (PERSONS.includes(row.person as Person)) {
          status[row.training_item_id][row.person as Person] = row.completed;
        }
      });
      setCompletionStatus(status);
    };

    fetchCompletions();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('training-completions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'training_completions',
          filter: `trip_slug=eq.${tripSlug}`,
        },
        () => {
          fetchCompletions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tripSlug]);

  const toggleCompletion = async (itemId: string, person: Person) => {
    const currentValue = completionStatus[itemId]?.[person] || false;
    const newValue = !currentValue;

    // Optimistic update
    setCompletionStatus(prev => ({
      ...prev,
      [itemId]: {
        jonas: prev[itemId]?.jonas || false,
        stan: prev[itemId]?.stan || false,
        nero: prev[itemId]?.nero || false,
        [person]: newValue,
      },
    }));

    // Upsert to Supabase
    const { error } = await supabase
      .from('training_completions')
      .upsert(
        {
          trip_slug: tripSlug,
          training_item_id: itemId,
          person,
          completed: newValue,
          completed_at: newValue ? new Date().toISOString() : null,
        },
        {
          onConflict: 'trip_slug,training_item_id,person',
        }
      );

    if (error) {
      console.error('Error updating completion:', error);
      // Revert on error
      setCompletionStatus(prev => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [person]: currentValue,
        },
      }));
    }
  };

  const openPdfViewer = (item: TrainingItem) => {
    setCurrentPdf(item);
    setPdfViewerOpen(true);
  };

  const handleItemClick = (item: TrainingItem, e: React.MouseEvent) => {
    if (item.type === 'pdf') {
      e.preventDefault();
      openPdfViewer(item);
    }
  };

  const renderThumbnail = (item: TrainingItem) => {
    if (item.type === 'pdf') {
      return (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto mb-2 text-blue-600 dark:text-blue-300" />
            <span className="text-sm font-medium text-muted-foreground">PDF Document</span>
          </div>
        </div>
      );
    }
    if (item.thumbnail) {
      return (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Training Plan</h1>
      
      {/* Countdown Card */}
      <Card className="mb-6 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Calendar className="h-12 w-12 text-primary" />
            <div className="text-center">
              <p className="text-5xl font-bold text-primary mb-2">
                {daysUntilTrip}
              </p>
              <p className="text-lg text-muted-foreground">
                {daysUntilTrip === 1 ? 'day' : 'days'} until the trip
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                February 13 - 21, 2026
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trainingItems.map((item) => (
          <Card key={item.id} className="h-full transition-all hover:shadow-lg">
            <a 
              href={item.url} 
              target={item.type !== 'pdf' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="block group"
              onClick={(e) => handleItemClick(item, e)}
            >
              {renderThumbnail(item)}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {item.title}
                  {item.type === 'pdf' ? (
                    <FileText className="h-4 w-4" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </a>
            
            {/* Completion Checkboxes */}
            <CardContent className="pt-0 border-t">
              <p className="text-sm font-medium mb-3 text-muted-foreground">Mark as completed:</p>
              <div className="flex gap-6">
                {PERSONS.map((person) => (
                  <label 
                    key={person} 
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox 
                      checked={completionStatus[item.id]?.[person] || false}
                      onCheckedChange={() => toggleCompletion(item.id, person)}
                    />
                    <span className="text-sm capitalize">{person}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PDF Viewer Dialog */}
      <Dialog open={pdfViewerOpen} onOpenChange={setPdfViewerOpen}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle>{currentPdf?.title}</DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={currentPdf?.url} target="_blank" rel="noopener noreferrer">
                    Open in new tab
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {currentPdf && (
              <iframe
                src={currentPdf.url}
                className="w-full h-full border-0"
                title={currentPdf.title}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
