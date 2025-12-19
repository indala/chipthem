// app/(veterinary)/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useVeterinaryStore } from '@/store/useVeterinaryStore';

export default function VeterinaryDashboardPage() {
  const { veterinary, isLoading, error, fetchVeterinaryData } = useVeterinaryStore();

  useEffect(() => {
    if (!veterinary) {
      fetchVeterinaryData();
    }
  }, [veterinary, fetchVeterinaryData]);


  if (isLoading && !veterinary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-sm">Loading your dashboard…</p>
      </div>
    );
  }

  if (error && !veterinary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!veterinary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-sm">No veterinary profile found.</p>
      </div>
    );
  }

  const firstName =
    veterinary.contact_person?.split(' ')[0] || veterinary.clinic_name || 'Doctor';

  const isSubscribed =
    veterinary.subscription_status &&
    veterinary.subscription_status.toLowerCase() !== 'not subscribed';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Welcome back</p>
            <h1 className="text-xl font-semibold text-gray-900">
              {firstName},
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {veterinary.clinic_name} • {veterinary.city || 'Unknown city'}
            </p>
          </div>
          <div className="text-right space-y-1">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                veterinary.is_verified
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {veterinary.is_verified ? 'Verified clinic' : 'Pending verification'}
            </span>
            <div className="text-[11px] text-gray-500">
              Status: {veterinary.status}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Hero / warm greeting */}
        <section className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Good to see you, {firstName}.
            </h2>
            <p className="mt-1 text-xs md:text-sm text-emerald-50 max-w-md">
              Manage your clinic details, keep your subscription active, and help
              more pets get back home faster.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/veterinary/my-clinic"
              className="inline-flex items-center rounded-full bg-white/95 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow hover:bg-white"
            >
              Go to My Clinic
            </Link>
            <Link
              href="/veterinary/profile"
              className="inline-flex items-center rounded-full border border-emerald-200/70 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600/70"
            >
              View Profile
            </Link>
          </div>
        </section>

        {/* Quick status cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Subscription card */}
          <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Subscription
              </h3>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {veterinary.subscription_status || 'Not Subscribed'}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {veterinary.subscribed_at
                  ? `Since ${new Date(
                      veterinary.subscribed_at as string
                    ).toLocaleDateString()}`
                  : 'No active subscription yet'}
              </p>
              {veterinary.subscription_expires_at && (
                <p className="mt-1 text-xs text-gray-500">
                  Expires{' '}
                  {new Date(
                    veterinary.subscription_expires_at as string
                  ).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="mt-3">
              <Link
                href="/veterinary/settings"
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                  isSubscribed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                Manage subscription
              </Link>
            </div>
          </div>

          {/* Location / maps card */}
          <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Clinic location
              </h3>
              <p className="mt-2 text-sm text-gray-900">
                {veterinary.city || 'No city set'}
                {veterinary.country ? `, ${veterinary.country}` : ''}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {veterinary.street_address
                  ? veterinary.street_address
                  : 'Street address not added yet'}
              </p>
              {veterinary.google_maps_url && (
                <a
                  href={veterinary.google_maps_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-xs text-indigo-600 hover:underline"
                >
                  Open in Google Maps
                </a>
              )}
            </div>
            <div className="mt-3">
              <Link
                href="/veterinary/my-clinic"
                className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Update address & map
              </Link>
            </div>
          </div>

          {/* Compliance / checklist card */}
          <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Profile checklist
              </h3>
              <ul className="mt-2 space-y-1.5 text-[11px] text-gray-700">
                <li>
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      veterinary.terms_accepted ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  />
                  Terms accepted
                </li>
                <li>
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      veterinary.data_accuracy_confirmed
                        ? 'bg-emerald-500'
                        : 'bg-gray-300'
                    }`}
                  />
                  Data accuracy confirmed
                </li>
                <li>
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      veterinary.professional_confirmation
                        ? 'bg-emerald-500'
                        : 'bg-gray-300'
                    }`}
                  />
                  Professional status confirmed
                </li>
                <li>
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      veterinary.email_updates_opt_in
                        ? 'bg-emerald-500'
                        : 'bg-gray-300'
                    }`}
                  />
                  Email updates enabled
                </li>
              </ul>
            </div>
            <div className="mt-3">
              <Link
                href="/veterinary/profile"
                className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Review profile
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom info row (optional, simple text) */}
        <section className="bg-white rounded-xl border shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Quick tips
          </h3>
          <p className="text-xs text-gray-600">
            Keep your clinic information complete and your subscription active so
            that pet owners can easily find and trust your clinic in the ChipThem
            network.
          </p>
        </section>
      </main>
    </div>
  );
}
