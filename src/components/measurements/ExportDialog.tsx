
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

// List of all possible numeric fields
const numericFields = [
  'serviceCharge', 'paidAmount', 'balance',
  'head', 'neck', 'shoulderToShoulder', 'chest', 'waist',
  'shoulderToNipple', 'shoulderToUnderbust', 'shoulderToWaist', 'nippleToNipple',
  'sleeveLength', 'roundSleeve', 'hip', 'halfLength', 'topLength', 'gownLength',
  'trouserWaist', 'crotch', 'trouserLength', 'thigh', 'waistToKnee', 'calf', 'ankle', 'insideLegSeam'
];

// Helper to ensure all numeric fields are numbers or null
const parseNumberOrNull = (value: any) => {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
};

// Create an initial job object from measurement data
const createInitialJob = (measurement: any) => {
  // Only create if we have at least one of these fields
  if (measurement.serviceCharge || measurement.paidAmount || measurement.collectionDate) {
    return {
      description: measurement.description || '', // Include job description
      serviceCharge: parseNumberOrNull(measurement.serviceCharge) || 0,
      paidAmount: parseNumberOrNull(measurement.paidAmount) || 0,
      balance: parseNumberOrNull(measurement.balance) || 0,
      collectionDateType: measurement.collectionDateType || 'estimated',
      serviceChargeCurrency: 'NGN',
      clientId: measurement.id,
      clientName: measurement.name,
      timestamp: measurement.timestamp,
      collectionDate: measurement.collectionDate,
      recordedDateTime: measurement.timestamp,
      label: 'Initial Job'
    };
  }
  return null;
};

const ExportDialog = ({ open, onOpenChange, measurements }: ExportDialogProps) => {
  const [exportFilename, setExportFilename] = useState('tailors_logbook_export');

  const downloadExportedData = (customFilename?: string) => {
    try {
      const filename = (customFilename || 'tailors_logbook_export').replace(/[^a-zA-Z0-9-_]/g, '_');

      // Normalize all measurements for export
      const exportData = measurements.map(m => {
        // Ensure all numeric fields are numbers or null
        const normalized: any = { ...m };

        numericFields.forEach(field => {
          normalized[field] = parseNumberOrNull(normalized[field]);
        });

        // Handle jobs array
        let jobsArray: any[] = [];
        
        // First, add the initial job if it doesn't exist in jobs
        const initialJob = createInitialJob(m);
        
        // Process existing jobs
        if (Array.isArray(m.jobs) && m.jobs.length > 0) {
          // Check if any job has label 'Initial Job'
          const hasInitialJob = m.jobs.some((job: any) => job.label === 'Initial Job');
          
          // Normalize jobs
          jobsArray = m.jobs.map((job: any) => {
            const jobCopy: any = { ...job };
            // Preserve description field
            jobCopy.description = job.description || '';
            
            numericFields.forEach(field => {
              jobCopy[field] = parseNumberOrNull(jobCopy[field]);
            });
            // Ensure balance in job
            if (
              typeof jobCopy.serviceCharge === 'number' &&
              typeof jobCopy.paidAmount === 'number'
            ) {
              jobCopy.balance = jobCopy.serviceCharge - jobCopy.paidAmount;
            } else {
              jobCopy.balance = 0;
            }
            return jobCopy;
          });
          
          // Add initial job at the beginning if it doesn't exist and is valid
          if (!hasInitialJob && initialJob) {
            jobsArray.unshift(initialJob);
          }
        } else if (initialJob) {
          // If there are no jobs but we have initial job data, add it
          jobsArray = [initialJob];
        }
        
        // Set the processed jobs array
        normalized.jobs = jobsArray.length > 0 ? jobsArray : null;

        // Always include comments (fallback to notes)
        normalized.comments = normalized.comments || normalized.notes || null;

        return normalized;
      });

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

  const handleExportConfirm = () => {
    downloadExportedData(exportFilename);
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
