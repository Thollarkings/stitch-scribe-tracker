import React from 'react';
import { ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getCurrencySymbol } from '@/utils/formatters';

interface JobsListProps {
  measurement: any;
  currency: string;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
}

// Helper to get all jobs (initial + additional)
const getAllJobs = (measurement: any, currency: string) => {
  const initialJob = {
    label: 'Initial Job',
    recordedDateTime: measurement.timestamp,
    collectionDate: measurement.collectionDate,
    serviceCharge: measurement.serviceCharge,
    paidAmount: measurement.paidAmount,
    balance: measurement.balance,
    serviceChargeCurrency: measurement.serviceChargeCurrency || currency,
  };
  const jobs = Array.isArray(measurement.jobs) ? measurement.jobs : [];
  return [initialJob, ...jobs];
};

const JobsList: React.FC<JobsListProps> = ({ measurement, currency, onOpenChange, isOpen }) => {
  const jobs = getAllJobs(measurement, currency);

  const getTotalPaidAmount = () => {
    return jobs.reduce((acc, job) =>
      acc + (typeof job.paidAmount === 'number' ? job.paidAmount : parseFloat(job.paidAmount || '0')), 0);
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateStr: string | undefined) => {
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

  return (
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
              </div>
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
                    {formatDate(job.collectionDate)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Service Charge:</span>
                  <span className="ml-1">
                    {getCurrencySymbol(job.serviceChargeCurrency)}
                    {job.serviceCharge !== null && job.serviceCharge !== undefined
                      ? Number(job.serviceCharge).toLocaleString(undefined, { minimumFractionDigits: 2 })
                      : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Paid Amount:</span>
                  <span className="ml-1">
                    {getCurrencySymbol(job.serviceChargeCurrency)}
                    {job.paidAmount !== null && job.paidAmount !== undefined
                      ? Number(job.paidAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })
                      : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Balance:</span>
                  <span className="ml-1">
                    {getCurrencySymbol(job.serviceChargeCurrency)}
                    {job.balance !== null && job.balance !== undefined
                      ? Number(job.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })
                      : 'N/A'}
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
  );
};

export default JobsList;
