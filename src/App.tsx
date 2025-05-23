
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Invoice from "./pages/Invoice";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { usePWAInstall } from "./hooks/usePWAInstall";

const queryClient = new QueryClient();

const PWAHandler = () => {
  const { isStandalone, isMobile } = usePWAInstall();
  
  useEffect(() => {
    console.log('PWA Status:', { isStandalone, isMobile });
  }, [isStandalone, isMobile]);

  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <PWAHandler />
          <Toaster />
          <Sonner />
          <BrowserRouter basename="/stitch-scribe-tracker">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/invoice/:id" element={
                <ProtectedRoute>
                  <Invoice />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
