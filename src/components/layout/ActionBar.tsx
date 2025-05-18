
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Download } from 'lucide-react';

interface ActionBarProps {
  onExport: () => void;
  onImportClick: () => void;
}

const ActionBar = ({ onExport, onImportClick }: ActionBarProps) => {
  return (
    <div className="bg-white border-b flex justify-between items-center p-4">
      <h1 className="text-xl md:text-2xl font-semibold font-serif">Client Records</h1>

      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-1.5"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center gap-1.5"
          onClick={onImportClick}
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Import</span>
        </Button>
      </div>
    </div>
  );
};

export default ActionBar;
