
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import ActionBar from '@/components/layout/ActionBar';
import MeasurementForm from '@/components/measurements/MeasurementForm';
import MeasurementsList from '@/components/measurements/MeasurementsList';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFilename, setExportFilename] = useState('tailors_logbook_export');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchMeasurements();
    }
  }, [user]);

  const fetchMeasurements = async () => {
    try {
      const { data, error } = await supabase
        .from('measurements')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      setMeasurements(data || []);
    } catch (error) {
      console.error("Error fetching measurements:", error);
      toast.error("Failed to load measurements");
    }
  };

  const handleSave = async (measurementData: any) => {
    try {
      // Format the collectionDate properly for database storage
      const dataToSave = {
        ...measurementData,
        user_id: user?.id,
        // Ensure we're sending the date in the correct format
        collectionDate: measurementData.collectionDate instanceof Date 
          ? measurementData.collectionDate.toISOString() 
          : measurementData.collectionDate,
      };

      if (editingIndex !== null) {
        // Update existing measurement
        const { error } = await supabase
          .from('measurements')
          .update(dataToSave)
          .eq('id', dataToSave.id);
        
        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        
        toast.success("Client measurements updated successfully");
        setEditingIndex(null);
      } else {
        // Insert new measurement
        const { error } = await supabase
          .from('measurements')
          .insert(dataToSave);
        
        if (error) {
          console.error("Insert error:", error);
          throw error;
        }
        
        toast.success(`${measurementData.name}'s measurements saved`);
      }

      // Refresh measurements
      fetchMeasurements();
      setFormVisible(false);
    } catch (error: any) {
      console.error("Error saving measurements:", error);
      toast.error(`Failed to save measurements: ${error.message || "Unknown error"}`);
    }
  };

  const handleDelete = async (index: number) => {
    try {
      const measurementToDelete = measurements[index];
      const { error } = await supabase
        .from('measurements')
        .delete()
        .eq('id', measurementToDelete.id);
      
      if (error) throw error;
      
      toast.success(`${measurementToDelete.name}'s record deleted`);
      fetchMeasurements();
    } catch (error) {
      console.error("Error deleting measurement:", error);
      toast.error("Failed to delete measurement");
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormVisible(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportAll = () => {
    // Always show dialog for filename input regardless of device
    setExportFilename('tailors_logbook_export');
    setExportDialogOpen(true);
  };

  const downloadExportedData = (customFilename?: string) => {
    try {
      const filename = (customFilename || 'tailors_logbook_export').replace(/[^a-zA-Z0-9-_]/g, '_');
      
      // Format the data for export to match the expected format
      const exportData = measurements.map(m => ({
        name: m.name,
        phone: m.phone,
        head: m.head,
        neck: m.neck,
        shoulderToShoulder: m.shoulderToShoulder,
        chest: m.chest,
        waist: m.waist,
        shoulderToNipple: m.shoulderToNipple,
        shoulderToUnderbust: m.shoulderToUnderbust,
        shoulderToWaist: m.shoulderToWaist,
        nippleToNipple: m.nippleToNipple,
        sleeveLength: m.sleeve_length,
        roundSleeve: m.roundSleeve,
        hip: m.hip,
        halfLength: m.halfLength,
        topLength: m.topLength,
        gownLength: m.gownLength,
        trouserWaist: m.trouserWaist,
        crotch: m.crotch,
        trouserLength: m.trouserLength,
        thigh: m.thigh,
        waistToKnee: m.waistToKnee,
        calf: m.calf,
        ankle: m.ankle,
        insideLegSeam: m.insideLegSeam,
        comments: m.notes,
        timestamp: m.timestamp,
        collectionDate: m.collectionDate,
        collectionDateType: m.collectionDateType
      }));
      
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
      
      setExportDialogOpen(false);
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    }
  };

  const handleExportConfirm = () => {
    downloadExportedData(exportFilename);
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportAll = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const result = e.target?.result;
        if (typeof result !== 'string') return;
        
        const importedData = JSON.parse(result);
        if (Array.isArray(importedData)) {
          // Map the imported data to match our database schema
          const dataWithUserId = importedData.map(item => {
            // Map fields from imported JSON to database columns
            return {
              user_id: user?.id,
              name: item.name,
              phone: item.phone,
              head: item.head,
              neck: item.neck,
              shoulderToShoulder: item.shoulderToShoulder,
              chest: item.chest,
              waist: item.waist,
              shoulderToNipple: item.shoulderToNipple,
              shoulderToUnderbust: item.shoulderToUnderbust,
              shoulderToWaist: item.shoulderToWaist,
              nippleToNipple: item.nippleToNipple,
              sleeve_length: item.sleeveLength,
              roundSleeve: item.roundSleeve,
              hip: item.hip,
              halfLength: item.halfLength,
              topLength: item.topLength,
              gownLength: item.gownLength,
              trouserWaist: item.trouserWaist,
              crotch: item.crotch,
              trouserLength: item.trouserLength,
              thigh: item.thigh,
              waistToKnee: item.waistToKnee,
              calf: item.calf,
              ankle: item.ankle,
              insideLegSeam: item.insideLegSeam,
              notes: item.comments,
              timestamp: item.timestamp || new Date().toISOString(),
              collectionDate: item.collectionDate,
              collectionDateType: item.collectionDateType || 'estimated',
              // Remove any existing id to let the database generate new ones
              id: undefined
            };
          });
          
          // Insert imported data into Supabase
          const { error } = await supabase
            .from('measurements')
            .insert(dataWithUserId);
          
          if (error) {
            console.error("Import error:", error);
            throw error;
          }
          
          toast.success(`Imported ${importedData.length} records`);
          fetchMeasurements();
        } else {
          toast.error('Invalid JSON file. Please ensure it contains an array of measurements.');
        }
      } catch (error: any) {
        console.error("Error importing data:", error);
        toast.error(`Failed to import data: ${error.message || "Please check the file format."}`);
      }
    };
    reader.readAsText(file);
    
    // Reset the file input so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  const filteredMeasurements = measurements.filter(measurement =>
    measurement.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleForm = () => {
    setFormVisible(prev => !prev);
    if (!formVisible && editingIndex !== null) {
      setEditingIndex(null);
    }
  };

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
            />
          </CardContent>
        </Card>

        <input 
          type="file"
          ref={fileInputRef}
          accept=".json"
          className="hidden"
          onChange={handleImportAll}
        />

        <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
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
              <Button variant="outline" onClick={() => setExportDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleExportConfirm}>Export</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <footer className="py-4 text-center text-sm text-gray-700 border-t">
        <p>&copy; Thollarkings {new Date().getFullYear()} - Tailor's Log Book</p>
      </footer>
    </div>
  );
};

export default Index;
