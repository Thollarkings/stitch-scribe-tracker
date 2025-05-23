
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasShownPrompt, setHasShownPrompt] = useState(false);

  // Device detection
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                            (window.navigator as any).standalone === true;

    setIsIOS(isIOSDevice);
    setIsMobile(isMobileDevice);
    setIsStandalone(isStandaloneMode);

    console.log('Device detection:', { 
      isIOSDevice, 
      isMobileDevice, 
      isStandaloneMode,
      userAgent: userAgent.substring(0, 50) + '...'
    });
  }, []);

  // Handle beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setDeferredPrompt(null);
      setIsInstallable(false);
      toast.success('App installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Auto-prompt logic
  useEffect(() => {
    if (!hasShownPrompt && !isStandalone && isMobile) {
      console.log('Checking if we should show install prompt');
      
      // For Android devices with deferredPrompt
      if (deferredPrompt && !isIOS) {
        console.log('Showing Android install prompt');
        setTimeout(() => {
          showInstallPrompt();
        }, 2000); // 2 second delay
      }
      // For iOS devices
      else if (isIOS) {
        console.log('Showing iOS install instructions');
        setTimeout(() => {
          showIOSInstructions();
        }, 3000); // 3 second delay for iOS
      }
      // For other mobile browsers that might support PWA
      else if (isMobile) {
        console.log('Mobile device detected, waiting for beforeinstallprompt');
        // Set a timeout to show iOS-style instructions if no prompt appears
        setTimeout(() => {
          if (!deferredPrompt && !hasShownPrompt) {
            console.log('No native prompt available, showing manual instructions');
            showManualInstallInstructions();
          }
        }, 5000);
      }
    }
  }, [deferredPrompt, isStandalone, isMobile, isIOS, hasShownPrompt]);

  const showInstallPrompt = useCallback(async () => {
    if (!deferredPrompt) return false;

    setHasShownPrompt(true);
    
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('User choice:', outcome);
      
      if (outcome === 'accepted') {
        toast.success('Thanks for installing StitchScribe!');
      } else {
        toast('You can install the app anytime from your browser menu', {
          duration: 5000,
        });
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
      return outcome === 'accepted';
    } catch (error) {
      console.error('Error showing install prompt:', error);
      return false;
    }
  }, [deferredPrompt]);

  const showIOSInstructions = useCallback(() => {
    setHasShownPrompt(true);
    toast('Install StitchScribe App', {
      description: 'Tap the Share button, then "Add to Home Screen" to install',
      duration: 10000,
      action: {
        label: 'Got it',
        onClick: () => {
          console.log('iOS instructions acknowledged');
        },
      },
    });
  }, []);

  const showManualInstallInstructions = useCallback(() => {
    setHasShownPrompt(true);
    toast('Install StitchScribe App', {
      description: 'Look for "Add to Home Screen" or "Install" in your browser menu',
      duration: 8000,
      action: {
        label: 'Understood',
        onClick: () => {
          console.log('Manual instructions acknowledged');
        },
      },
    });
  }, []);

  return {
    isInstallable,
    isStandalone,
    isIOS,
    isMobile,
    deferredPrompt,
    showInstallPrompt,
    showIOSInstructions,
    showManualInstallInstructions,
    hasShownPrompt,
  };
};
