'use client';

import React, { useEffect, useState } from 'react';

export default function ViewJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [openMenuJobId, setOpenMenuJobId] = useState(null); // which card's menu is open

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch('/api/job');
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to load jobs.');
      }

      setJobs(data.data || []);
    } catch (err) {
      setError(err.message || 'Something went wrong while loading jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleViewCandidates = (job) => {
    console.log('View candidates for job:', job.job_id);
  };

  const handleEditPost = (job) => {
    console.log('Edit job:', job.job_id);
  };

  const handleDeletePost = async (job) => {
    if (!confirm(`Delete job "${job.job_title}"?`)) return;

    try {
      setDeletingId(job.job_id);

      const res = await fetch('/api/job', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ job_id: job.job_id }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to delete job.');
      }

      setJobs((prev) => prev.filter((j) => j.job_id !== job.job_id));
    } catch (err) {
      alert(err.message || 'Something went wrong while deleting the job.');
    } finally {
      setDeletingId(null);
      setOpenMenuJobId(null);
    }
  };

  const toggleMenu = (jobId) => {
    setOpenMenuJobId((current) => (current === jobId ? null : jobId));
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-900 flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Soft orange gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-orange-200 blur-3xl opacity-70" />
        <div className="absolute bottom-[-6rem] left-[-4rem] h-72 w-72 rounded-full bg-orange-100 blur-3xl opacity-80" />
      </div>

      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-orange-500 uppercase">
              Admin · Jobs
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
              Job postings
            </h1>
            <p className="mt-2 text-sm text-slate-500 max-w-xl">
              Review all active and past job posts. Use the menu on each card to view candidates, edit, or delete a posting.
            </p>
          </div>
        </div>

        {/* Content states */}
        {loading && (
          <div className="flex justify-center py-12">
            <p className="text-sm text-slate-500">Loading jobs…</p>
          </div>
        )}

        {error && !loading && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2">
            {error}
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">
            <p className="text-sm font-medium text-slate-700">
              No job postings yet.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Create a new job from the “Post job” page to see it listed here.
            </p>
          </div>
        )}

        {/* Jobs list – single column, stacked cards */}
        {!loading && !error && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job) => {
              const expiry = job.expiry_date ? new Date(job.expiry_date) : null;
              const created = job.created_at ? new Date(job.created_at) : null;
              const isExpired = expiry && expiry.getTime() < Date.now();

              const menuOpen = openMenuJobId === job.job_id;

              return (
                <div
                  key={job.job_id}
                  className="relative flex flex-col rounded-2xl border border-slate-200 bg-white/90 shadow-[0_16px_40px_rgba(15,23,42,0.06)] p-4 md:p-5"
                >
                  {/* Top row: title + status + menu */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-semibold text-slate-900 truncate">
                        {job.job_title}
                      </h2>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-600">
                          {job.employment_type}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                          {job.work_mode}
                        </span>
                        {job.job_level && (
                          <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                            {job.job_level}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status + menu */}
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          isExpired
                            ? 'bg-slate-100 text-slate-500'
                            : job.is_active
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {isExpired
                          ? 'Expired'
                          : job.is_active
                          ? 'Active'
                          : 'Inactive'}
                      </span>

                      {/* Three-dots button + dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => toggleMenu(job.job_id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"
                        >
                          <span className="sr-only">Open menu</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-4 w-4"
                          >
                            <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0 5.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm1.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                          </svg>
                        </button>

                        {menuOpen && (
                          <div className="absolute right-0 mt-1 w-40 rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10 text-xs py-1 z-10">
                            <button
                              type="button"
                              onClick={() => handleViewCandidates(job)}
                              className="block w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                            >
                              View candidates
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditPost(job)}
                              className="block w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                            >
                              Edit post
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePost(job)}
                              className="block w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 disabled:opacity-60"
                              disabled={deletingId === job.job_id}
                            >
                              {deletingId === job.job_id ? 'Deleting…' : 'Delete post'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-slate-600 line-clamp-3">
                      {job.job_description}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Location:{' '}
                      <span className="font-medium">{job.primary_location}</span>
                    </p>
                    {job.external_url && (
                      <p className="text-[11px] text-slate-500">
                        External URL:{' '}
                        <a
                          href={job.external_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-orange-600 hover:underline break-all"
                        >
                          {job.external_url}
                        </a>
                      </p>
                    )}
                  </div>

                  {/* Footer meta */}
                  <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      Created{' '}
                      {created
                        ? created.toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '–'}
                    </span>
                    <span>
                      Expires{' '}
                      {expiry
                        ? expiry.toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '–'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}