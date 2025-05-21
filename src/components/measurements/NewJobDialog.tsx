import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { getCurrencySymbol } from '@/utils/formatters';

interface NewJobDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  clientId: string;
  defaultCurrency: string;
  onSubmit: (clientId: string, jobData: any) => void;
}

const NewJobDialog: React.FC<NewJobDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  clientName, 
  clientId,
  defaultCurrency,
  onSubmit 
}) => {
  const [collectionDate, setCollectionDate] = useState<Date | undefined>(undefined);
  const [jobData, setJobData] = useState({
    serviceCharge: '',
    paidAmount: '', 
    balance: '', 
    collectionDateType: 'estimated',
    serviceChargeCurrency: defaultCurrency || 'NGN'
  });

  const handleSubmit = () => {
    // Calculate balance based on service charge and paid amount
    const serviceCharge = parseFloat(jobData.serviceCharge || '0');
    const paidAmount = parseFloat(jobData.paidAmount || '0');
    const calculatedBalance = serviceCharge - paidAmount;
    
    // Convert string values to numbers where appropriate
    const newJobData = {
      ...jobData,
      serviceCharge: serviceCharge,
      paidAmount: paidAmount,
      balance: calculatedBalance,
      clientId,
      clientName,
      timestamp: new Date().toISOString(),
      collectionDate: collectionDate ? collectionDate.toISOString() : null,
      recordedDateTime: new Date().toISOString()
    };
    
    onSubmit(clientId, newJobData);
    resetForm();
  };

  const resetForm = () => {
    onOpenChange(false);
    setCollectionDate(undefined);
    setJobData({
      serviceCharge: '',
      paidAmount: '',
      balance: '',
      collectionDateType: 'estimated',
      serviceChargeCurrency: defaultCurrency || 'NGN'
    });
  };

  // Auto-calculate balance whenever service charge or paid amount changes
  useEffect(() => {
    if (jobData.serviceCharge || jobData.paidAmount) {
      const calculatedBalance = 
        (parseFloat(jobData.serviceCharge || '0') - parseFloat(jobData.paidAmount || '0')).toFixed(2);
      setJobData(prev => ({...prev, balance: calculatedBalance }));
    }
  }, [jobData.serviceCharge, jobData.paidAmount]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Job for {clientName}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="collection-date-type" className="col-span-4">
              Collection Date Type
            </Label>
            <div className="flex items-center space-x-2 col-span-4">
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
            <div className="flex items-center space-x-2 col-span-4">
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
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="service-charge-currency" className="col-span-4">
              Currency
            </Label>
            <select
              id="service-charge-currency"
              className="col-span-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="service-charge" className="col-span-4">
              Service Charge
            </Label>
            <div className="flex col-span-4">
              <div className="flex items-center px-3 border rounded-l-md bg-muted/50 h-10">
                {getCurrencySymbol(jobData.serviceChargeCurrency)}
              </div>
              <Input
                id="service-charge"
                type="number"
                placeholder="0.00"
                value={jobData.serviceCharge}
                onChange={(e) => setJobData({...jobData, serviceCharge: e.target.value})}
                className="rounded-l-none"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
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
                type="number"
                placeholder="0.00"
                value={jobData.paidAmount}
                onChange={(e) => setJobData({...jobData, paidAmount: e.target.value})}
                className="rounded-l-none"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
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
                type="text"
                value={jobData.balance}
                className="rounded-l-none bg-gray-50"
                readOnly
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={resetForm}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>Save Job</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewJobDialog;
