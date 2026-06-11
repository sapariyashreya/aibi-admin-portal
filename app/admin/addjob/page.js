'use client';

import React, { useState } from 'react';

export default function Page() {
  const [requireResume, setRequireResume] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      job_title: formData.get('job_title'),
      job_description: formData.get('job_description'),
      employment_type: formData.get('employment_type'),
      work_mode: formData.get('work_mode'),
      primary_location: formData.get('primary_location'),
      job_level: formData.get('job_level') || null,
      external_url: formData.get('external_url') || null,
      require_resume: requireResume,
      is_active: isActive,
      expiry_date: formData.get('expiry_date'),
      job_poster_url: formData.get('job_poster_url') || null,
    };

    // later: send this payload to your API / server action to insert into job_post
    console.log('Job payload:', payload);
  };

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
              Admin · Post job
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
              Create a new job
            </h1>
            <p className="mt-2 text-sm text-slate-500 max-w-xl">
              Fill in the details below. Fields marked with{' '}
              <span className="text-red-500">*</span> are required.
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <form
            className="p-6 md:p-8 space-y-6"
            onSubmit={handleSubmit}
          >
            {/* Job title */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Job title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="job_title"
                placeholder="Senior Backend Engineer"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Job description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="job_description"
                rows={5}
                placeholder="Describe the role, responsibilities, and required skills..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition resize-y"
                required
              />
            </div>

            {/* Employment type & work mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  Employment type <span className="text-red-500">*</span>
                </label>
                <select
                  name="employment_type"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                  required
                >
                  <option value="">Select type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Internship">Internship</option>
                  <option value="Volunteer">Volunteer</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  Work mode <span className="text-red-500">*</span>
                </label>
                <select
                  name="work_mode"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                  required
                >
                  <option value="">Select mode</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Primary location */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Primary location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="primary_location"
                placeholder="Mumbai, Maharashtra"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                required
              />
            </div>

            {/* Job level & expiry date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  Job level
                </label>
                <select
                  name="job_level"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                >
                  <option value="">Optional</option>
                  <option value="Entry">Entry</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                  <option value="Executive">Executive</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  Expiry date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="expiry_date"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                  required
                />
              </div>
            </div>

            {/* External URL & job poster URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  External job URL
                </label>
                <input
                  type="url"
                  name="external_url"
                  placeholder="https://other-company.com/job/123"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  Job poster URL
                </label>
                <input
                  type="url"
                  name="job_poster_url"
                  placeholder="https://linkedin.com/in/job-poster"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>
            </div>

            {/* Toggles: require resume & is_active */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Require resume */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                <div className="mr-4">
                  <p className="text-sm font-medium text-slate-700">
                    Require resume
                  </p>
                  <p className="text-xs text-slate-500">
                    Candidates must upload a resume when applying.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRequireResume((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    requireResume ? 'bg-orange-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      requireResume ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Is active */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                <div className="mr-4">
                  <p className="text-sm font-medium text-slate-700">
                    Mark as active
                  </p>
                  <p className="text-xs text-slate-500">
                    When off, the job will be saved as inactive.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isActive ? 'bg-orange-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isActive ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-6 py-2.5 shadow-md shadow-orange-500/30 transition-colors"
              >
                Save job
              </button>
            </div>
          </form>
        </div>

        <p className="mt-4 text-[11px] text-center text-slate-400">
          Job posts will follow your system rules for expiry and visibility.
        </p>
      </div>
    </div>
  );
}

