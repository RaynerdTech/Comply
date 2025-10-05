"use client";

import React from 'react';
import { PayslipFormState, CalculationTotals } from './PayslipForm';
import { formatMoney } from './PayslipForm';

interface PayslipPreviewProps {
  formState: PayslipFormState;
  totals: CalculationTotals;
  isPro?: boolean;
  layout?: 'classic' | 'modern' | 'compact';
}

export const PayslipPreview: React.FC<PayslipPreviewProps> = ({
  formState,
  totals,
  isPro = false,
  layout = 'classic'
}) => {
  const brandColor = formState.brandColor || '#16a34a';

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getPayPeriodText = (): string => {
    if (formState.periodType === 'range' && formState.periodStart && formState.periodEnd) {
      return `${formatDate(formState.periodStart)} to ${formatDate(formState.periodEnd)}`;
    } else if (formState.periodType === 'month' && formState.periodMonth && formState.periodYear) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthIndex = parseInt(formState.periodMonth) - 1;
      return `${monthNames[monthIndex]} ${formState.periodYear}`;
    }
    return 'Not specified';
  };

  const hasEarnings = totals.basicEarnings > 0 || totals.overtimeEarnings > 0 || 
                     formState.allowances.some(a => parseFloat(a.amount) > 0) ||
                     formState.bonuses.some(b => parseFloat(b.amount) > 0);

  const hasDeductions = totals.taxVal > 0 || totals.pensionVal > 0 || totals.healthVal > 0 ||
                       formState.otherDeductions.some(d => parseFloat(d.amount) > 0);

  // Function to truncate long text
  const truncateText = (text: string, maxLength: number = 50): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Get image URL for display - use base64 URL if available, otherwise create object URL
  const getLogoUrl = (): string | null => {
    if (formState.logoUrl) {
      return formState.logoUrl; // Use base64 URL for both preview and PDF
    }
    if (formState.logoFile) {
      return URL.createObjectURL(formState.logoFile); // Fallback for preview only
    }
    return null;
  };

  // Get signature URL for display
  const getSignatureUrl = (): string | null => {
    if (formState.signatureUrl) {
      return formState.signatureUrl; // Use base64 URL for both preview and PDF
    }
    if (formState.signatureFile) {
      return URL.createObjectURL(formState.signatureFile); // Fallback for preview only
    }
    return null;
  };

  const logoUrl = getLogoUrl();
  const signatureUrl = getSignatureUrl();

  return (
    <div 
      id="payslip-preview" 
      className="w-full bg-white text-gray-900 p-6 rounded-lg shadow-lg payslip-preview"
      style={{ 
        minHeight: '400px', 
        fontFamily: 'Arial, sans-serif',
        maxWidth: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Header with Logo */}
      <div className="border-b-2 mb-6 pb-4" style={{ borderColor: brandColor }}>
        <div className="flex justify-between items-start mb-4">
          {/* Company Logo */}
          <div className="flex-1">
            {logoUrl ? (
              <div className="mb-3">
                <img 
                  src={logoUrl} 
                  alt="Company logo" 
                  className="h-16 object-contain"
                  style={{ maxWidth: '200px' }}
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="h-16 flex items-center">
                <h1 className="text-2xl font-bold" style={{ color: brandColor }}>
                  {formState.companyName || 'Company Name'}
                </h1>
              </div>
            )}
          </div>
          
          {/* Payslip Title */}
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-600">PAYSLIP</p>
            <p className="text-sm text-gray-500 mt-1">
              {formState.frequency ? `${formState.frequency} Payslip` : 'Payslip'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* Company Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Company Information</h3>
            {formState.companyName && (
              <p className="font-medium">{formState.companyName}</p>
            )}
            {formState.companyAddress && (
              <p className="text-gray-600 break-words">{truncateText(formState.companyAddress, 60)}</p>
            )}
            {formState.taxId && (
              <p className="text-gray-600">Tax ID: {formState.taxId}</p>
            )}
            {formState.companyContact && (
              <p className="text-gray-600">Contact: {truncateText(formState.companyContact, 40)}</p>
            )}
          </div>

          {/* Employee Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Employee Information</h3>
            <p className="font-medium">{formState.employeeName || 'Employee Name'}</p>
            {formState.employeeId && (
              <p className="text-gray-600">ID: {formState.employeeId}</p>
            )}
            {formState.jobTitle && (
              <p className="text-gray-600">Title: {formState.jobTitle}</p>
            )}
            {formState.department && (
              <p className="text-gray-600">Department: {formState.department}</p>
            )}
            {formState.employeeEmail && (
              <p className="text-gray-600 break-all">Email: {formState.employeeEmail}</p>
            )}
            {formState.employeeAddress && (
              <p className="text-gray-600 break-words">{truncateText(formState.employeeAddress, 60)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Pay Period & Payment Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Pay Period: </span>
              <span>{getPayPeriodText()}</span>
            </div>
            {formState.payDate && (
              <div>
                <span className="font-semibold">Pay Date: </span>
                <span>{formatDate(formState.payDate)}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            {formState.frequency && (
              <div>
                <span className="font-semibold">Frequency: </span>
                <span>{formState.frequency}</span>
              </div>
            )}
            {formState.method && (
              <div>
                <span className="font-semibold">Method: </span>
                <span>{formState.method}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Earnings & Deductions */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Earnings */}
        <div>
          <h3 
            className="font-semibold text-lg mb-4 p-3 bg-gray-100 rounded-lg" 
            style={{ borderLeft: `4px solid ${brandColor}` }}
          >
            EARNINGS
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Basic Pay:</span>
              <span className="font-bold">₦{formatMoney(totals.basicEarnings)}</span>
            </div>
            
            {totals.overtimeEarnings > 0 && (
              <div className="flex justify-between items-center">
                <span>Overtime:</span>
                <span className="font-medium">₦{formatMoney(totals.overtimeEarnings)}</span>
              </div>
            )}

            {formState.allowances.map((allowance) => {
              const amount = parseFloat(allowance.amount);
              return amount > 0 ? (
                <div key={allowance.id} className="flex justify-between items-center">
                  <span className="break-words max-w-[70%]">{allowance.label || 'Allowance'}:</span>
                  <span className="font-medium whitespace-nowrap">₦{formatMoney(amount)}</span>
                </div>
              ) : null;
            })}

            {formState.bonuses.map((bonus) => {
              const amount = parseFloat(bonus.amount);
              return amount > 0 ? (
                <div key={bonus.id} className="flex justify-between items-center">
                  <span className="break-words max-w-[70%]">{bonus.label || 'Bonus'}:</span>
                  <span className="font-medium whitespace-nowrap">₦{formatMoney(amount)}</span>
                </div>
              ) : null;
            })}

            <div className="border-t border-gray-300 pt-3 mt-2 font-semibold flex justify-between items-center">
              <span>Gross Pay:</span>
              <span style={{ color: brandColor }} className="text-lg">₦{formatMoney(totals.gross)}</span>
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div>
          <h3 
            className="font-semibold text-lg mb-4 p-3 bg-gray-100 rounded-lg" 
            style={{ borderLeft: `4px solid #dc2626` }}
          >
            DEDUCTIONS
          </h3>
          <div className="space-y-3">
            {totals.taxVal > 0 && (
              <div className="flex justify-between items-center">
                <span>Tax:</span>
                <span className="font-medium text-red-600">₦{formatMoney(totals.taxVal)}</span>
              </div>
            )}

            {totals.pensionVal > 0 && (
              <div className="flex justify-between items-center">
                <span>Pension:</span>
                <span className="font-medium text-red-600">₦{formatMoney(totals.pensionVal)}</span>
              </div>
            )}

            {totals.healthVal > 0 && (
              <div className="flex justify-between items-center">
                <span>Health Insurance:</span>
                <span className="font-medium text-red-600">₦{formatMoney(totals.healthVal)}</span>
              </div>
            )}

            {formState.otherDeductions.map((deduction) => {
              const amount = parseFloat(deduction.amount);
              return amount > 0 ? (
                <div key={deduction.id} className="flex justify-between items-center">
                  <span className="break-words max-w-[70%]">{deduction.label || 'Deduction'}:</span>
                  <span className="font-medium text-red-600 whitespace-nowrap">₦{formatMoney(amount)}</span>
                </div>
              ) : null;
            })}

            <div className="border-t border-gray-300 pt-3 mt-2 font-semibold flex justify-between items-center">
              <span>Total Deductions:</span>
              <span className="text-red-600 text-lg">₦{formatMoney(totals.totalDeductions)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Net Pay */}
      <div 
        className="p-6 rounded-lg mb-6 text-center shadow-md"
        style={{ 
          backgroundColor: brandColor, 
          color: 'white',
          background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}dd 100%)`
        }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <span className="text-xl font-bold">NET PAY</span>
          <span className="text-3xl font-extrabold">₦{formatMoney(totals.net)}</span>
        </div>
        {formState.bankDetails && (
          <div className="mt-3 text-sm opacity-90">
            <span className="font-medium">Bank: </span>
            <span>{truncateText(formState.bankDetails, 80)}</span>
          </div>
        )}
      </div>

      {/* Compliance & Additional Information */}
      {(formState.country || formState.wageRuleRef || formState.notes) && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-semibold mb-3 text-gray-700">Compliance & Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {formState.country && (
              <div>
                <span className="font-medium">Country: </span>
                <span>{formState.country}</span>
              </div>
            )}
            {formState.wageRuleRef && (
              <div>
                <span className="font-medium">Wage Rule Ref: </span>
                <span>{formState.wageRuleRef}</span>
              </div>
            )}
            {formState.notes && (
              <div className="md:col-span-2">
                <div className="font-medium mb-1">Notes:</div>
                <div className="text-gray-600 bg-white p-3 rounded border break-words">
                  {formState.notes}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer with Signature */}
      <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-left">
            <p>Generated on {new Date().toLocaleDateString()} by Complyn Payslip Generator</p>
            {formState.country && (
              <p className="mt-1">Country: {formState.country}</p>
            )}
          </div>
          
          {/* Signature Area - FIXED: Now properly shows signature image */}
          <div className="text-right">
            {signatureUrl && (
              <div className="mt-2">
                <div className="border-t border-gray-400 pt-2 mt-1">
                  <p className="font-medium mb-2">Authorized Signature</p>
                  <div className="flex flex-col items-end">
                    <img 
                      src={signatureUrl} 
                      alt="Employer signature" 
                      className="h-12 object-contain max-w-[150px] mb-1"
                      onError={(e) => {
                        // Fallback if signature image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    {formState.signatureFileName && (
                      <p className="text-xs text-gray-400 mt-1">{formState.signatureFileName}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};