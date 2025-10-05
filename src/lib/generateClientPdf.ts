import jsPDF from 'jspdf';

export interface PDFOptions {
  brandColor?: string;
  logoUrl?: string;
  signatureUrl?: string;
  layout?: 'classic' | 'modern' | 'compact';
  isPro?: boolean;
}

export interface PayslipData {
  company: {
    name: string;
    address: string;
    taxId: string;
    contact: string;
    logoUrl?: string;
  };
  employee: {
    name: string;
    id?: string;
    jobTitle?: string;
    department?: string;
    email?: string;
    address?: string;
  };
  payPeriod: {
    type: 'range' | 'month';
    start?: string;
    end?: string;
    month?: string;
    year?: string;
    payDate?: string;
  };
  earnings: {
    basic: number;
    overtime: number;
    allowances: Array<{ label: string; amount: number }>;
    bonuses: Array<{ label: string; amount: number }>;
  };
  deductions: {
    tax: number;
    pension: number;
    healthInsurance: number;
    others: Array<{ label: string; amount: number }>;
  };
  totals: {
    gross: number;
    totalDeductions: number;
    net: number;
  };
  additional: {
    frequency?: string;
    method?: string;
    bankDetails?: string;
    country?: string;
    wageRuleRef?: string;
    notes?: string;
  };
  signatureUrl?: string;
}

export class PayslipPDFGenerator {
  private doc: jsPDF;
  private options: PDFOptions;
  private data: PayslipData;

  constructor(data: PayslipData, options: PDFOptions = {}) {
    this.doc = new jsPDF();
    this.data = data;
    this.options = {
      brandColor: '#16a34a',
      layout: 'classic',
      isPro: false,
      ...options
    };
    
    console.log('📄 PDF Generator initialized:', {
      hasLogo: !!options.logoUrl,
      hasSignature: !!data.signatureUrl,
      isPro: options.isPro,
      logoUrlLength: options.logoUrl?.length,
      signatureUrlLength: data.signatureUrl?.length
    });
  }

  private formatMoney(amount: number): string {
    const formatWithSuffix = (num: number, divisor: number, suffix: string) => {
        const value = num / divisor;
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value) + suffix;
    };

    const absoluteAmount = Math.abs(amount);
    
    if (absoluteAmount >= 1_000_000_000) {
        return formatWithSuffix(amount, 1_000_000_000, 'B');
    }
    if (absoluteAmount >= 1_000_000) {
        return formatWithSuffix(amount, 1_000_000, 'M');
    }
    if (absoluteAmount >= 1_000) {
        return formatWithSuffix(amount, 1_000, 'K');
    }
    
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
  }

  private formatDate(dateStr?: string): string {
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
  }

  private truncateText(text: string, maxLength: number = 18): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  private async addHeader(): Promise<number> {
    const { doc, data, options } = this;
    
    let yPosition = 8;

    console.log('🖼️ Adding header with logo:', { 
      hasLogo: !!options.logoUrl, 
      isPro: options.isPro,
      logoUrlLength: options.logoUrl?.length 
    });

    if (options.logoUrl) {
      try {
        console.log('🔄 Attempting to add logo to PDF...');
        // Logo at the very top with space below
        doc.addImage(options.logoUrl, 'PNG', 20, yPosition, 26, 12);
        console.log('✅ Logo added successfully to PDF');
        yPosition += 16; // Space after logo
      } catch (error) {
        console.error('❌ Failed to add logo to PDF:', error);
        yPosition += 8;
      }
    }

    // Company name and PAYSLIP positioned below logo
    const headerTextY = yPosition;
    
    // Add company name on the left
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    const rgb = this.hexToRgb(options.brandColor || '#16a34a');
    if (rgb) {
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
    } else {
      doc.setTextColor(22, 163, 74);
    }
    doc.text(data.company.name, 20, headerTextY + 5);
    
    // PAYSLIP text on the right - aligned with company name
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40);
    doc.text('PAYSLIP', 190, headerTextY, { align: 'right' });
    
    if (data.additional.frequency) {
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`${data.additional.frequency} Payslip`, 190, headerTextY + 5, { align: 'right' });
    }
    
    // Separator line below header
    doc.setFillColor(options.brandColor || '#16a34a');
    doc.rect(15, headerTextY + 8, 180, 1.5, 'F');
    
    return headerTextY + 16;
  }

  private addCompanyAndEmployeeInfo(startY: number): number {
    const { doc, data } = this;
    let y = startY;
    
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40);
    doc.text('COMPANY INFORMATION', 20, y);
    
    y += 7;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80);
    
    if (data.company.address) {
      const addressLines = doc.splitTextToSize(data.company.address, 70);
      doc.text(addressLines, 20, y);
      y += addressLines.length * 5;
    }
    
    if (data.company.taxId) {
      doc.text(`Tax ID: ${data.company.taxId}`, 20, y);
      y += 6;
    }
    
    if (data.company.contact) {
      doc.text(`Contact: ${data.company.contact}`, 20, y);
      y += 6;
    }
    
    let yEmployee = startY;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40);
    doc.text('EMPLOYEE INFORMATION', 120, yEmployee);
    
    yEmployee += 7;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80);
    
    doc.text(data.employee.name, 120, yEmployee);
    yEmployee += 6;
    
    if (data.employee.id) {
      doc.text(`ID: ${data.employee.id}`, 120, yEmployee);
      yEmployee += 6;
    }
    
    if (data.employee.jobTitle) {
      doc.text(`Title: ${data.employee.jobTitle}`, 120, yEmployee);
      yEmployee += 6;
    }
    
    if (data.employee.department) {
      doc.text(`Department: ${data.employee.department}`, 120, yEmployee);
      yEmployee += 6;
    }
    
    if (data.employee.email) {
      doc.text(`Email: ${data.employee.email}`, 120, yEmployee);
      yEmployee += 6;
    }
    
    if (data.employee.address) {
      const addressLines = doc.splitTextToSize(data.employee.address, 70);
      doc.text(addressLines, 120, yEmployee);
      yEmployee += addressLines.length * 5;
    }
    
    return Math.max(y, yEmployee) + 10;
  }

  private addPayPeriodInfo(startY: number): number {
    const { doc, data } = this;
    const y = startY;
    
    doc.setFillColor(248, 250, 252);
    doc.rect(15, y, 180, 20, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, y, 180, 20);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40);
    
    let periodText = '';
    if (data.payPeriod.type === 'range' && data.payPeriod.start && data.payPeriod.end) {
      periodText = `${this.formatDate(data.payPeriod.start)} to ${this.formatDate(data.payPeriod.end)}`;
    } else if (data.payPeriod.type === 'month' && data.payPeriod.month && data.payPeriod.year) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthIndex = parseInt(data.payPeriod.month) - 1;
      periodText = `${monthNames[monthIndex]} ${data.payPeriod.year}`;
    }
    
    doc.text('Pay Period:', 20, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(periodText, 50, y + 7);
    
    if (data.payPeriod.payDate) {
      doc.setFont('helvetica', 'bold');
      doc.text('Pay Date:', 20, y + 13);
      doc.setFont('helvetica', 'normal');
      doc.text(this.formatDate(data.payPeriod.payDate), 50, y + 13);
    }
    
    let yRight = y + 7;
    if (data.additional.frequency) {
      doc.setFont('helvetica', 'bold');
      doc.text('Frequency:', 120, yRight);
      doc.setFont('helvetica', 'normal');
      doc.text(data.additional.frequency, 150, yRight);
      yRight += 6;
    }
    
    if (data.additional.method) {
      doc.setFont('helvetica', 'bold');
      doc.text('Method:', 120, yRight);
      doc.setFont('helvetica', 'normal');
      doc.text(data.additional.method, 150, yRight);
    }
    
    return y + 26;
  }

  private addEarningsAndDeductions(startY: number): number {
    const { doc, data, options } = this;
    let y = startY;
    
    doc.setFillColor(248, 250, 252);
    doc.rect(15, y, 85, 9, 'F');
    doc.setFillColor(options.brandColor || '#16a34a');
    doc.rect(15, y, 4, 9, 'F');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40);
    doc.text('EARNINGS', 25, y + 6);
    
    y += 16;
    
    this.addEarningRow('Basic Pay', data.earnings.basic, 20, y);
    y += 6;
    
    if (data.earnings.overtime > 0) {
      this.addEarningRow('Overtime', data.earnings.overtime, 20, y);
      y += 6;
    }
    
    data.earnings.allowances.forEach(allowance => {
      if (allowance.amount > 0) {
        const label = allowance.label || 'Allowance';
        this.addEarningRow(label, allowance.amount, 20, y);
        y += 6;
      }
    });
    
    data.earnings.bonuses.forEach(bonus => {
      if (bonus.amount > 0) {
        const label = bonus.label || 'Bonus';
        this.addEarningRow(label, bonus.amount, 20, y);
        y += 6;
      }
    });
    
    y += 3;
    doc.setDrawColor(200);
    doc.line(15, y, 100, y);
    y += 6;
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(options.brandColor || '#16a34a');
    doc.text('Gross Pay', 20, y);
    doc.text(`${this.formatMoney(data.totals.gross)}`, 95, y, { align: 'right' });
    
    let yDeductions = startY;
    doc.setFillColor(248, 250, 252);
    doc.rect(110, yDeductions, 85, 9, 'F');
    doc.setFillColor(220, 38, 38);
    doc.rect(110, yDeductions, 4, 9, 'F');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40);
    doc.text('DEDUCTIONS', 120, yDeductions + 6);
    
    yDeductions += 16;
    
    if (data.deductions.tax > 0) {
      this.addDeductionRow('Tax', data.deductions.tax, 115, yDeductions);
      yDeductions += 6;
    }
    
    if (data.deductions.pension > 0) {
      this.addDeductionRow('Pension', data.deductions.pension, 115, yDeductions);
      yDeductions += 6;
    }
    
    if (data.deductions.healthInsurance > 0) {
      this.addDeductionRow('Health Insurance', data.deductions.healthInsurance, 115, yDeductions);
      yDeductions += 6;
    }
    
    data.deductions.others.forEach(deduction => {
      if (deduction.amount > 0) {
        const label = deduction.label || 'Deduction';
        this.addDeductionRow(label, deduction.amount, 115, yDeductions);
        yDeductions += 6;
      }
    });
    
    yDeductions += 3;
    doc.setDrawColor(200);
    doc.line(110, yDeductions, 195, yDeductions);
    yDeductions += 6;
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text('Total Deductions', 115, yDeductions);
    doc.text(`${this.formatMoney(data.totals.totalDeductions)}`, 180, yDeductions, { align: 'right' });
    
    return Math.max(y, yDeductions) + 10;
  }

  private addEarningRow(label: string, amount: number, x: number, y: number) {
    const { doc } = this;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80);
    
    const truncatedLabel = this.truncateText(label, 18);
    doc.text(truncatedLabel, x, y);
    doc.text(`${this.formatMoney(amount)}`, 95, y, { align: 'right' });
  }

  private addDeductionRow(label: string, amount: number, x: number, y: number) {
    const { doc } = this;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80);
    
    const truncatedLabel = this.truncateText(label, 18);
    doc.text(truncatedLabel, x, y);
    doc.setTextColor(220, 38, 38);
    doc.text(`${this.formatMoney(amount)}`, 180, y, { align: 'right' });
  }

  private addNetPay(startY: number): number {
    const { doc, data, options } = this;
    let y = startY;
    
    const brandColor = options.brandColor || '#16a34a';
    const rgb = this.hexToRgb(brandColor);
    
    if (rgb) {
      doc.setFillColor(rgb.r, rgb.g, rgb.b);
    } else {
      doc.setFillColor(22, 163, 74);
    }
    
    doc.rect(15, y, 180, 13, 'F');
    
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('NET PAY', 20, y + 8);
    doc.text(`${this.formatMoney(data.totals.net)}`, 180, y + 8, { align: 'right' });
    
    y += 19;
    if (data.additional.bankDetails) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(`Bank: ${data.additional.bankDetails}`, 105, y, { align: 'center' });
      y += 6;
    }
    
    return y + 5;
  }

  private addComplianceInfo(startY: number): number {
    const { doc, data } = this;
    let y = startY;
    
    if (data.additional.country || data.additional.wageRuleRef || data.additional.notes) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, 180, 11, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(15, y, 180, 11);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40);
      doc.text('COMPLIANCE & ADDITIONAL INFORMATION', 20, y + 7);
      
      y += 18;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80);
      
      if (data.additional.country) {
        doc.text(`Country: ${data.additional.country}`, 20, y);
        y += 7;
      }
      
      if (data.additional.wageRuleRef) {
        doc.text(`Wage Rule Ref: ${data.additional.wageRuleRef}`, 20, y);
        y += 7;
      }
      
      if (data.additional.notes) {
        doc.setFont('helvetica', 'bold');
        doc.text('Notes:', 20, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        
        const notes = doc.splitTextToSize(data.additional.notes, 170);
        doc.text(notes, 20, y);
        y += notes.length * 5;
      }
      
      return y;
    }
    
    return y;
  }

  private async addFooter(finalY: number): Promise<void> {
    const { doc, data, options } = this;
    
    const footerY = finalY + 8;
    
    console.log('✍️ Adding footer with signature:', { 
      hasSignature: !!data.signatureUrl, 
      signatureUrlLength: data.signatureUrl?.length,
      hasOptionsSignature: !!options.signatureUrl 
    });
    
    doc.setDrawColor(200);
    doc.line(15, footerY, 195, footerY);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150);
    
    const generatedText = `Generated on ${new Date().toLocaleDateString()} by Complyn Payslip Generator`;
    doc.text(generatedText, 20, footerY + 5);
    
    if (data.additional.country) {
      doc.text(`Country: ${data.additional.country}`, 20, footerY + 10);
    }
    
    // Check both data.signatureUrl and options.signatureUrl for maximum compatibility
    const signatureUrl = data.signatureUrl || options.signatureUrl;
    
    if (signatureUrl) {
      try {
        console.log('🔄 Attempting to add signature to PDF...', { signatureUrl });
        
        // Add signature image - positioned above the footer line
        doc.addImage(signatureUrl, 'PNG', 150, footerY - 20, 35, 10);
        console.log('✅ Signature added successfully to PDF');
        
        // Add "Authorized Signature" text below the image
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(40);
        doc.text('Authorized Signature', 167, footerY - 6, { align: 'center' });
        
      } catch (error) {
        console.error('❌ Failed to add signature to PDF:', error);
        // Fallback: just show the text if image fails
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(40);
        doc.text('Authorized Signature', 167, footerY + 5, { align: 'center' });
      }
    } else {
      console.log('ℹ️ No signature URL provided, skipping signature image');
    }
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 22, g: 163, b: 74 };
  }

  async generate(): Promise<jsPDF> {
    console.log('🚀 Starting PDF generation...');
    
    const headerEndY = await this.addHeader();
    const companyEndY = this.addCompanyAndEmployeeInfo(headerEndY);
    const periodEndY = this.addPayPeriodInfo(companyEndY);
    const tablesEndY = this.addEarningsAndDeductions(periodEndY);
    const netPayEndY = this.addNetPay(tablesEndY);
    const complianceEndY = this.addComplianceInfo(netPayEndY);
    
    await this.addFooter(complianceEndY);
    
    console.log('✅ PDF generation completed successfully');
    
    return this.doc;
  }
}

// Utility function to generate PDF
export const generatePayslipPDF = async (
  formState: any,
  totals: any,
  options: PDFOptions = {}
): Promise<void> => {
  console.log('📦 Preparing PDF data with options:', {
    hasLogo: !!options.logoUrl,
    hasSignature: !!formState.signatureUrl,
    isPro: options.isPro,
    brandColor: options.brandColor
  });

  const pdfData: PayslipData = {
    company: {
      name: formState.companyName || 'Company Name',
      address: formState.companyAddress || '',
      taxId: formState.taxId || '',
      contact: formState.companyContact || '',
      logoUrl: formState.logoUrl
    },
    employee: {
      name: formState.employeeName || 'Employee Name',
      id: formState.employeeId,
      jobTitle: formState.jobTitle,
      department: formState.department,
      email: formState.employeeEmail,
      address: formState.employeeAddress
    },
    payPeriod: {
      type: formState.periodType,
      start: formState.periodStart,
      end: formState.periodEnd,
      month: formState.periodMonth,
      year: formState.periodYear,
      payDate: formState.payDate
    },
    earnings: {
      basic: totals.basicEarnings,
      overtime: totals.overtimeEarnings,
      allowances: formState.allowances.map((a: any) => ({
        label: a.label,
        amount: parseMoney(a.amount)
      })),
      bonuses: formState.bonuses.map((b: any) => ({
        label: b.label,
        amount: parseMoney(b.amount)
      }))
    },
    deductions: {
      tax: totals.taxVal,
      pension: totals.pensionVal,
      healthInsurance: totals.healthVal,
      others: formState.otherDeductions.map((d: any) => ({
        label: d.label,
        amount: parseMoney(d.amount)
      }))
    },
    totals: {
      gross: totals.gross,
      totalDeductions: totals.totalDeductions,
      net: totals.net
    },
    additional: {
      frequency: formState.frequency,
      method: formState.method,
      bankDetails: formState.bankDetails,
      country: formState.country,
      wageRuleRef: formState.wageRuleRef,
      notes: formState.notes
    },
    signatureUrl: formState.signatureUrl
  };

  try {
    const generator = new PayslipPDFGenerator(pdfData, options);
    const pdf = await generator.generate();
    
    const filename = `payslip-${formState.employeeName}-${new Date().getTime()}.pdf`;
    console.log('💾 Saving PDF as:', filename);
    pdf.save(filename);
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

// Helper function to parse money
const parseMoney = (v?: string): number => {
  if (!v && v !== "0") return 0;
  const cleaned = String(v).replace(/[^\d.-]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
};