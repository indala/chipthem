"use client";

import { useEffect, useState } from "react";
import { useOwnerStore } from "@/store/useOwnerStore";
import type { Owner } from "@/types/owners";
import { motion } from "framer-motion";

export default function MyProfilePage() {
  const { owner, isLoading, error, fetchOwnerData, updateOwner } = useOwnerStore();

  // FIX: Initialize state using a function (lazy initialization)
  // This runs only once on mount and uses the initial value of 'owner' if available.
  // This replaces the useEffect that was causing the cascading render warning.
  const [form, setForm] = useState<Partial<Owner>>(() => {
    if (owner) {
      return {
        full_name: owner.full_name,
        email: owner.email,
        phone_number: owner.phone_number,
        street_address: owner.street_address,
        city: owner.city,
        country: owner.country,
      };
    }
    return {};
  });

  const [saving, setSaving] = useState(false);

  // Effect to fetch owner data on component mount
  useEffect(() => {
    if (!owner) fetchOwnerData();
  }, [owner, fetchOwnerData]);
  
  // NOTE: The problematic useEffect that called setForm based on 'owner' has been removed.
  // The state is now initialized above.

  if (isLoading && !owner) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-sky-50 via-slate-50 to-emerald-50">
        <div className="text-lg font-semibold text-slate-700">
          Loading your profile...
        </div>
      </div>
    );
  }

  if (error && !owner) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-rose-50 via-amber-50 to-slate-50">
        <div className="text-center px-8 py-6 rounded-3xl bg-white/95 border border-rose-200 shadow-lg">
          <p className="text-rose-600 font-semibold mb-2">
            Error loading profile: {error}
          </p>
          <p className="text-sm text-slate-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-sky-50 via-slate-50 to-emerald-50">
        <p className="text-gray-700 text-lg font-medium">
          No profile found.
        </p>
      </div>
    );
  }

  const handleChange =
    (field: keyof Owner) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Assuming updateOwner updates the 'owner' in the store on success.
    await updateOwner(owner.id, form);
    setSaving(false);
    
    // Optional: Re-sync form with the latest owner state from the store after update.
    // This is good practice to ensure the form reflects the officially saved data.
    if (owner) {
       setForm({
         full_name: owner.full_name,
         email: owner.email,
         phone_number: owner.phone_number,
         street_address: owner.street_address,
         city: owner.city,
         country: owner.country,
       });
    }
  };

  return (
    <div className="min-h-[100vh] bg-gradient-to-br from-sky-50 via-slate-50 to-emerald-50 flex items-center">
      <div className="max-w-3xl mx-auto w-full px-4 py-10 " >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-sky-50/70 to-emerald-50/70 shadow-xl border border-yellow-500"
        >
          {/* Soft gradient accents */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 -right-10 h-32 w-32 bg-sky-200/60 blur-3xl" />
            <div className="absolute -bottom-16 -left-10 h-32 w-32 bg-emerald-200/60 blur-3xl" />
          </div>

          <div className="relative p-8 sm:p-10 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-500">
                Account
              </p>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                My Profile
              </h1>
              <p className="text-sm text-slate-600">
                Manage your contact information and address.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Full name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                  value={form.full_name ?? ""}
                  onChange={handleChange("full_name")}
                  placeholder="Your full name"
                />
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                  value={form.email ?? ""}
                  readOnly
                />
                <p className="text-[11px] text-slate-500">
                  Your email is managed by the system and cannot be changed here.
                </p>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Phone number
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                  value={form.phone_number ?? ""}
                  onChange={handleChange("phone_number")}
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Street Address */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Street address
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                  value={form.street_address ?? ""}
                  onChange={handleChange("street_address")}
                  placeholder="House / Apartment, Street, Area"
                />
              </div>

              {/* City & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">
                    City
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                    value={form.city ?? ""}
                    onChange={handleChange("city")}
                    placeholder="Your city"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">
                    Country
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                    value={form.country ?? ""}
                    onChange={handleChange("country")}
                    placeholder="Your country"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}