
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Download } from 'lucide-react';

interface ActionBarProps {
  onExport: () => void;
  onImportClick: () => void;
}

const ActionBar = ({ onExport, onImportClick }: ActionBarProps) => {
  return (
    <div className="bg-gradient-to-r from-gray-300 via-white to-gray-300 border-b flex justify-between items-center p-4 rounded-lg">
      <h1 className="text-xl md:text-2xl font-bold font-serif">Client Records</h1>

      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-1.5 bg-red-200"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          <span className="block">Export</span>
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center gap-1.5 bg-blue-200"
          onClick={onImportClick}
        >
          <Upload className="h-4 w-4" />
          <span className="block">Import</span>
        </Button>
      </div>
    </div>
  );
};

export default ActionBar;
