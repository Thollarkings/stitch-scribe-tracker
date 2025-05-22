
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';

interface MeasurementDetailsProps {
  measurement: Record<string, any>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MeasurementDetails: React.FC<MeasurementDetailsProps> = ({ 
  measurement,
  isOpen,
  onOpenChange
}) => {
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

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange} className="w-full">
      <CollapsibleTrigger className="flex w-full justify-between items-center rounded-md p-2 hover:bg-gray-200 text-lg-blue-700 font-medium">
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
              <h4 className="text-sm font-bold mb-2 text-indigo-800">
                {section.label} Measurements
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {section.items.map(
                  (item) =>
                    measurement[item.key] && (
                      <div
                        key={item.key}
                        className="flex justify-between p-1.5 rounded border-border/60"
                      >
                        <span className="text-gray-500">
                          {item.label}:
                        </span>
                        <span className="text-lg font-bold text-green-700">
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
            <h4 className="text-sm font-bold mb-2 text-indigo-800">
              Additional Comments
            </h4>
            <p className="text-sm whitespace-pre-wrap p-2 border rounded border-border/60">
              {measurement.comments}
            </p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MeasurementDetails;
