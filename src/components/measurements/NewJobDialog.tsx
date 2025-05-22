
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { getCurrencySymbol } from '@/utils/formatters';
import { useToast } from '@/components/ui/use-toast';

interface JobData {
  description?: string; // Added job description field
  serviceCharge: number;
  paidAmount: number;
  balance: number;
  collectionDateType: 'estimated' | 'exact';
  serviceChargeCurrency: string;
  clientId: string;
  clientName: string;
  timestamp: string;
  collectionDate: string | null;
  recordedDateTime: string;
}

interface NewJobDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  clientId: string;
  defaultCurrency: string;
  onSubmit: (clientId: string, jobData: JobData) => Promise<void>;
  isSubmitting: boolean;
}

const NewJobDialog: React.FC<NewJobDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  clientName, 
  clientId,
  defaultCurrency,
  onSubmit,
  isSubmitting
}) => {
  const { toast } = useToast();
  const [collectionDate, setCollectionDate] = useState<Date | undefined>(undefined);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [jobData, setJobData] = useState<{
    description: string;
    serviceCharge: string;
    paidAmount: string; 
    balance: string; 
    collectionDateType: 'estimated' | 'exact';
    serviceChargeCurrency: string;
  }>({
    description: '',
    serviceCharge: '',
    paidAmount: '', 
    balance: '', 
    collectionDateType: 'estimated',
    serviceChargeCurrency: defaultCurrency || 'NGN'
  });

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!jobData.serviceCharge || isNaN(Number(jobData.serviceCharge))) {
      errors.serviceCharge = 'Valid service charge required';
    }
    
    if (jobData.paidAmount && isNaN(Number(jobData.paidAmount))) {
      errors.paidAmount = 'Enter a valid number';
    }
    
    if (!collectionDate) {
      errors.collectionDate = 'Collection date required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Convert string values to numbers
      const serviceCharge = Number(jobData.serviceCharge);
      const paidAmount = Number(jobData.paidAmount || '0');
      const balance = serviceCharge - paidAmount;

      const numericData: JobData = {
        description: jobData.description, // Include job description
        serviceCharge: serviceCharge,
        paidAmount: paidAmount,
        balance: balance,
        collectionDateType: jobData.collectionDateType,
        serviceChargeCurrency: jobData.serviceChargeCurrency,
        clientId,
        clientName,
        timestamp: new Date().toISOString(),
        collectionDate: collectionDate ? collectionDate.toISOString() : null,
        recordedDateTime: new Date().toISOString()
      };

      await onSubmit(clientId, numericData);
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save job data',
        variant: 'destructive'
      });
      console.error('Error saving job:', error);
    }
  };

  const resetForm = () => {
    setCollectionDate(undefined);
    setJobData({
      description: '',
      serviceCharge: '',
      paidAmount: '',
      balance: '',
      collectionDateType: 'estimated',
      serviceChargeCurrency: defaultCurrency || 'NGN'
    });
    setFormErrors({});
    onOpenChange(false);
  };

  // Auto-calculate balance
  useEffect(() => {
    const serviceCharge = parseFloat(jobData.serviceCharge || '0');
    const paidAmount = parseFloat(jobData.paidAmount || '0');
    const balance = serviceCharge - paidAmount;
    
    setJobData(prev => ({
      ...prev,
      balance: isNaN(balance) ? '' : balance.toFixed(2)
    }));
  }, [jobData.serviceCharge, jobData.paidAmount]);

  const handleNumericInput = (field: 'serviceCharge' | 'paidAmount', value: string) => {
    // Allow only numbers and decimal points
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setJobData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Job for {clientName}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Job Description - New field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="job-description" className="col-span-4">
              Job Description
            </Label>
            <Input
              id="job-description"
              className="col-span-4"
              value={jobData.description}
              onChange={(e) => setJobData({...jobData, description: e.target.value})}
              placeholder="Enter job description"
            />
          </div>

          {/* Collection Date Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="collection-date-type" className="col-span-4">
              Collection Date Type
            </Label>
            <div className="flex items-center space-x-4 col-span-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="estimated"
                  value="estimated"
                  checked={jobData.collectionDateType === 'estimated'}
                  onChange={() => setJobData({...jobData, collectionDateType: 'estimated'})}
                  className="h-4 w-4"
                />
                <Label htmlFor="estimated">Estimated</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="exact"
                  value="exact"
                  checked={jobData.collectionDateType === 'exact'}
                  onChange={() => setJobData({...jobData, collectionDateType: 'exact'})}
                  className="h-4 w-4"
                />
                <Label htmlFor="exact">Exact</Label>
              </div>
            </div>
          </div>

          {/* Collection Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="collection-date" className="col-span-4">
              {jobData.collectionDateType === 'exact' ? 'Exact' : 'Estimated'} Collection Date
            </Label>
            <div className="col-span-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !collectionDate && "text-muted-foreground"
                    )}
                  >
                    {collectionDate ? format(collectionDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={collectionDate}
                    onSelect={setCollectionDate}
                    initialFocus
                    fromDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
              {formErrors.collectionDate && (
                <p className="text-sm text-red-500 mt-1">{formErrors.collectionDate}</p>
              )}
            </div>
          </div>

          {/* Currency */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="service-charge-currency" className="col-span-4">
              Currency
            </Label>
            <select
              id="service-charge-currency"
              className="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={jobData.serviceChargeCurrency}
              onChange={(e) => setJobData({...jobData, serviceChargeCurrency: e.target.value})}
            >
              <option value="NGN">₦ NGN</option>
              <option value="USD">$ USD</option>
              <option value="GBP">£ GBP</option>
              <option value="EUR">€ EUR</option>
              <option value="CAD">$ CAD</option>
            </select>
          </div>

          {/* Service Charge */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="service-charge" className="col-span-4">
              Service Charge *
            </Label>
            <div className="flex col-span-4">
              <div className="flex items-center px-3 border rounded-l-md bg-muted/50 h-10">
                {getCurrencySymbol(jobData.serviceChargeCurrency)}
              </div>
              <Input
                id="service-charge"
                placeholder="0.00"
                value={jobData.serviceCharge}
                onChange={(e) => handleNumericInput('serviceCharge', e.target.value)}
                className="rounded-l-none"
              />
            </div>
            {formErrors.serviceCharge && (
              <p className="text-sm text-red-500 col-span-4 -mt-2">{formErrors.serviceCharge}</p>
            )}
          </div>
          
          {/* Paid Amount */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paid-amount" className="col-span-4">
              Paid Amount
            </Label>
            <div className="flex col-span-4">
              <div className="flex items-center px-3 border rounded-l-md bg-muted/50 h-10">
                {getCurrencySymbol(jobData.serviceChargeCurrency)}
              </div>
              <Input
                id="paid-amount"
                placeholder="0.00"
                value={jobData.paidAmount}
                onChange={(e) => handleNumericInput('paidAmount', e.target.value)}
                className="rounded-l-none"
              />
            </div>
            {formErrors.paidAmount && (
              <p className="text-sm text-red-500 col-span-4 -mt-2">{formErrors.paidAmount}</p>
            )}
          </div>
          
          {/* Balance */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="balance" className="col-span-4">
              Balance (Calculated)
            </Label>
            <div className="flex col-span-4">
              <div className="flex items-center px-3 border rounded-l-md bg-muted/50 h-10">
                {getCurrencySymbol(jobData.serviceChargeCurrency)}
              </div>
              <Input
                id="balance"
                value={jobData.balance}
                className="rounded-l-none bg-gray-50"
                readOnly
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={resetForm}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Job'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewJobDialog;
