"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText, ShieldCheck, Zap } from "lucide-react";

export default function Hero() {
  const handleScrollToForm = useCallback(() => {
    const formSection = document.getElementById("payslip-form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleScrollToFeatures = useCallback(() => {
    const featuresSection = document.getElementById("features-section");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Animation variants for the staggered headline
  const headlineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  const headline = "Generate Payslips in Seconds";

  return (
    <section className="relative w-full mt-18 flex flex-col items-center justify-center overflow-hidden">
      {/* 1. Dynamic Background using your green secondary color */}
      <div className="absolute top-0 left-0 w-full h-full bg-[var(--color-bg)]">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(5,150,105,0.15),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(5,150,105,0.1),rgba(255,255,255,0))]"></div>
      </div>
      
      {/* 2. Responsive Product Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 50, rotate: 15 }}
        animate={{ opacity: 0.05, y: 0, rotate: 5 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-[10%] -left-[10%] w-64 h-64 lg:top-1/4 lg:left-[5%] lg:w-96 lg:h-96"
        style={{
          backgroundImage: `url('https://cdn-icons-png.flaticon.com/512/8159/8159180.png')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          filter: 'invert(1)'
        }}
        aria-hidden="true"
      />
      
      {/* Main Content Container with improved padding */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full px-6 md:px-8 mt-auto">
        {/* Fluid Typography */}
        <motion.h1
          variants={headlineVariants}
          initial="hidden"
          animate="visible"
          className="text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tighter text-[var(--color-text)]"
        >
          {headline.split("").map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              variants={letterVariants}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeInOut" }}
          className="mt-6 text-base md:text-lg lg:text-xl text-[var(--color-text)]/80 max-w-2xl mx-auto"
        >
          Quick, compliant, and professional payslips — free to start, upgrade
          for more features.
        </motion.p>
        
        {/* Responsive CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: "easeInOut" }}
          className="mt-10 flex w-full flex-col sm:w-auto sm:flex-row items-center gap-4"
        >
          <button
            onClick={handleScrollToForm}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[var(--color-primary-dark)] hover:scale-105"
          >
            Generate Now <ArrowRight className="h-5 w-5" />
          </button>
          <button
            onClick={handleScrollToFeatures}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border-2 border-[var(--color-text)]/30 bg-transparent px-8 py-4 text-lg font-medium text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-text)]/80 hover:bg-[var(--color-text)]/10"
          >
            View Features
          </button>
        </motion.div>

        {/* Responsive Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6, ease: "easeInOut" }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 text-sm text-[var(--color-text)]/70"
        >
          <div className="flex -space-x-2 overflow-hidden">
            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[var(--color-bg)]" src="https://randomuser.me/api/portraits/women/79.jpg" alt="User"/>
            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[var(--color-bg)]" src="https://randomuser.me/api/portraits/men/34.jpg" alt="User"/>
            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[var(--color-bg)]" src="https://randomuser.me/api/portraits/women/58.jpg" alt="User"/>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center text-[var(--color-accent)]">
              {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
            </div>
            <p>Trusted by 10,000+ happy users</p>
          </div>
        </motion.div>
      </div>

      {/* Responsive "Glassmorphism" Feature Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
        className="relative z-10 my-8 md:my-10 lg:my-12 w-11/12 max-w-5xl rounded-2xl border border-[var(--color-text)]/15 bg-[var(--color-text)]/5 p-4 md:p-6 backdrop-blur-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-[var(--color-text)] text-center">
          <div className="flex flex-col items-center gap-2">
            <Zap className="h-8 w-8 text-[var(--color-primary)]" />
            <h3 className="font-semibold">Instant Generation</h3>
            <p className="text-sm text-[var(--color-text)]/80">Create and download professional payslips in under 60 seconds.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <FileText className="h-8 w-8 text-[var(--color-primary)]" />
            <h3 className="font-semibold">Multiple Templates</h3>
            <p className="text-sm text-[var(--color-text)]/80">Choose from a variety of legally compliant and customizable templates.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-[var(--color-primary)]" />
            <h3 className="font-semibold">Secure & Private</h3>
            <p className="text-sm text-[var(--color-text)]/80">Your data is processed securely and never stored on our servers.</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}