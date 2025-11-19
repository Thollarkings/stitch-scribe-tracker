
import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import ActionBar from '@/components/layout/ActionBar';
import MeasurementForm from '@/components/measurements/MeasurementForm';
import MeasurementsList from '@/components/measurements/MeasurementsList';
import ExportDialog from '@/components/measurements/ExportDialog';
import ImportFile from '@/components/measurements/ImportFile';
import { useMeasurements } from '@/hooks/useMeasurements';
import { toast } from 'sonner';

interface Job {
  description?: string; // Add job description field
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

const Index = () => {
  const { 
    measurements, 
    isLoading, 
    saveMeasurement,
    deleteMeasurement,
    importMeasurements
  } = useMeasurements();
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const importRef = useRef<HTMLDivElement>(null);

  const handleSave = async (measurementData: any) => {
    // Preserve the original timestamp when editing
    if (editingIndex !== null && measurements[editingIndex]) {
      const originalTimestamp = measurements[editingIndex].timestamp;
      measurementData.timestamp = originalTimestamp;
    }
    
    const success = await saveMeasurement(
      measurementData,
      editingIndex !== null
    );
    
    if (success) {
      setEditingIndex(null);
      setFormVisible(false);
    }
  };

  const handleDelete = async (index: number) => {
    const measurementToDelete = measurements[index];
    await deleteMeasurement(measurementToDelete.id);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormVisible(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportAll = () => {
    setExportDialogOpen(true);
  };

  const handleImportClick = () => {
    if (importRef.current) {
      const button = importRef.current.querySelector('button');
      if (button) button.click();
    }
  };

  const toggleForm = () => {
    setFormVisible(prev => !prev);
    if (!formVisible && editingIndex !== null) {
      setEditingIndex(null);
    }
  };

  const handleAddJob = async (clientId: string, jobData: Job): Promise<void> => {
    // Find the measurement to update
    const measurementIndex = measurements.findIndex(m => m.id === clientId);
    
    if (measurementIndex >= 0) {
      const measurement = measurements[measurementIndex];
      
      // Create updated measurement with the new job
      const updatedMeasurement = {
        ...measurement,
        jobs: Array.isArray(measurement.jobs) 
          ? [...measurement.jobs, jobData]
          : [jobData]
      };
      
      // Save the updated measurement
      const success = await saveMeasurement(updatedMeasurement, true);
      if (success) {
        toast.success(`Added new job for ${jobData.clientName}`);
      }
    } else {
      toast.error("Could not find measurement to add job to");
    }
  };

  const handleUpdateMeasurement = async (updatedMeasurement: any): Promise<void> => {
    // Ensure numeric fields are properly handled for consistency with database
    if (typeof updatedMeasurement.serviceCharge === 'number') {
      updatedMeasurement.serviceCharge = updatedMeasurement.serviceCharge.toString();
    }
    if (typeof updatedMeasurement.paidAmount === 'number') {
      updatedMeasurement.paidAmount = updatedMeasurement.paidAmount.toString();
    }
    if (typeof updatedMeasurement.balance === 'number') {
      updatedMeasurement.balance = updatedMeasurement.balance.toString();
    }

    // Log what we're sending to debug
    console.log("Updating measurement:", JSON.stringify(updatedMeasurement));
    
    const success = await saveMeasurement(updatedMeasurement, true);
    if (success) {
      toast.success(`Updated job for ${updatedMeasurement.name}`);
    } else {
      toast.error("Failed to update measurement");
    }
  };

  const filteredMeasurements = measurements.filter(measurement =>
    measurement.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-indigo-200 via-gray-100 to-indigo-200">
      <Navbar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        toggleForm={toggleForm}
        formVisible={formVisible}
      />
      
      <div className="container mx-auto px-4 py-6 flex-1 bg-indigo-50">
        {formVisible && (
          <div className="mb-6">
            <MeasurementForm 
              onSave={handleSave} 
              editingData={editingIndex !== null ? measurements[editingIndex] : undefined} 
              setEditingIndex={setEditingIndex} 
            />
          </div>
        )}

        <Card className="border border-border shadow-sm">
          <ActionBar 
            onExport={handleExportAll}
            onImportClick={handleImportClick}
          />
          
          <CardContent className="p-4">
            <MeasurementsList 
              measurements={filteredMeasurements}
              onDelete={handleDelete}
              handleEdit={handleEdit}
              searchTerm={searchTerm}
              isLoading={isLoading}
              onAddJob={handleAddJob}
              onUpdateMeasurement={handleUpdateMeasurement}
            />
          </CardContent>
        </Card>

        <div ref={importRef}>
          <ImportFile onImport={importMeasurements} />
        </div>

        <ExportDialog 
          open={exportDialogOpen} 
          onOpenChange={setExportDialogOpen}
          measurements={measurements}
        />
      </div>
      
      <footer className="py-4 text-center text-sm text-gray-700 border-t">
        <p>&copy; Thollarkings {new Date().getFullYear()} - Tailors Suite</p>
      </footer>
    </div>
  );
};

export default Index;
