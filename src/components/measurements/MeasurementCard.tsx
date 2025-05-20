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
import { Edit, Trash2, ChevronDown } from 'lucide-react';

interface MeasurementCardProps {
  measurement: Record<string, any>;
  index: number;
  onDelete: (index: number) => void;
  handleEdit: (index: number) => void;
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
  handleEdit
}: MeasurementCardProps) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
  const collectionDate = measurement.collectionDate
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

  useEffect(() => {
    return () => setConfirmingDelete(false);
  }, [index]);

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
        {collectionDate && (
          <>
            <span className="text-muted-foreground">•</span>
            <span>
              ({collectionDateType === 'exact' ? 'Exact' : 'Estimated'}) Collection Date: {collectionDate}
            </span>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default MeasurementCard;
