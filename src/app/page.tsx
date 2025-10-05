// src/app/page.tsx
import Hero from "./home/Hero";
import PayslipForm from "./home/PayslipForm";
import {HowItWorksSection} from "./home/howcomplynworks";
import {VersionComparisonSection} from "./home/version";
// import PreviewPane from "./home/PreviewPane";
// import Footer from "./home/Footer";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* Hero section with scroll-to-form CTA */}
      <Hero />

      {/* Payslip generator form */}
      <section id="payslip-form" className="py-16 px-4 sm:px-8 mx-auto w-full  ">
        <PayslipForm />
      </section>

      {/* how it works */}
      <section className="py-6 mx-auto w-full" id="features-section">
        <HowItWorksSection />
      </section>
      {/* version */}
      <section className="py-6 mx-auto w-full">
        <VersionComparisonSection />
      </section>


    </main>
  );
}
