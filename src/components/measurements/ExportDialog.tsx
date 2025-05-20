
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  measurements: any[];
}

const ExportDialog = ({ open, onOpenChange, measurements }: ExportDialogProps) => {
  const [exportFilename, setExportFilename] = useState('tailors_logbook_export');

  const handleExportConfirm = () => {
    downloadExportedData(exportFilename);
  };

  const downloadExportedData = (customFilename?: string) => {
    try {
      const filename = (customFilename || 'tailors_logbook_export').replace(/[^a-zA-Z0-9-_]/g, '_');
      
      // Format the data for export to match the expected format
      const exportData = measurements.map(m => ({
        name: m.name,
        phone: m.phone,
        head: m.head,
        neck: m.neck,
        shoulderToShoulder: m.shoulderToShoulder,
        chest: m.chest,
        waist: m.waist,
        shoulderToNipple: m.shoulderToNipple,
        shoulderToUnderbust: m.shoulderToUnderbust,
        shoulderToWaist: m.shoulderToWaist,
        nippleToNipple: m.nippleToNipple,
        sleeveLength: m.sleeve_length,
        roundSleeve: m.roundSleeve,
        hip: m.hip,
        halfLength: m.halfLength,
        topLength: m.topLength,
        gownLength: m.gownLength,
        trouserWaist: m.trouserWaist,
        crotch: m.crotch,
        trouserLength: m.trouserLength,
        thigh: m.thigh,
        waistToKnee: m.waistToKnee,
        calf: m.calf,
        ankle: m.ankle,
        insideLegSeam: m.insideLegSeam,
        comments: m.notes,
        timestamp: m.timestamp,
        collectionDate: m.collectionDate,
        collectionDateType: m.collectionDateType
      }));
      
      const jsonStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = url;
      downloadAnchor.download = `${filename}.json`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);

      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      toast.success("Data exported successfully");
      
      // Mobile-specific guidance toast
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        toast.info("File saved to your device's Downloads folder. If you can't find it, check your Files app or Downloads folder.");
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Measurements</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="filename" className="text-sm font-medium">Filename</label>
            <Input
              id="filename"
              type="text"
              value={exportFilename}
              onChange={(e) => setExportFilename(e.target.value)}
              placeholder="Enter filename..."
            />
            <span className="text-xs text-muted-foreground">.json will be added automatically</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleExportConfirm}>Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
