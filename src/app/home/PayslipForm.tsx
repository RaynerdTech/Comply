"use client";

import React, { JSX, useEffect, useMemo, useRef, useState } from "react";
import Accordion, { AccordionItem } from "@/components/common/accordion";
import UpgradeOverlay from "./UpgradeOverlay";
import { Plus, Trash2, Calculator, Eye, Download, FileText } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { PayslipPreview } from "./PreviewPane";
import { generatePayslipPDF } from "@/lib/generateClientPdf";

type MoneyString = string;

interface DynamicRow {
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
  brandColor?: string; // pro
  logoFile?: File; // pro - store actual file
  logoUrl?: string; // NEW: Store base64 URL for PDF generation
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
  signatureUrl?: string; // NEW: Store base64 URL for PDF generation
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

// Preview and PDF generation props
interface PreviewPaneProps {
  formState: PayslipFormState;
  totals: CalculationTotals;
  isPro?: boolean;
}

const STORAGE_KEY = "complyn.home.payslipDraft";

/* ---------------------- Helpers ---------------------- */

const emptyRow = (label = "", amount = ""): DynamicRow => ({
  id: Math.random().toString(36).slice(2, 9),
  label,
  amount,
});

const parseMoney = (v?: MoneyString): number => {
  if (!v && v !== "0") return 0;
  const cleaned = String(v).replace(/[^\d.-]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
};

const parsePercentage = (v?: MoneyString): number => {
  if (!v) return 0;
  const str = String(v).trim();
  if (str.endsWith('%')) {
    const percentage = parseFloat(str.replace('%', ''));
    return Number.isFinite(percentage) ? Math.max(0, Math.min(100, percentage)) / 100 : 0;
  }
  return 0;
};

export const formatMoney = (n: number): string => {
  if (n >= 1000000) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(n);
  }
  
  return new Intl.NumberFormat("en-US", { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(n);
};

const safeCalculateTotals = (fn: () => CalculationTotals): CalculationTotals => {
  try {
    return fn();
  } catch (error) {
    console.warn('Calculation error:', error);
    return {
      basicEarnings: 0,
      overtimeEarnings: 0,
      allowancesTotal: 0,
      bonusesTotal: 0,
      gross: 0,
      taxVal: 0,
      pensionVal: 0,
      healthVal: 0,
      otherDeductionTotal: 0,
      totalDeductions: 0,
      net: 0,
      payRate: 0,
      hoursWorked: 0
    };
  }
};

// Convert File to base64 for storage and PDF generation
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log('✅ File converted to base64:', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        base64Length: (reader.result as string).length,
        base64Preview: (reader.result as string).substring(0, 100) + '...'
      });
      resolve(reader.result as string);
    };
    reader.onerror = error => reject(error);
  });
};

// Load images from localStorage
const loadImagesFromStorage = () => {
  try {
    const logoBase64 = localStorage.getItem(`${STORAGE_KEY}-logo`);
    const signatureBase64 = localStorage.getItem(`${STORAGE_KEY}-signature`);
    
    console.log('🔄 Loading images from localStorage:', {
      hasLogo: !!logoBase64,
      hasSignature: !!signatureBase64,
      logoLength: logoBase64?.length,
      signatureLength: signatureBase64?.length
    });
    
    return {
      logoUrl: logoBase64 || undefined,
      signatureUrl: signatureBase64 || undefined
    };
  } catch (error) {
    console.warn('Failed to load images from storage:', error);
    return {};
  }
};

// Save images to localStorage - FIXED VERSION
const saveImageToStorage = async (type: 'logo' | 'signature', file?: File): Promise<void> => {
  try {
    const storageKey = `${STORAGE_KEY}-${type}`;
    
    if (file) {
      const base64Url = await fileToBase64(file);
      localStorage.setItem(storageKey, base64Url);
      console.log(`💾 Saved ${type} to localStorage:`, {
        fileName: file.name,
        storageKey,
        base64Length: base64Url.length
      });
    } else {
      localStorage.removeItem(storageKey);
      console.log(`🗑️ Removed ${type} from localStorage`);
    }
  } catch (error) {
    console.warn(`Failed to save ${type} to storage:`, error);
  }
};

/* ---------------------- Preview Pane Component ---------------------- */

const PreviewPane = ({ formState, totals, isPro = false }: PreviewPaneProps) => {
  const debouncedFormState = useDebounce(formState, 500);
  const hasData = formState.employeeName && formState.companyName;

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-600">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Payslip Preview
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {hasData ? 'Real-time preview' : 'Fill the form to see preview'}
          </p>
        </div>
      </div>

      <div className="p-4 max-h-[600px] overflow-y-auto">
        {hasData ? (
          <PayslipPreview 
            formState={debouncedFormState}
            totals={totals}
            isPro={isPro}
          />
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Preview Unavailable</p>
            <p className="text-sm">Please fill in employee and company information to see the preview</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------------- Main Component ---------------------- */

export default function PayslipForm(): JSX.Element {
  const defaultState: PayslipFormState = {
    companyName: "",
    companyAddress: "",
    taxId: "",
    companyContact: "",
    brandColor: "#16a34a",
    employeeName: "",
    employeeId: "",
    jobTitle: "",
    department: "",
    employeeEmail: "",
    employeeAddress: "",
    periodType: "range",
    periodStart: "",
    periodEnd: "",
    periodMonth: "",
    periodYear: `${new Date().getFullYear()}`,
    payDate: "",
    frequency: "",
    method: "",
    bankDetails: "",
    payType: "salary",
    payRate: "",
    hoursWorked: "",
    overtimeHours: "",
    overtimeRate: "",
    allowances: [],
    bonuses: [],
    tax: "",
    pension: "",
    healthInsurance: "",
    otherDeductions: [],
    country: "",
    wageRuleRef: "",
    notes: "",
  };

  const [state, setState] = useState<PayslipFormState>(defaultState);
  const [isPro, setIsPro] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // Refs for file inputs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const previewSectionRef = useRef<HTMLDivElement>(null);

  // Load from localStorage once on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const images = loadImagesFromStorage();
        
        console.log('📥 Loading saved data:', {
          hasFormData: !!raw,
          hasLogo: !!images.logoUrl,
          hasSignature: !!images.signatureUrl
        });
        
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<PayslipFormState>;
          setState((prev) => ({ 
            ...prev, 
            ...parsed,
            logoUrl: images.logoUrl,
            signatureUrl: images.signatureUrl
          }));
        }
      } catch (err) {
        console.warn("Failed to parse saved payslip draft", err);
      }
    };

    loadSavedData();
  }, []);

  // Autosave to localStorage when `state` changes
  useEffect(() => {
    try {
      // Don't save File objects or URLs to localStorage
      const { logoFile, signatureFile, logoUrl, signatureUrl, ...stateWithoutFiles } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateWithoutFiles));
    } catch (err) {
      console.warn("Failed to save payslip draft", err);
    }
  }, [state]);

  /* ---------------------- Field Helpers ---------------------- */

  const setField = <K extends keyof PayslipFormState>(k: K, v: PayslipFormState[K]) =>
    setState((s) => ({ ...s, [k]: v }));

  /* ---------------------- File Handlers ---------------------- */

  const handleLogoFile = async (file?: File | null) => {
    console.log('🖼️ Handling logo file:', { 
      hasFile: !!file, 
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size 
    });
    
    if (file) {
      try {
        // Convert to base64 for PDF generation and storage
        const base64Url = await fileToBase64(file);
        
        // Save logo to localStorage
        await saveImageToStorage('logo', file);
        
        setState((prev) => ({ 
          ...prev, 
          logoFile: file,
          logoUrl: base64Url
        }));
        
        console.log('✅ Logo processed and saved successfully');
      } catch (error) {
        console.error('❌ Error processing logo file:', error);
        alert('Failed to process logo file. Please try again.');
      }
    } else {
      // Remove logo from localStorage
      await saveImageToStorage('logo', undefined);
      setState((prev) => ({ 
        ...prev, 
        logoFile: undefined,
        logoUrl: undefined 
      }));
      console.log('🗑️ Logo removed');
    }
  };

  const handleSignatureFile = async (file?: File | null) => {
    console.log('✍️ Handling signature file:', { 
      hasFile: !!file, 
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size 
    });
    
    if (file) {
      try {
        // Convert to base64 for PDF generation and storage
        const base64Url = await fileToBase64(file);
        
        // Save signature to localStorage
        await saveImageToStorage('signature', file);
        
        setState((prev) => ({ 
          ...prev, 
          signatureFile: file,
          signatureFileName: file.name,
          signatureUrl: base64Url
        }));
        
        console.log('✅ Signature processed and saved successfully');
      } catch (error) {
        console.error('❌ Error processing signature file:', error);
        alert('Failed to process signature file. Please try again.');
      }
    } else {
      // Remove signature from localStorage
      await saveImageToStorage('signature', undefined);
      setState((prev) => ({ 
        ...prev, 
        signatureFile: undefined,
        signatureFileName: undefined,
        signatureUrl: undefined 
      }));
      console.log('🗑️ Signature removed');
    }
  };

  const triggerLogoInput = () => {
    logoInputRef.current?.click();
  };

  const triggerSignatureInput = () => {
    signatureInputRef.current?.click();
  };

  /* ---------------------- Dynamic Rows Handlers ---------------------- */

  const addAllowance = () =>
    setState((s) => ({ ...s, allowances: [...s.allowances, emptyRow("Allowance", "")] }));

  const updateAllowance = (id: string, field: "label" | "amount", value: string) =>
    setState((s) => ({
      ...s,
      allowances: s.allowances.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    }));

  const removeAllowance = (id: string) =>
    setState((s) => ({ ...s, allowances: s.allowances.filter((r) => r.id !== id) }));

  const addBonus = () =>
    setState((s) => ({ ...s, bonuses: [...s.bonuses, emptyRow("Bonus", "")] }));

  const updateBonus = (id: string, field: "label" | "amount", value: string) =>
    setState((s) => ({
      ...s,
      bonuses: s.bonuses.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    }));

  const removeBonus = (id: string) =>
    setState((s) => ({ ...s, bonuses: s.bonuses.filter((r) => r.id !== id) }));

  const addOtherDeduction = () =>
    setState((s) => ({ ...s, otherDeductions: [...s.otherDeductions, emptyRow("Deduction", "")] }));

  const updateOtherDeduction = (id: string, field: "label" | "amount", value: string) =>
    setState((s) => ({
      ...s,
      otherDeductions: s.otherDeductions.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    }));

  const removeOtherDeduction = (id: string) =>
    setState((s) => ({ ...s, otherDeductions: s.otherDeductions.filter((r) => r.id !== id) }));

  /* ---------------------- Computations ---------------------- */

  const totals = useMemo(() => {
    return safeCalculateTotals(() => {
      const payRate = parseMoney(state.payRate);
      const hours = parseMoney(state.hoursWorked);
      
      let basicEarnings = 0;
      if (state.payType === "hourly") {
        basicEarnings = payRate * hours;
      } else {
        basicEarnings = payRate;
      }

      const overtimeHours = parseMoney(state.overtimeHours);
      const overtimeRate = parseMoney(state.overtimeRate) || payRate * 1.5;
      const overtimeEarnings = overtimeHours * overtimeRate;

      const allowancesTotal = state.allowances.reduce((acc, r) => acc + parseMoney(r.amount), 0);
      const bonusesTotal = state.bonuses.reduce((acc, r) => acc + parseMoney(r.amount), 0);

      const gross = basicEarnings + overtimeEarnings + allowancesTotal + bonusesTotal;

      const taxPercentage = parsePercentage(state.tax);
      const taxAmount = parseMoney(state.tax);
      const taxVal = taxPercentage > 0 ? gross * taxPercentage : taxAmount;

      const pensionVal = parseMoney(state.pension);
      const healthVal = parseMoney(state.healthInsurance);
      const otherDeductionTotal = state.otherDeductions.reduce((acc, r) => acc + parseMoney(r.amount), 0);
      
      const totalDeductions = taxVal + pensionVal + healthVal + otherDeductionTotal;
      const safeTotalDeductions = Math.min(totalDeductions, gross);
      const net = gross - safeTotalDeductions;

      return {
        basicEarnings,
        overtimeEarnings,
        allowancesTotal,
        bonusesTotal,
        gross,
        taxVal,
        pensionVal,
        healthVal,
        otherDeductionTotal,
        totalDeductions: safeTotalDeductions,
        net,
        payRate,
        hoursWorked: hours
      };
    });
  }, [state]);

  /* ---------------------- UI Helpers ---------------------- */

  const months = [
    { v: "01", label: "January" }, { v: "02", label: "February" }, { v: "03", label: "March" },
    { v: "04", label: "April" }, { v: "05", label: "May" }, { v: "06", label: "June" },
    { v: "07", label: "July" }, { v: "08", label: "August" }, { v: "09", label: "September" },
    { v: "10", label: "October" }, { v: "11", label: "November" }, { v: "12", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }).map((_, i) => `${currentYear - 5 + i}`);

  const canGenerateFree = useMemo(() => {
    if (!state.employeeName || state.employeeName.trim().length === 0) return false;
    if (state.periodType === "range") {
      if (!state.periodStart || !state.periodEnd) return false;
    } else {
      if (!state.periodMonth || !state.periodYear) return false;
    }
    if (!state.payRate) return false;
    if (state.payType === "hourly" && !state.hoursWorked) return false;
    return true;
  }, [state]);

  const clearDraft = () => {
    // Clean up localStorage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(`${STORAGE_KEY}-logo`);
    localStorage.removeItem(`${STORAGE_KEY}-signature`);
    
    setState(defaultState);
    console.log('🧹 All data cleared from localStorage');
  };

  const handlePreview = () => {
    if (!canGenerateFree) {
      alert('Please fill in all required fields to preview the payslip.');
      return;
    }
    
    // Scroll to preview on mobile
    if (window.innerWidth < 1024) {
      previewSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }
  };

  const handleGeneratePDF = async () => {
    if (!canGenerateFree) {
      alert('Please fill in all required fields to generate the PDF.');
      return;
    }

    try {
      setIsGeneratingPDF(true);
      
      console.log('📄 Generating PDF with images:', {
        hasLogo: !!state.logoUrl,
        hasSignature: !!state.signatureUrl,
        logoUrlLength: state.logoUrl?.length,
        signatureUrlLength: state.signatureUrl?.length
      });
      
      // Prepare image data for PDF generation
      const pdfOptions = {
        brandColor: state.brandColor,
        isPro: isPro,
        layout: 'classic' as const,
        // Pass base64 URLs to PDF generator
        logoUrl: state.logoUrl,
        signatureUrl: state.signatureUrl
      };
      
      await generatePayslipPDF(state, totals, pdfOptions);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  /* ---------------------- Input Styling ---------------------- */

  const inputClass = "w-full rounded-xl border border-gray-300/60 dark:border-gray-600/60 bg-white/80 dark:bg-gray-800/50 px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 backdrop-blur-sm";
  const buttonClass = "inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300/60 dark:border-gray-600/60 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-all duration-200 text-sm font-medium";
  const actionButtonClass = "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed";

  /* ---------------------- Render ---------------------- */

  return (
   <div className="w-full sm:w-[86%] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-8 h-8 text-[var(--color-primary)]" />
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Payslip Generator</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Create professional payslips with automatic calculations and compliance features
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6">
          {/* Actions Bar */}
          <div className="flex items-center justify-between gap-4 p-4 bg-white/50 dark:bg-gray-900/30 rounded-xl border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Calculator className="w-5 h-5 text-[var(--color-primary)]" />
              <span className="font-medium text-[var(--color-text)]">Quick Payslip</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={clearDraft}
                className={buttonClass}
              >
                <Trash2 className="w-4 h-4" />
                Clear Draft
              </button>
            </div>
          </div>

          {/* Form Accordion */}
          <Accordion className="mb-8">
            {/* Company Info */}
            <AccordionItem title="🏢 Company Information" defaultOpen={true}>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Company name <span className="text-red-500">*</span></label>
                  <input
                    className={inputClass}
                    value={state.companyName}
                    onChange={(e) => setField("companyName", e.target.value)}
                    placeholder="e.g. Acme Ltd"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    className={inputClass}
                    value={state.companyAddress}
                    onChange={(e) => setField("companyAddress", e.target.value)}
                    placeholder="Office address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tax ID / Registration</label>
                  <input
                    className={inputClass}
                    value={state.taxId}
                    onChange={(e) => setField("taxId", e.target.value)}
                    placeholder="Tax / RC number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone / Email</label>
                  <input
                    className={inputClass}
                    value={state.companyContact}
                    onChange={(e) => setField("companyContact", e.target.value)}
                    placeholder="e.g. +234 80 0000 0000 / hr@company.com"
                  />
                </div>

                {/* Pro Fields */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <UpgradeOverlay featureName="Company Logo">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Company logo <span className="text-xs text-amber-600 dark:text-amber-400 ml-2">PRO</span>
                        </label>
                        <div className="border border-gray-300/60 dark:border-gray-600/60 rounded-xl p-4 bg-white/50 dark:bg-gray-800/30">
                          <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleLogoFile(e.target.files?.[0])}
                          />
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              {state.logoUrl ? (
                                <img 
                                  src={state.logoUrl} 
                                  alt="Company logo" 
                                  className="w-10 h-10 object-contain rounded"
                                  onError={(e) => {
                                    // Fallback if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <FileText className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {state.logoFile ? state.logoFile.name : "Upload company logo"}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG up to 5MB</p>
                            </div>
                            <button
                              type="button"
                              onClick={triggerLogoInput}
                              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              {state.logoFile ? "Change" : "Browse"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </UpgradeOverlay>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="relative">
                    <UpgradeOverlay featureName="Brand Color">
                      <div className="p-4 border border-gray-300/60 dark:border-gray-600/60 rounded-xl bg-white/50 dark:bg-gray-800/30">
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium">
                            Brand color <span className="text-xs text-amber-600 dark:text-amber-400 ml-2">PRO</span>
                          </label>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Customize PDF appearance</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <input
                            type="color"
                            value={state.brandColor || "#16a34a"}
                            className="h-10 w-10 rounded-lg border-2 border-gray-300/60 cursor-pointer"
                            onChange={(e) => setField("brandColor", e.target.value)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div 
                                className="w-4 h-4 rounded border border-gray-300"
                                style={{ backgroundColor: state.brandColor || "#16a34a" }}
                              ></div>
                              <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                {state.brandColor || "#16a34a"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Select your brand color for professional-looking payslips
                            </p>
                          </div>
                        </div>
                      </div>
                    </UpgradeOverlay>
                  </div>
                </div>
              </div>
            </AccordionItem>

            {/* Employee Info */}
            <AccordionItem title="👤 Employee Information">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Full name <span className="text-red-500">*</span></label>
                  <input
                    value={state.employeeName}
                    onChange={(e) => setField("employeeName", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Ada Lovelace"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Employee ID</label>
                  <input
                    value={state.employeeId}
                    onChange={(e) => setField("employeeId", e.target.value)}
                    className={inputClass}
                    placeholder="E1234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Job title</label>
                  <input
                    value={state.jobTitle}
                    onChange={(e) => setField("jobTitle", e.target.value)}
                    className={inputClass}
                    placeholder="Frontend developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Department</label>
                  <input
                    value={state.department}
                    onChange={(e) => setField("department", e.target.value)}
                    className={inputClass}
                    placeholder="Engineering"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={state.employeeEmail}
                    onChange={(e) => setField("employeeEmail", e.target.value)}
                    className={inputClass}
                    placeholder="employee@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    value={state.employeeAddress}
                    onChange={(e) => setField("employeeAddress", e.target.value)}
                    className={inputClass}
                    placeholder="Employee address"
                  />
                </div>
              </div>
            </AccordionItem>

            {/* Pay Info */}
            <AccordionItem title="💰 Payment Information">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-3">Period type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-3 p-4 border border-gray-300/60 dark:border-gray-600/60 rounded-xl cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors flex-1">
                      <input
                        type="radio"
                        name="periodType"
                        checked={state.periodType === "range"}
                        onChange={() => setField("periodType", "range")}
                        className="text-[var(--color-primary)]"
                      />
                      <div>
                        <div className="font-medium">Date range</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Specific start and end dates</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-gray-300/60 dark:border-gray-600/60 rounded-xl cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors flex-1">
                      <input
                        type="radio"
                        name="periodType"
                        checked={state.periodType === "month"}
                        onChange={() => setField("periodType", "month")}
                        className="text-[var(--color-primary)]"
                      />
                      <div>
                        <div className="font-medium">Month + Year</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Whole calendar month</div>
                      </div>
                    </label>
                  </div>
                </div>

                {state.periodType === "range" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Pay period start</label>
                      <input
                        type="date"
                        value={state.periodStart || ""}
                        onChange={(e) => setField("periodStart", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Pay period end</label>
                      <input
                        type="date"
                        value={state.periodEnd || ""}
                        onChange={(e) => setField("periodEnd", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Month</label>
                      <select
                        value={state.periodMonth || ""}
                        onChange={(e) => setField("periodMonth", e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Select month</option>
                        {months.map((m) => (
                          <option key={m.v} value={m.v}>{m.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Year</label>
                      <select
                        value={state.periodYear || ""}
                        onChange={(e) => setField("periodYear", e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Select year</option>
                        {years.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Pay date</label>
                  <input
                    type="date"
                    value={state.payDate || ""}
                    onChange={(e) => setField("payDate", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Payment frequency</label>
                  <select
                    value={state.frequency || ""}
                    onChange={(e) => setField("frequency", e.target.value as any)}
                    className={inputClass}
                  >
                    <option value="">Select frequency</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Biweekly">Biweekly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Hourly">Hourly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Payment method</label>
                  <select
                    value={state.method || ""}
                    onChange={(e) => setField("method", e.target.value as any)}
                    className={inputClass}
                  >
                    <option value="">Select method</option>
                    <option value="Bank">Bank transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bank details</label>
                  <input
                    value={state.bankDetails || ""}
                    onChange={(e) => setField("bankDetails", e.target.value)}
                    className={inputClass}
                    placeholder="Bank name - Account number"
                  />
                </div>
              </div>
            </AccordionItem>

            {/* Earnings */}
            <AccordionItem title="📈 Earnings & Allowances">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Pay Type Selection */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-3">Pay type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-3 p-4 border border-gray-300/60 dark:border-gray-600/60 rounded-xl cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors flex-1">
                      <input
                        type="radio"
                        name="payType"
                        checked={state.payType === "salary"}
                        onChange={() => setField("payType", "salary")}
                        className="text-[var(--color-primary)]"
                      />
                      <div>
                        <div className="font-medium">Monthly Salary</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Fixed monthly amount</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-gray-300/60 dark:border-gray-600/60 rounded-xl cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors flex-1">
                      <input
                        type="radio"
                        name="payType"
                        checked={state.payType === "hourly"}
                        onChange={() => setField("payType", "hourly")}
                        className="text-[var(--color-primary)]"
                      />
                      <div>
                        <div className="font-medium">Hourly Rate</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Rate × hours worked</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Pay Rate Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {state.payType === "hourly" ? "Hourly rate" : "Monthly salary"} 
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={state.payRate}
                    onChange={(e) => setField("payRate", e.target.value)}
                    className={inputClass}
                    placeholder={state.payType === "hourly" ? "e.g. 25.00" : "e.g. 5000.00"}
                    inputMode="decimal"
                  />
                </div>

                {/* Hours Worked (only for hourly) */}
                {state.payType === "hourly" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Hours worked <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={state.hoursWorked}
                      onChange={(e) => setField("hoursWorked", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 160"
                      inputMode="decimal"
                    />
                    {state.payRate && state.hoursWorked && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Basic pay: {formatMoney(totals.basicEarnings)} 
                        ({formatMoney(totals.payRate)} × {totals.hoursWorked} hours)
                      </p>
                    )}
                  </div>
                )}

                {/* Overtime Fields */}
                <div>
                  <label className="block text-sm font-medium mb-2">Overtime hours</label>
                  <input
                    value={state.overtimeHours}
                    onChange={(e) => setField("overtimeHours", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 10"
                    inputMode="decimal"
                  />
                  {state.overtimeHours && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Overtime pay: {formatMoney(totals.overtimeEarnings)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Overtime rate</label>
                  <input
                    value={state.overtimeRate}
                    onChange={(e) => setField("overtimeRate", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 37.50 (or leave blank for 1.5×)"
                    inputMode="decimal"
                  />
                </div>

                {/* Dynamic Allowances */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-medium">Allowances</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Additional earnings and benefits</div>
                    </div>
                    <button
                      type="button"
                      onClick={addAllowance}
                      className={buttonClass}
                    >
                      <Plus className="w-4 h-4" />
                      Add Allowance
                    </button>
                  </div>

                  <div className="space-y-3">
                    {state.allowances.length === 0 && (
                      <div className="text-center py-6 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300/60 dark:border-gray-600/60 rounded-xl">
                        No allowances added yet
                      </div>
                    )}
                    {state.allowances.map((row) => (
                      <div key={row.id} className="flex gap-3 items-start">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Description</label>
                          <input
                            className={inputClass}
                            placeholder="e.g. Transport, Housing, Meal"
                            value={row.label}
                            onChange={(e) => updateAllowance(row.id, "label", e.target.value)}
                          />
                        </div>
                        <div className="w-40">
                          <label className="block text-xs text-gray-500 mb-1">Amount</label>
                          <input
                            className={inputClass}
                            placeholder="0.00"
                            value={row.amount}
                            onChange={(e) => updateAllowance(row.id, "amount", e.target.value)}
                            inputMode="decimal"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeAllowance(row.id)}
                            className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                            title="Remove allowance"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic Bonuses */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-medium">Bonuses</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">One-time payments and incentives</div>
                    </div>
                    <button
                      type="button"
                      onClick={addBonus}
                      className={buttonClass}
                    >
                      <Plus className="w-4 h-4" />
                      Add Bonus
                    </button>
                  </div>

                  <div className="space-y-3">
                    {state.bonuses.length === 0 && (
                      <div className="text-center py-6 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300/60 dark:border-gray-600/60 rounded-xl">
                        No bonuses added yet
                      </div>
                    )}
                    {state.bonuses.map((row) => (
                      <div key={row.id} className="flex gap-3 items-start">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Description</label>
                          <input
                            className={inputClass}
                            placeholder="e.g. Performance, Annual, Project"
                            value={row.label}
                            onChange={(e) => updateBonus(row.id, "label", e.target.value)}
                          />
                        </div>
                        <div className="w-40">
                          <label className="block text-xs text-gray-500 mb-1">Amount</label>
                          <input
                            className={inputClass}
                            placeholder="0.00"
                            value={row.amount}
                            onChange={(e) => updateBonus(row.id, "amount", e.target.value)}
                            inputMode="decimal"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeBonus(row.id)}
                            className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                            title="Remove bonus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionItem>

            {/* Deductions */}
            <AccordionItem title="📉 Deductions">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Tax (amount or %)</label>
                  <input
                    value={state.tax}
                    onChange={(e) => setField("tax", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 10% or 15000"
                  />
                  {state.tax && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {state.tax.includes('%') 
                        ? `Tax amount: ${formatMoney(totals.taxVal)} (${state.tax} of gross)` 
                        : `Fixed tax: ${formatMoney(totals.taxVal)}`
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Pension</label>
                  <input
                    value={state.pension}
                    onChange={(e) => setField("pension", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Health insurance</label>
                  <input
                    value={state.healthInsurance}
                    onChange={(e) => setField("healthInsurance", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 2000"
                  />
                </div>

                {/* Dynamic Other Deductions */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-medium">Other deductions</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Loans, advances, and other deductions</div>
                    </div>
                    <button
                      type="button"
                      onClick={addOtherDeduction}
                      className={buttonClass}
                    >
                      <Plus className="w-4 h-4" />
                      Add Deduction
                    </button>
                  </div>

                  <div className="space-y-3">
                    {state.otherDeductions.length === 0 && (
                      <div className="text-center py-6 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300/60 dark:border-gray-600/60 rounded-xl">
                        No other deductions added yet
                      </div>
                    )}
                    {state.otherDeductions.map((row) => (
                      <div key={row.id} className="flex gap-3 items-start">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Description</label>
                          <input
                            className={inputClass}
                            placeholder="e.g. Loan repayment, Salary advance"
                            value={row.label}
                            onChange={(e) => updateOtherDeduction(row.id, "label", e.target.value)}
                          />
                        </div>
                        <div className="w-40">
                          <label className="block text-xs text-gray-500 mb-1">Amount</label>
                          <input
                            className={inputClass}
                            placeholder="0.00"
                            value={row.amount}
                            onChange={(e) => updateOtherDeduction(row.id, "amount", e.target.value)}
                            inputMode="decimal"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeOtherDeduction(row.id)}
                            className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                            title="Remove deduction"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionItem>

            {/* Compliance & Notes */}
            <AccordionItem title="📝 Compliance & Notes">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <input
                    value={state.country}
                    onChange={(e) => setField("country", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Nigeria"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Wage rule reference</label>
                  <input
                    value={state.wageRuleRef}
                    onChange={(e) => setField("wageRuleRef", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Minimum Wage Act 2019"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    value={state.notes}
                    onChange={(e) => setField("notes", e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="Additional notes, terms, or compliance information"
                    rows={4}
                  />
                </div>

                {/* Pro Field */}
                <div className="md:col-span-2">
                  <UpgradeOverlay featureName="Digital Signature">
                    <div>
                      <label className="block text-sm font-medium mb-2">Employer signature</label>
                      <div className="border-2 border-dashed border-gray-300/60 dark:border-gray-600/60 rounded-xl p-6 text-center bg-white/50 dark:bg-gray-800/30">
                        <input
                          ref={signatureInputRef}
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleSignatureFile(e.target.files?.[0])}
                        />
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-8 h-8 text-gray-400" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {state.signatureFile ? state.signatureFile.name : "Upload signature file"}
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                          <button
                            type="button"
                            onClick={triggerSignatureInput}
                            className="mt-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            {state.signatureFile ? "Change File" : "Browse Files"}
                          </button>
                        </div>
                        {state.signatureUrl && (
                          <div className="mt-4">
                            <img 
                              src={state.signatureUrl} 
                              alt="Signature preview" 
                              className="h-12 mx-auto object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </UpgradeOverlay>
                </div>
              </div>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Right Column - Preview & Actions */}
        <div className="space-y-6" ref={previewSectionRef}>
          {/* Preview Pane */}
          <PreviewPane formState={state} totals={totals} isPro={isPro} />

          {/* Actions Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200/60 dark:border-blue-700/60 backdrop-blur-sm">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Gross Pay</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{formatMoney(totals.gross)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Deductions</div>
                <div className="text-xl font-bold text-red-600 dark:text-red-400">{formatMoney(totals.totalDeductions)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Net Pay</div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">{formatMoney(totals.net)}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handlePreview}
                className={`${actionButtonClass} bg-blue-600 hover:bg-blue-700 text-white flex-1 justify-center`}
              >
                <Eye className="w-4 h-4" />
                Preview Payslip
              </button>
              <button
                type="button"
                onClick={handleGeneratePDF}
                disabled={!canGenerateFree || isGeneratingPDF}
                className={`${actionButtonClass} bg-[var(--color-primary)] hover:opacity-90 text-white flex-1 justify-center`}
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Generate PDF
                  </>
                )}
              </button>
            </div>

            {/* Detailed Breakdown */}
            <div className="mt-4 p-4 bg-white/50 dark:bg-gray-800/30 rounded-lg border border-gray-200/60 dark:border-gray-600/60">
              <div className="text-sm font-medium mb-2">Calculation Breakdown</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div>Basic Pay:</div>
                <div className="text-right">{formatMoney(totals.basicEarnings)}</div>
                
                <div>Overtime:</div>
                <div className="text-right">{formatMoney(totals.overtimeEarnings)}</div>
                
                <div>Allowances:</div>
                <div className="text-right">{formatMoney(totals.allowancesTotal)}</div>
                
                <div>Bonuses:</div>
                <div className="text-right">{formatMoney(totals.bonusesTotal)}</div>
                
                <div className="border-t border-gray-300 dark:border-gray-600 pt-1 font-medium">Tax:</div>
                <div className="border-t border-gray-300 dark:border-gray-600 pt-1 text-right font-medium">{formatMoney(totals.taxVal)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}