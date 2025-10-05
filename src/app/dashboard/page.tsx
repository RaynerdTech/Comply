"use client";
import { useSession, signOut } from "next-auth/react";
import CompanyGuard from "@/components/CompanyGuard";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Required</h2>
          <p className="text-gray-600 dark:text-gray-300">Please sign in to access your company dashboard</p>
          <a 
            href="/login" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <CompanyGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 🎉 PRO FEATURES ANNOUNCEMENT BANNER */}
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden border-0">
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold animate-pulse">
                  🎉 EXCLUSIVE ACCESS
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Pro Features Unlocked! 🚀</h2>
              <p className="text-xl mb-6 max-w-3xl mx-auto opacity-95">
                <strong>Congratulations!</strong> You now have access to all Pro features including 
                <strong> custom branding, unlimited documents, and advanced payslip generation</strong> 
                - available right on the homepage!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/"
                  className="px-8 py-4 bg-white text-purple-600 font-bold rounded-2xl hover:scale-105 transition-all duration-200 transform shadow-2xl flex items-center gap-3 text-lg"
                >
                  <span>✨</span>
                  Go to Homepage & Use Pro Features
                  <span>🚀</span>
                </Link>
                <div className="text-sm opacity-80">
                  Click the Complyn logo anytime to return here
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <span className="text-4xl">🎯</span>
            </div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 rounded-full"></div>
          </div>

          {/* Welcome & Progress Header */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-slate-700">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Welcome to Complyn!
                  </h1>
                  <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold rounded-full animate-pulse">
                    EARLY BETA
                  </div>
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Great news! Your company <span className="font-semibold text-primary">{session.user?.name || "account"}</span> is successfully set up and ready.
                </p>
                
                {/* Progress Tracker */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mt-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                    <span>🏗️</span> Build Progress
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-green-700 dark:text-green-300">Authentication & Company Setup</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-green-700 dark:text-green-300">Public Payslip Generator</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">→</span>
                      </div>
                      <span className="text-blue-700 dark:text-blue-300">HR & Employee Invite System</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🚀</span>
              </div>
            </div>
          </div>

          {/* What's Live Right Now */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>✅</span> Ready to Use
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Company Profile Setup</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Secure Authentication</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Pro Features on Homepage</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
            </div>

            {/* Coming Next */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>🔜</span> Coming Next
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                    <span className="font-semibold">HR Manager Invites</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Employee Management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Wage Rules & Compliance</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-white/5 rounded-full"></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Your Account
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                    {session.user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{session.user?.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">Company Owner • Active</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100 dark:border-slate-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold text-primary">Plan:</span> <span className="text-green-500">Pro Features Active</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold text-primary">Status:</span> <span className="text-green-500">Full Access</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link 
                  href="/"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-200 transform shadow-lg flex items-center justify-center gap-2"
                >
                  <span>✨</span>
                  Use Pro Features
                </Link>
              <button 
  className="w-full px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300 flex items-center justify-center gap-2 border border-green-200 dark:border-green-700/50 hover:scale-105"
  onClick={() => window.open('https://wa.link/1tw7f2', '_blank')}
>
  <span>💬</span>
  Give Feedback on Development
</button>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSigningOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      Signing Out...
                    </>
                  ) : (
                    <>
                      <span>🚪</span>
                      Sign Out
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tip */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-700 text-center">
            <p className="text-yellow-800 dark:text-yellow-200 flex items-center justify-center gap-2">
              <span>💡</span>
              <strong>Quick Tip:</strong> Click the Complyn logo in the header to switch between Dashboard and Pro Features
            </p>
          </div>
        </div>
      </div>
    </CompanyGuard>
  );
}