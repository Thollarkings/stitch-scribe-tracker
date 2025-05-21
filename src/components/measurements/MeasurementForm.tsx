import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MeasurementData {
  name?: string;
  phone?: string;
  comments?: string;
  collectionDateType?: string;
  timestamp?: string;
  collectionDate?: Date | string;
  serviceCharge?: number;
  paidAmount?: number;
  serviceChargeCurrency?: string;
  balance?: number;
  head?: number;
  neck?: number;
  shoulderToShoulder?: number;
  chest?: number;
  waist?: number;
  shoulderToNipple?: number;
  shoulderToUnderbust?: number;
  shoulderToWaist?: number;
  nippleToNipple?: number;
  sleeveLength?: number;
  roundSleeve?: number;
  hip?: number;
  halfLength?: number;
  topLength?: number;
  gownLength?: number;
  trouserWaist?: number;
  crotch?: number;
  trouserLength?: number;
  thigh?: number;
  waistToKnee?: number;
  calf?: number;
  ankle?: number;
  insideLegSeam?: number;
  [key: string]: string | number | Date | undefined;
}

interface MeasurementFormProps {
  onSave: (data: MeasurementData) => void;
  editingData?: MeasurementData;
  setEditingIndex: (index: number | null) => void;
}

// List of all numeric field names
const numericFields = [
  'serviceCharge', 'paidAmount', 'balance',
  'head', 'neck', 'shoulderToShoulder', 'chest', 'waist',
  'shoulderToNipple', 'shoulderToUnderbust', 'shoulderToWaist', 'nippleToNipple',
  'sleeveLength', 'roundSleeve', 'hip', 'halfLength', 'topLength', 'gownLength',
  'trouserWaist', 'crotch', 'trouserLength', 'thigh', 'waistToKnee', 'calf', 'ankle', 'insideLegSeam'
];

const upperBodyFields = [
  { name: 'head', label: 'Head' },
  { name: 'neck', label: 'Neck' },
  { name: 'shoulderToShoulder', label: 'Shoulder to Shoulder' },
  { name: 'chest', label: 'Chest' },
  { name: 'waist', label: 'Waist' },
  { name: 'shoulderToNipple', label: 'Shoulder to Nipple' },
  { name: 'shoulderToUnderbust', label: 'Shoulder to Underbust' },
  { name: 'shoulderToWaist', label: 'Shoulder to Waist' },
  { name: 'nippleToNipple', label: 'Nipple to Nipple' },
];

const sleevesFields = [
  { name: 'sleeveLength', label: 'Sleeve Length' },
  { name: 'roundSleeve', label: 'Round Sleeve' },
];

const lowerBodyFields = [
  { name: 'hip', label: 'Hip' },
  { name: 'halfLength', label: 'Half Length' },
  { name: 'topLength', label: 'Top Length' },
  { name: 'gownLength', label: 'Gown Length' },
];

const trouserFields = [
  { name: 'trouserWaist', label: 'Trouser Waist' },
  { name: 'crotch', label: 'Crotch' },
  { name: 'trouserLength', label: 'Trouser Length' },
  { name: 'thigh', label: 'Thigh' },
  { name: 'waistToKnee', label: 'Waist to Knee' },
  { name: 'calf', label: 'Calf' },
  { name: 'ankle', label: 'Ankle' },
  { name: 'insideLegSeam', label: 'Inside Leg Seam' },
];

const MeasurementForm = ({ onSave, editingData, setEditingIndex }: MeasurementFormProps) => {
  const [formData, setFormData] = useState<MeasurementData>({});
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [balance, setBalance] = useState<number>(0);

  // Normalize imported or loaded data
  useEffect(() => {
    if (editingData) {
      const normalized: MeasurementData = { ...editingData };
      numericFields.forEach(field => {
        if (normalized[field] !== undefined && normalized[field] !== null && normalized[field] !== '') {
          normalized[field] = Number(normalized[field]);
        }
      });
      setFormData(normalized);

      // Handle collectionDate as Date object
      if (editingData.collectionDate) {
        setDate(new Date(editingData.collectionDate));
      }
    } else {
      setFormData({});
      setDate(undefined);
    }
  }, [editingData]);

  // Recalculate balance whenever serviceCharge or paidAmount changes
  useEffect(() => {
    const serviceCharge = typeof formData.serviceCharge === 'number'
      ? formData.serviceCharge
      : parseFloat(formData.serviceCharge as string) || 0;
    const paidAmount = typeof formData.paidAmount === 'number'
      ? formData.paidAmount
      : parseFloat(formData.paidAmount as string) || 0;
    setBalance(serviceCharge - paidAmount);
  }, [formData.serviceCharge, formData.paidAmount]);

  // Handle input changes and keep numeric fields as numbers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? (value === '' ? '' : Number(value))
        : value,
    }));
  };

  const handleCollectionTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, collectionDateType: value }));
  };

  const handleCollectionDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setFormData((prev) => ({ ...prev, collectionDate: date }));
    } else {
      const { collectionDate, ...rest } = formData;
      setFormData(rest);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure numeric fields are numbers before saving
    const dataToSave: MeasurementData = { ...formData };
    numericFields.forEach(field => {
      if (dataToSave[field] !== undefined && dataToSave[field] !== null && dataToSave[field] !== '') {
        dataToSave[field] = Number(dataToSave[field]);
      }
    });
    // Save the calculated balance as well
    dataToSave.balance = balance;
    dataToSave.timestamp = new Date().toISOString();
    onSave(dataToSave);
    setFormData({});
    setDate(undefined);
  };

  const handleCancel = () => {
    setFormData({});
    setDate(undefined);
    setEditingIndex(null);
  };

  const renderMeasurementInputs = (fields: { name: string; label: string }[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            name={field.name}
            type="number"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            value={
              typeof formData[field.name] === 'number' || typeof formData[field.name] === 'string'
                ? formData[field.name] as string | number
                : ''
            }
            onChange={handleChange}
            className="w-full"
            min="0"
          />
        </div>
      ))}
    </div>
  );

  return (
    <Card className="w-full border border-border shadow-md animate-fade-in">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-xl">
          {editingData ? 'Edit Client Measurements' : 'New Client Measurements'}
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="required">Client's Name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Full name"
                value={formData.name || ''}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="required">Client's Phone</Label>
              <Input
                id="phone"
                name="phone"
                required
                placeholder="Phone number"
                pattern="[\+]?[\d\- ]+"
                title="Phone number with optional +, - or spaces"
                value={formData.phone || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Collection Date & Payment Section - IMPROVED LAYOUT */}
          <div className="bg-muted/30 p-4 rounded-lg my-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Type and Date Picker */}
              <div className="space-y-3">
                <Label className="text-base font-medium block">Collection Date</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date Type</Label>
                    <RadioGroup
                      value={formData.collectionDateType as string || 'estimated'}
                      onValueChange={handleCollectionTypeChange}
                      className="flex flex-col space-y-1 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="estimated" id="estimated" />
                        <Label htmlFor="estimated">Estimated</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="exact" id="exact" />
                        <Label htmlFor="exact">Exact</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="mb-2 block">
                      {formData.collectionDateType === 'exact'
                        ? 'Exact Collection Date'
                        : 'Estimated Collection Date'}
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="collectionDate"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP') : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleCollectionDateChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Payment section with improved layout */}
              <div className="space-y-4">
                <Label className="text-base font-medium block">Payment Information</Label>
                <div className="grid grid-cols-1 gap-4 mt-2">
                  {/* Currency Selector */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="serviceChargeCurrency">Currency</Label>
                    <select
                      id="serviceChargeCurrency"
                      name="serviceChargeCurrency"
                      value={formData.serviceChargeCurrency || 'NGN'}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md h-10 bg-background"
                    >
                      <option value="NGN">₦ NGN</option>
                      <option value="USD">$ USD</option>
                      <option value="GBP">£ GBP</option>
                      <option value="EUR">€ EUR</option>
                      <option value="CAD">$ CAD</option>
                    </select>
                  </div>

                  {/* Service Charge and Paid Amount */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="serviceCharge">Service Charge</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border rounded-l-md bg-muted/50 h-10">
                          {formData.serviceChargeCurrency === 'USD' && '$'}
                          {formData.serviceChargeCurrency === 'GBP' && '£'}
                          {formData.serviceChargeCurrency === 'EUR' && '€'}
                          {formData.serviceChargeCurrency === 'CAD' && '$'}
                          {(!formData.serviceChargeCurrency || formData.serviceChargeCurrency === 'NGN') && '₦'}
                        </div>
                        <Input
                          id="serviceCharge"
                          name="serviceCharge"
                          type="number"
                          placeholder="0.00"
                          value={formData.serviceCharge ?? ''}
                          onChange={handleChange}
                          className="rounded-l-none"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paidAmount">Paid Amount</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border rounded-l-md bg-muted/50 h-10">
                          {formData.serviceChargeCurrency === 'USD' && '$'}
                          {formData.serviceChargeCurrency === 'GBP' && '£'}
                          {formData.serviceChargeCurrency === 'EUR' && '€'}
                          {formData.serviceChargeCurrency === 'CAD' && '$'}
                          {(!formData.serviceChargeCurrency || formData.serviceChargeCurrency === 'NGN') && '₦'}
                        </div>
                        <Input
                          id="paidAmount"
                          name="paidAmount"
                          type="number"
                          placeholder="0.00"
                          value={formData.paidAmount ?? ''}
                          onChange={handleChange}
                          className="rounded-l-none"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Balance - readonly */}
                  <div className="space-y-2">
                    <Label htmlFor="balance">Balance</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 border rounded-l-md bg-muted/50 h-10">
                        {formData.serviceChargeCurrency === 'USD' && '$'}
                        {formData.serviceChargeCurrency === 'GBP' && '£'}
                        {formData.serviceChargeCurrency === 'EUR' && '€'}
                        {formData.serviceChargeCurrency === 'CAD' && '$'}
                        {(!formData.serviceChargeCurrency || formData.serviceChargeCurrency === 'NGN') && '₦'}
                      </div>
                      <Input
                        id="balance"
                        readOnly
                        value={balance.toFixed(2)}
                        className="rounded-l-none bg-muted/30"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <Tabs defaultValue="upper-body" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="upper-body">Upper Body</TabsTrigger>
              <TabsTrigger value="sleeves">Sleeves</TabsTrigger>
              <TabsTrigger value="lower-body">Lower Body</TabsTrigger>
              <TabsTrigger value="trousers">Trousers</TabsTrigger>
            </TabsList>

            <TabsContent value="upper-body">
              {renderMeasurementInputs(upperBodyFields)}
            </TabsContent>
            <TabsContent value="sleeves">
              {renderMeasurementInputs(sleevesFields)}
            </TabsContent>
            <TabsContent value="lower-body">
              {renderMeasurementInputs(lowerBodyFields)}
            </TabsContent>
            <TabsContent value="trousers">
              {renderMeasurementInputs(trouserFields)}
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              id="comments"
              name="comments"
              placeholder="Special requirements, preferences, fabric details..."
              value={formData.comments || ''}
              onChange={handleChange}
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4 pt-2 pb-6">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-tailor-navy hover:bg-tailor-lightnav text-white"
          >
            {editingData ? 'Update Measurements' : 'Save Measurements'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MeasurementForm;
