
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useMeasurements = () => {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch measurements from Supabase
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

  // Save or update a measurement
  const saveMeasurement = async (measurementData: any, isEditing: boolean = false) => {
    try {
      // Prepare data to save - handle numeric fields
      const dataToSave = {
        ...measurementData,
        user_id: user?.id,
        // Ensure balance is saved as string to match the database column type
        balance: measurementData.balance?.toString(),
        paidAmount: measurementData.paidAmount?.toString(),
        serviceCharge: measurementData.serviceCharge?.toString(),
        collectionDate: measurementData.collectionDate instanceof Date
          ? measurementData.collectionDate.toISOString()
          : measurementData.collectionDate,
        // Make sure jobs is handled properly - pass directly as object
        jobs: measurementData.jobs,
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

  // Delete a measurement
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

  // Import measurements in bulk
  const importMeasurements = async (importedData: any[]) => {
    try {
      // Process each measurement before import
      for (const item of importedData) {
        // Create the initial job data from top-level fields if there's no jobs array
        // or if the first record doesn't have initial job data
        const initialJobData = {
          serviceCharge: Number(item.serviceCharge) || 0,
          paidAmount: Number(item.paidAmount) || 0,
          balance: Number(item.balance) || 0,
          collectionDateType: item.collectionDateType || 'estimated',
          serviceChargeCurrency: 'NGN',
          clientId: item.id || '',
          clientName: item.name || '',
          timestamp: item.timestamp || new Date().toISOString(),
          collectionDate: item.collectionDate || null,
          recordedDateTime: item.timestamp || new Date().toISOString(),
          label: 'Initial Job',
        };

        // Prepare jobs data - ensure all array or create if missing
        let jobsData = item.jobs;
        if (!jobsData || !Array.isArray(jobsData)) {
          // If there's service charge data but no jobs array, create one with initial job
          if (item.serviceCharge) {
            jobsData = [initialJobData];
          } else {
            jobsData = [];
          }
        } else if (jobsData.length > 0) {
          // If there's a jobs array, ensure numeric fields are numbers
          jobsData = jobsData.map((job: any) => ({
            ...job,
            serviceCharge: Number(job.serviceCharge) || 0,
            paidAmount: Number(job.paidAmount) || 0,
            balance: Number(job.balance) || 0,
          }));

          // If there's a jobs array but no initial job data is present in it,
          // add the initial job data
          if (item.serviceCharge && 
              !jobsData.some((job: any) => job.label === 'Initial Job')) {
            jobsData.unshift(initialJobData);
          }
        }

        // Prepare the data for insertion
        const measurementData = {
          user_id: user?.id,
          name: item.name,
          phone: item.phone,
          email: item.email,
          gender: item.gender,
          comments: item.comments || item.notes,
          timestamp: item.timestamp || new Date().toISOString(),
          head: item.head,
          neck: item.neck,
          shoulderToShoulder: item.shoulderToShoulder,
          chest: item.chest,
          waist: item.waist,
          shoulderToNipple: item.shoulderToNipple,
          shoulderToUnderbust: item.shoulderToUnderbust,
          shoulderToWaist: item.shoulderToWaist,
          nippleToNipple: item.nippleToNipple,
          sleeveLength: item.sleeveLength,
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
          collectionDate: item.collectionDate,
          collectionDateType: item.collectionDateType || 'estimated',
          // Convert numeric fields to strings for DB compatibility
          serviceCharge: item.serviceCharge?.toString(),
          paidAmount: item.paidAmount?.toString(),
          balance: item.balance?.toString(),
          notes: item.notes,
          status: item.status || 'pending',
          jobs: jobsData, // Pass directly as object/array
        };

        // Insert the measurement
        const { error } = await supabase
          .from('measurements')
          .insert(measurementData);

        if (error) {
          console.error("Import error for item:", item.name, error);
          throw error;
        }
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
