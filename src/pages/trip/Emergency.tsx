import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, AlertTriangle, MapPin, Heart, Radio, Mountain, Hospital, Wifi, CheckCircle2, Circle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

interface ChecklistSection {
  title: string;
  items: ChecklistItem[];
}

export const Emergency = () => {
  const [checklist, setChecklist] = useState<ChecklistSection[]>([
    {
      title: "Avalanche Safety Equipment",
      items: [
        { id: "transceiver", label: "Avalanche transceiver (LVS) checked and working", description: "Verify batteries are fresh and device is transmitting", checked: false },
        { id: "probe", label: "Avalanche probe (min 240cm) packed", description: "Check for damage and ensure it extends/retracts properly", checked: false },
        { id: "shovel", label: "Avalanche shovel (metal blade) packed", description: "Verify handle and blade connection is secure", checked: false },
        { id: "transceiver-check", label: "Group transceiver check completed", description: "All team members switched modes and verified signals", checked: false },
      ]
    },
    {
      title: "Weather & Conditions Review",
      items: [
        { id: "avalanche-bulletin", label: "Checked latest avalanche bulletin", description: "EAWS/ALBINA bulletin for Tyrol & Vorarlberg (updated daily)", checked: false },
        { id: "weather-forecast", label: "Reviewed 24h weather forecast", description: "Temperature, precipitation, wind speed and direction", checked: false },
        { id: "recent-snow", label: "Noted recent snowfall and wind patterns", description: "New snow depth, wind loading on slopes", checked: false },
        { id: "visibility", label: "Confirmed visibility forecast is adequate", description: "Avoid tours in poor visibility conditions", checked: false },
      ]
    },
    {
      title: "Route Planning & Navigation",
      items: [
        { id: "route-planned", label: "Route planned with alternatives", description: "Primary route and bail-out options identified", checked: false },
        { id: "hazards-identified", label: "Terrain hazards identified", description: "Avalanche terrain, crevasses, steep sections noted", checked: false },
        { id: "map-compass", label: "Map, compass, and GPS devices packed", description: "Ensure GPS is charged and waypoints loaded", checked: false },
        { id: "timing-plan", label: "Timing and turnaround time established", description: "Know when you must turn back regardless of progress", checked: false },
      ]
    },
    {
      title: "Emergency Preparedness",
      items: [
        { id: "first-aid", label: "First aid kit packed and checked", description: "Include blister treatment, pain relief, emergency blanket", checked: false },
        { id: "phone-charged", label: "Mobile phone fully charged", description: "Backup battery packed and charged", checked: false },
        { id: "emergency-contacts", label: "Emergency numbers saved in phone", description: "112, Bergrettung 140, Alpinpolizei +43 59 133", checked: false },
        { id: "itinerary-shared", label: "Route and return time shared", description: "Someone outside group knows your plans", checked: false },
      ]
    },
    {
      title: "Team & Skills",
      items: [
        { id: "team-briefing", label: "Team briefing completed", description: "Discussed route, hazards, roles, emergency procedures", checked: false },
        { id: "skills-match", label: "Confirmed team skills match route difficulty", description: "All members capable of technical and physical demands", checked: false },
        { id: "decision-maker", label: "Identified decision maker/leader", description: "Clear authority for go/no-go decisions", checked: false },
        { id: "fitness-check", label: "All team members feel physically ready", description: "Well-rested, fed, hydrated, no illness", checked: false },
      ]
    },
  ]);

  // Load checklist state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("emergencyChecklist");
    const savedDate = localStorage.getItem("emergencyChecklistDate");
    
    if (savedState && savedDate) {
      const today = new Date().toDateString();
      if (savedDate !== today) {
        resetChecklist();
      } else {
        setChecklist(JSON.parse(savedState));
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("emergencyChecklist", JSON.stringify(checklist));
    localStorage.setItem("emergencyChecklistDate", new Date().toDateString());
  }, [checklist]);

  const toggleItem = (sectionIndex: number, itemId: string) => {
    setChecklist(prev => {
      const newChecklist = [...prev];
      const section = newChecklist[sectionIndex];
      const item = section.items.find(i => i.id === itemId);
      if (item) {
        item.checked = !item.checked;
      }
      return newChecklist;
    });
  };

  const resetChecklist = () => {
    setChecklist(prev => prev.map(section => ({
      ...section,
      items: section.items.map(item => ({ ...item, checked: false }))
    })));
  };

  const getTotalItems = () => checklist.reduce((total, section) => total + section.items.length, 0);
  const getCheckedItems = () => checklist.reduce((total, section) => total + section.items.filter(item => item.checked).length, 0);
  const getCompletionPercentage = () => {
    const total = getTotalItems();
    const checked = getCheckedItems();
    return total > 0 ? Math.round((checked / total) * 100) : 0;
  };

  return (
    <div className="container max-w-6xl py-8 px-4 mb-20 md:mb-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Emergency Information</h1>
        <p className="text-lg text-muted-foreground">
          Critical emergency contacts and procedures for ski touring in the Silvretta region, Tyrol/Vorarlberg, Austria
        </p>
      </div>

      {/* Pre-Tour Safety Checklist */}
      <Card className="mb-6 border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                Pre-Tour Safety Checklist
              </CardTitle>
              <CardDescription className="mt-2">
                Complete this checklist before every ski tour. Resets daily.
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetChecklist}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {getCheckedItems()} of {getTotalItems()} items completed
              </span>
              <span className="text-sm font-semibold text-primary">
                {getCompletionPercentage()}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300 ease-in-out"
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
            {getCompletionPercentage() === 100 && (
              <Alert className="mt-4 border-green-500 bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-600 dark:text-green-400">
                  <strong>Checklist complete!</strong> You&apos;re ready to start your tour. Stay safe and enjoy!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {checklist.map((section, sectionIndex) => (
            <div key={section.title} className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {section.items.every(item => item.checked) ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                {section.title}
                <span className="text-sm text-muted-foreground font-normal">
                  ({section.items.filter(item => item.checked).length}/{section.items.length})
                </span>
              </h3>
              <div className="space-y-3 ml-7">
                {section.items.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      id={item.id}
                      checked={item.checked}
                      onCheckedChange={() => toggleItem(sectionIndex, item.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 space-y-1">
                      <label
                        htmlFor={item.id}
                        className={`text-sm font-medium leading-none cursor-pointer ${
                          item.checked ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {item.label}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Critical Emergency Numbers */}
      <Alert className="mb-6 border-destructive bg-destructive/10">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <AlertDescription className="text-base">
          <strong className="text-destructive">In case of emergency:</strong> Stay calm, assess the situation, 
          protect yourself and others, and call for help immediately.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Emergency Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-destructive" />
              Emergency Phone Numbers
            </CardTitle>
            <CardDescription>Save these numbers in your phone before departing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-destructive pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-lg">112</span>
                <Badge variant="destructive">Primary</Badge>
              </div>
              <p className="text-sm text-muted-foreground">European Emergency Number (works on any network)</p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-lg">140</span>
                <Badge className="bg-orange-500">Bergrettung</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Austrian Mountain Rescue (Österreichischer Bergrettungsdienst)</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-lg">144</span>
                <Badge className="bg-blue-500">Rettung</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Ambulance / Medical Emergency (Austria)</p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-lg">+43 59 133</span>
                <Badge className="bg-purple-500">Alpinpolizei</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Alpine Police - for accident reports and coordination</p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-lg">133</span>
                <Badge className="bg-yellow-500 text-black">Polizei</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Austrian Police</p>
            </div>
          </CardContent>
        </Card>

        {/* Avalanche Emergency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Avalanche Emergency Protocol
            </CardTitle>
            <CardDescription>Critical steps if caught in avalanche</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 list-decimal list-inside">
              <li className="text-sm">
                <strong>Activate airbag</strong> immediately if equipped
              </li>
              <li className="text-sm">
                <strong>Try to ski/board to the side</strong> to escape avalanche path
              </li>
              <li className="text-sm">
                <strong>Ditch poles and equipment</strong> if caught
              </li>
              <li className="text-sm">
                <strong>Swimming motions</strong> to stay on surface
              </li>
              <li className="text-sm">
                <strong>Create air pocket</strong> with hands in front of face before stopping
              </li>
              <li className="text-sm">
                <strong>Stay calm & conserve oxygen</strong> if buried
              </li>
            </ol>
            <div className="mt-4 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                If witness to avalanche: Mark last seen point, call 140 (Bergrettung) or 112, begin transceiver search immediately
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medical Facilities */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hospital className="h-5 w-5 text-blue-500" />
            Nearest Medical Facilities
          </CardTitle>
          <CardDescription>Hospitals and medical centers near Silvretta / Paznaun Valley</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Krankenhaus Zams</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  Sanatoriumstraße 43, 6511 Zams
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  +43 5442 600
                </p>
                <p>~45 min from Galtür, nearest major hospital</p>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Landeskrankenhaus Innsbruck</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  Anichstraße 35, 6020 Innsbruck
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  +43 512 504 0
                </p>
                <p>~1.5h drive, major trauma center with helicopter access</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Arzt Galtür (Local Doctor)</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  Galtür village center
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  +43 5443 8209
                </p>
                <p>Local general practitioner, limited hours</p>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Arzt Ischgl (Local Doctor)</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  Ischgl village, ~15 min from Galtür
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  +43 5444 5200
                </p>
                <p>Doctor on call during ski season</p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-semibold mb-2">Pharmacies (Apotheken)</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Nearest pharmacies are in Landeck (~40 min). For urgent needs, contact the local doctor in Galtür or Ischgl. 
              Look for the red "A" sign.
            </p>
            <p className="text-sm">
              <strong>Night/weekend pharmacy:</strong> Call <span className="font-mono">1455</span> for the nearest on-duty pharmacy (Apothekenruf)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Safety Equipment Check */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-blue-500" />
            Safety Equipment Checklist
          </CardTitle>
          <CardDescription>Mandatory equipment for each person</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Avalanche Safety</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Avalanche transceiver (LVS)</li>
                <li>✓ Probe (minimum 240cm)</li>
                <li>✓ Shovel (metal blade)</li>
                <li>✓ Avalanche airbag (recommended)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">First Aid & Communication</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ First aid kit</li>
                <li>✓ Emergency blanket</li>
                <li>✓ Mobile phone (charged)</li>
                <li>✓ Backup battery</li>
                <li>✓ Whistle</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Navigation & Repair</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Map & compass</li>
                <li>✓ GPS device</li>
                <li>✓ Headlamp + spare batteries</li>
                <li>✓ Repair kit (ski, binding)</li>
                <li>✓ Multi-tool</li>
              </ul>
            </div>
          </div>

          <Alert className="mt-4">
            <Radio className="h-4 w-4" />
            <AlertDescription>
              <strong>Daily transceiver check:</strong> Before every tour, perform a group transceiver check. 
              Each person switches to transmit mode, then search mode to verify all units are working.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Weather & Avalanche Info Sources */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mountain className="h-5 w-5 text-blue-500" />
            Weather & Avalanche Information
          </CardTitle>
          <CardDescription>Check before every tour</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              EAWS / ALBINA Avalanche Bulletin
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Official avalanche forecast for Tyrol, South Tyrol & Trentino, updated daily at 17:00
            </p>
            <a 
              href="https://avalanche.report/bulletin/latest" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              avalanche.report/bulletin/latest
            </a>
            <div className="mt-3 grid grid-cols-5 gap-2 text-xs">
              <div className="text-center p-2 bg-green-100 dark:bg-green-900/20 rounded">
                <div className="font-bold">1</div>
                <div className="text-muted-foreground">Low</div>
              </div>
              <div className="text-center p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded">
                <div className="font-bold">2</div>
                <div className="text-muted-foreground">Moderate</div>
              </div>
              <div className="text-center p-2 bg-orange-100 dark:bg-orange-900/20 rounded">
                <div className="font-bold">3</div>
                <div className="text-muted-foreground">Considerable</div>
              </div>
              <div className="text-center p-2 bg-red-100 dark:bg-red-900/20 rounded">
                <div className="font-bold">4</div>
                <div className="text-muted-foreground">High</div>
              </div>
              <div className="text-center p-2 bg-red-200 dark:bg-red-900/40 rounded">
                <div className="font-bold">5</div>
                <div className="text-muted-foreground">Very High</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Mountain Weather</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://www.zamg.ac.at" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    GeoSphere Austria (ZAMG)
                  </a>
                  <span className="text-muted-foreground"> - Official Austrian forecasts</span>
                </li>
                <li>
                  <a href="https://www.mountain-forecast.com/peaks/Piz-Buin" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Mountain-Forecast.com
                  </a>
                  <span className="text-muted-foreground"> - Piz Buin altitude-specific</span>
                </li>
                <li>
                  <a href="https://www.bergfex.at/sommer/tirol/wetter/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Bergfex
                  </a>
                  <span className="text-muted-foreground"> - Detailed Tyrol mountain weather</span>
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Hut & Trail Info</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://www.alpenverein.at" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Österreichischer Alpenverein (ÖAV)
                  </a>
                  <span className="text-muted-foreground"> - Hut status & info</span>
                </li>
                <li>
                  <a href="https://www.camptocamp.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Camptocamp.org
                  </a>
                  <span className="text-muted-foreground"> - Trip reports</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-blue-500" />
            Communication in Mountains
          </CardTitle>
          <CardDescription>Mobile coverage and alternatives</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Wifi className="h-4 w-4" />
            <AlertDescription>
              <strong>Limited mobile coverage:</strong> The Silvretta high alpine area has very limited signal. 
              Huts may have Wi-Fi. Always tell someone your route and expected return time.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 text-sm">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <strong>For emergency calls without signal:</strong>
              <p className="text-muted-foreground mt-1">
                112 works on any available network, even without SIM credit. 
                Try moving to higher ground or ridge lines for better reception.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <strong>Alpine distress signal:</strong>
              <p className="text-muted-foreground mt-1">
                6 signals per minute (whistle, light, or waving), then 1 minute pause. Repeat.
                Response: 3 signals per minute.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <strong>Satellite communication (recommended for remote areas):</strong>
              <ul className="text-muted-foreground mt-1 space-y-1 ml-4 list-disc">
                <li>Garmin inReach (satellite messenger)</li>
                <li>SPOT device</li>
                <li>iPhone 14+ Emergency SOS via satellite</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2">
              <strong>Share your location:</strong>
              <p className="text-muted-foreground mt-1">
                Before heading out, share your planned route with someone not in your group. 
                Use apps like WhatsApp live location or What3Words for precise coordinates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Alert className="mt-6">
        <Heart className="h-4 w-4" />
        <AlertDescription>
          <strong>Prevention is key:</strong> Most mountain emergencies are preventable. 
          Check weather and avalanche forecasts, carry proper equipment, stay within your skill level, 
          and don't hesitate to turn back if conditions are unfavorable.
        </AlertDescription>
      </Alert>
    </div>
  );
};
