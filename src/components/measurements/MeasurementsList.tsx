import React, { useState, useEffect } from 'react';
import MeasurementCard from './MeasurementCard';
import { Loader2 } from 'lucide-react';

interface MeasurementsListProps {
  measurements: any[];
  searchTerm: string;
  isLoading: boolean;
  onDelete: (index: number) => void;
  handleEdit: (index: number) => void;
  onAddJob: (clientId: string, jobData: any) => Promise<void>;
  onUpdateMeasurement?: (updatedMeasurement: any) => void;
}

const getClientLevel = (count: number) => {
    if (count >= 100)
    return {
      level: 'Diamond',
      gradient: 'bg-gradient-to-r from-gray-900 via-yellow-700 to-gray-900',
      textColor: 'text-white',
    };
  if (count >= 40)
    return {
      level: 'Platinum',
      gradient: 'bg-gradient-to-r from-purple-900 via-purple-500 to-purple-900',
      textColor: 'text-white',
    };
  if (count >= 30)
    return {
      level: 'Gold',
      gradient: 'bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600',
      textColor: 'text-black',
    };
  if (count >= 20)
    return {
      level: 'Silver',
      gradient: 'bg-gradient-to-r from-gray-500 via-gray-200 to-gray-500',
      textColor: 'text-black',
    };
  if (count >= 10)
    return {
      level: 'Bronze',
      gradient: 'bg-gradient-to-r from-orange-400 via-orange-100 to-orange-400',
      textColor: 'text-black',
    };
  return {
    level: 'Starter',
    gradient: 'bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300',
    textColor: 'text-gray-700',
  };
};

const MeasurementsList: React.FC<MeasurementsListProps> = ({
  measurements,
  searchTerm,
  isLoading,
  onDelete,
  handleEdit,
  onAddJob,
  onUpdateMeasurement,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allIds = measurements.map((m) => m.id);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === measurements.length) {
      // All selected, so clear all
      setSelectedIds(new Set());
    } else {
      // Select all
      setSelectedIds(new Set(allIds));
    }
  };

  const handleBatchDelete = () => {
    selectedIds.forEach((id) => {
      const index = measurements.findIndex((m) => m.id === id);
      if (index !== -1) {
        onDelete(index);
      }
    });
    setSelectedIds(new Set());
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (measurements.length === 0) {
    if (searchTerm) {
      return (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No results found</h3>
          <p className="text-muted-foreground">
            No measurements match your search term.
          </p>
        </div>
      );
    }

    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No measurements yet</h3>
        <p className="text-muted-foreground">
          Click the "Add New" button to create your first client measurement.
        </p>
      </div>
    );
  }

  const clientCount = measurements.length;
  const { level, gradient, textColor } = getClientLevel(clientCount);

  const allSelected = selectedIds.size === measurements.length && measurements.length > 0;
  const someSelected = selectedIds.size > 0 && !allSelected;

  return (
    <div className="space-y-6">
      {/* Client count badge with gradient */}
      <div className="flex justify-between items-center">
        <div
          className={`${gradient} ${textColor} px-4 py-1 rounded-full font-semibold shadow-md select-none`}
          title={`${level} Level`}
        >
          {clientCount} client{clientCount !== 1 ? 's' : ''} - {level}{/*  level */}
        </div>

        {selectedIds.size > 0 && (
          <button
            onClick={handleBatchDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded shadow font-semibold transition"
          >
            Delete Selected ({selectedIds.size})
          </button>
        )}
      </div>

      {/* Select All Checkbox */}
      <div className="flex items-left mb-2 pl-7 pr-2">
        <input
          type="checkbox"
          checked={allSelected}
          ref={(input) => {
            if (input) input.indeterminate = someSelected;
          }}
          onChange={toggleSelectAll}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 "
          id="select-all-checkbox"
        />
        <label htmlFor="select-all-checkbox" className="ml-1 text-sm select-none font-medium cursor-pointer">
          Select All
        </label>
      </div>

      {measurements.map((measurement, index) => (
        <div
          key={measurement.id}
          className="flex items-start space-x-3"
          style={{ width: '100%' }}
        >
          {/* Checkbox */}
          <div className="flex-shrink-0 pt-2">
            <input
              type="checkbox"
              checked={selectedIds.has(measurement.id)}
              onChange={() => toggleSelect(measurement.id)}
              className="w-3 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              id={`checkbox-${measurement.id}`}
            />
          </div>

          {/* MeasurementCard */}
          <div className="flex-grow">
            <MeasurementCard
              measurement={measurement}
              index={index}
              onDelete={onDelete}
              handleEdit={handleEdit}
              onAddJob={onAddJob}
              onUpdateMeasurement={onUpdateMeasurement}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MeasurementsList;
