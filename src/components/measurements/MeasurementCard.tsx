
import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PaymentSummary from './PaymentSummary';
import MeasurementDetails from './MeasurementDetails';
import CardActions from './CardActions';
import JobsList from './JobsList';
import NewJobDialog from './NewJobDialog';

interface MeasurementCardProps {
  measurement: Record<string, any>;
  index: number;
  onDelete: (index: number) => void;
  handleEdit: (index: number) => void;
  onAddJob?: (clientId: string, jobData: any) => void;
}

const MeasurementCard = ({
  measurement,
  index,
  onDelete,
  handleEdit,
  onAddJob
}: MeasurementCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [jobListOpen, setJobListOpen] = useState(false);
  const [newJobDialogOpen, setNewJobDialogOpen] = useState(false);

  // Helper function to get all jobs (initial + additional)
  const getAllJobs = () => {
    const initialJob = {
      recordedDateTime: measurement.timestamp,
      collectionDate: measurement.collectionDate,
      serviceCharge: measurement.serviceCharge || '0',
      paidAmount: measurement.paidAmount || '0',
      balance: parseFloat(measurement.serviceCharge || '0') - parseFloat(measurement.paidAmount || '0'),
      serviceChargeCurrency: measurement.serviceChargeCurrency || 'NGN',
      label: 'Initial Job'
    };
    
    // measurement.jobs is an array of job objects added via "New Job"
    const jobs = Array.isArray(measurement.jobs) ? measurement.jobs : [];
    return [initialJob, ...jobs];
  };

  // Format timestamp
  const timestamp = measurement.timestamp
    ? new Date(measurement.timestamp)
    : new Date();
  const formattedDate = timestamp.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

  // Format collection date if available
  const origCollectionDate = measurement.collectionDate
    ? new Date(measurement.collectionDate).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  // Get collection date type (estimated or exact)
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
  const balance = serviceCharge - paidAmount;

  const handleNewJob = (clientId: string, jobData: any) => {
    if (onAddJob) {
      onAddJob(clientId, jobData);
      setNewJobDialogOpen(false);
    }
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
          <div className="flex items-center space-x-2">
            <CardActions 
              measurementId={measurement.id}
              index={index}
              handleEdit={handleEdit}
              onDelete={onDelete}
              onNewJobClick={() => setNewJobDialogOpen(true)}
            />
            <JobsList
              jobs={getAllJobs()}
              currency={measurement.serviceChargeCurrency || 'NGN'}
              isOpen={jobListOpen}
              onOpenChange={setJobListOpen}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Payment summary section */}
        <PaymentSummary 
          serviceCharge={serviceCharge} 
          paidAmount={paidAmount} 
          balance={balance}
          currency={measurement.serviceChargeCurrency || 'NGN'}
        />

        <MeasurementDetails 
          measurement={measurement}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        />
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground pt-0 pb-2 flex flex-wrap gap-2">
        <span>Recorded: {formattedDate}</span>
        {origCollectionDate && (
          <>
            <span className="text-muted-foreground">•</span>
            <span>
              ({collectionDateType === 'exact' ? 'Exact' : 'Estimated'}) Collection Date: {origCollectionDate}
            </span>
          </>
        )}
      </CardFooter>

      <NewJobDialog
        isOpen={newJobDialogOpen}
        onOpenChange={setNewJobDialogOpen}
        clientId={measurement.id}
        clientName={measurement.name}
        defaultCurrency={measurement.serviceChargeCurrency || 'NGN'}
        onSubmit={handleNewJob}
      />
    </Card>
  );
};

export default MeasurementCard;
