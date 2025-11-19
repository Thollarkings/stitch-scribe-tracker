import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useJobs } from '@/hooks/useJobs';

interface JobPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  measurement: any;
  onConfirm: (job: any) => void;
}

export default function JobPickerDialog({ open, onOpenChange, measurement, onConfirm }: JobPickerDialogProps) {
  const { jobs } = useJobs(measurement?.id);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const items = useMemo(() => {
    if (jobs && jobs.length > 0) {
      // Map Convex jobs into UI shape; first job selected by default
      return jobs.map((j: any) => ({
        id: j._id,
        label: j.label || 'Job',
        description: j.description,
        serviceCharge: Number(j.serviceCharge) || 0,
        paidAmount: Number(j.paidAmount) || 0,
        balance: Number(j.balance) || (Number(j.serviceCharge)||0) - (Number(j.paidAmount)||0),
        collectionDate: j.collectionDate ?? null,
        serviceChargeCurrency: j.currency || 'NGN',
        _source: 'convex',
        _raw: j,
      }));
    }
    // Fallback to derived initial job from measurement
    const sc = typeof measurement?.serviceCharge === 'number' ? measurement.serviceCharge : parseFloat(measurement?.serviceCharge || '0');
    const pa = typeof measurement?.paidAmount === 'number' ? measurement.paidAmount : parseFloat(measurement?.paidAmount || '0');
    return [{
      id: measurement?.id,
      label: 'Initial Job',
      description: measurement?.comments,
      serviceCharge: sc,
      paidAmount: pa,
      balance: sc - pa,
      collectionDate: measurement?.collectionDate,
      serviceChargeCurrency: measurement?.serviceChargeCurrency || 'NGN',
      _source: 'derived',
      _raw: measurement,
    }];
  }, [jobs, measurement]);

  const handleConfirm = () => {
    const job = items[selectedIndex];
    // Map Convex job to expected invoice shape
    const mapped = job._source === 'convex'
      ? { ...job._raw, id: job.id, serviceChargeCurrency: job.serviceChargeCurrency }
      : job;
    onConfirm(mapped);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a job to invoice</DialogTitle>
          <DialogDescription>Choose one of the recorded jobs for this client to generate an invoice.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 max-h-80 overflow-auto pr-1">
          {items.map((j, idx) => (
            <label key={j.id || idx} className={`flex items-start gap-3 p-2 rounded border cursor-pointer ${idx===selectedIndex? 'border-primary' : 'border-muted'}`}>
              <input type="radio" name="job" checked={selectedIndex===idx} onChange={() => setSelectedIndex(idx)} className="mt-1" />
              <div className="flex-1">
                <div className="font-medium">{j.label}</div>
                {j.description && <div className="text-sm text-muted-foreground">{j.description}</div>}
                <div className="text-sm">Amount: {j.serviceCharge}</div>
                {j.collectionDate && <div className="text-xs text-muted-foreground">Collection: {new Date(j.collectionDate).toLocaleDateString()}</div>}
              </div>
            </label>
          ))}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConfirm}>Generate invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
