'use client';

import { useEffect, useState } from 'react';
import { useOwnerStore } from '@/store/useOwnerStore';
import Modal from '../../components/Modal';

export default function SettingsPage() {
  const { owner, isLoading, error, fetchOwnerData, updatePassword } = useOwnerStore();
  const [isPwModalOpen, setIsPwModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);

  useEffect(() => {
    if (!owner) fetchOwnerData();
  }, [owner, fetchOwnerData]);

  const resetPwForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPwError(null);
  };

  const handleOpenPwModal = () => {
    resetPwForm();
    setIsPwModalOpen(true);
  };

  const handleClosePwModal = () => {
    setIsPwModalOpen(false);
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError('Please fill all fields.');
      return;
    }

    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }

    if (newPassword === currentPassword) {
      setPwError('New password must be different from current password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError('New password and confirmation do not match.');
      return;
    }

    if (!owner) {
      setPwError('Owner not loaded.');
      return;
    }

    await updatePassword(owner.id, currentPassword, newPassword);
    setIsPwModalOpen(false);
  };

  if (isLoading && !owner) {
    return <div className="text-center p-12">Loading settings...</div>;
  }

  if (error && !owner) {
    return (
      <div className="text-center p-12 text-red-600">
        <p>Error loading settings: {error}</p>
      </div>
    );
  }

  if (!owner) {
    return <div className="text-center p-12">No owner data found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>

      {/* Account */}
      <section className="bg-white shadow-sm rounded-lg p-4 sm:p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-2">Account</h2>
        <p className="text-sm text-gray-600">
          Logged in as <span className="font-medium">{owner.email}</span>
        </p>
      </section>

      {/* Privacy & verification */}
      <section className="bg-white shadow-sm rounded-lg p-4 sm:p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-2">Privacy & verification</h2>
        <p className="text-sm text-gray-600">
          Account status:{' '}
          <span className="font-medium">{owner.status ?? 'active'}</span>
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Verified:{' '}
          <span className="font-medium">{owner.is_verified ? 'Yes' : 'No'}</span>
        </p>
      </section>

     

      {/* Security / Change password */}
      <section className="bg-white shadow-sm rounded-lg p-4 sm:p-6 border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-1">Security</h2>
          <p className="text-sm text-gray-600">
            Change your password to keep your account secure.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenPwModal}
          className="mt-3 sm:mt-0 inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          Change password
        </button>
      </section>

      {isPwModalOpen && (
        <Modal title="Change password" onClose={handleClosePwModal}>
          <form onSubmit={handleSubmitPassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                Current password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
              />
              <p className="text-[11px] text-gray-500">
                Must be at least 8 characters and different from your current password.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
              />
            </div>

            {pwError && (
              <p className="text-xs text-red-600 font-medium">{pwError}</p>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClosePwModal}
                className="px-3 py-1.5 text-xs font-semibold rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700"
              >
                Save password
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
