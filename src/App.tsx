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
import { toast } from "sonner";

const queryClient = new QueryClient();

const App = () => {
  const [promptShown, setPromptShown] = useState(false);

  // Function to show the install prompt toast
  const showInstallPromotion = () => {
    if ((window as any).deferredPrompt) {
      setPromptShown(true);
      toast.info('Install StitchScribe for better experience', {
        action: {
          label: 'Install',
          onClick: () => promptInstall(),
        },
        duration: 20000,
        position: 'bottom-center'
      });
    }
  };

  // Function to trigger the install prompt
  const promptInstall = () => {
    const promptEvent = (window as any).deferredPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          toast.success('App installed successfully!');
        } else {
          toast('You can always install later from your browser menu');
        }
        (window as any).deferredPrompt = null;
      });
    }
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;

      // Show install prompt after 30 seconds if not shown yet
      setTimeout(() => {
        if (!promptShown) {
          showInstallPromotion();
        }
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [promptShown]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
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
