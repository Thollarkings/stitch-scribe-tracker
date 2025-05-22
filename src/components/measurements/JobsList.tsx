
import React, { useState } from 'react';
import { ListTodo, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getCurrencySymbol } from '@/utils/formatters';

interface Job {
  label?: string;
  description?: string; // Added job description field
  recordedDateTime?: string;
  collectionDate?: string | null;
  collectionDateType?: string;
  serviceCharge?: number;
  paidAmount?: number;
  balance?: number;
  serviceChargeCurrency?: string;
}

interface JobsListProps {
  measurement: any; // full measurement object with top-level fields + jobs array
  currency: string;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
  onUpdateMeasurement?: (updatedMeasurement: any) => void; // callback to update measurement
}

// Helper to get all jobs (initial + additional)
const getAllJobs = (measurement: any, currency: string): Job[] => {
  const initialJob: Job = {
    label: 'Initial Job',
    description: measurement.description || '', // Added job description field
    recordedDateTime: measurement.timestamp,
    collectionDate: measurement.collectionDate,
    collectionDateType: measurement.collectionDateType,
    serviceCharge: typeof measurement.serviceCharge === 'number' ? measurement.serviceCharge : parseFloat(measurement.serviceCharge || '0'),
    paidAmount: typeof measurement.paidAmount === 'number' ? measurement.paidAmount : parseFloat(measurement.paidAmount || '0'),
    balance: typeof measurement.balance === 'number' ? measurement.balance : parseFloat(measurement.balance || '0'),
    serviceChargeCurrency: measurement.serviceChargeCurrency || currency,
  };
  const jobs = Array.isArray(measurement.jobs) ? measurement.jobs : [];
  return [initialJob, ...jobs];
};

const JobsList: React.FC<JobsListProps> = ({ measurement, currency, onOpenChange, isOpen, onUpdateMeasurement }) => {
  const [editingJobIndex, setEditingJobIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Job>>({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const jobs = getAllJobs(measurement, currency);

  const getTotalPaidAmount = () => {
    return jobs.reduce((acc, job) =>
      acc + (typeof job.paidAmount === 'number' ? job.paidAmount : parseFloat(String(job.paidAmount || '0'))), 0);
  };

  const formatDate = (dateStr: string | undefined | null, type: string | undefined) => {
    if (!dateStr) return 'N/A';
    
    const formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    // Add the collection date type in parentheses before the date
    return type ? `(${type}) ${formattedDate}` : formattedDate;
  };

  const formatDateTime = (dateStr: string | undefined | null) => {
    if (!dateStr) return 'N/A';
    const dateObj = new Date(dateStr);
    return (
      dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) +
      ', ' +
      dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    );
  };

  // Open edit modal and populate form
  const openEdit = (index: number) => {
    setEditingJobIndex(index);
    setEditForm({ ...jobs[index] });
    setIsEditDialogOpen(true);
  };

  // Close edit modal and reset form
  const closeEdit = () => {
    setEditingJobIndex(null);
    setEditForm({});
    setIsEditDialogOpen(false);
  };

  // Update form fields
  const onChangeField = (field: keyof Job, value: any) => {
    setEditForm(prev => {
      let updated = { ...prev, [field]: value };
      // Auto-calc balance if serviceCharge or paidAmount changed
      if (field === 'serviceCharge' || field === 'paidAmount') {
        const sc = Number(updated.serviceCharge) || 0;
        const pa = Number(updated.paidAmount) || 0;
        updated.balance = sc - pa;
      }
      return updated;
    });
  };

  // Save edits
  const saveEdit = () => {
    if (!onUpdateMeasurement || editingJobIndex === null) return;

    if (editingJobIndex === 0) {
      // Initial job: update top-level measurement fields only
      // Fix: Convert numeric values to strings to match database column types
      const updatedMeasurement = {
        ...measurement,
        description: editForm.description, // Include job description in updates
        collectionDateType: editForm.collectionDateType,
        collectionDate: editForm.collectionDate,
        // Convert to strings as expected by the database
        serviceCharge: editForm.serviceCharge?.toString(),
        paidAmount: editForm.paidAmount?.toString(),
        balance: editForm.balance?.toString(),
      };
      onUpdateMeasurement(updatedMeasurement);
    } else {
      // Additional job: update the job in jobs array
      const updatedJobs = [...(measurement.jobs || [])];
      updatedJobs[editingJobIndex - 1] = {
        ...updatedJobs[editingJobIndex - 1],
        description: editForm.description, // Include job description in updates
        collectionDateType: editForm.collectionDateType,
        collectionDate: editForm.collectionDate,
        serviceCharge: editForm.serviceCharge,
        paidAmount: editForm.paidAmount,
        balance: editForm.balance,
      };
      onUpdateMeasurement({ ...measurement, jobs: updatedJobs });
    }
    closeEdit();
  };

  // Delete job
  const deleteJob = (index: number) => {
    if (!onUpdateMeasurement) return;
    
    if (index === 0) {
      // Initial job: clear only job-related fields on measurement
      const clearedMeasurement = {
        ...measurement,
        description: '', // Clear job description
        collectionDateType: null,
        collectionDate: null,
        serviceCharge: '0',  // Changed to string
        paidAmount: '0',     // Changed to string
        balance: '0',        // Changed to string
      };
      onUpdateMeasurement(clearedMeasurement);
    } else {
      // Additional job: remove from jobs array
      const updatedJobs = [...(measurement.jobs || [])];
      updatedJobs.splice(index - 1, 1);
      onUpdateMeasurement({ ...measurement, jobs: updatedJobs });
    }
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="bg-white/80 hover:bg-white"
          >
            <ListTodo className="h-4 w-4 mr-1" /> Job List
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-96 bg-white" align="end">
          <div className="p-2 space-y-2 max-h-96 overflow-y-auto">
            <h4 className="font-medium border-b pb-1">Client Jobs</h4>
            {jobs.map((job, idx) => (
              <div key={idx} className="text-xs border rounded p-2">
                <div className="flex justify-between">
                  <span className="font-medium">{job.label || `Job #${idx}`}</span>
                  {onUpdateMeasurement && (
                    <div className="space-x-2">
                      <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => openEdit(idx)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-red-600 hover:text-red-800" onClick={() => deleteJob(idx)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Display job description if available */}
                {job.description && (
                  <div className="mt-1">
                    <span className="text-muted-foreground">Description:</span>
                    <span className="ml-1">
                      {job.description}
                    </span>
                  </div>
                )}
                
                <div className="mt-1">
                  <div>
                    <span className="text-muted-foreground">Recorded Date:</span>
                    <span className="ml-1">
                      {formatDateTime(job.recordedDateTime)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Collection Date:</span>
                    <span className="ml-1">
                      {formatDate(job.collectionDate, job.collectionDateType)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Service Charge:</span>
                    <span className="ml-1">
                      {getCurrencySymbol(job.serviceChargeCurrency)}
                      {job.serviceCharge !== null && job.serviceCharge !== undefined
                        ? Number(job.serviceCharge).toLocaleString(undefined, { minimumFractionDigits: 2 })
                        : '0.00'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Paid Amount:</span>
                    <span className="ml-1">
                      {getCurrencySymbol(job.serviceChargeCurrency)}
                      {job.paidAmount !== null && job.paidAmount !== undefined
                        ? Number(job.paidAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })
                        : '0.00'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Balance:</span>
                    <span className="ml-1">
                      {getCurrencySymbol(job.serviceChargeCurrency)}
                      {job.balance !== null && job.balance !== undefined
                        ? Number(job.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })
                        : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {/* Total row */}
            <div className="mt-2 pt-2 border-t font-medium flex justify-between">
              <span>Total Paid Amount:</span>
              <span>{getCurrencySymbol(currency)} {getTotalPaidAmount().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Job - {editingJobIndex === 0 ? 'Initial Job' : `Job #${editingJobIndex}`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Add Job Description field to the edit form */}
            <div>
              <label className="block mb-1 text-sm font-medium">Job Description</label>
              <input
                type="text"
                value={editForm.description || ''}
                onChange={e => onChangeField('description', e.target.value)}
                placeholder="Enter job description"
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Collection Date Type</label>
              <select
                value={editForm.collectionDateType || ''}
                onChange={e => onChangeField('collectionDateType', e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Select type</option>
                <option value="estimated">Estimated</option>
                <option value="exact">Exact</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Collection Date</label>
              <input
                type="date"
                value={editForm.collectionDate ? new Date(editForm.collectionDate).toISOString().split('T')[0] : ''}
                onChange={e => onChangeField('collectionDate', e.target.value ? new Date(e.target.value).toISOString() : null)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Service Charge *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={editForm.serviceCharge ?? ''}
                onChange={e => onChangeField('serviceCharge', parseFloat(e.target.value) || 0)}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Paid Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={editForm.paidAmount ?? ''}
                onChange={e => onChangeField('paidAmount', parseFloat(e.target.value) || 0)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Balance (Calculated)</label>
              <input
                type="number"
                value={(editForm.balance ?? 0).toFixed(2)}
                readOnly
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEdit}>Cancel</Button>
            <Button onClick={saveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobsList;
