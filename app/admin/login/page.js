'use client';

import React, { useState } from 'react';

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // later: call your login API / server action here
    console.log('Admin login submitted');
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-900 flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Soft orange gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-orange-200 blur-3xl opacity-70" />
        <div className="absolute bottom-[-6rem] left-[-4rem] h-72 w-72 rounded-full bg-orange-100 blur-3xl opacity-80" />
      </div>

      <div className="w-full max-w-md">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="mt-2 text-5xl font-bold tracking-tight">Log in</h1>
          <p className="mt-2 text-sm text-slate-500">
            Use your admin credentials to access the dashboard.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <form className="p-6 md:p-7 space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Admin email
              </label>
              <input
                type="email"
                name="email"
                placeholder="admin@company.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>

            {/* Password with eye toggle */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 pr-10 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    // Eye off
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5 0-9-3.5-10-8 0-1.1.27-2.16.76-3.1" />
                      <path d="M6.06 6.06A10.07 10.07 0 0 1 12 4c5 0 9 3.5 10 8-.24 1.08-.63 2.11-1.16 3.05" />
                      <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
                      <path d="m3 3 18 18" />
                    </svg>
                  ) : (
                    // Eye
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-base font-medium px-4 py-2.5 shadow-md shadow-orange-500/30 transition-colors"
              >
                Log in
              </button>
            </div>
          </form>
        </div>

        <p className="mt-4 text-[11px] text-center text-slate-400">
          For security reasons, admin access is monitored. Contact your system
          owner if you face login issues.
        </p>
      </div>
    </div>
  );
}
