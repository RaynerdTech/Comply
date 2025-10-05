export type MoneyString = string;

export interface DynamicRow {
  id: string;
  label: string;
  amount: MoneyString;
}

export interface PayslipFormState {
  // Company
  companyName: string;
  companyAddress: string;
  taxId: string;
  companyContact: string;
  brandColor?: string;
  logoFile?: File;
  // Employee
  employeeName: string;
  employeeId?: string;
  jobTitle?: string;
  department?: string;
  employeeEmail?: string;
  employeeAddress?: string;
  // Pay info
  periodType: "range" | "month";
  periodStart?: string;
  periodEnd?: string;
  periodMonth?: string;
  periodYear?: string;
  payDate?: string;
  frequency?: "Monthly" | "Biweekly" | "Weekly" | "Hourly" | "";
  method?: "Bank" | "Cash" | "Cheque" | "Other" | "";
  bankDetails?: string;
  // Earnings
  payType: "hourly" | "salary";
  payRate: MoneyString;
  hoursWorked?: MoneyString;
  overtimeHours?: MoneyString;
  overtimeRate?: MoneyString;
  allowances: DynamicRow[];
  bonuses: DynamicRow[];
  // Deductions
  tax?: MoneyString;
  pension?: MoneyString;
  healthInsurance?: MoneyString;
  otherDeductions: DynamicRow[];
  // Compliance & notes
  country?: string;
  wageRuleRef?: string;
  notes?: string;
  // Employer signature (pro)
  signatureFile?: File;
  signatureFileName?: string;
}

export interface CalculationTotals {
  basicEarnings: number;
  overtimeEarnings: number;
  allowancesTotal: number;
  bonusesTotal: number;
  gross: number;
  taxVal: number;
  pensionVal: number;
  healthVal: number;
  otherDeductionTotal: number;
  totalDeductions: number;
  net: number;
  payRate: number;
  hoursWorked: number;
}

export interface PreviewPaneProps {
  formState: PayslipFormState;
  totals: CalculationTotals;
  isPro?: boolean;
}