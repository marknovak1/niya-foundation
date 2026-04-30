import { Analytics } from '@vercel/analytics/react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookieConsent } from "@/components/CookieConsent";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/i18n";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import GetInvolved from "./pages/GetInvolved";
import Membership from "./pages/Membership";
import Surveys from "./pages/Surveys";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Ethics from "./pages/Ethics";
import Cookies from "./pages/Cookies";
import Reports from "./pages/Reports";
import News from "./pages/News";
import MemberLogin from "./pages/MemberLogin";
import MemberDashboard from "./pages/MemberDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";
import TrainingDocuments from "./pages/TrainingDocuments";
import BusinessListings from "./pages/BusinessListings";
import DevenirMembre from "./pages/DevenirMembre";
import QRLanding from "./pages/QRLanding";
import ResetPassword from "./pages/ResetPassword";
import CreateListing from "./pages/CreateListing";
import MemberListings from "./pages/MemberListings";
import BusinessListingDetail from "./pages/BusinessListingDetail";
import EditListing from "./pages/EditListing";

const queryClient = new QueryClient();

// App component with providers
const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename="/">
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/get-involved" element={<GetInvolved />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/surveys" element={<Surveys />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/ethics" element={<Ethics />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/news" element={<News />} />
              <Route path="/events" element={<Events />} />
              <Route path="/member/login" element={<MemberLogin />} />
              <Route path="/member" element={<MemberDashboard />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/training" element={<TrainingDocuments />} />
              <Route path="/businesses" element={<BusinessListings />} />
              <Route path="/devenir-membre" element={<DevenirMembre />} />
              <Route path="/qr" element={<QRLanding />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/member/listings" element={<MemberListings />} />
              <Route path="/member/listings/new" element={<CreateListing />} />
              <Route path="/businesses/:id" element={<BusinessListingDetail />} />
              <Route path="/member/listings/edit/:id" element={<EditListing />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieConsent />
            <NewsletterPopup />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
    <Analytics />
  </QueryClientProvider>
);

export default App;