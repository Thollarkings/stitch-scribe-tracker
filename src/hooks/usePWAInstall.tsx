import { useState, useEffect } from 'react';

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode
    const checkStandalone = () => {
      return window.matchMedia('(display-mode: standalone)').matches || 
             ('standalone' in window.navigator && (window.navigator as any).standalone);
    };

    // Check device type
    const checkDevice = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(userAgent));
      setIsMobile(/android|iphone|ipad|ipod/.test(userAgent));
    };

    setIsStandalone(checkStandalone());
    checkDevice();

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const showInstallPrompt = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      return outcome === 'accepted';
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    }
  };

  const showIOSInstructions = () => {
    alert('To install this app on iOS, tap the Share button and select "Add to Home Screen".');
  };

  const showManualInstallInstructions = () => {
    alert('Your browser doesn\'t support direct installation. Please check your browser settings to add this app to your home screen.');
  };

  return {
    isInstallable,
    isStandalone,
    isIOS,
    isMobile,
    showInstallPrompt,
    showIOSInstructions,
    showManualInstallInstructions
  };
};

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}