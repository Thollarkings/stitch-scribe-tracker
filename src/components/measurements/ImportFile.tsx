import { useRef } from 'react';
import { toast } from 'sonner';

interface ImportFileProps {
  onImport: (data: any[]) => Promise<boolean>;
}

const numericFields = [
  'serviceCharge', 'paidAmount', 'balance',
  'head', 'neck', 'shoulderToShoulder', 'chest', 'waist',
  'shoulderToNipple', 'shoulderToUnderbust', 'shoulderToWaist', 'nippleToNipple',
  'sleeveLength', 'roundSleeve', 'hip', 'halfLength', 'topLength', 'gownLength',
  'trouserWaist', 'crotch', 'trouserLength', 'thigh', 'waistToKnee', 'calf', 'ankle', 'insideLegSeam'
];

const parseNumberOrNull = (value: any) => {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
};

// Extract initial job data from a measurement or from the jobs array
const extractInitialJobData = (measurement: any) => {
  // First check if there's an initial job in the jobs array
  if (Array.isArray(measurement.jobs) && measurement.jobs.length > 0) {
    const initialJob = measurement.jobs.find((job: any) => job.label === 'Initial Job');
    if (initialJob) {
      // Copy data from initial job to measurement
      return {
        ...measurement,
        serviceCharge: initialJob.serviceCharge,
        paidAmount: initialJob.paidAmount,
        balance: initialJob.balance,
        collectionDate: initialJob.collectionDate || measurement.collectionDate,
        collectionDateType: initialJob.collectionDateType || 'estimated'
      };
    }
  }
  
  // If no initial job was found in the array, keep the existing data
  return measurement;
};

const ImportFile = ({ onImport }: ImportFileProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const result = e.target?.result;
        if (typeof result !== 'string') return;

        let importedData = JSON.parse(result);

        if (Array.isArray(importedData)) {
          importedData = importedData.map((measurement) => {
            const obj: any = { ...measurement };

            // Normalize comments/notes
            if (!obj.comments && obj.notes) obj.comments = obj.notes;

            // Process initial job data if available
            obj = extractInitialJobData(obj);

            // Parse numeric fields, preserving nulls
            numericFields.forEach(field => {
              obj[field] = parseNumberOrNull(obj[field]);
            });

            // Ensure balance is present and correct
            if (
              typeof obj.serviceCharge === 'number' &&
              typeof obj.paidAmount === 'number'
            ) {
              obj.balance = obj.serviceCharge - obj.paidAmount;
            } else {
              obj.balance = 0;
            }

            // If jobs array exists, normalize numeric fields inside jobs too
            if (Array.isArray(obj.jobs)) {
              obj.jobs = obj.jobs.map((job: any) => {
                const jobCopy = { ...job };
                numericFields.forEach(field => {
                  jobCopy[field] = parseNumberOrNull(jobCopy[field]);
                });
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
            }

            return obj;
          });

          // (Optional) Log for debugging
          console.log('Normalized import data:', importedData);

          const success = await onImport(importedData);
          if (success) {
            toast.success('Data imported successfully!');
          } else {
            toast.error('Import failed. Please try again.');
          }
        } else {
          toast.error('Invalid JSON file. Please ensure it contains an array of measurements.');
        }
      } catch (error: any) {
        console.error("Error parsing import file:", error);
        toast.error(`Failed to import data: ${error.message || "Please check the file format."}`);
      }
    };
    reader.readAsText(file);

    // Reset the file input so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <>
      <input 
        type="file"
        ref={fileInputRef}
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />
      <button 
        onClick={handleImportClick} 
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        aria-label="Import data"
        type="button"
      >
        Import Data
      </button>
    </>
  );
};

export default ImportFile;
