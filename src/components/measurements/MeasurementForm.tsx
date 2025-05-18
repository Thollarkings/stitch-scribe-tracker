
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
  [key: string]: string | number | Date | undefined;
}

interface MeasurementFormProps {
  onSave: (data: MeasurementData) => void;
  editingIndex: number | null;
  setEditingIndex: (index: number | null) => void;
}

const MeasurementForm = ({ onSave, editingIndex, setEditingIndex }: MeasurementFormProps) => {
  const [formData, setFormData] = useState<MeasurementData>({});
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (editingIndex !== null) {
      const measurements = JSON.parse(localStorage.getItem('clientMeasurements') || '[]');
      const measurement = measurements[editingIndex] || {};
      
      // Convert collectionDate string back to Date object if it exists
      if (measurement.collectionDate) {
        measurement.collectionDate = new Date(measurement.collectionDate);
        setDate(measurement.collectionDate);
      }
      
      setFormData(measurement);
    } else {
      setFormData({});
      setDate(undefined);
    }
  }, [editingIndex]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCollectionTypeChange = (value: string) => {
    setFormData({ ...formData, collectionDateType: value });
  };

  const handleCollectionDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setFormData({ ...formData, collectionDate: date });
    } else {
      // Create a new object without the collectionDate property
      const { collectionDate, ...rest } = formData;
      setFormData(rest);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a serializable version of the data for storage
    const dataToSave = { ...formData, timestamp: new Date().toISOString() };
    
    onSave(dataToSave);
    setFormData({});
    setDate(undefined);
  };

  const handleCancel = () => {
    setFormData({});
    setDate(undefined);
    setEditingIndex(null);
  };

  // Group measurements into categories for better organization
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
            value={formData[field.name] || ''}
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
          {editingIndex !== null ? 'Edit Client Measurements' : 'New Client Measurements'}
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

          {/* Collection Date Section */}
          <div className="bg-muted/30 p-4 rounded-lg my-6">
            <Label className="text-base font-medium mb-2 block">Collection Date</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Date Type</Label>
                <RadioGroup 
                  value={formData.collectionDateType as string || 'estimated'} 
                  onValueChange={handleCollectionTypeChange}
                  className="flex flex-col space-y-1"
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
              <div className="space-y-3">
                <Label>
                  {formData.collectionDateType === 'exact' ? 'Exact Collection Date' : 'Estimated Collection Date'}
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
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-tailor-navy hover:bg-tailor-lightnav text-white"
          >
            {editingIndex !== null ? 'Update Measurements' : 'Save Measurements'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MeasurementForm;
