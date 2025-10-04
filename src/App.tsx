import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import AddCustomer from "./pages/AddCustomer";
import AddTransaction from "./pages/AddTransaction";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication and onboarding status
    const authData = localStorage.getItem("cl_auth");
    const onboardingComplete = localStorage.getItem("cl_onboarding_complete");
    
    setIsAuthenticated(!!authData);
    setHasSeenOnboarding(!!onboardingComplete);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/onboarding" 
              element={hasSeenOnboarding ? <Navigate to="/auth" /> : <Onboarding />} 
            />
            <Route 
              path="/auth" 
              element={isAuthenticated ? <Navigate to="/customers" /> : <Auth />} 
            />
            <Route 
              path="/customers" 
              element={isAuthenticated ? <Customers /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/customer/:id" 
              element={isAuthenticated ? <CustomerDetails /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/add-customer" 
              element={isAuthenticated ? <AddCustomer /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/customer/:id/add-transaction/:type" 
              element={isAuthenticated ? <AddTransaction /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
