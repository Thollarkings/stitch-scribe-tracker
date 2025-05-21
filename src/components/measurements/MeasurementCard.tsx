
import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Edit, Trash2, ChevronDown, Plus, FileText, ListTodo } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface MeasurementCardProps {
  measurement: Record<string, any>;
  index: number;
  onDelete: (index: number) => void;
  handleEdit: (index: number) => void;
  onAddJob?: (clientId: string, jobData: any) => void;
}

const getCurrencySymbol = (currency?: string) => {
  switch (currency) {
    case 'USD':
    case 'CAD':
      return '$';
    case 'GBP':
      return '£';
    case 'EUR':
      return '€';
    case 'NGN':
    default:
      return '₦';
  }
};

const MeasurementCard = ({
  measurement,
  index,
  onDelete,
  handleEdit,
  onAddJob
}: MeasurementCardProps) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [jobListOpen, setJobListOpen] = useState(false);
  const [newJobDialogOpen, setNewJobDialogOpen] = useState(false);
  const [collectionDate, setCollectionDate] = useState<Date | undefined>(undefined);
  const [newJobData, setNewJobData] = useState({
    serviceCharge: '',
    paidAmount: '', 
    balance: '', 
    collectionDateType: 'estimated',
    serviceChargeCurrency: measurement.serviceChargeCurrency || 'NGN'
  });
  const navigate = useNavigate();

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

  // Helper to calculate total paid amount
  const getTotalPaidAmount = () => {
    return getAllJobs().reduce((acc, job) => 
      acc + (typeof job.paidAmount === 'number' ? job.paidAmount : parseFloat(job.paidAmount || '0')), 0);
  };

  // Define measurement fields with labels and keys
  const measurementFields = [
    {
      label: 'Upper Body',
      items: [
        { key: 'head', label: 'Head' },
        { key: 'shoulderToShoulder', label: 'Shoulder to Shoulder' },
        { key: 'neck', label: 'Neck' },
        { key: 'chest', label: 'Chest' },
        { key: 'waist', label: 'Waist' },
        { key: 'shoulderToNipple', label: 'Shoulder to Nipple' },
        { key: 'shoulderToUnderbust', label: 'Shoulder to Underbust' },
        { key: 'shoulderToWaist', label: 'Shoulder to Waist' },
        { key: 'nippleToNipple', label: 'Nipple to Nipple' }
      ]
    },
    {
      label: 'Sleeves',
      items: [
        { key: 'sleeveLength', label: 'Sleeve Length' },
        { key: 'roundSleeve', label: 'Round Sleeve' }
      ]
    },
    {
      label: 'Lower Body',
      items: [
        { key: 'hip', label: 'Hip' },
        { key: 'halfLength', label: 'Half Length' },
        { key: 'topLength', label: 'Top Length' },
        { key: 'gownLength', label: 'Gown Length' }
      ]
    },
    {
      label: 'Trousers',
      items: [
        { key: 'trouserWaist', label: 'Trouser Waist' },
        { key: 'crotch', label: 'Crotch' },
        { key: 'trouserLength', label: 'Trouser Length' },
        { key: 'thigh', label: 'Thigh' },
        { key: 'waistToKnee', label: 'Waist to Knee' },
        { key: 'calf', label: 'Calf' },
        { key: 'ankle', label: 'Ankle' },
        { key: 'insideLegSeam', label: 'Inside Leg Seam' }
      ]
    }
  ];

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
  const currencySymbol = getCurrencySymbol(measurement.serviceChargeCurrency);
  const serviceCharge =
    typeof measurement.serviceCharge === 'number'
      ? measurement.serviceCharge
      : parseFloat(measurement.serviceCharge || '0');
  const paidAmount =
    typeof measurement.paidAmount === 'number'
      ? measurement.paidAmount
      : parseFloat(measurement.paidAmount || '0');
  const balance = serviceCharge - paidAmount;

  const handleDeleteClick = () => {
    if (confirmingDelete) {
      onDelete(index);
      setConfirmingDelete(false);
    } else {
      setConfirmingDelete(true);
      const timer = setTimeout(() => setConfirmingDelete(false), 3000);
      return () => clearTimeout(timer);
    }
  };

  const handleNewJobSubmit = () => {
    if (onAddJob && measurement.id) {
      // Calculate balance based on service charge and paid amount
      const calculatedBalance = parseFloat(newJobData.serviceCharge || '0') - parseFloat(newJobData.paidAmount || '0');
      
      const jobData = {
        ...newJobData,
        balance: calculatedBalance.toString(),
        clientId: measurement.id,
        clientName: measurement.name,
        timestamp: new Date().toISOString(),
        collectionDate: collectionDate ? collectionDate.toISOString() : null,
        recordedDateTime: new Date().toISOString()
      };
      
      onAddJob(measurement.id, jobData);
      setNewJobDialogOpen(false);
      setCollectionDate(undefined);
      setNewJobData({
        serviceCharge: '',
        paidAmount: '',
        balance: '',
        collectionDateType: 'estimated',
        serviceChargeCurrency: measurement.serviceChargeCurrency || 'NGN'
      });
    }
  };

  // Fix the navigation path - remove the duplicate /stitch-scribe-tracker prefix
  const handleInvoiceClick = () => {
    navigate(`/invoice/${measurement.id}`);
  };

  useEffect(() => {
    return () => setConfirmingDelete(false);
  }, [index]);

  // Auto-calculate balance whenever service charge or paid amount changes
  useEffect(() => {
    if (newJobData.serviceCharge || newJobData.paidAmount) {
      const calculatedBalance = 
        (parseFloat(newJobData.serviceCharge || '0') - parseFloat(newJobData.paidAmount || '0')).toFixed(2);
      setNewJobData(prev => ({...prev, balance: calculatedBalance }));
    }
  }, [newJobData.serviceCharge, newJobData.paidAmount]);

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
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white/80 hover:bg-white"
              onClick={() => setNewJobDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> New Job
            </Button>
            <DropdownMenu open={jobListOpen} onOpenChange={setJobListOpen}>
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
                  {getAllJobs().map((job, idx) => (
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
                    <span>{currencySymbol} {getTotalPaidAmount().toFixed(2)}</span>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white/80 hover:bg-white"
              onClick={handleInvoiceClick}
            >
              <FileText className="h-4 w-4 mr-1" /> Service Invoice
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleEdit(index)}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button
              size="sm"
              variant={confirmingDelete ? 'destructive' : 'ghost'}
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {confirmingDelete ? 'Confirm' : 'Delete'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Payment summary section */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-indigo-50 border rounded p-2">
          <div>
            <span className="text-xs text-muted-foreground">Service Charge</span>
            <div className="font-semibold">
              {currencySymbol} {serviceCharge ? serviceCharge.toFixed(2) : '0.00'}
            </div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Paid Amount</span>
            <div className="font-semibold">
              {currencySymbol} {paidAmount ? paidAmount.toFixed(2) : '0.00'}
            </div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Balance</span>
            <div className="font-semibold">
              {currencySymbol} {balance.toFixed(2)}
            </div>
          </div>
        </div>
        {/* End payment summary */}

        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <CollapsibleTrigger className="flex w-full justify-between items-center rounded-md p-2 hover:bg-muted text-sm font-medium">
            View Client's Measurements
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            {measurementFields.map((section, idx) => {
              // Only show sections with at least one value
              const hasValues = section.items.some(
                (item) => measurement[item.key]
              );
              if (!hasValues) return null;

              return (
                <div key={`section-${idx}`} className="mb-4">
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                    {section.label} Measurements
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {section.items.map(
                      (item) =>
                        measurement[item.key] && (
                          <div
                            key={item.key}
                            className="flex justify-between p-1.5 border rounded border-border/60"
                          >
                            <span className="text-muted-foreground">
                              {item.label}:
                            </span>
                            <span className="font-medium">
                              {measurement[item.key]}
                            </span>
                          </div>
                        )
                    )}
                  </div>
                  {idx < measurementFields.length - 1 && hasValues && (
                    <Separator className="mt-3" />
                  )}
                </div>
              );
            })}

            {measurement.comments && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                  Additional Comments
                </h4>
                <p className="text-sm whitespace-pre-wrap p-2 border rounded border-border/60">
                  {measurement.comments}
                </p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
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

      {/* New Job Dialog with added fields for Paid Amount and Balance */}
      <Dialog open={newJobDialogOpen} onOpenChange={setNewJobDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Job for {measurement.name}</DialogTitle>
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
                  checked={newJobData.collectionDateType === 'estimated'}
                  onChange={() => setNewJobData({...newJobData, collectionDateType: 'estimated'})}
                  className="h-4 w-4"
                />
                <Label htmlFor="estimated">Estimated</Label>
              </div>
              <div className="flex items-center space-x-2 col-span-4">
                <input
                  type="radio"
                  id="exact"
                  value="exact"
                  checked={newJobData.collectionDateType === 'exact'}
                  onChange={() => setNewJobData({...newJobData, collectionDateType: 'exact'})}
                  className="h-4 w-4"
                />
                <Label htmlFor="exact">Exact</Label>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="collection-date" className="col-span-4">
                {newJobData.collectionDateType === 'exact' ? 'Exact' : 'Estimated'} Collection Date
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
                value={newJobData.serviceChargeCurrency}
                onChange={(e) => setNewJobData({...newJobData, serviceChargeCurrency: e.target.value})}
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
                  {getCurrencySymbol(newJobData.serviceChargeCurrency)}
                </div>
                <Input
                  id="service-charge"
                  type="number"
                  placeholder="0.00"
                  value={newJobData.serviceCharge}
                  onChange={(e) => setNewJobData({...newJobData, serviceCharge: e.target.value})}
                  className="rounded-l-none"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            {/* Added Paid Amount Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paid-amount" className="col-span-4">
                Paid Amount
              </Label>
              <div className="flex col-span-4">
                <div className="flex items-center px-3 border rounded-l-md bg-muted/50 h-10">
                  {getCurrencySymbol(newJobData.serviceChargeCurrency)}
                </div>
                <Input
                  id="paid-amount"
                  type="number"
                  placeholder="0.00"
                  value={newJobData.paidAmount}
                  onChange={(e) => setNewJobData({...newJobData, paidAmount: e.target.value})}
                  className="rounded-l-none"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            {/* Added Balance Field (read-only, automatically calculated) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="col-span-4">
                Balance (Calculated)
              </Label>
              <div className="flex col-span-4">
                <div className="flex items-center px-3 border rounded-l-md bg-muted/50 h-10">
                  {getCurrencySymbol(newJobData.serviceChargeCurrency)}
                </div>
                <Input
                  id="balance"
                  type="text"
                  value={newJobData.balance}
                  className="rounded-l-none bg-gray-50"
                  readOnly
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setNewJobDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleNewJobSubmit}>Save Job</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MeasurementCard;
