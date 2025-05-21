
import React from 'react';
import { ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getCurrencySymbol } from '@/utils/formatters';

interface JobsListProps {
  jobs: any[];
  currency: string;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
}

const JobsList: React.FC<JobsListProps> = ({ jobs, currency, onOpenChange, isOpen }) => {
  // Helper to calculate total paid amount
  const getTotalPaidAmount = () => {
    return jobs.reduce((acc, job) => 
      acc + (typeof job.paidAmount === 'number' ? job.paidAmount : parseFloat(job.paidAmount || '0')), 0);
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
                <span className="font-medium">{job.label || `Job #${idx + 1}`}</span>
                <span className="text-muted-foreground">
                  {job.recordedDateTime 
                    ? new Date(job.recordedDateTime).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) 
                    : 'N/A'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 mt-1">
                <div>
                  <span className="text-muted-foreground">Collection Date:</span>
                  <span className="ml-1">
                    {job.collectionDate 
                      ? new Date(job.collectionDate).toLocaleDateString() 
                      : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Service Charge:</span>
                  <span className="ml-1">
                    {getCurrencySymbol(job.serviceChargeCurrency)}
                    {parseFloat(job.serviceCharge || '0').toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Paid Amount:</span>
                  <span className="ml-1">
                    {getCurrencySymbol(job.serviceChargeCurrency)}
                    {parseFloat(job.paidAmount || '0').toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Balance:</span>
                  <span className="ml-1">
                    {getCurrencySymbol(job.serviceChargeCurrency)}
                    {typeof job.balance === 'number' 
                      ? job.balance.toFixed(2)
                      : parseFloat(job.balance || '0').toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {/* Total row */}
          <div className="mt-2 pt-2 border-t font-medium flex justify-between">
            <span>Total Paid Amount:</span>
            <span>{getCurrencySymbol(currency)} {getTotalPaidAmount().toFixed(2)}</span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default JobsList;
