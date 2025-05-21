
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardActionsProps {
  measurementId: string;
  index: number;
  handleEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onNewJobClick: () => void;
}

const CardActions: React.FC<CardActionsProps> = ({ 
  measurementId,
  index, 
  handleEdit, 
  onDelete,
  onNewJobClick
}) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const navigate = useNavigate();

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

  const handleInvoiceClick = () => {
    navigate(`/invoice/${measurementId}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button 
        size="sm" 
        variant="outline" 
        className="bg-white/80 hover:bg-white"
        onClick={onNewJobClick}
      >
        <Plus className="h-4 w-4 mr-1" /> New Job
      </Button>

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
  );
};

export default CardActions;
