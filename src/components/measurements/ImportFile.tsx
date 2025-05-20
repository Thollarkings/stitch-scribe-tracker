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

const ImportFile = ({ onImport }: ImportFileProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
          // Normalize all numeric fields and comments
          importedData = importedData.map((m) => {
            const obj: any = { ...m };
            // Normalize comments/notes
            if (!obj.comments && obj.notes) obj.comments = obj.notes;

            // Normalize numeric fields
            numericFields.forEach(field => {
              if (obj[field] !== undefined && obj[field] !== null && obj[field] !== '') {
                obj[field] = Number(obj[field]);
              }
            });

            // Ensure balance is present and correct
            if (
              (typeof obj.serviceCharge === 'number' || typeof obj.serviceCharge === 'string') &&
              (typeof obj.paidAmount === 'number' || typeof obj.paidAmount === 'string')
            ) {
              obj.balance =
                typeof obj.balance === 'number'
                  ? obj.balance
                  : Number(obj.serviceCharge) - Number(obj.paidAmount);
            } else {
              obj.balance = 0;
            }

            return obj;
          });

          await onImport(importedData);
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
        className="hidden"
        aria-label="Import data"
      />
    </>
  );
};

export default ImportFile;
