// app/(veterinary)/settings/page.tsx
'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useVeterinaryStore } from '@/store/useVeterinaryStore';

export default function VeterinarySettingsPage() {
  const { veterinary, isLoading, error, fetchVeterinaryData, updatePassword } =
    useVeterinaryStore();
  

  const [showPwModal, setShowPwModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!veterinary) {
      fetchVeterinaryData();
    }
  }, [veterinary, fetchVeterinaryData]);


  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!veterinary?.id) return;
    setLocalError(null);

    if (newPassword.length < 8) {
      setLocalError('New password must be at least 8 characters long.');
      return;
    }

    await updatePassword(veterinary.id, currentPassword, newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setShowPwModal(false);
  };

  

  if (isLoading && !veterinary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-sm">Loading settings…</p>
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
        <p className="text-gray-600 text-sm">No account data found.</p>
      </div>
    );
  }

  const isSubscribed =
    veterinary.subscription_status &&
    veterinary.subscription_status.toLowerCase() !== 'not subscribed';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your account security and subscription status.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Subscription + verification */}
        <section className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">
            Account status
          </h2>
          <div className="flex flex-col gap-2 text-xs text-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Verification</span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${
                  veterinary.is_verified
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {veterinary.is_verified ? 'Verified clinic' : 'Pending verification'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Status</span>
              <span className="text-gray-900 capitalize">
                {veterinary.status || 'pending'}
              </span>
            </div>
            {veterinary.verified_at && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Verified on</span>
                <span className="text-gray-900">
                  {new Date(veterinary.verified_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Subscription info */}
        <section className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">
            Subscription
          </h2>
          <div className="flex flex-col gap-2 text-xs text-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Plan</span>
              <span className="text-gray-900">
                {veterinary.subscription_status || 'Not Subscribed'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Started</span>
              <span className="text-gray-900">
                {veterinary.subscribed_at
                  ? new Date(
                      veterinary.subscribed_at
                    ).toLocaleDateString()
                  : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Expires</span>
              <span className="text-gray-900">
                {veterinary.subscription_expires_at
                  ? new Date(
                      veterinary.subscription_expires_at
                    ).toLocaleDateString()
                  : '—'}
              </span>
            </div>
          </div>
          <div className="pt-2">
            <button
              type="button"
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                isSubscribed
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
              }`}
              // onClick={() => router.push('/veterinary/billing')} // later
            >
              {isSubscribed ? 'Subscribed' : 'contact out team to active subscription'}
            </button>
          </div>
        </section>

        {/* Security section */}
        <section className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">Security</h2>
          <p className="text-xs text-gray-600">
            Keep your account secure by using a strong password and logging out
            from shared devices.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowPwModal(true)}
              className="inline-flex justify-center items-center rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-700"
            >
              Change password
            </button>
          </div>
          {error && (
            <p className="text-[11px] text-red-600 mt-1 break-words">
              {error}
            </p>
          )}
        </section>
      </main>

      {/* Password modal */}
      {showPwModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Change password
            </h3>
            <form className="space-y-3" onSubmit={handlePasswordSubmit}>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Current password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  New password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <p className="mt-1 text-[11px] text-gray-500">
                  At least 8 characters, ideally with letters, numbers, and a
                  symbol.
                </p>
              </div>
              {localError && (
                <p className="text-[11px] text-red-600">{localError}</p>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowPwModal(false);
                    setLocalError(null);
                    setCurrentPassword('');
                    setNewPassword('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                >
                  {isLoading ? 'Saving…' : 'Save profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
