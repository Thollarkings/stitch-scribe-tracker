import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PaymentSummary from './PaymentSummary';
import MeasurementDetails from './MeasurementDetails';
import CardActions from './CardActions';
import NewJobDialog from './NewJobDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';

interface Job {
  recordedDateTime: string;
  collectionDate: string | null;
  serviceCharge: number;
  paidAmount: number;
  balance: number;
  serviceChargeCurrency: string;
  label?: string;
}

interface MeasurementCardProps {
  measurement: {
    id: string;
    name: string;
    phone: string;
    timestamp?: string;
    collectionDate?: string;
    collectionDateType?: string;
    serviceCharge?: number | string;
    paidAmount?: number | string;
    serviceChargeCurrency?: string;
    jobs?: Job[];
    [key: string]: any;
  };
  index: number;
  onDelete: (index: number) => void;
  handleEdit: (index: number) => void;
  onAddJob: (clientId: string, jobData: Job) => Promise<void>;
}

// --- Date formatting helpers ---
const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateTime = (dateStr?: string | null) => {
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

const MeasurementCard = ({
  measurement,
  index,
  onDelete,
  handleEdit,
  onAddJob
}: MeasurementCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [jobListOpen, setJobListOpen] = useState(false);
  const [newJobDialogOpen, setNewJobDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Invoice dialog state
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedJobIndex, setSelectedJobIndex] = useState<number | null>(null);

  // Helper function to get all jobs (initial + additional)
  const getAllJobs = (): Job[] => {
    const initialJob: Job = {
      recordedDateTime: measurement.timestamp || new Date().toISOString(),
      collectionDate: measurement.collectionDate || null,
      serviceCharge:
        typeof measurement.serviceCharge === 'number'
          ? measurement.serviceCharge
          : parseFloat(measurement.serviceCharge || '0'),
      paidAmount:
        typeof measurement.paidAmount === 'number'
          ? measurement.paidAmount
          : parseFloat(measurement.paidAmount || '0'),
      balance: calculateBalance(
        typeof measurement.serviceCharge === 'number'
          ? measurement.serviceCharge
          : parseFloat(measurement.serviceCharge || '0'),
        typeof measurement.paidAmount === 'number'
          ? measurement.paidAmount
          : parseFloat(measurement.paidAmount || '0')
      ),
      serviceChargeCurrency: measurement.serviceChargeCurrency || 'NGN',
      label: 'Initial Job'
    };

    const additionalJobs = Array.isArray(measurement.jobs) ? measurement.jobs : [];
    return [initialJob, ...additionalJobs];
  };

  // Calculate total paid amount across all jobs
  const getTotalPaidAmount = (): number => {
    return getAllJobs().reduce((total, job) => total + (job.paidAmount || 0), 0);
  };

  const calculateBalance = (serviceCharge: number, paidAmount: number): number => {
    return serviceCharge - paidAmount;
  };

  // Format timestamp
  const timestamp = measurement.timestamp ? new Date(measurement.timestamp) : new Date();

  const formattedDate = formatDateTime(measurement.timestamp);

  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

  // Format collection date if available
  const origCollectionDate = measurement.collectionDate
    ? formatDate(measurement.collectionDate)
    : null;

  const collectionDateType = measurement.collectionDateType || 'estimated';

  // Payment fields and balance calculation
  const serviceCharge =
    typeof measurement.serviceCharge === 'number'
      ? measurement.serviceCharge
      : parseFloat(measurement.serviceCharge || '0');

  const paidAmount =
    typeof measurement.paidAmount === 'number'
      ? measurement.paidAmount
      : parseFloat(measurement.paidAmount || '0');

  const balance = calculateBalance(serviceCharge, paidAmount);

  // Handle adding a new job
  const handleNewJob = async (clientId: string, jobData: Job) => {
    setIsSubmitting(true);
    try {
      await onAddJob(clientId, jobData);
      setNewJobDialogOpen(false);
      toast({
        title: 'Success',
        description: 'New job added successfully',
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add new job',
        variant: 'destructive'
      });
      console.error('Error adding new job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open invoice dialog
  const handleOpenInvoiceDialog = () => {
    setInvoiceDialogOpen(true);
    setSelectedJobIndex(null);
  };

  // Generate invoice for selected job
  const handleGenerateInvoice = () => {
    if (selectedJobIndex === null) {
      toast({
        title: 'Please select a job',
        variant: 'destructive'
      });
      return;
    }
    const job = getAllJobs()[selectedJobIndex];
    setInvoiceDialogOpen(false);

    // Navigate to invoice page, passing job details in state
    navigate(`/invoice/${measurement.id}`, { state: { job } });
  };

  return (
    <Card className="mb-10 border-l-4 border-l-tailor-gold overflow-hidden animate-fade-in shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-blue-200 via-navy-800 to-indigo-100 text-black-900 pb-2">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <div>
            <h3 className="text-2xl font-semibold mb-0">{measurement.name}</h3>
            <div className="text-sm text-muted-foreground flex flex-wrap gap-2 items-center">
              <span>{measurement.phone}</span>
              <Badge variant="outline" className="text-xs">
                {timeAgo}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <CardActions
              measurementId={measurement.id}
              index={index}
              handleEdit={handleEdit}
              onDelete={onDelete}
              onNewJobClick={() => setNewJobDialogOpen(true)}
              onServiceInvoiceClick={handleOpenInvoiceDialog}
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setJobListOpen(true)}
              className="bg-white/80 hover:bg-white w-full/2 mb-3">
              View Jobs
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
{/*         <PaymentSummary
          serviceCharge={serviceCharge}
          paidAmount={paidAmount}
          balance={balance}
          currency={measurement.serviceChargeCurrency || 'NGN'}
        /> */}

        <MeasurementDetails measurement={measurement} isOpen={isOpen} onOpenChange={setIsOpen} />
      </CardContent>

{/*       <CardFooter className="text-xs text-muted-foreground pt-0 pb-2 flex flex-wrap gap-2">
        <span>Recorded: {formattedDate}</span>
        {origCollectionDate && (
          <>
            <span className="text-muted-foreground">•</span>
            <span>
              ({collectionDateType === 'exact' ? 'Exact' : 'Estimated'}) Collection Date: {origCollectionDate}
            </span>
          </>
        )}
      </CardFooter> */}

      <NewJobDialog
        isOpen={newJobDialogOpen}
        onOpenChange={setNewJobDialogOpen}
        clientId={measurement.id}
        clientName={measurement.name}
        defaultCurrency={measurement.serviceChargeCurrency || 'NGN'}
        onSubmit={handleNewJob}
        isSubmitting={isSubmitting}
      />

      {/* Job List Modal */}
      <Dialog open={jobListOpen} onOpenChange={setJobListOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Job List for {measurement.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {getAllJobs().map((job, idx) => (
              <div key={idx} className="p-3 border rounded shadow-sm">
                <p>
                  <strong>{job.label || `Job ${idx + 1}`}</strong>
                </p>
                <p>Recorded Date: {formatDateTime(job.recordedDateTime)}</p>
                <p>
                  Collection Date: {formatDate(job.collectionDate)}
                </p>
                <p>
                  Service Charge: {job.serviceChargeCurrency}
                  {job.serviceCharge.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p>
                  Paid Amount: {job.serviceChargeCurrency}
                  {job.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p>
                  Balance: {job.serviceChargeCurrency}
                  {job.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>

          {/* Total Paid Amount */}
          <div className="p-3 mt-4 border-t font-semibold text-right">
            Total Paid Amount: {measurement.serviceChargeCurrency || 'NGN'}{' '}
            {getTotalPaidAmount().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          <DialogClose asChild>
            <Button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Invoice Selection Dialog */}
      <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Job for Invoice</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <label htmlFor="job-select" className="block mb-2 font-medium">
              Choose a job:
            </label>
            <select
              id="job-select"
              className="w-full border rounded p-2"
              value={selectedJobIndex !== null ? selectedJobIndex : ''}
              onChange={(e) => setSelectedJobIndex(Number(e.target.value))}
            >
              <option value="" disabled>
                -- Select a job --
              </option>
              {getAllJobs().map((job, idx) => (
                <option key={idx} value={idx}>
                  {job.label || `Job ${idx + 1}`} - {formatDate(job.recordedDateTime)}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setInvoiceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateInvoice} disabled={selectedJobIndex === null}>
              Generate Invoice
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MeasurementCard;
