'use client';

import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="relative min-h-screen bg-white text-slate-900 flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Soft orange gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-orange-200 blur-3xl opacity-70" />
        <div className="absolute bottom-[-6rem] left-[-4rem] h-72 w-72 rounded-full bg-orange-100 blur-3xl opacity-80" />
      </div>

      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-orange-500 uppercase">
              Admin Dashboard
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
              Job management
            </h1>
            <p className="mt-2 text-sm text-slate-500 max-w-xl">
              Create new job postings or review existing ones from a single place.
            </p>
          </div>
        </div>

        {/* Card with two actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Post Jobs */}
          <div className="bg-white/90 border border-slate-200 rounded-2xl shadow-[0_18px_50px_rgba(15,23,42,0.06)] p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1">Post jobs</h2>
              <p className="text-sm text-slate-500 mb-4">
                Create a new opening with role details, location, and requirements.
              </p>
            </div>
            <Link
              href="/admin/addjob"
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 shadow-md shadow-orange-500/30 transition-colors"
            >
              Post a job
            </Link>
          </div>

          {/* View Jobs */}
          <div className="bg-white/90 border border-slate-200 rounded-2xl shadow-[0_18px_50px_rgba(15,23,42,0.06)] p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1">View jobs</h2>
              <p className="text-sm text-slate-500 mb-4">
                See all active and expired postings, and manage their status.
              </p>
            </div>
            <Link
              href="/admin/jobs" // you can implement this list page later
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2.5 transition-colors"
            >
              View jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
