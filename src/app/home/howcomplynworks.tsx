"use client";

import React from 'react';
import { Calculator, Zap, Lock, CheckCircle, ArrowRight, FileText, Palette, Image, Signature } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  return (
    <div className="w-full py-8 sm:py-12 lg:py-16 bg-[var(--color-custom-bg)]">
      <div className="w-full sm:w-[86%] mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl border border-green-200/60 dark:border-green-700/60 mb-6 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-green-600 dark:text-green-400" aria-hidden="true" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Smart Payslip Generation
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How Complyn Calculates Your Payslip
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Automatic calculations, compliance features, and professional formatting - all in one powerful tool.
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Left Column - Core Features */}
          <div className="space-y-8">
            {/* Earnings Calculation */}
            <section className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex md:items-start flex-col sm:flex-row items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0" aria-hidden="true">
                  <Calculator className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Earnings Calculation
                  </h2>
                  <div className="space-y-3 text-base">
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Basic Pay:</span>
                      <code className="font-mono text-green-600 dark:text-green-400 text-sm">
                        {`Pay Rate × Hours Worked`}
                      </code>
                    </div>
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Overtime:</span>
                      <code className="font-mono text-green-600 dark:text-green-400 text-sm">
                        {`Overtime Hours × Overtime Rate`}
                      </code>
                    </div>
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Allowances & Bonuses:</span>
                      <code className="font-mono text-green-600 dark:text-green-400 text-sm">
                        Sum of all entries
                      </code>
                    </div>
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between py-3 bg-green-50 dark:bg-green-900/20 rounded-lg px-4">
                      <span className="font-semibold text-green-800 dark:text-green-200">Gross Pay:</span>
                      <code className="font-mono font-bold text-green-700 dark:text-green-300 text-sm">
                        {`Basic + Overtime + Allowances + Bonuses`}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Deductions Calculation */}
            <section className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-center md:items-start gap-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0" aria-hidden="true">
                  <Calculator className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Deductions Calculation
                  </h2>
                  <div className="space-y-3 text-base">
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                      <code className="font-mono text-red-600 dark:text-red-400 text-sm">
                        {`Percentage or Fixed Amount`}
                      </code>
                    </div>
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Pension & Insurance:</span>
                      <code className="font-mono text-red-600 dark:text-red-400 text-sm">
                        Fixed amounts
                      </code>
                    </div>
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Other Deductions:</span>
                      <code className="font-mono text-red-600 dark:text-red-400 text-sm">
                        Sum of all entries
                      </code>
                    </div>
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between py-3 bg-red-50 dark:bg-red-900/20 rounded-lg px-4">
                      <span className="font-semibold text-red-800 dark:text-red-200">Total Deductions:</span>
                      <code className="font-mono font-bold text-red-700 dark:text-red-300 text-sm">
                        {`Tax + Pension + Insurance + Others`}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Final Calculation */}
            <section className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">Net Pay Calculation</h2>
                  <p className="text-green-100 text-base opacity-90">
                    The final amount the employee receives
                  </p>
                </div>
                <div className="flex flex-col items-center lg:items-end">
                  <div className="text-2xl font-bold">Gross Pay</div>
                  <ArrowRight className="w-6 h-6 mx-auto my-2 rotate-90 lg:rotate-0" aria-hidden="true" />
                  <div className="text-2xl font-bold">Total Deductions</div>
                  <div className="text-3xl font-bold mt-3">= Net Pay</div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Pro Features & Benefits */}
          <div className="space-y-8">
            {/* Pro Features Header */}
            <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200/60 dark:border-amber-700/60 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Professional Features
                  </h2>
                  <p className="text-amber-700 dark:text-amber-300">
                    Upgrade to Complyn Pro for enhanced professionalism
                  </p>
                </div>
              </div>
            </section>

            {/* Pro Features List */}
            <div className="space-y-6">
              {[
                {
                  icon: Palette,
                  title: "Brand Color",
                  description: "Customize payslip colors to match your company branding",
                  color: "green"
                },
                {
                  icon: Image,
                  title: "Company Logo",
                  description: "Add your company logo for professional branding on all payslips",
                  color: "blue"
                },
                {
                  icon: Signature,
                  title: "Digital Signature",
                  description: "Upload authorized signatures for official-looking payslips",
                  color: "purple"
                }
              ].map((feature, index) => (
                <section key={index} className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/60 dark:border-gray-700/60 group hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className={`w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`} aria-hidden="true">
                      <feature.icon className={`w-5 h-5 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1 justify-center sm:justify-start">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                        <span className="px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full font-medium">
                          PRO
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center flex-shrink-0 mt-2 sm:mt-0" aria-hidden="true">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* Benefits Card */}
            <section className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-center sm:text-left">Why Choose Complyn Pro?</h3>
              <div className="space-y-3">
                {[
                  "Professional branding with your colors and logo",
                  "Official-looking payslips with digital signatures",
                  "Enhanced credibility with authorized documents",
                  "Faster processing with automated calculations",
                  "Compliance-ready for various countries"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-gray-600 dark:text-gray-400 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Calculation Examples */}
        <section className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-lg transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Real Calculation Examples
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Example 1: Salary Employee */}
            <div className="space-y-6">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-center sm:text-left">Monthly Salary Example</h3>
              </div>
              <div className="space-y-3 text-base">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Basic Salary:</span>
                  <span className="font-mono text-green-600 dark:text-green-400">₦150,000.00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Transport Allowance:</span>
                  <span className="font-mono text-green-600 dark:text-green-400">₦20,000.00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Housing Allowance:</span>
                  <span className="font-mono text-green-600 dark:text-green-400">₦50,000.00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Tax (10% of Gross):</span>
                  <span className="font-mono text-red-600 dark:text-red-400">₦22,000.00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Pension:</span>
                  <span className="font-mono text-red-600 dark:text-red-400">₦7,500.00</span>
                </div>
                <div className="flex justify-between pt-3 font-semibold border-t border-gray-200 dark:border-gray-600">
                  <span className="text-gray-900 dark:text-white">Net Pay:</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">₦190,500.00</span>
                </div>
              </div>
            </div>

            {/* Example 2: Hourly Employee */}
            <div className="space-y-6">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-center sm:text-left">Hourly Employee Example</h3>
              </div>
              <div className="space-y-3 text-base">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Hourly Rate (₦2,500 × 160h):</span>
                  <span className="font-mono text-green-600 dark:text-green-400">₦400,000.00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Overtime (10h × ₦3,750):</span>
                  <span className="font-mono text-green-600 dark:text-green-400">₦37,500.00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Performance Bonus:</span>
                  <span className="font-mono text-green-600 dark:text-green-400">₦25,000.00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Tax (Fixed):</span>
                  <span className="font-mono text-red-600 dark:text-red-400">₦45,000.00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Health Insurance:</span>
                  <span className="font-mono text-red-600 dark:text-red-400">₦15,000.00</span>
                </div>
                <div className="flex justify-between pt-3 font-semibold border-t border-gray-200 dark:border-gray-600">
                  <span className="text-gray-900 dark:text-white">Net Pay:</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">₦402,500.00</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <footer className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium backdrop-blur-sm">
            <Zap className="w-4 h-4" aria-hidden="true" />
            Ready to create professional payslips?
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-base max-w-2xl mx-auto leading-relaxed">
            Start with our free plan or upgrade to Complyn Pro for advanced features and professional branding.
          </p>
        </footer>
      </div>
    </div>
  );
};