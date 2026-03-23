import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BrowseMentors from "./pages/BrowseMentors";
import MentorProfile from "./pages/MentorProfile";
import MentorDashboard from "./pages/MentorDashboard";
import LearnerDashboard from "./pages/LearnerDashboard";
import HowItWorksPage from "./pages/HowItWorks";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mentors" element={<BrowseMentors />} />
          <Route path="/mentor/:id" element={<MentorProfile />} />
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />
          <Route path="/dashboard" element={<LearnerDashboard />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
