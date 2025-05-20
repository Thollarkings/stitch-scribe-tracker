
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, Edit } from 'lucide-react';
import MeasurementCard from './MeasurementCard';

interface MeasurementsListProps {
  measurements: any[];
  onDelete: (index: number) => void;
  handleEdit: (index: number) => void;
  searchTerm: string;
  isLoading?: boolean;
}

const MeasurementsList = ({ 
  measurements, 
  onDelete, 
  handleEdit, 
  searchTerm, 
  isLoading = false 
}: MeasurementsListProps) => {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [viewIndex, setViewIndex] = useState<number | null>(null);

  const confirmDelete = (index: number) => {
    setDeleteIndex(index);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      onDelete(deleteIndex);
      setDeleteIndex(null);
    }
  };

  const viewDetails = (index: number) => {
    setViewIndex(index);
  };

  return (
    <>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {measurements.map((measurement, index) => (
            <div key={measurement.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{measurement.name}</h3>
                    {measurement.phone && (
                      <p className="text-sm text-gray-600">{measurement.phone}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewDetails(index)}
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>Client Measurements</SheetTitle>
                          <SheetDescription>
                            View complete measurement details for {viewIndex !== null ? measurements[viewIndex]?.name : ''}
                          </SheetDescription>
                        </SheetHeader>
                        {viewIndex !== null && (
                          <MeasurementCard measurement={measurements[viewIndex]} />
                        )}
                      </SheetContent>
                    </Sheet>
                    
                    <Button
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(index)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDelete(index)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete {deleteIndex !== null ? measurements[deleteIndex]?.name : ''}'s measurement record.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeleteIndex(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  {measurement.chest && (
                    <div>
                      <span className="font-medium">Chest:</span> {measurement.chest}"
                    </div>
                  )}
                  {measurement.waist && (
                    <div>
                      <span className="font-medium">Waist:</span> {measurement.waist}"
                    </div>
                  )}
                  {measurement.hip && (
                    <div>
                      <span className="font-medium">Hip:</span> {measurement.hip}"
                    </div>
                  )}
                  {measurement.shoulderToShoulder && (
                    <div>
                      <span className="font-medium">Shoulder:</span> {measurement.shoulderToShoulder}"
                    </div>
                  )}
                </div>
                
                {measurement.collectionDate && (
                  <div className="mt-3 text-xs text-gray-500">
                    Collection: {new Date(measurement.collectionDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default MeasurementsList;
