'use client';

import React, { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';

interface LostPetFormData {
  pet_name: string;
  pet_type: string;
  breed: string;
  color: string;
  size: string;
  microchip: string;
  date_lost: string;
  time_lost: string;
  last_seen_location: string;
  loss_circumstances: string;
  owner_name: string;
  phone: string;
  email: string;
  alt_phone: string;
  pet_photo: File | null;
}

const LostFoundLostReport: React.FC = () => {
  const t = useTranslations('LostPet');
  const [formData, setFormData] = useState<LostPetFormData>({
    pet_name: '',
    pet_type: '',
    breed: '',
    color: '',
    size: '',
    microchip: '',
    date_lost: '',
    time_lost: '',
    last_seen_location: '',
    loss_circumstances: '',
    owner_name: '',
    phone: '',
    email: '',
    alt_phone: '',
    pet_photo: null,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, pet_photo: file }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    const data = new FormData();
    (Object.keys(formData) as (keyof LostPetFormData)[]).forEach((key) => {
      const value = formData[key];
      if (value !== null) {
        data.append(key, value instanceof File ? value : String(value));
      }
    });

    try {
      const res = await fetch('/api/lostPet', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        alert(t('successMessage'));
        setFormData({
          pet_name: '',
          pet_type: '',
          breed: '',
          color: '',
          size: '',
          microchip: '',
          date_lost: '',
          time_lost: '',
          last_seen_location: '',
          loss_circumstances: '',
          owner_name: '',
          phone: '',
          email: '',
          alt_phone: '',
          pet_photo: null,
        });
      } else {
        alert(t('errorMessage'));
      }
    } catch (error) {
      console.error(error);
      alert(t('networkError'));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="report-lost" className="py-16 bg-red-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-red-500 px-8 py-6 text-center">
            <h3 className="text-xl font-bold text-white">{t('formTitle')}</h3>
            <p className="text-red-100">{t('formSubtitle')}</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="px-8 py-8"
            encType="multipart/form-data"
          >
            {/* Pet Info */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                {t('petInformation')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('petName')}
                  </label>
                  <input
                    type="text"
                    name="pet_name"
                    required
                    value={formData.pet_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('petType')}
                  </label>
                  <select
                    name="pet_type"
                    required
                    value={formData.pet_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    {t('breed')}
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('color')}
                  </label>
                  <input
                    type="text"
                    name="color"
                    required
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('size')}
                  </label>
                  <select
                    name="size"
                    required
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">{t('selectSize')}</option>
                    <option value="Small">{t('small')}</option>
                    <option value="Medium">{t('medium')}</option>
                    <option value="Large">{t('large')}</option>
                  </select>
                </div>
                
                {/* New: Microchip Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('microchipNumber')}
                  </label>
                  <input
                    type="text"
                    name="microchip"
                    value={formData.microchip}
                    placeholder={t('microchipPlaceholder')}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            ---

            {/* Loss Details (Date, Time, Location, Circumstances) */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                {t('lossCircumstances')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Date Lost */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('dateLost')}
                  </label>
                  <input
                    type="date"
                    name="date_lost"
                    required
                    value={formData.date_lost}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Time Lost */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('timeLost')}
                  </label>
                  <input
                    type="time"
                    name="time_lost"
                    value={formData.time_lost}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Last Seen Location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('lastSeenLocation')}
                  </label>
                  <input
                    type="text"
                    name="last_seen_location"
                    required
                    value={formData.last_seen_location}
                    placeholder={t('lastSeenLocationPlaceholder')}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Loss Circumstances (Details) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('lossCircumstancesDetails')}
                </label>
                <textarea
                  name="loss_circumstances"
                  rows={4}
                  value={formData.loss_circumstances}
                  placeholder={t('lossCircumstancesPlaceholder')}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>

            ---

            {/* Owner Contact Info */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                {t('ownerContact')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Owner Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('ownerName')}
                  </label>
                  <input
                    type="text"
                    name="owner_name"
                    required
                    value={formData.owner_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Primary Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('phoneNumber')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Alternate Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('altPhone')}
                  </label>
                  <input
                    type="tel"
                    name="alt_phone"
                    value={formData.alt_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            ---

            {/* Photo Upload */}
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
                  <p className="text-gray-600">
                    {formData.pet_photo ? formData.pet_photo.name : t('photoDescription')}
                  </p>
                  <p className="text-sm text-gray-500">{t('photoNote')}</p>
                </label>
              </div>
            </div>

            ---

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSending}
                className={`px-8 py-4 rounded-xl text-lg font-bold transition-all duration-200 ${
                  isSending
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {isSending ? t('sendingButton') : t('submitButton')}
              </button>
              <p className="text-sm text-gray-500 mt-2">
                {t('submitNote')}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LostFoundLostReport;