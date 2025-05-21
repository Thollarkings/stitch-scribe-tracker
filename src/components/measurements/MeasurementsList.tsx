
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import MeasurementCard from './MeasurementCard';

interface MeasurementsListProps {
  measurements: any[];
  onDelete: (index: number) => void;
  handleEdit: (index: number) => void;
  searchTerm: string;
  isLoading?: boolean;
  onAddJob?: (clientId: string, jobData: any) => void;
}

const MeasurementsList = ({ 
  measurements, 
  onDelete, 
  handleEdit, 
  searchTerm, 
  isLoading = false,
  onAddJob
}: MeasurementsListProps) => {
  console.log(measurements); // in MeasurementsList before rendering MeasurementCard

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Client Records</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : measurements.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          {searchTerm ? (
            <p className="text-muted-foreground">No measurements found matching "{searchTerm}"</p>
          ) : (
            <div>
              <h3 className="text-lg font-medium mb-2">No measurements records yet</h3>
              <p className="text-muted-foreground">Click "New Client" to create your first measurement record.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {measurements.map((measurement, index) => (
            <MeasurementCard
              key={measurement.id}
              measurement={measurement}
              index={index}
              onDelete={onDelete}
              handleEdit={handleEdit}
              onAddJob={onAddJob}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default MeasurementsList;
