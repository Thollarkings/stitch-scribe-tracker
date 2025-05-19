
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

const Index = () => {
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFilename, setExportFilename] = useState('tailors_logbook_export');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMeasurements();
  }, []);

  const loadMeasurements = () => {
    try {
      const data = JSON.parse(localStorage.getItem('clientMeasurements') || '[]');
      // Sort the measurements by timestamp in descending order
      const sortedData = data.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setMeasurements(sortedData);
    } catch (error) {
      console.error("Error loading measurements:", error);
      toast.error("Failed to load saved measurements");
      setMeasurements([]);
    }
  };

  const handleSave = (measurementData: any) => {
    try {
      const updatedMeasurements = [...measurements];
      if (editingIndex !== null) {
        updatedMeasurements[editingIndex] = measurementData;
        setEditingIndex(null);
        toast.success("Client measurements updated successfully");
      } else {
        updatedMeasurements.push(measurementData);
        toast.success(`${measurementData.name}'s measurements saved`);
      }

      localStorage.setItem('clientMeasurements', JSON.stringify(updatedMeasurements));
      // Sort again after saving to maintain order
      const sortedData = updatedMeasurements.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setMeasurements(sortedData);
      setFormVisible(false);
    } catch (error) {
      console.error("Error saving measurements:", error);
      toast.error("Failed to save measurements");
    }
  };

  const handleDelete = (index: number) => {
    try {
      const deletedName = measurements[index].name;
      const updatedMeasurements = measurements.filter((_, i) => i !== index);
      localStorage.setItem('clientMeasurements', JSON.stringify(updatedMeasurements));
      setMeasurements(updatedMeasurements);
      toast.success(`${deletedName}'s record deleted`);
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
    // For mobile devices, show a dialog to input filename
    if (window.innerWidth <= 768) {
      setExportDialogOpen(true);
    } else {
      downloadExportedData();
    }
  };

  const downloadExportedData = (customFilename?: string) => {
    try {
      const filename = customFilename || 'tailors_logbook_export';
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(measurements, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${filename}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      
      toast.success("Data exported successfully");
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

  const handleImportAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result !== 'string') return;
        
        const importedData = JSON.parse(result);
        if (Array.isArray(importedData)) {
          const mergedData = [...measurements, ...importedData];
          const uniqueData = mergedData.filter((item, index, self) =>
            index === self.findIndex((t) => 
              t.timestamp === item.timestamp && t.name === item.name
            )
          );
          localStorage.setItem('clientMeasurements', JSON.stringify(uniqueData));
          setMeasurements(uniqueData);
          toast.success(`Imported ${importedData.length} records`);
        } else {
          toast.error('Invalid JSON file. Please ensure it contains an array of measurements.');
        }
      } catch (error) {
        console.error("Error importing data:", error);
        toast.error('Invalid JSON file. Please check the file content.');
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        toggleForm={toggleForm}
        formVisible={formVisible}
      />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        {formVisible && (
          <div className="mb-6">
            <MeasurementForm 
              onSave={handleSave} 
              editingIndex={editingIndex} 
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
      
      <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        <p>&copy; Thollarkings {new Date().getFullYear()} - Tailor's Log Book</p>
      </footer>
    </div>
  );
};

export default Index;
