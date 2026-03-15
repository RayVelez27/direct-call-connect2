import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import IndexArchive from "./pages/IndexArchive";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";
import OnboardingIdentity from "./pages/OnboardingIdentity";
import OnboardingPayouts from "./pages/OnboardingPayouts";
import CreateService from "./pages/CreateService";
import Explore from "./pages/Explore";
import HowItWorks from "./pages/HowItWorks";
import ServicePost from "./pages/ServicePost";
import UserDashboard from "./pages/UserDashboard";
import CreatorDashboard from "./pages/CreatorDashboard";
import AdminPortal from "./pages/AdminPortal";
import Discovery from "./pages/Discovery";
import TermsAndPolicies from "./pages/TermsAndPolicies";
import TrustAndSafety from "./pages/TrustAndSafety";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Discovery />} />
          <Route path="/home" element={<Index />} />
          <Route path="/home-archive" element={<IndexArchive />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding-identity" element={<OnboardingIdentity />} />
          <Route path="/onboarding-payouts" element={<OnboardingPayouts />} />
          <Route path="/create-service" element={<CreateService />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/service-post" element={<ServicePost />} />
          <Route path="/dashboard/user" element={<UserDashboard />} />
          <Route path="/dashboard/creator" element={<CreatorDashboard />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/terms" element={<TermsAndPolicies />} />
          <Route path="/trust-and-safety" element={<TrustAndSafety />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
