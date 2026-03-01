import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export const Learning = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Learning Resources</h1>
      <p className="text-muted-foreground mb-6">
        Essential resources to learn about tourski safety and avalanche awareness
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a 
          href="https://www.ortovox.com/uk/safety-academy-lab-snow/?srsltid=AfmBOor-BEcX0fxCEqCHKdtAYTvUp4wR6hGe-xrxHXePJWH7HOsvdI1J" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group"
        >
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img
                src="/images/ortovox-academy.png"
                alt="Ortovox Safety Academy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Ortovox Safety Academy
                <ExternalLink className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Comprehensive education about avalanche safety, snow science, and mountain awareness
              </p>
            </CardContent>
          </Card>
        </a>

        <a 
          href="https://www.youtube.com/watch?v=ZFWII5bAlQI&list=PLpNJNTd93SblL447belxr2-t0JTCC-P-z" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group"
        >
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img
                src="/images/youtube-playlist.png"
                alt="YouTube Avalanche Tutorial Playlist"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                YouTube Tutorial Playlist
                <ExternalLink className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Practical video guides covering ski touring techniques and safety procedures
              </p>
            </CardContent>
          </Card>
        </a>

        <a 
          href="https://rise.articulate.com/share/VqrSFzGPcodpt7vHnCXIS42DuuliF4ep#/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group"
        >
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img
                src="/images/nz-course.png"
                alt="New Zealand Online Avalanche Course"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Nieuw-Zeelandse Online Cursus
                <ExternalLink className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                In-depth online avalanche training course with interactive modules
              </p>
            </CardContent>
          </Card>
        </a>

        <a 
          href="https://portaal.klimenbergsportfederatie.be/events/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group"
        >
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img
                src="/images/kbf-events.png"
                alt="KBF Events & Training"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                KBF Sneeuw- en Lawinekunde
                <ExternalLink className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Official Belgian climbing federation avalanche training courses and events
              </p>
            </CardContent>
          </Card>
        </a>

        <a 
          href="https://avalanche.org/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group"
        >
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img
                src="/images/avalanches-org.png"
                alt="Avalanche.org"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Avalanche.org
                <ExternalLink className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Comprehensive avalanche forecasts, education, and safety resources for backcountry enthusiasts
              </p>
            </CardContent>
          </Card>
        </a>

        <a 
          href="https://www.avalanches.org/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group"
        >
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img
                src="/images/avalanches-org-eu.png"
                alt="ANENA - Avalanches.org"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ANENA - Avalanches.org
                <ExternalLink className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                French avalanche safety association with educational resources and mountain safety information
              </p>
            </CardContent>
          </Card>
        </a>

        <a 
          href="/docs/cursus-sneeuw-en-lawinekunde.pdf" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group"
        >
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
            <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">📄</div>
                <span className="text-sm font-medium text-muted-foreground">PDF Document</span>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Cursus Sneeuw- en Lawinekunde
                <ExternalLink className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Comprehensive Dutch course material covering snow science and avalanche safety fundamentals
              </p>
            </CardContent>
          </Card>
        </a>
      </div>
    </div>
  );
};
