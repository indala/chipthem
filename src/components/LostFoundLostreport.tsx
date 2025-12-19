'use client';

import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Other'] as const;
 type PetType = (typeof PET_TYPES)[number]; 
 const SIZES = ['Small', 'Medium', 'Large', 'Extra Large'] as const;
 
const LostFoundLostReport: React.FC = () => {
  const t = useTranslations('LostPet');
  const tv = useTranslations('LostPet.validation');
   

  // Build schema with translated messages
  const lostPetSchema = React.useMemo(
    () =>
      z
        .object({
          pet_name: z
            .string()
            .min(1, { message: tv('petNameRequired') }),
          pet_type: z
            .string()
            .refine((val:string) => PET_TYPES.includes(val as PetType), {
              message: tv('petTypeRequired'),
            }),
          breed: z.string().optional(),
          color: z
            .string()
            .min(1, { message: tv('colorRequired') }),
                  size: z.string()
            .optional()
            .refine((val) => !val || SIZES.includes(val as typeof SIZES[number]), {
              message: tv('sizeRequired'),
            }),
          microchip: z.string().optional(),
          date_lost: z
            .string()
            .min(1, { message: tv('dateRequired') }),
          time_lost: z.string().optional(),
          last_seen_location: z
            .string()
            .min(1, { message: tv('locationRequired') }),
          loss_circumstances: z.string().optional(),
          owner_name: z
            .string()
            .min(1, { message: tv('ownerNameRequired') }),
          phone: z
            .string()
            .min(1, { message: tv('phoneRequired') })
            .regex(/^[0-9+\-\s]{7,}$/, { message: tv('phoneInvalid') }),
          email: z
            .string()
            .min(1, { message: tv('emailRequired') })
            .email({ message: tv('emailInvalid') }),
          alt_phone: z.string().optional(),
          pet_photo: z
            .instanceof(File)
            .refine((file) => file.size <= 5 * 1024 * 1024, {
              message: tv('fileTooLarge')
            })
            .refine(
              (file) =>
                ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
              {
                message: tv('fileTypeNotAllowed')
              }
            )
            .optional()
        })
        .refine(
          (data) => {
            if (!data.date_lost) return false;
            const date = new Date(data.date_lost);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return !isNaN(date.getTime()) && date <= today;
          },
          {
            message: tv('dateFuture'),
            path: ['date_lost']
          }
        ),
    [tv]
  );

  type LostPetFormData = z.infer<typeof lostPetSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
    reset
  } = useForm<LostPetFormData>({
    resolver: zodResolver(lostPetSchema),
    defaultValues: {
      pet_name: '',
      // cast to satisfy enum type
      pet_type: '' as unknown as LostPetFormData['pet_type'],
      breed: '',
      color: '',
      size: '' as unknown as LostPetFormData['size'],
      microchip: '',
      date_lost: '',
      time_lost: '',
      last_seen_location: '',
      loss_circumstances: '',
      owner_name: '',
      phone: '',
      email: '',
      alt_phone: '',
      pet_photo: undefined
    }
  });

  // ✅ useWatch instead of watch()
  const photoFile = useWatch({
    control,
    name: 'pet_photo'
  });

  const onSubmit = async (data: LostPetFormData) => {
    const formData = new FormData();

    if (data.pet_photo) {
      formData.append('pet_photo', data.pet_photo);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (value && key !== 'pet_photo') {
        formData.append(key, String(value));
      }
    });

    try {
      const res = await fetch('/api/reportLost', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        alert(t('successMessage'));
        reset();
      } else {
        alert(t('errorMessage'));
      }
    } catch (error) {
      console.error(error);
      alert(t('networkError'));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || undefined;
    setValue('pet_photo', file as File, { shouldValidate: true });
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

          <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8">
            {/* Pet Info */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                {t('petInformation')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pet name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('petName')}
                  </label>
                  <input
                    {...register('pet_name')}
                    type="text"
                    placeholder={t('petNamePlaceholder')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors.pet_name
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.pet_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.pet_name.message}
                    </p>
                  )}
                </div>

                {/* Pet type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('petType')}
                  </label>
                  <select
                    {...register('pet_type')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors.pet_type
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">{t('selectPetType')}</option>
                    <option value="Dog">{t('dog')}</option>
                    <option value="Cat">{t('cat')}</option>
                    <option value="Bird">{t('bird')}</option>
                    <option value="Other">{t('other')}</option>
                  </select>
                  {errors.pet_type && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.pet_type.message}
                    </p>
                  )}
                </div>

                {/* Breed */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('breed')}
                  </label>
                  <input
                    {...register('breed')}
                    type="text"
                    placeholder={t('breedPlaceholder')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors.breed
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('color')}
                  </label>
                  <input
                    {...register('color')}
                    type="text"
                    placeholder={t('colorPlaceholder')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors.color
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.color && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.color.message}
                    </p>
                  )}
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('size')}
                  </label>
                  <select
                    {...register('size')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors.size
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">{t('selectSize')}</option>
                    <option value="Small">{t('small')}</option>
                    <option value="Medium">{t('medium')}</option>
                    <option value="Large">{t('large')}</option>
                  </select>
                  {errors.size && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.size.message}
                    </p>
                  )}
                </div>

                {/* Microchip */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('microchipNumber')}
                  </label>
                  <input
                    {...register('microchip')}
                    type="text"
                    
                    placeholder={t('microchipPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Loss Details */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                {t('lossCircumstances')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Date lost */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('dateLost')}
                  </label>
                  <input
                    {...register('date_lost')}
                    type="date"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors.date_lost
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.date_lost && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.date_lost.message}
                    </p>
                  )}
                </div>

                {/* Time lost */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('timeLost')}
                  </label>
                  <input
                    {...register('time_lost')}
                    type="time"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Last seen location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('lastSeenLocation')}
                  </label>
                  <input
                    {...register('last_seen_location')}
                    type="text"
                    placeholder={t('lastSeenLocationPlaceholder')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors.last_seen_location
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.last_seen_location && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.last_seen_location.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Circumstances details */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('lossCircumstancesDetails')}
                </label>
                <textarea
                  {...register('loss_circumstances')}
                  rows={4}
                  placeholder={t('lossCircumstancesPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Owner Contact Info */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                {t('ownerContact')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Owner name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('ownerName')}
                  </label>
                  <input
                    {...register('owner_name')}
                    type="text"
                    placeholder={t('ownerNamePlaceholder')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors.owner_name
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.owner_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.owner_name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('email')}
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors.email
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('phoneNumber')}
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder={t('phonePlaceholder')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors.phone
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Alt phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('altPhone')}
                  </label>
                  <input
                    {...register('alt_phone')}
                    type="tel"
                    placeholder={t('altPhonePlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                {t('photoUpload')}
              </h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  {...register('pet_photo')}
                  id="photo-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="photo-upload" className="cursor-pointer block">
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
                    />
                  </svg>
                  <p className="text-gray-600">
                    {photoFile instanceof File
                      ? photoFile.name
                      : t('photoDescription')}
                  </p>
                  <p className="text-sm text-gray-500">{t('photoNote')}</p>
                </label>
                {errors.pet_photo && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.pet_photo.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-4 rounded-xl text-lg font-bold transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {isSubmitting ? t('sendingButton') : t('submitButton')}
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
