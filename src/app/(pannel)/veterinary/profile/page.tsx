'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useVeterinaryStore } from '@/store/useVeterinaryStore';

// --- Type definition (assuming this structure exists in your store) ---
// Note: You would normally import this type from your store definition.
type VeterinaryData = {
  id: string;
  email: string;
  clinic_name: string;
  created_at: string;
  updated_at: string | null;
  contact_person: string | null;
  license_number: string | null;
  terms_accepted: boolean | null;
  data_accuracy_confirmed: boolean | null;
  professional_confirmation: boolean | null;
  consent_for_referrals: boolean | null;
  email_updates_opt_in: boolean | null;
};

// --- 1. Sub-Component: The Form and Local State Handler ---
// This component receives already-loaded data and manages the form state locally.
function VeterinaryProfileForm({
  initialData,
  onUpdate,
  isSaving,
  error,
}: {
  initialData: VeterinaryData;
  onUpdate: (data: Partial<Omit<VeterinaryData, 'id'>>) => Promise<void>;
  isSaving: boolean;
  error: string | null;
}) {
  // Initialize state directly from the initialData prop
  // This runs only once when the component mounts with the data.
  const [formState, setFormState] = useState({
    contact_person: initialData.contact_person || '',
    license_number: initialData.license_number || '',
    terms_accepted: !!initialData.terms_accepted,
    data_accuracy_confirmed: !!initialData.data_accuracy_confirmed,
    professional_confirmation: !!initialData.professional_confirmation,
    consent_for_referrals: !!initialData.consent_for_referrals,
    email_updates_opt_in: !!initialData.email_updates_opt_in,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Prepare data for API: trim strings, use null for empty fields
    const updatePayload = {
      contact_person: formState.contact_person.trim() || null,
      license_number: formState.license_number.trim() || null,
      terms_accepted: formState.terms_accepted,
      data_accuracy_confirmed: formState.data_accuracy_confirmed,
      professional_confirmation: formState.professional_confirmation,
      consent_for_referrals: formState.consent_for_referrals,
      email_updates_opt_in: formState.email_updates_opt_in,
    };

    await onUpdate(updatePayload);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Professional profile
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your contact details and professional confirmations. This
            information builds trust with pet owners.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Read-only account info */}
        <section className="bg-white rounded-xl shadow-sm border p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Account details
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="text-gray-900">{initialData.email}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Clinic</dt>
              <dd className="text-gray-900">{initialData.clinic_name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Account created</dt>
              <dd className="text-gray-900">
                {new Date(initialData.created_at).toLocaleDateString()}
              </dd>
            </div>
            {initialData.updated_at && (
              <div>
                <dt className="text-gray-500">Last updated</dt>
                <dd className="text-gray-900">
                  {new Date(initialData.updated_at).toLocaleDateString()}
                </dd>
              </div>
            )}
          </dl>
        </section>

        {/* Editable professional info */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border p-4 space-y-4"
        >
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Responsible veterinarian
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Contact person / Vet name
                </label>
                <input
                  type="text"
                  name="contact_person"
                  value={formState.contact_person}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Dr. Jane Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  License / registration number
                </label>
                <input
                  type="text"
                  name="license_number"
                  value={formState.license_number}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. VET-123456"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Declarations & consents
            </h2>
            <div className="space-y-2 text-xs text-gray-700">
              {/* Checkboxes */}
              {Object.keys(formState).map((key) => {
                // Only render checkboxes for boolean keys
                if (typeof formState[key as keyof typeof formState] === 'boolean') {
                  const labelMap: Record<string, string> = {
                    terms_accepted: 'I accept the platform terms of use and agree to comply with the guidelines for veterinary partners.',
                    data_accuracy_confirmed: 'I confirm that the clinic and professional information I provide is accurate and kept up to date.',
                    professional_confirmation: 'I confirm that I am a licensed veterinary professional or legally authorized representative of this clinic.',
                    consent_for_referrals: 'I consent to being contacted about referrals, lost/found pet cases, and related coordination.',
                    email_updates_opt_in: 'I would like to receive email updates about product changes, tips, and important notifications.',
                  };

                  return (
                    <label key={key} className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        name={key}
                        checked={formState[key as keyof typeof formState] as boolean}
                        onChange={handleChange}
                        className="h-3 w-3 mt-0.5 rounded border-gray-300"
                      />
                      <span>{labelMap[key] || key}</span>
                    </label>
                  );
                }
                return null;
              })}
            </div>
          </section>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            {error && (
              <p className="text-[11px] text-red-600 self-center mr-auto">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-1.5 text-xs font-semibold rounded-full bg-emerald-600 text-white shadow hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

// --- 2. Main Component: The Loader/Page Wrapper ---
export default function VeterinaryProfilePage() {
  const { veterinary, isLoading, error, fetchVeterinaryData, updateVeterinary } =
    useVeterinaryStore();

  // Load veterinary data once on mount
  useEffect(() => {
    if (!veterinary) {
      fetchVeterinaryData();
    }
  }, [veterinary, fetchVeterinaryData]);


  const handleUpdate = async (updatePayload: Partial<Omit<VeterinaryData, 'id'>>) => {
    if (!veterinary?.id) return;
    await updateVeterinary(veterinary.id, updatePayload);
  };

  // --- Loading States ---
  if (isLoading && !veterinary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-sm">Loading profile…</p>
      </div>
    );
  }

  if (error && !veterinary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 text-sm">Error: {error}</p>
      </div>
    );
  }

  if (!veterinary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-sm">No profile found.</p>
      </div>
    );
  }

  // --- Render Form Component with Loaded Data ---
  return (
    <VeterinaryProfileForm
      initialData={veterinary as VeterinaryData}
      onUpdate={handleUpdate}
      isSaving={isLoading} // Reuse isLoading as isSaving indicator
      error={error}
    />
  );
}