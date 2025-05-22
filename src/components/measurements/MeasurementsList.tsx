
import { useState } from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import MeasurementCard from './MeasurementCard';

interface Job {
  serviceCharge: number;
  paidAmount: number;
  balance: number;
  collectionDateType: 'estimated' | 'exact';
  serviceChargeCurrency: string;
  clientId: string;
  clientName: string;
  timestamp: string;
  collectionDate: string | null;
  recordedDateTime: string;
}

interface MeasurementsListProps {
  measurements: any[];
  onDelete: (index: number) => void;
  handleEdit: (index: number) => void;
  searchTerm: string;
  isLoading?: boolean;
  onAddJob?: (clientId: string, jobData: Job) => Promise<void>;
}

const MeasurementsList = ({ 
  measurements, 
  onDelete, 
  handleEdit, 
  searchTerm, 
  isLoading = false,
  onAddJob
}: MeasurementsListProps) => {
  return (
    <div className="space-y-4 p-4">
      {/* Header with title and client count */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Client Records</h1>
        <div className="text-sm font-semibold bg-blue-100 text-blue-800 rounded-full px-3 py-1 select-none">
          {measurements.length} {measurements.length === 1 ? 'Client' : 'Clients'}
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : 
      
      // No measurements found
      measurements.length === 0 ? (
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
        // Render list of MeasurementCards
        <>
          {measurements.map((measurement, index) => (
            <MeasurementCard
              key={measurement.id}
              measurement={measurement}
              index={index}
              onDelete={onDelete}
              handleEdit={handleEdit}
              onAddJob={onAddJob || (() => Promise.resolve())}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default MeasurementsList;
