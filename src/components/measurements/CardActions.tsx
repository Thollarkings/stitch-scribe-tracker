import React, { useState } from 'react';
import { Plus, FileText, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardActionsProps {
  measurementId: string;
  index: number;
  handleEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onNewJobClick: () => void;
  onServiceInvoiceClick: () => void;
}

const CardActions: React.FC<CardActionsProps> = ({
  measurementId,
  index,
  handleEdit,
  onDelete,
  onNewJobClick,
  onServiceInvoiceClick
}) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleDeleteClick = () => {
    if (confirmingDelete) {
      onDelete(index);
      setConfirmingDelete(false);
    } else {
      setConfirmingDelete(true);
      const timer = setTimeout(() => setConfirmingDelete(false), 3000);
      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  };

  return (
    <div className="grid grid-cols-1 gap- max-w-3xl mx-auto sm:grid-cols-4 sm:gap-4">
  <Button
    size="sm"
    variant="outline"
    className="bg-white/80 hover:bg-white w-full mb-2"
    onClick={onNewJobClick}
  >
    <Plus className="h-4 w-4 mr-1" /> New Job
  </Button>

  <Button
    size="sm"
    variant="outline"
    className="bg-white/80 hover:bg-white w-full mb-3"
    onClick={onServiceInvoiceClick}
  >
    <FileText className="h-4 w-4 mr-1" /> Service Invoice
  </Button>

  <Button
    size="sm"
    variant="ghost"
    className="bg-white/80 hover:bg-white w-full mb-3"
    onClick={() => handleEdit(index)}
  >
    <Edit className="h-4 w-4 mr-1" /> Edit
  </Button>

  <Button
    size="sm"
    variant={confirmingDelete ? 'destructive' : 'ghost'}
    className="bg-white/80 hover:bg-red-600 w-full mb-3"
    onClick={handleDeleteClick}
  >
    <Trash2 className="h-4 w-4 mr-1" />
    {confirmingDelete ? 'Confirm' : 'Delete'}
  </Button>
</div>

  );
};

export default CardActions;
