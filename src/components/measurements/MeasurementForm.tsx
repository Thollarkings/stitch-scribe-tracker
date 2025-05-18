
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

interface MeasurementData {
  [key: string]: string | number;
  name?: string;
  phone?: string;
  timestamp?: string;
}

interface MeasurementFormProps {
  onSave: (data: MeasurementData) => void;
  editingIndex: number | null;
  setEditingIndex: (index: number | null) => void;
}

const MeasurementForm = ({ onSave, editingIndex, setEditingIndex }: MeasurementFormProps) => {
  const [formData, setFormData] = useState<MeasurementData>({});

  useEffect(() => {
    if (editingIndex !== null) {
      const measurements = JSON.parse(localStorage.getItem('clientMeasurements') || '[]');
      setFormData(measurements[editingIndex] || {});
    } else {
      setFormData({});
    }
  }, [editingIndex]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, timestamp: new Date().toISOString() });
    setFormData({});
  };

  const handleCancel = () => {
    setFormData({});
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
