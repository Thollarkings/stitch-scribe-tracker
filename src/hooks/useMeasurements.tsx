
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useMeasurements = () => {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMeasurements = async () => {
    if (!user) return;
    
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const saveMeasurement = async (measurementData: any, isEditing: boolean = false) => {
    try {
      // Format the collectionDate properly for database storage
      const dataToSave = {
        ...measurementData,
        user_id: user?.id,
        // Ensure we're sending the date in the correct format
        collectionDate: measurementData.collectionDate instanceof Date 
          ? measurementData.collectionDate.toISOString() 
          : measurementData.collectionDate,
        // Ensure jobs array is handled properly
        jobs: Array.isArray(measurementData.jobs) ? JSON.stringify(measurementData.jobs) : null
      };

      if (isEditing) {
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
      await fetchMeasurements();
      return true;
    } catch (error: any) {
      console.error("Error saving measurements:", error);
      toast.error(`Failed to save measurements: ${error.message || "Unknown error"}`);
      return false;
    }
  };

  const deleteMeasurement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('measurements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success(`Record deleted successfully`);
      await fetchMeasurements();
      return true;
    } catch (error) {
      console.error("Error deleting measurement:", error);
      toast.error("Failed to delete measurement");
      return false;
    }
  };

  const importMeasurements = async (importedData: any[]) => {
    try {
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
          jobs: item.jobs ? JSON.stringify(item.jobs) : null,
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
      await fetchMeasurements();
      return true;
    } catch (error: any) {
      console.error("Error importing data:", error);
      toast.error(`Failed to import data: ${error.message || "Please check the file format."}`);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchMeasurements();
    }
  }, [user]);

  // Parse jobs array when fetching measurements
  const parsedMeasurements = measurements.map(measurement => {
    try {
      // If jobs is a string, try to parse it
      if (typeof measurement.jobs === 'string') {
        return {
          ...measurement,
          jobs: JSON.parse(measurement.jobs)
        };
      }
      return measurement;
    } catch (e) {
      console.error("Error parsing jobs:", e);
      return {
        ...measurement,
        jobs: []
      };
    }
  });

  return {
    measurements: parsedMeasurements,
    isLoading,
    fetchMeasurements,
    saveMeasurement,
    deleteMeasurement,
    importMeasurements
  };
};
