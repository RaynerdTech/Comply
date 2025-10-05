// src/app/signup/page.tsx
import React from "react";
import AuthForm from "@/components/AuthForm";
import OAuthButton from "@/components/OAuthButton";
import Link from "next/link";

// ✅ Base64-encoded SVG splash background
const SPLASH_GREEN_SVG_BASE64 = `/green_splash.png`;

export default function SignupPage() {
  return (
    <main
      className="flex min-h-screen w-full items-center justify-center bg-cover bg-center p-4 text-white"
      style={{ backgroundImage: "url('/payslip background.jpg')" }}
    >
      {/* Animated container for the form */}
      <div className="w-full max-w-md animate-fadeInUp space-y-6">
        {/* Logo + Heading */}
        <div className="text-center text-white space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-white">Complyn</h1>

          {/* ✅ Splash-styled subheading */}
          <p
            className="inline-block px-5 py-2 text-base font-medium text-white rounded-lg shadow-md"
            style={{
              backgroundImage: `url(${SPLASH_GREEN_SVG_BASE64})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              lineHeight: "1.3",
            }}
          >
            Simplified Payroll for Modern Business
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-lg">
          <AuthForm mode="signup" />

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-600" />
            <div className="text-sm text-gray-400">OR</div>
            <div className="flex-1 h-px bg-gray-600" />
          </div>

          <OAuthButton provider="google" label="Sign up with Google" />
        </div>

        <p className="text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-green-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
