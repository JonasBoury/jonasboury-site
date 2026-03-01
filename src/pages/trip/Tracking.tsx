import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Apple, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Traccar Client configuration URL
const WEBHOOK_BASE = "https://sbtupxuvuvwfbkcvyzba.supabase.co/functions/v1/trip-location-webhook";

interface ParticipantConfig {
  name: string;
  displayName: string;
}

const participants: ParticipantConfig[] = [
  { name: "Jonas", displayName: "Jonas" },
  { name: "Nero", displayName: "Nero" },
  { name: "Stan", displayName: "Stan" },
];

const Tracking = () => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Build Traccar QR code configuration string
  // Format: key=value pairs that Traccar Client parses
  const buildTraccarQrConfig = (participantName: string) => {
    const serverUrl = `${WEBHOOK_BASE}?token=moelleux&trip=toerski-moelleux-club`;
    // Traccar Client QR format: url=SERVER_URL&id=DEVICE_ID with additional settings
    return `url=${encodeURIComponent(serverUrl)}&id=${participantName}&accuracy=high&distance=75&buffer=true`;
  };

  const getServerUrl = () => {
    return `${WEBHOOK_BASE}?token=moelleux&trip=toerski-moelleux-club`;
  };

  const handleCopyUrl = (url: string, name: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(name);
    toast({
      title: "URL copied",
      description: `Tracking URL for ${name} copied to clipboard`,
    });
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-8 pb-24 md:pb-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Live Tracking Setup</h1>
        <p className="text-muted-foreground">
          Set up Traccar Client to share your location with the group during the trip.
        </p>
      </div>

      {/* Download Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Step 1: Download Traccar Client
          </CardTitle>
          <CardDescription>
            Install the free Traccar Client app on your phone
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button asChild variant="outline" className="gap-2">
            <a 
              href="https://apps.apple.com/app/traccar-client/id843156974" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Apple className="h-5 w-5" />
              App Store (iOS)
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <a 
              href="https://play.google.com/store/apps/details?id=org.traccar.client" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Smartphone className="h-5 w-5" />
              Play Store (Android)
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* QR Code Setup Section */}
      <Card>
        <CardHeader>
          <CardTitle>Step 2: Scan Your QR Code</CardTitle>
          <CardDescription>
            Open Traccar Client → Menu → Scan QR Code, then scan the code for your name.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {participants.map((participant) => {
              const qrConfig = buildTraccarQrConfig(participant.name);
              return (
                <div 
                  key={participant.name}
                  className="flex flex-col items-center p-4 rounded-lg border bg-card"
                >
                  <h3 className="font-semibold text-lg mb-3">{participant.displayName}</h3>
                  <div className="bg-white p-3 rounded-lg">
                    <QRCodeSVG 
                      value={qrConfig}
                      size={140}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 gap-2 text-xs"
                    onClick={() => handleCopyUrl(getServerUrl(), participant.name)}
                  >
                    {copiedUrl === participant.name ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy URL
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Manual Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Step 3: Manual Configuration</CardTitle>
          <CardDescription>
            If the QR code doesn't work, configure these settings manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 text-sm">
            <div className="flex flex-col gap-1 py-2 border-b">
              <span className="text-muted-foreground">Device identifier</span>
              <span className="font-medium">Your name (Jonas, Nero, or Stan)</span>
            </div>
            <div className="flex flex-col gap-1 py-2 border-b">
              <span className="text-muted-foreground">Server URL</span>
              <code className="text-xs bg-muted p-2 rounded break-all">
                {getServerUrl()}
              </code>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 gap-2 w-fit"
                onClick={() => handleCopyUrl(getServerUrl(), "server")}
              >
                {copiedUrl === "server" ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy Server URL
                  </>
                )}
              </Button>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Location accuracy</span>
              <span className="font-medium">High</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Distance</span>
              <span className="font-medium">75-100 meters</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Offline buffering</span>
              <span className="font-medium">Enabled ✓</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enable Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Step 4: Enable Tracking</CardTitle>
          <CardDescription>
            Toggle the "Service status" switch ON when the trip starts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your location will be shared in real-time on the trip map. 
            You can disable tracking anytime by toggling the switch OFF.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tracking;
