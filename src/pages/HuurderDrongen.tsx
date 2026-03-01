import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Bike,
  Train,
  Car,
  Footprints,
  Mail,
  Phone,
  CheckCircle2,
  Home,
  Building2,
  TreePine,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ""; //

const PROPERTY: [number, number] = [3.66, 51.065];

interface Destination {
  id: string;
  name: string;
  label: string;
  coords: [number, number];
  mode: "cycling" | "driving" | "walking";
  modeLabel: string;
  color: string;
  icon: React.ElementType;
  note?: string;
  isStraightLine?: boolean;
}

const destinations: Destination[] = [
  {
    id: "wintercircus",
    name: "Wintercircus Gent",
    label: "Citizen Pay HQ",
    coords: [3.7246, 51.0544],
    mode: "cycling",
    modeLabel: "Fiets",
    color: "#3b82f6",
    icon: Building2,
  },
  {
    id: "walden",
    name: "Klimzaal Walden",
    label: "Boulderen",
    coords: [3.7105, 51.0435],
    mode: "cycling",
    modeLabel: "Fiets",
    color: "#10b981",
    icon: MapPin,
  },
  {
    id: "bleau",
    name: "Klimzaal Bleau",
    label: "Lead & boulderen",
    coords: [3.6935, 51.0395],
    mode: "cycling",
    modeLabel: "Fiets",
    color: "#8b5cf6",
    icon: MapPin,
  },
  {
    id: "brussel",
    name: "Brussel Centraal",
    label: "Via Drongen station",
    coords: [4.3571, 50.8455],
    mode: "driving",
    modeLabel: "Trein",
    color: "#f59e0b",
    icon: Train,
    note: "~45 min per trein",
    isStraightLine: true,
  },
  {
    id: "waregem",
    name: "Waregem",
    label: "Via E40",
    coords: [3.4275, 50.8850],
    mode: "driving",
    modeLabel: "Auto",
    color: "#ef4444",
    icon: Car,
  },
  {
    id: "leie",
    name: "Leiestreek",
    label: "Dagelijkse wandeling met Lowie",
    coords: [3.645, 51.060],
    mode: "walking",
    modeLabel: "Te voet",
    color: "#06b6d4",
    icon: Footprints,
  },
];

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

interface RouteData {
  geometry: GeoJSON.LineString;
  distance: number;
  duration: number;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}u${m}` : `${h}u`;
}

const ModeIcon = ({ dest }: { dest: Destination }) => {
  if (dest.mode === "cycling") return <Bike className="h-4 w-4" />;
  if (dest.mode === "walking") return <Footprints className="h-4 w-4" />;
  if (dest.id === "brussel") return <Train className="h-4 w-4" />;
  return <Car className="h-4 w-4" />;
};

const HuurderDrongen = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [routes, setRoutes] = useState<Record<string, RouteData>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const fetchRoute = useCallback(
    async (dest: Destination): Promise<RouteData | null> => {
      if (dest.isStraightLine) {
        const drongenStation: [number, number] = [3.6575, 51.0545];
        return {
          geometry: {
            type: "LineString",
            coordinates: [drongenStation, dest.coords],
          },
          distance: 55000,
          duration: 2700,
        };
      }
      try {
        const coords = `${PROPERTY[0]},${PROPERTY[1]};${dest.coords[0]},${dest.coords[1]}`;
        const url = `https://api.mapbox.com/directions/v5/mapbox/${dest.mode}/${coords}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          return {
            geometry: route.geometry,
            distance: route.distance,
            duration: route.duration,
          };
        }
      } catch (e) {
        console.error("Route fetch failed for", dest.id, e);
      }
      return null;
    },
    []
  );

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [3.68, 51.05],
      zoom: 11.5,
    });

    m.addControl(new mapboxgl.NavigationControl(), "top-right");

    m.on("load", () => {
      setMapLoaded(true);

      // Property marker
      const homeEl = document.createElement("div");
      homeEl.innerHTML = '<div style="background:#1d4ed8;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:3px solid white;font-size:18px;">&#127968;</div>';
      new mapboxgl.Marker({ element: homeEl })
        .setLngLat(PROPERTY)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML("<strong>Woning Drongen</strong>"))
        .addTo(m);

      // Destination markers
      destinations.forEach((dest) => {
        const el = document.createElement("div");
        el.innerHTML = `<div style="background:${dest.color};color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.25);border:2px solid white;font-size:12px;font-weight:bold;cursor:pointer;">${dest.name.charAt(0)}</div>`;
        el.style.cursor = "pointer";
        el.addEventListener("click", () => {
          setActiveId((prev) => (prev === dest.id ? null : dest.id));
        });
        new mapboxgl.Marker({ element: el })
          .setLngLat(dest.coords)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<strong>${dest.name}</strong><br/><span style="color:#666">${dest.label}</span>`
            )
          )
          .addTo(m);
      });
    });

    map.current = m;

    return () => {
      m.remove();
      map.current = null;
    };
  }, []);

  // Fetch all routes once map is loaded
  useEffect(() => {
    if (!mapLoaded) return;
    const fetchAll = async () => {
      const results: Record<string, RouteData> = {};
      for (const dest of destinations) {
        const route = await fetchRoute(dest);
        if (route) results[dest.id] = route;
      }
      setRoutes(results);
    };
    fetchAll();
  }, [mapLoaded, fetchRoute]);

  // Draw routes on map
  useEffect(() => {
    const m = map.current;
    if (!m || !mapLoaded || Object.keys(routes).length === 0) return;

    destinations.forEach((dest) => {
      const route = routes[dest.id];
      if (!route) return;

      const sourceId = `route-${dest.id}`;
      const layerId = `route-layer-${dest.id}`;

      if (m.getSource(sourceId)) {
        (m.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
          type: "Feature",
          properties: {},
          geometry: route.geometry,
        });
      } else {
        m.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: route.geometry,
          },
        });

        const paintProps: Record<string, unknown> = {
          "line-color": dest.color,
          "line-width": activeId === null || activeId === dest.id ? 4 : 2,
          "line-opacity": activeId === null || activeId === dest.id ? 0.85 : 0.25,
        };
        if (dest.isStraightLine) {
          paintProps["line-dasharray"] = [2, 2];
        }

        m.addLayer({
          id: layerId,
          type: "line",
          source: sourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: paintProps as mapboxgl.LinePaint,
        });
      }
    });
  }, [routes, mapLoaded, activeId]);

  // Update route opacity on active change
  useEffect(() => {
    const m = map.current;
    if (!m || !mapLoaded) return;

    destinations.forEach((dest) => {
      const layerId = `route-layer-${dest.id}`;
      if (!m.getLayer(layerId)) return;
      const isActive = activeId === null || activeId === dest.id;
      m.setPaintProperty(layerId, "line-opacity", isActive ? 0.85 : 0.2);
      m.setPaintProperty(layerId, "line-width", isActive ? 4 : 2);
    });

    if (activeId) {
      const dest = destinations.find((d) => d.id === activeId);
      if (dest) {
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(PROPERTY);
        bounds.extend(dest.coords);
        m.fitBounds(bounds, { padding: 80, duration: 800 });
      }
    } else {
      m.flyTo({ center: [3.68, 51.05], zoom: 11.5, duration: 800 });
    }
  }, [activeId, mapLoaded]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="fixed top-4 left-4 z-20">
        <Button variant="outline" size="sm" asChild>
          <Link to="/huurder" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Terug naar huurderprofiel
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="mx-auto max-w-5xl px-6 md:px-12 pt-16 md:pt-24 pb-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Kandidatuur: Woning Drongen
          </h1>
          <p className="text-muted-foreground">
            Nabij station Drongen, Gent
          </p>
        </header>
        <Separator className="mb-8" />
      </div>

      {/* Map + Sidebar */}
      <div className="mx-auto max-w-6xl px-4 md:px-8 mb-12">
        <div className="flex flex-col lg:flex-row gap-0 rounded-xl overflow-hidden border border-border shadow-sm">
          {/* Map */}
          <div className="w-full lg:flex-1 h-[400px] lg:h-[520px]" ref={mapContainer} />

          {/* Sidebar */}
          <div className="w-full lg:w-80 bg-card border-t lg:border-t-0 lg:border-l border-border p-4 overflow-y-auto max-h-[520px]">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Bestemmingen
            </h3>
            <div className="space-y-1">
              {destinations.map((dest) => {
                const route = routes[dest.id];
                const isActive = activeId === dest.id;
                return (
                  <button
                    key={dest.id}
                    onClick={() =>
                      setActiveId((prev) =>
                        prev === dest.id ? null : dest.id
                      )
                    }
                    className={`w-full text-left px-3 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-accent ring-1 ring-primary/20"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: dest.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {dest.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {dest.label}
                        </p>
                      </div>
                    </div>
                    {route && (
                      <div className="flex items-center gap-3 mt-1.5 ml-6 text-xs text-muted-foreground">
                        <ModeIcon dest={dest} />
                        <span>
                          {dest.note
                            ? dest.note
                            : `${formatDistance(route.distance)}, ${formatDuration(route.duration)}`}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {activeId && (
              <button
                onClick={() => setActiveId(null)}
                className="mt-3 text-xs text-primary hover:underline"
              >
                Toon alle routes
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="mx-auto max-w-3xl px-6 md:px-12 pb-16">
        <Section icon={MapPin} title="Waarom Drongen ideaal is">
          <div className="text-muted-foreground space-y-3">
            <p>
              Drongen combineert het beste van twee werelden: de rust van het
              platteland met directe toegang tot Gent centrum. Het station van
              Drongen biedt een rechtstreekse verbinding naar Brussel in 45
              minuten, en via de E40 is zowel de kust als Waregem snel
              bereikbaar.
            </p>
            <p>
              Voor mijn dagelijks werk bij Citizen Pay fiets ik in 20 minuten
              naar het Wintercircus. De Leiestreek biedt perfecte
              wandelmogelijkheden met Lowie, en twee klimzalen liggen op
              fietsafstand.
            </p>
          </div>
        </Section>

        <Section icon={Home} title="De woning">
          <BulletList
            items={[
              "Recente renovatie met kwaliteitsafwerking",
              "Bureau op het gelijkvloers: ideaal voor thuiswerk",
              "Tuin voor Lowie (omheining op eigen kosten)",
              "Nabij station Drongen: vlot openbaar vervoer",
              "Rustige buurt, perfecte uitvalsbasis",
            ]}
          />
        </Section>

        <Section icon={TreePine} title="Levensstijl in Drongen">
          <BulletList
            items={[
              "Dagelijkse wandelingen langs de Leie met Lowie",
              "Fietsen naar Wintercircus, Walden en Bleau",
              "Weekends naar de kust of Waregem via E40",
              "Rustige thuiswerker, gestructureerde werkstijl",
            ]}
          />
        </Section>

        <Separator className="my-10" />

        {/* Footer */}
        <section className="text-center">
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link to="/huurder" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Bekijk volledig huurderprofiel
              </Link>
            </Button>
          </div>
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

export default HuurderDrongen;
