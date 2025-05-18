
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Edit, Trash2 } from 'lucide-react';

interface MeasurementCardProps {
  measurement: Record<string, any>;
  index: number;
  onDelete: (index: number) => void;
  handleEdit: (index: number) => void;
}

const MeasurementCard = ({ measurement, index, onDelete, handleEdit }: MeasurementCardProps) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Define measurement fields with labels and keys
  const measurementFields = [
    { label: 'Upper Body', items: [
      { key: 'head', label: 'Head' },
      { key: 'shoulderToShoulder', label: 'Shoulder to Shoulder' },
      { key: 'neck', label: 'Neck' },
      { key: 'chest', label: 'Chest' },
      { key: 'waist', label: 'Waist' },
      { key: 'shoulderToNipple', label: 'Shoulder to Nipple' },
      { key: 'shoulderToUnderbust', label: 'Shoulder to Underbust' },
      { key: 'shoulderToWaist', label: 'Shoulder to Waist' },
      { key: 'nippleToNipple', label: 'Nipple to Nipple' },
    ]},
    { label: 'Sleeves', items: [
      { key: 'sleeveLength', label: 'Sleeve Length' },
      { key: 'roundSleeve', label: 'Round Sleeve' },
    ]},
    { label: 'Lower Body', items: [
      { key: 'hip', label: 'Hip' },
      { key: 'halfLength', label: 'Half Length' },
      { key: 'topLength', label: 'Top Length' },
      { key: 'gownLength', label: 'Gown Length' },
    ]},
    { label: 'Trousers', items: [
      { key: 'trouserWaist', label: 'Trouser Waist' },
      { key: 'crotch', label: 'Crotch' },
      { key: 'trouserLength', label: 'Trouser Length' },
      { key: 'thigh', label: 'Thigh' },
      { key: 'waistToKnee', label: 'Waist to Knee' },
      { key: 'calf', label: 'Calf' },
      { key: 'ankle', label: 'Ankle' },
      { key: 'insideLegSeam', label: 'Inside Leg Seam' },
    ]},
  ];

  // Format timestamp
  const timestamp = measurement.timestamp ? new Date(measurement.timestamp) : new Date();
  const formattedDate = timestamp.toLocaleString('en-US', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

  const handleDeleteClick = () => {
    if (confirmingDelete) {
      onDelete(index);
    } else {
      setConfirmingDelete(true);
      setTimeout(() => setConfirmingDelete(false), 3000); // Reset after 3 seconds
    }
  };

  return (
    <Card className="mb-4 border-l-4 border-l-tailor-gold overflow-hidden animate-fade-in">
      <CardHeader className="bg-muted/30 pb-2">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <div>
            <h3 className="text-lg font-semibold mb-0">{measurement.name}</h3>
            <div className="text-sm text-muted-foreground flex flex-wrap gap-2 items-center">
              <span>{measurement.phone}</span>
              <Badge variant="outline" className="text-xs">
                {timeAgo}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" onClick={() => handleEdit(index)}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button 
              size="sm" 
              variant={confirmingDelete ? "destructive" : "ghost"}
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4 mr-1" /> 
              {confirmingDelete ? "Confirm" : "Delete"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <Accordion type="single" collapsible className="w-full">
          {measurementFields.map((section, idx) => (
            <AccordionItem key={idx} value={`section-${idx}`}>
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                {section.label} Measurements
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  {section.items.map(item => measurement[item.key] && (
                    <div key={item.key} className="flex justify-between p-1.5 border rounded border-border/60">
                      <span className="text-muted-foreground">{item.label}:</span>
                      <span className="font-medium">{measurement[item.key]}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
          
          {measurement.comments && (
            <AccordionItem value="comments">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                Additional Comments
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm whitespace-pre-wrap">{measurement.comments}</p>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground pt-0 pb-2">
        Recorded: {formattedDate}
      </CardFooter>
    </Card>
  );
};

export default MeasurementCard;
