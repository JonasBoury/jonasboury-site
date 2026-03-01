import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Resume from "./pages/Resume";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import Trip from "./pages/Trip";
import { TripLayout } from "./pages/trip/TripLayout";
import { PackingList } from "./pages/trip/PackingList";
import { Training } from "./pages/trip/Training";
import { Learning } from "./pages/trip/Learning";
import { Research } from "./pages/trip/Research";
import { Emergency } from "./pages/trip/Emergency";
import { ExpeditionGuide } from "./pages/trip/ExpeditionGuide";
import { Itinerary } from "./pages/trip/Itinerary";
import Tracking from "./pages/trip/Tracking";
import Huurder from "./pages/Huurder";
import HuurderDrongen from "./pages/HuurderDrongen";
import HuurderDePinte from "./pages/HuurderDePinte";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/huurder" element={<Huurder />} />
          <Route path="/huurder/drongen" element={<HuurderDrongen />} />
          <Route path="/huurder/de-pinte" element={<HuurderDePinte />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/trip/toerski-moelleux-club" element={<TripLayout />}>
            <Route index element={<Navigate to="itinerary" replace />} />
            <Route path="itinerary" element={<Itinerary />} />
            <Route path="packing" element={<PackingList />} />
            <Route path="training" element={<Training />} />
            <Route path="schedule" element={<Navigate to="/trip/toerski-moelleux-club/itinerary" replace />} />
            <Route path="learning" element={<Learning />} />
            <Route path="tracking" element={<Tracking />} />
            <Route path="emergency" element={<Emergency />} />
            <Route path="research" element={<Research />} />
            <Route path="guide" element={<ExpeditionGuide />} />
          </Route>
          <Route path="/trip/:slug" element={<Trip />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
