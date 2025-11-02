'use client';

import React, { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';

// UPDATED: Added pet_photo field
interface FoundPetFormData {
  pet_type: string;
  size: string;
  color: string;
  description: string;
  date_found: string;
  time_found: string;
  found_location: string;
  finder_name: string;
  phone: string;
  email: string;
  current_location: string;
  pet_photo: File | null; // <-- NEW FIELD
}

const LostFoundFoundReport: React.FC = () => {
  const t = useTranslations('FoundPet');

  const [formData, setFormData] = useState<FoundPetFormData>({
    pet_type: '',
    size: '',
    color: '',
    description: '',
    date_found: '',
    time_found: '',
    found_location: '',
    finder_name: '',
    phone: '',
    email: '',
    current_location: '',
    pet_photo: null, // <-- INITIAL STATE
  });

  const [isSending, setIsSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // NEW HANDLER for file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, pet_photo: file }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    // UPDATED SUBMISSION: Using FormData for file upload
    const data = new FormData();
    (Object.keys(formData) as (keyof FoundPetFormData)[]).forEach((key) => {
      const value = formData[key];
      if (value !== null) {
        data.append(key, value instanceof File ? value : String(value));
      }
    });

    try {
      const response = await fetch('/api/foundLostPet', {
        method: 'POST',
        // IMPORTANT: No 'Content-Type' header needed; browser sets it automatically for FormData
        body: data,
      });

      if (response.ok) {
        alert(t('successMessage'));
        // Reset form data including the new field
        setFormData({
          pet_type: '',
          size: '',
          color: '',
          description: '',
          date_found: '',
          time_found: '',
          found_location: '',
          finder_name: '',
          phone: '',
          email: '',
          current_location: '',
          pet_photo: null, // Reset photo state
        });
      } else {
        alert(t('errorMessage'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(t('networkError'));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="report-found" className="py-16 bg-yellow-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-yellow-500 px-8 py-6 text-center">
            <h3 className="text-xl font-bold text-white">{t('formTitle')}</h3>
            <p className="text-yellow-100">{t('formSubtitle')}</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="px-8 py-8"
            // IMPORTANT: Set encType for file upload
            encType="multipart/form-data" 
          >
            {/* Pet Description */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                {t('petDescription')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('petType')} *
                  </label>
                  <select
                    name="pet_type"
                    required
                    value={formData.pet_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">{t('selectPetType')}</option>
                    <option value="Dog">{t('dog')}</option>
                    <option value="Cat">{t('cat')}</option>
                    <option value="Bird">{t('bird')}</option>
                    <option value="Other">{t('other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('size')}
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">{t('selectSize')}</option>
                    <option value="Small">{t('small')}</option>
                    <option value="Medium">{t('medium')}</option>
                    <option value="Large">{t('large')}</option>
                    <option value="Extra Large">{t('extraLarge')}</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('color')} *
                  </label>
                  <input
                    type="text"
                    name="color"
                    required
                    value={formData.color}
                    onChange={handleChange}
                    placeholder={t('colorPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('description')}
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t('descriptionPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Found Location */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                {t('locationSection')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('dateFound')} *
                  </label>
                  <input
                    type="date"
                    name="date_found"
                    required
                    value={formData.date_found}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('timeFound')}
                  </label>
                  <input
                    type="time"
                    name="time_found"
                    value={formData.time_found}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('locationFound')} *
                  </label>
                  <input
                    type="text"
                    name="found_location"
                    required
                    value={formData.found_location}
                    onChange={handleChange}
                    placeholder={t('locationPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload (NEW SECTION) */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                {t('photoUpload')}
              </h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  name="pet_photo"
                  accept="image/*"
                  id="photo-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="text-gray-600">{t('photoDescription')}</p>
                  <p className="text-sm text-gray-500">{t('photoNote')}</p>
                </label>
              </div>
            </div>


            {/* Contact Info and Pet's Current Location */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                {t('contactSection')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('name')} *
                  </label>
                  <input
                    type="text"
                    name="finder_name"
                    required
                    value={formData.finder_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('phone')} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('currentLocation')}
                  </label>
                  <select
                    name="current_location"
                    value={formData.current_location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">{t('selectCurrentLocation')}</option>
                    <option value="With me">{t('withMe')}</option>
                    <option value="Veterinary clinic">{t('vetClinic')}</option>
                    <option value="Animal shelter">{t('animalShelter')}</option>
                    <option value="Still roaming">{t('roaming')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSending}
                className={`px-8 py-4 rounded-xl text-lg font-bold transition-all duration-200 ${
                  isSending
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-yellow-500 text-white hover:bg-yellow-600'
                }`}
              >
                {isSending ? t('sendingButton') : t('submit')}
              </button>
              <p className="text-sm text-gray-500 mt-2">{t('submitNote')}</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LostFoundFoundReport;