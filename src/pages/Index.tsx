
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
      // Add user_id to the measurement data
      const measurementWithUser = {
        ...measurementData,
        user_id: user?.id,
      };

      if (editingIndex !== null) {
        // Update existing measurement
        const { error } = await supabase
          .from('measurements')
          .update(measurementWithUser)
          .eq('id', measurementWithUser.id);
        
        if (error) throw error;
        
        toast.success("Client measurements updated successfully");
        setEditingIndex(null);
      } else {
        // Insert new measurement
        const { error } = await supabase
          .from('measurements')
          .insert(measurementWithUser);
        
        if (error) throw error;
        
        toast.success(`${measurementData.name}'s measurements saved`);
      }

      // Refresh measurements
      fetchMeasurements();
      setFormVisible(false);
    } catch (error) {
      console.error("Error saving measurements:", error);
      toast.error("Failed to save measurements");
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
      const jsonStr = JSON.stringify(measurements, null, 2);
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
          // Add user_id to each imported record
          const dataWithUserId = importedData.map(item => ({
            ...item,
            user_id: user?.id,
            // Remove any existing id to let the database generate new ones
            id: undefined
          }));
          
          // Insert imported data into Supabase
          const { error } = await supabase
            .from('measurements')
            .insert(dataWithUserId);
          
          if (error) throw error;
          
          toast.success(`Imported ${importedData.length} records`);
          fetchMeasurements();
        } else {
          toast.error('Invalid JSON file. Please ensure it contains an array of measurements.');
        }
      } catch (error) {
        console.error("Error importing data:", error);
        toast.error('Failed to import data. Please check the file format.');
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
