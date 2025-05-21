
import React from 'react';
import { getCurrencySymbol } from '@/utils/formatters';

interface PaymentSummaryProps {
  serviceCharge: number;
  paidAmount: number;
  balance: number;
  currency: string;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ 
  serviceCharge, 
  paidAmount, 
  balance, 
  currency 
}) => {
  const currencySymbol = getCurrencySymbol(currency);
  
  return (
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
  );
};

export default PaymentSummary;
