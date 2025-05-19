
import MeasurementCard from './MeasurementCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Search } from 'lucide-react';

interface MeasurementsListProps {
  measurements: any[];
  onDelete: (index: number) => void;
  handleEdit: (index: number) => void;
  searchTerm: string;
}

const MeasurementsList = ({ measurements, onDelete, handleEdit, searchTerm }: MeasurementsListProps) => {
  if (measurements.length === 0) {
    return (
      <Alert className="mt-6 bg-muted/50 border-dashed">
        <Search className="h-4 w-4" />
        <AlertTitle>No measurements found</AlertTitle>
        <AlertDescription>
          {searchTerm 
            ? `No clients match the search term "${searchTerm}". Try a different search.` 
            : "Add your first client using the 'New Client' button."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 mt-4 bg-purple-50 p-4 rounded-lg">
      {measurements.map((measurement, index) => (
        <MeasurementCard
          key={index}
          measurement={measurement}
          index={index}
          onDelete={onDelete}
          handleEdit={handleEdit}
        />
      ))}
    </div>
  );
};

export default MeasurementsList;
