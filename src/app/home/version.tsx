"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Crown, Zap, Palette, Signature, Image, Layers, Infinity, Star, ArrowUp } from 'lucide-react';
import { useRouter } from "next/navigation";

export const VersionComparisonSection: React.FC = () => {
    const router = useRouter();
  const [activeVersion, setActiveVersion] = useState<'free' | 'pro' | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const freeCardRef = useRef<HTMLDivElement>(null);
  const proCardRef = useRef<HTMLDivElement>(null);

  // Detect mobile and handle resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle click outside to close features
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (freeCardRef.current && !freeCardRef.current.contains(event.target as Node) &&
          proCardRef.current && !proCardRef.current.contains(event.target as Node)) {
        setActiveVersion(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const freeFeatures = [
    { name: "Basic Salary Calculations", icon: Zap, available: true },
    { name: "Single Payslip Generation", icon: Layers, available: true },
    { name: "Standard Templates", icon: Image, available: true },
    { name: "Basic PDF Export", icon: Check, available: true },
    { name: "Employee Information", icon: Check, available: true },
    { name: "Tax & Deduction Support", icon: Check, available: true },
  ];

  const proFeatures = [
    { name: "Brand Color Customization", icon: Palette, available: true },
    { name: "Digital Signatures", icon: Signature, available: true },
    { name: "Company Logo Integration", icon: Image, available: true },
    { name: "Multiple Payslip Generation", icon: Layers, available: true },
    { name: "Unlimited Payslip Creation", icon: Infinity, available: true },
    { name: "Priority Support", icon: Star, available: true },
  ];

  const handleCardInteraction = (version: 'free' | 'pro') => {
    if (isMobile) {
      setActiveVersion(activeVersion === version ? null : version);
    } else {
      setActiveVersion(version);
    }
  };

  const handleCardLeave = () => {
    if (!isMobile) {
      setActiveVersion(null);
    }
  };

  return (
    <div className="w-full py-12">
      <div className="w-full sm:w-[86%] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/60 dark:border-green-700/60 mb-6 backdrop-blur-sm">
            <Crown className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Choose Your Plan
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Free vs Pro Features
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Compare features and choose the perfect plan for your business needs
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Free Version Card */}
          <div
            ref={freeCardRef}
            className={`relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 transition-all duration-500 ${
              activeVersion === 'free' 
                ? 'border-blue-500 shadow-2xl scale-105 z-10' 
                : 'border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-xl'
            }`}
            onMouseEnter={() => !isMobile && handleCardInteraction('free')}
            onMouseLeave={handleCardLeave}
            onClick={() => isMobile && handleCardInteraction('free')}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Free Version
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                ₦0 / forever
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Perfect for getting started
              </p>
            </div>

            {/* Image Container with Overlay */}
            <div className="relative mb-6 rounded-xl overflow-hidden border border-gray-200/60 dark:border-gray-700/60 group">
              <img 
                src="/free.jpg" 
                alt="Free Version Interface"
                className="w-full h-72 sm:h-80 object-contain bg-white transition-transform duration-300"
              />
              
              {/* Features Overlay - Animated from bottom */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/40 transition-all duration-500 transform overflow-y-auto ${
                activeVersion === 'free' || isMobile
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              } flex flex-col justify-end p-4 sm:p-6`}>
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-400" />
                    Free Features Included
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-h-48 sm:max-h-56 overflow-y-auto pr-2">
                    {freeFeatures.map((feature, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/20 min-h-12"
                        style={{ transitionDelay: `${index * 50}ms` }}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          feature.available 
                            ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-400/30'
                        }`}>
                          {feature.available ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </div>
                        <span className="text-white text-xs sm:text-sm font-medium leading-tight flex-1">
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hover Indicator */}
              {!isMobile && (
                <div className={`absolute top-4 right-4 transition-all duration-300 ${
                  activeVersion === 'free' ? 'opacity-0' : 'opacity-100'
                }`}>
                  <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-1">
                    <ArrowUp className="w-3 h-3" />
                    Hover to see features
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Tap Hint */}
            {isMobile && (
              <div className="text-center mt-4">
                <p className="text-xs text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 py-2 px-4 rounded-lg">
                  {activeVersion === 'free' ? 'Tap anywhere to hide features' : 'Tap image to view features'}
                </p>
              </div>
            )}

            {/* Free CTA Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-blue-700" onClick={() => router.push('/signup')}>
              Get Started Free
            </button>
          </div>

          {/* Pro Version Card */}
          <div
            ref={proCardRef}
            className={`relative bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 transition-all duration-500 ${
              activeVersion === 'pro' 
                ? 'border-green-500 shadow-2xl scale-105 z-10' 
                : 'border-green-200/60 dark:border-green-700/60 shadow-lg hover:shadow-xl'
            }`}
            onMouseEnter={() => !isMobile && handleCardInteraction('pro')}
            onMouseLeave={handleCardLeave}
            onClick={() => isMobile && handleCardInteraction('pro')}
          >
            {/* Premium Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                <Crown className="w-4 h-4" />
                MOST POPULAR
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6 pt-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Pro Version
              </h3>
              <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
                ₦5,000 / month
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Everything you need for professional payslips
              </p>
            </div>

            {/* Image Container with Overlay */}
            <div className="relative mb-6 rounded-xl overflow-hidden border border-green-200/60 dark:border-green-700/60 group">
              <img 
                src="/pro version.jpg" 
                alt="Pro Version Interface"
                className="w-full h-72 sm:h-80 object-contain bg-white transition-transform duration-300"
              />
              
              {/* Features Overlay - Animated from bottom */}
              <div className={`absolute inset-0 bg-gradient-to-t from-green-900/95 via-green-800/90 to-green-700/50 transition-all duration-500 transform overflow-y-auto ${
                activeVersion === 'pro' || isMobile
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              } flex flex-col justify-end p-4 sm:p-6`}>
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    Premium Pro Features
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-h-48 sm:max-h-56 overflow-y-auto pr-2">
                    {proFeatures.map((feature, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/20 min-h-12"
                        style={{ transitionDelay: `${index * 50}ms` }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/20 text-white border border-white/30 flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-4 h-4" />
                        </div>
                        <span className="text-white text-xs sm:text-sm font-medium leading-tight flex-1">
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hover Indicator */}
              {!isMobile && (
                <div className={`absolute top-4 right-4 transition-all duration-300 ${
                  activeVersion === 'pro' ? 'opacity-0' : 'opacity-100'
                }`}>
                  <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-1">
                    <ArrowUp className="w-3 h-3" />
                    Hover to see features
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Tap Hint */}
            {isMobile && (
              <div className="text-center mt-4">
                <p className="text-xs text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/20 py-2 px-4 rounded-lg">
                  {activeVersion === 'pro' ? 'Tap anywhere to hide features' : 'Tap image to view features'}
                </p>
              </div>
            )}

            {/* Pro CTA Button */}
            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-green-700" onClick={() => router.push('/signup')}>
              Upgrade to Pro
            </button>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900 dark:text-white">Not sure which to choose?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Start with Free and upgrade anytime</p>
              </div>
            </div>
           <button 
  onClick={() => router.push('/signup')}
  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors whitespace-nowrap"
>
  Start Free Trial
</button>
          </div>
        </div>
      </div>
    </div>
  );
};