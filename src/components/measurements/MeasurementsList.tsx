
import React from 'react';
import MeasurementCard from './MeasurementCard';
import { Loader2 } from 'lucide-react';

interface MeasurementsListProps {
  measurements: any[];
  searchTerm: string;
  isLoading: boolean;
  onDelete: (index: number) => void;
  handleEdit: (index: number) => void;
  onAddJob: (clientId: string, jobData: any) => Promise<void>;
  onUpdateMeasurement?: (updatedMeasurement: any) => void;
}

const MeasurementsList: React.FC<MeasurementsListProps> = ({
  measurements,
  searchTerm,
  isLoading,
  onDelete,
  handleEdit,
  onAddJob,
  onUpdateMeasurement
}) => {
  // Display loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  // Display empty state
  if (measurements.length === 0) {
    // If search term exists, show no results message
    if (searchTerm) {
      return (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No results found</h3>
          <p className="text-muted-foreground">
            No measurements match your search term.
          </p>
        </div>
      );
    }
    
    // If no search term, show empty state
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No measurements yet</h3>
        <p className="text-muted-foreground">
          Click the "Add New" button to create your first client measurement.
        </p>
      </div>
    );
  }

  // Display list of measurements
  return (
    <div className="space-y-6">
      {measurements.map((measurement, index) => (
        <MeasurementCard
          key={measurement.id}
          measurement={measurement}
          index={index}
          onDelete={onDelete}
          handleEdit={handleEdit}
          onAddJob={onAddJob}
          onUpdateMeasurement={onUpdateMeasurement}
        />
      ))}
    </div>
  );
};

export default MeasurementsList;
