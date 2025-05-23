import { Button } from '@/components/ui/button';
import { Download, Plus, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useEffect, useState } from 'react';

interface InstallPromptProps {
  variant?: 'button' | 'banner';
  className?: string;
}

const InstallPrompt = ({ variant = 'button', className = '' }: InstallPromptProps) => {
  const { 
    isInstallable, 
    isStandalone, 
    isIOS, 
    isMobile,
    showInstallPrompt,
    showIOSInstructions,
    showManualInstallInstructions
  } = usePWAInstall();

  const [showPrompt, setShowPrompt] = useState(!isStandalone);
  const [lastDismissed, setLastDismissed] = useState<number | null>(null);

  // Check if we should show prompt based on last dismissal time
  useEffect(() => {
    const checkShouldShow = () => {
      if (isStandalone) {
        setShowPrompt(false);
        return;
      }

      const dismissedTime = localStorage.getItem('installPromptDismissed');
      if (dismissedTime) {
        const elapsedMinutes = (Date.now() - parseInt(dismissedTime)) / (1000 * 60);
        setShowPrompt(elapsedMinutes >= 1); // Show after 1 minute
      } else {
        setShowPrompt(true);
      }
    };

    checkShouldShow();
    window.addEventListener('appinstalled', () => setShowPrompt(false));

    return () => {
      window.removeEventListener('appinstalled', () => setShowPrompt(false));
    };
  }, [isStandalone]);

  // Track user activity to reset timer
  useEffect(() => {
    if (!showPrompt && !isStandalone) {
      const activityHandler = () => {
        const dismissedTime = localStorage.getItem('installPromptDismissed');
        if (dismissedTime && (Date.now() - parseInt(dismissedTime)) >= 60000) {
          setShowPrompt(true);
          document.removeEventListener('click', activityHandler);
          document.removeEventListener('scroll', activityHandler);
          document.removeEventListener('keydown', activityHandler);
        }
      };

      document.addEventListener('click', activityHandler);
      document.addEventListener('scroll', activityHandler);
      document.addEventListener('keydown', activityHandler);

      return () => {
        document.removeEventListener('click', activityHandler);
        document.removeEventListener('scroll', activityHandler);
        document.removeEventListener('keydown', activityHandler);
      };
    }
  }, [showPrompt, isStandalone]);

  const handleInstallClick = async () => {
    try {
      if (isInstallable) {
        const installed = await showInstallPrompt();
        if (installed) {
          setShowPrompt(false);
        }
      } else if (isIOS) {
        showIOSInstructions();
      } else {
        showManualInstallInstructions();
      }
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    const now = Date.now();
    setLastDismissed(now);
    localStorage.setItem('installPromptDismissed', now.toString());
  };

  if (!showPrompt) return null;

  if (variant === 'banner') {
    return (
      <div className={`bg-tailor-gold/10 border border-tailor-gold/20 rounded-lg p-4 relative ${className}`}>
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200/50 transition-colors"
          aria-label="Close install prompt"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
        <div className="flex items-center justify-between pr-6">
          <div>
            <h3 className="font-semibold text-tailor-navy text-blue-400">Install StitchScribe</h3>
            <p className="text-sm text-gray-400">
              Add to your home screen for quick access
            </p>
          </div>
          <Button 
            onClick={handleInstallClick} 
            size="sm" 
            className="bg-tailor-gold hover:bg-tailor-gold/90"
          >
            <Download className="h-4 w-4 mr-1" />
            Install
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      {/* <button 
        onClick={handleClose}
        className="absolute -top-2 -right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-100"
        aria-label="Close install prompt"
      >
        <X className="h-3 w-3 text-gray-500" />
      </button>
      <Button 
        onClick={handleInstallClick}
        size="sm"
        variant="outline"
        className={`border-tailor-gold text-tailor-gold hover:bg-tailor-gold hover:text-white ${className}`}
      >
        <Plus className="h-4 w-4 mr-1" />
        Install App
      </Button> */}
    </div>
  );
};

export default InstallPrompt;