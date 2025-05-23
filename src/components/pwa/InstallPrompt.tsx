
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

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

  // Don't show if already installed
  if (isStandalone) return null;

  const handleInstallClick = () => {
    if (isInstallable) {
      showInstallPrompt();
    } else if (isIOS) {
      showIOSInstructions();
    } else {
      showManualInstallInstructions();
    }
  };

  if (variant === 'banner') {
    return (
      <div className={`bg-tailor-gold/10 border border-tailor-gold/20 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-tailor-navy">Install StitchScribe</h3>
            <p className="text-sm text-gray-600">
              Add to your home screen for quick access
            </p>
          </div>
          <Button onClick={handleInstallClick} size="sm" className="bg-tailor-gold hover:bg-tailor-gold/90">
            <Download className="h-4 w-4 mr-1" />
            Install
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleInstallClick}
      size="sm"
      variant="outline"
      className={`border-tailor-gold text-tailor-gold hover:bg-tailor-gold hover:text-white ${className}`}
    >
      <Plus className="h-4 w-4 mr-1" />
      Install App
    </Button>
  );
};

export default InstallPrompt;
