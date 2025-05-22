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
      <CollapsibleTrigger className="flex w-full justify-between items-center rounded-md p-3 hover:bg-gray-100 text-lg-blue-700 font-semibold shadow-sm">
        View Client's Measurements
        <ChevronDown
          className={`h-5 w-5 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        {/* Grid container for sections: 2 columns, 3 rows max */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {measurementFields.map((section, idx) => {
            const hasValues = section.items.some(
              (item) =>
                measurement[item.key] !== undefined &&
                measurement[item.key] !== null &&
                measurement[item.key] !== ''
            );
            if (!hasValues) return null;

            return (
              <section
                key={`section-${idx}`}
                className="bg-white rounded-lg shadow-md p-5 border border-gray-200"
              >
                <h4 className="text-base font-bold mb-4 bg-gray-100 text-indigo-900 border border-gray-400 pb-2 shadow-lg px-2 inline-block rounded">
                  {section.label} Measurements
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {section.items.map((item) =>
                    measurement[item.key] !== undefined &&
                    measurement[item.key] !== null &&
                    measurement[item.key] !== '' ? (
                      <div
                        key={item.key}
                        className="flex flex-col bg-gradient-to-r from-blue-100 via-gray-300 to-blue-100 rounded-md p-3 border border-gray-400 shadow-xl"
                      >
                        <label
                          htmlFor={item.key}
                          className="text-sm font-medium text-gray-600 mb-1 select-none shadow-sm px-1 rounded bg-white"
                        >
                          {item.label}
                        </label>
                        <input
                          id={item.key}
                          type="text"
                          readOnly
                          value={measurement[item.key]}
                          className="bg-transparent text-lg font-semibold text-green-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded shadow-sm"
                        />
                      </div>
                    ) : null
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {measurement.comments && (
          <section className="bg-white rounded-lg shadow-md p-5 border border-gray-200 mt-6">
            <h4 className="text-base font-bold mb-3 text-indigo-900 border-b border-indigo-200 pb-2 shadow-sm px-2 inline-block rounded">
              Additional Comments
            </h4>
            <textarea
              readOnly
              value={measurement.comments}
              className="w-full min-h-[80px] resize-none p-3 rounded border border-gray-300 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
            />
          </section>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MeasurementDetails;
