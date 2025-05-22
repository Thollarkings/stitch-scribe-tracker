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
          importedData = importedData.map((m) => {
            const obj: any = { ...m };

            // Normalize comments/notes
            if (!obj.comments && obj.notes) obj.comments = obj.notes;

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
                numericFields.forEach(field => {
                  job[field] = parseNumberOrNull(job[field]);
                });
                if (
                  typeof job.serviceCharge === 'number' &&
                  typeof job.paidAmount === 'number'
                ) {
                  job.balance = job.serviceCharge - job.paidAmount;
                } else {
                  job.balance = 0;
                }
                return job;
              });
            }

            return obj;
          });

          // (Optional) Log for debugging
          // console.log('Normalized import:', importedData);

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
