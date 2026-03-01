import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  User,
  ShieldCheck,
  Dog,
  CalendarCheck,
  Mail,
  Phone,
  CheckCircle2,
  Home,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import profilePicture from "@/assets/profile-picture.png";

const Section = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-10">
    <div className="flex items-center gap-3 mb-4">
      <Icon className="h-5 w-5 text-primary" />
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
    </div>
    {children}
  </section>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2.5 text-muted-foreground">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2.5">
        <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);


const previousHomePhotos = [
  { src: "/images/vorige-woning-veranda.jpg", label: "Veranda met lichtkoepel" },
  { src: "/images/vorige-woning-living.jpg", label: "Living en eetruimte" },
  { src: "/images/vorige-woning-bureau.jpg", label: "Thuiskantoor" },
  { src: "/images/vorige-woning-keuken.jpg", label: "Keuken" },
  { src: "/images/vorige-woning-slaapkamer.jpg", label: "Slaapkamer" },
  { src: "/images/vorige-woning-badkamer.jpg", label: "Badkamer" },
  { src: "/images/vorige-woning-inkom.jpg", label: "Inkomhal" },
  { src: "/images/vorige-woning-dressing.png", label: "Dressing" },
];

const PreviousHomeGallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {previousHomePhotos.map((photo, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(photo.src)}
            className="group relative overflow-hidden rounded-lg border border-border aspect-[4/3]"
          >
            <img
              src={photo.src}
              alt={photo.label}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
              <span className="text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {photo.label}
              </span>
            </div>
          </button>
        ))}
      </div>
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-1 bg-background border-border">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Vorige woning"
              className="w-full h-auto rounded"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const Huurder = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="fixed top-4 left-4 z-10">
        <Button variant="outline" size="sm" asChild>
          <Link to="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Terug naar jonasboury.com
          </Link>
        </Button>
      </div>

      <div className="mx-auto max-w-3xl px-6 md:px-12 py-16 md:py-24">
        {/* Header */}
        <header className="mb-12 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <Avatar className="h-28 w-28 md:h-36 md:w-36 border-2 border-border">
            <AvatarImage src={profilePicture} alt="Jonas Boury" />
            <AvatarFallback>JB</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Jonas Boury
            </h1>
            <p className="text-lg text-primary font-medium mb-1">
              Huurderprofiel
            </p>
            <p className="text-muted-foreground">
              Op zoek naar een thuis in de regio Gent
            </p>
          </div>
        </header>

        <Separator className="mb-10" />

        {/* Over mij */}
        <Section icon={User} title="Over mij">
          <div className="text-muted-foreground space-y-3">
            <p>
              33 jaar, burgerlijk ingenieur en ondernemer. Na een relatiebreuk op
              zoek naar een nieuwe thuis in de buitenrand van Gent. Voorlopig
              alleen, op middellange termijn mogelijk met partner.
            </p>
            <p>
              Ik bouw aan een fintech startup (Citizen Pay) vanuit Gent en doe
              daarnaast tech consulting. Ik werk voornamelijk vanuit huis: een
              rustige, gestructureerde werkstijl.
            </p>
          </div>
        </Section>

        {/* Waarom ik een goede huurder ben */}
        <Section icon={ShieldCheck} title="Waarom ik een goede huurder ben">
          <BulletList
            items={[
              "Voldoende liquide middelen uit eerdere ondernemingen (BloomUp, Yuso)",
              "Geen ambitie om op korte termijn eigen vastgoed te kopen: bewuste keuze, stabiele huurder op middellange termijn",
              "Bereid 6 maanden huur vooruit te betalen",
              "Heel zorgvuldig persoon, respecteert kwaliteitsafwerking",
              "Kan alles onderbouwen met bankafschriften en jaarrekeningen",
            ]}
          />
        </Section>

        {/* Lowie */}
        <Section icon={Dog} title="Lowie">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card className="overflow-hidden border-border">
              <img
                src="/images/lowie-2.jpg"
                alt="Lowie, Akita Inu"
                className="w-full h-56 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  Lowie, Akita Inu, 1,5 jaar oud
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-border">
              <img
                src="/images/hondenhok.jpg"
                alt="Zelfgemaakt hondenhok"
                className="w-full h-56 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  Zelfgemaakt hondenhok
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-border">
              <img
                src="/images/lowie-1.jpg"
                alt="Lowie als puppy"
                className="w-full h-56 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  Lowie als puppy
                </p>
              </CardContent>
            </Card>
          </div>
          <BulletList
            items={[
              "Akita Inu, 1,5 jaar oud",
              "Kalm, proper ras dat nooit blaft: geen overlast voor buren",
              "Gaat bijna altijd mee op stap, zelden alleen thuis",
              "Jonas voorziet zelf omheining, kennel en hondenhok op eigen kosten",
              "Bereid extra waarborg te voorzien",
            ]}
          />
        </Section>


        {/* Mijn vorige woning */}
        <Section icon={Home} title="Mijn vorige woning">
          <p className="text-muted-foreground mb-6">
            Een blik op mijn vorige woning in Antwerpen, die ik zelf heb
            gerenoveerd en onderhouden. Foto's zeggen meer dan woorden over hoe
            ik met een woning omga.
          </p>
          <PreviousHomeGallery />
        </Section>

        {/* Beschikbaarheid */}
        <Section icon={CalendarCheck} title="Beschikbaarheid">
          <BulletList
            items={[
              "Direct beschikbaar, kan huur laten ingaan vanaf maart 2026",
              "Geen opzegperiode",
            ]}
          />
        </Section>

        <Separator className="my-10" />

        {/* Contact */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Contact
          </h2>
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <p className="text-foreground font-medium text-lg">Jonas Boury</p>
            <a
              href="tel:+32479562881"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Phone className="h-4 w-4" />
              +32 479 56 28 81
            </a>
            <a
              href="mailto:jonas.boury@gmail.com"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
              jonas.boury@gmail.com
            </a>
          </div>
        </section>

        <div className="mt-16 text-center text-xs text-muted-foreground/50">
          jonasboury.com
        </div>
      </div>
    </div>
  );
};

export default Huurder;
