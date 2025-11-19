import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
// @ts-ignore
import { api } from '../../../convex/_generated/api';
// @ts-ignore
import { useMutation } from 'convex/react';
import { useJobs } from '@/hooks/useJobs';
const USE_CONVEX = import.meta.env.VITE_USE_CONVEX === 'true';
const isConvexId = (id: any) => typeof id === 'string' && !id.includes('-');
import { ListTodo, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { getCurrencySymbol } from '@/utils/formatters';

interface Job {
  label?: string;
  description?: string;
  recordedDateTime?: string;
  collectionDate?: string | null;
  collectionDateType?: string;
  serviceCharge?: number;
  paidAmount?: number;
  balance?: number;
  serviceChargeCurrency?: string;
}

interface JobsListProps {
  measurement: any;
  currency: string;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
  onUpdateMeasurement?: (updatedMeasurement: any) => void;
}

const getAllJobs = (measurement: any, currency: string): Job[] => {
  const initialJob: Job = {
    label: 'Initial Job',
    description: measurement.description || '',
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
  const { user } = useAuth();
  const measurementIdForConvex = USE_CONVEX && isConvexId(measurement?.id) ? measurement.id : undefined;
  const { jobs: convexJobs, upsertJob, deleteJob: removeJob } = useJobs(measurementIdForConvex);

  const [editForm, setEditForm] = useState<Partial<Job>>({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const jobs = USE_CONVEX && convexJobs
    ? [
        // initial job from measurement top-level
        ...getAllJobs(measurement, currency).slice(0, 1),
        // map convex jobs to UI shape
        ...convexJobs.map((j: any) => ({
          label: j.label || 'Job',
          description: j.description,
          recordedDateTime: new Date(j.createdAt).toISOString(),
          collectionDate: j.collectionDate ?? null,
          collectionDateType: j.collectionDateType,
          serviceCharge: j.serviceCharge,
          paidAmount: j.paidAmount,
          balance: j.balance,
          serviceChargeCurrency: j.currency || currency,
          _id: j._id,
        }))
      ]
    : getAllJobs(measurement, currency);


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
      if (field === 'serviceCharge' || field === 'paidAmount') {
        const sc = Number(updated.serviceCharge) || 0;
        const pa = Number(updated.paidAmount) || 0;
        updated.balance = sc - pa;
      }
      return updated;
    });
  };

  // Save edits
  const saveEdit = async () => {
    if (!onUpdateMeasurement || editingJobIndex === null) return;

    if (editingJobIndex === 0) {
      const updatedMeasurement = {
        ...measurement,
        description: editForm.description,
        collectionDateType: editForm.collectionDateType,
        collectionDate: editForm.collectionDate,
        serviceCharge: Number(editForm.serviceCharge) || 0,
        paidAmount: Number(editForm.paidAmount) || 0,
        balance: Number(editForm.balance) || 0,
      };
      onUpdateMeasurement(updatedMeasurement);
    } else {
      const updatedJobs = [...(measurement.jobs || [])];
      updatedJobs[editingJobIndex - 1] = {
        ...updatedJobs[editingJobIndex - 1],
        description: editForm.description,
        collectionDateType: editForm.collectionDateType,
        collectionDate: editForm.collectionDate,
        serviceCharge: Number(editForm.serviceCharge) || 0,
        paidAmount: Number(editForm.paidAmount) || 0,
        balance: Number(editForm.balance) || 0,
      };
      onUpdateMeasurement({ ...measurement, jobs: updatedJobs });
    }
    closeEdit();
  };

  // Delete job
  const deleteJob = async (index: number) => {
    if (!onUpdateMeasurement) return;
    if (index === 0) {
      const clearedMeasurement = {
        ...measurement,
        description: '',
        collectionDateType: null,
        collectionDate: null,
        serviceCharge: 0,
        paidAmount: 0,
        balance: 0,
      };
      onUpdateMeasurement(clearedMeasurement);
    } else {
      const updatedJobs = [...(measurement.jobs || [])];
      updatedJobs.splice(index - 1, 1);
      onUpdateMeasurement({ ...measurement, jobs: updatedJobs });
    }
  };

  // Drawer close helper
  const closeDrawer = () => onOpenChange(false);

  return (
    <>
      {/* Button to open Drawer */}
      <Button
        size="sm"
        variant="outline"
        className="bg-white/80 hover:bg-white"
        onClick={() => onOpenChange(true)}
      >
        <ListTodo className="h-4 w-4 mr-1" /> Job List
      </Button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={closeDrawer}
            aria-label="Close drawer"
          />
          {/* Drawer panel */}
          <div className="relative ml-auto w-full max-w-3xl bg-white shadow-xl h-full flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Client Jobs</h2>
              <Button size="icon" variant="ghost" onClick={closeDrawer}>
                <span className="sr-only">Close</span>
                <svg width="24" height="24" fill="none" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round" />
                </svg>
              </Button>
            </div>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              {jobs.map((job, idx) => (
                <div key={idx} className="text-sm border rounded p-4 bg-gray-50">
                  <div className="flex justify-between">
                    <span className="font-medium">{job.label || `Job #${idx}`}</span>
                    {onUpdateMeasurement && (
                      <div className="space-x-2">
                        <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => openEdit(idx)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-red-600 hover:text-red-800" onClick={() => deleteJob(idx)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {job.description && (
                    <div className="mt-1">
                      <span className="text-muted-foreground">Description:</span>
                      <span className="ml-1">{job.description}</span>
                    </div>
                  )}
                  <div className="mt-1">
                    <div>
                      <span className="text-muted-foreground">Recorded Date:</span>
                      <span className="ml-1">{formatDateTime(job.recordedDateTime)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Collection Date:</span>
                      <span className="ml-1">{formatDate(job.collectionDate, job.collectionDateType)}</span>
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
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Job - {editingJobIndex === 0 ? 'Initial Job' : `Job #${editingJobIndex}`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
