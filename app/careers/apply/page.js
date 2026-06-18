'use client';

import React, { useState } from 'react';

export default function Page() {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    country_code: 'IND',
    address: '',
    city: '',
    state: '',
    pincode: '',
    email: '',
    phone_no: '',
    portfolio_url: '',
    gender: '',
    resume: null,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      resume: file,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';

    if (!formData.country_code.trim()) newErrors.country_code = 'Country code is required';

    if (!formData.phone_no.trim()) newErrors.phone_no = 'Phone number is required';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';

    if (!formData.gender) newErrors.gender = 'Please select a gender option';

    if (!formData.resume) newErrors.resume = 'Resume (PDF) is required';
    else if (formData.resume.type !== 'application/pdf') {
      newErrors.resume = 'Resume must be a PDF file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    setFormData({
      first_name: '',
      middle_name: '',
      last_name: '',
      country_code: 'IND',
      address: '',
      city: '',
      state: '',
      pincode: '',
      email: '',
      phone_no: '',
      portfolio_url: '',
      gender: '',
      resume: null,
    });
    setErrors({});
  };

  // NEW: FormData + Cloudinary-friendly submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const isValid = validate();
    if (!isValid) return;

    try {
      setIsLoading(true);

      const fd = new FormData();
      fd.append('first_name', formData.first_name);
      fd.append('middle_name', formData.middle_name);
      fd.append('last_name', formData.last_name);
      fd.append('country_code', formData.country_code);
      fd.append('address', formData.address);
      fd.append('city', formData.city);
      fd.append('state', formData.state);
      fd.append('pincode', formData.pincode);
      fd.append('email', formData.email);
      fd.append('phone_no', formData.phone_no);
      fd.append('portfolio_url', formData.portfolio_url);
      fd.append('gender', formData.gender);
      if (formData.resume) {
        fd.append('resume', formData.resume); // name must match API
      }

      const res = await fetch('/api/candidate', {
        method: 'POST',
        body: fd, // browser sets Content-Type with boundary
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to submit application.');
      }

      setSuccessMessage('Application submitted successfully.');
      clearForm();
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-900 flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Soft orange gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-orange-200 blur-3xl opacity-70" />
        <div className="absolute bottom-[-6rem] left-[-4rem] h-72 w-72 rounded-full bg-orange-100 blur-3xl opacity-80" />
      </div>

      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium tracking-[0.2em] text-orange-500 uppercase">
            Careers
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
            Candidate application
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-xl">
            Share your details and upload your resume so we can review your application.
            Fields marked with <span className="text-red-500">*</span> are required.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <form className="p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>
            {/* Global messages */}
            {successMessage && (
              <div className="mb-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs px-3 py-2">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mb-2 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2">
                {errorMessage}
              </div>
            )}

            {/* Name row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Aryan"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
                {errors.first_name && (
                  <p className="text-xs text-red-500 mt-0.5">{errors.first_name}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  Middle name
                </label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  placeholder="(optional)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  Last name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Sonavane"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
                {errors.last_name && (
                  <p className="text-xs text-red-500 mt-0.5">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Contact row: country code + phone */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              <div className="space-y-1 col-span-1">
                <label className="block text-sm font-medium text-slate-700">
                  Country code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country_code"
                  value={formData.country_code}
                  onChange={handleChange}
                  placeholder="IND"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm uppercase outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
                {errors.country_code && (
                  <p className="text-xs text-red-500 mt-0.5">{errors.country_code}</p>
                )}
              </div>

              <div className="space-y-1 col-span-2 md:col-span-3">
                <label className="block text-sm font-medium text-slate-700">
                  Phone number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone_no"
                  value={formData.phone_no}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
                {errors.phone_no && (
                  <p className="text-xs text-red-500 mt-0.5">{errors.phone_no}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                placeholder="Flat / Building / Street"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition resize-y"
              />
              {errors.address && (
                <p className="text-xs text-red-500 mt-0.5">{errors.address}</p>
              )}
            </div>

            {/* City / State / Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
                {errors.city && (
                  <p className="text-xs text-red-500 mt-0.5">{errors.city}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
                {errors.state && (
                  <p className="text-xs text-red-500 mt-0.5">{errors.state}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="400001"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
                {errors.pincode && (
                  <p className="text-xs text-red-500 mt-0.5">{errors.pincode}</p>
                )}
              </div>
            </div>

            {/* Portfolio & gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  Portfolio / GitHub URL
                </label>
                <input
                  type="url"
                  name="portfolio_url"
                  value={formData.portfolio_url}
                  onChange={handleChange}
                  placeholder="https://github.com/aryan"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>
                )}
              </div>
            </div>

            {/* Resume upload */}
            <div className="space-y-2 pt-2">
              <label className="block text-sm font-medium text-slate-700">
                Resume (PDF) <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <input
                  type="file"
                  name="resume"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-600
                             file:mr-4 file:rounded-lg file:border-0
                             file:bg-orange-500 file:px-4 file:py-2.5
                             file:text-sm file:font-medium file:text-white
                             hover:file:bg-orange-400 cursor-pointer"
                />
                <p className="text-xs text-slate-400">
                  Upload your latest resume in PDF format, max 5&nbsp;MB.
                </p>
              </div>
              {errors.resume && (
                <p className="text-xs text-red-500 mt-0.5">{errors.resume}</p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={clearForm}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 shadow-md shadow-orange-500/30 transition-colors"
              >
                {isLoading ? 'Submitting…' : 'Submit application'}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-4 text-[11px] text-center text-slate-400">
          Your information will be stored securely and used only for recruitment purposes.
        </p>
      </div>
    </div>
  );
}