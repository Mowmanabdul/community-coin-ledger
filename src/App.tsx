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
  // Check auth status directly from localStorage for each route
  const checkAuth = () => {
    return !!localStorage.getItem("cl_auth");
  };

  const checkOnboarding = () => {
    return !!localStorage.getItem("cl_onboarding_complete");
  };

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
              element={checkOnboarding() ? <Navigate to="/auth" /> : <Onboarding />} 
            />
            <Route 
              path="/auth" 
              element={checkAuth() ? <Navigate to="/customers" /> : <Auth />} 
            />
            <Route 
              path="/customers" 
              element={checkAuth() ? <Customers /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/customer/:id" 
              element={checkAuth() ? <CustomerDetails /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/add-customer" 
              element={checkAuth() ? <AddCustomer /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/customer/:id/add-transaction/:type" 
              element={checkAuth() ? <AddTransaction /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/dashboard" 
              element={checkAuth() ? <Dashboard /> : <Navigate to="/auth" />} 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
