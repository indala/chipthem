'use client';

import React from 'react';
import { useForm,useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Other'] as const;
 type PetType = (typeof PET_TYPES)[number]; // 'Dog' | 'Cat' | 'Bird' | 'Other'
 const SIZES = ['Small', 'Medium', 'Large', 'Extra Large'] as const;


const LostFoundFoundReport: React.FC = () => {
  const t = useTranslations('FoundPet');
  const tv = useTranslations('FoundPet.validation');
 


  // Zod schema with translated messages
  const foundPetSchema = React.useMemo(
  () =>
    z
      .object({
        pet_type: z
  .string()
  .refine((val:string) => PET_TYPES.includes(val as PetType), {
    message: tv('petTypeRequired'),
  }),


        size: z.string()
  .optional()
  .refine((val) => !val || SIZES.includes(val as typeof SIZES[number]), {
    message: tv('sizeRequired'),
  }),


        color: z.string().min(1, { message: tv('colorRequired') }),

        description: z.string().optional(),

        date_found: z.string().min(1, {
          message: tv('dateFoundRequired'),
        }),

        time_found: z.string().optional(),

        found_location: z.string().min(1, {
          message: tv('locationRequired'),
        }),

        finder_name: z.string().min(1, {
          message: tv('nameRequired'),
        }),

        phone: z
          .string()
          .min(1, { message: tv('phoneRequired') })
          .regex(/^[0-9+\-\s]{7,}$/, {
            message: tv('phoneInvalid'),
          }),

        email: z
          .string()
          .optional()
          .refine(
            (val) =>
              !val || z.string().email().safeParse(val).success,
            { message: tv('emailInvalid') }
          ),

        current_location: z
          .string()
          .optional(),

        pet_photo: z
          .instanceof(File)
          .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: tv('fileTooLarge'),
          })
          .refine(
            (file) =>
              ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
            { message: tv('fileTypeNotAllowed') }
          )
          .optional(),
      })
      .refine(
        (data) => {
          const date = new Date(data.date_found);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return !isNaN(date.getTime()) && date <= today;
        },
        {
          message: tv('dateFuture'),
          path: ['date_found'],
        }
      ),
  [tv]
);


  type FoundPetFormData = z.infer<typeof foundPetSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
    reset
  } = useForm<FoundPetFormData>({
    resolver: zodResolver(foundPetSchema),
    defaultValues: {
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
      pet_photo: undefined
    }
  });

  // ✅ useWatch instead of watch()
    const photoFile = useWatch({
      control,
      name: 'pet_photo'
    });

  const onSubmit = async (data: FoundPetFormData) => {
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
      const res = await fetch('/api/reportFound', {
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
            onSubmit={handleSubmit(onSubmit)}
            className="px-8 py-8"
            encType="multipart/form-data"
          >
            {/* Pet Description */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                {t('petDescription')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pet type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('petType')}
                  </label>
                  <select
                    {...register('pet_type')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
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

                {/* Size */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('size')}
                  </label>
                  <select
                    {...register('size')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      errors.size
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">{t('selectSize')}</option>
                    <option value="Small">{t('small')}</option>
                    <option value="Medium">{t('medium')}</option>
                    <option value="Large">{t('large')}</option>
                    <option value="Extra Large">{t('extraLarge')}</option>
                  </select>
                </div>

                {/* Color */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('color')}
                  </label>
                  <input
                    type="text"
                    {...register('color')}
                    placeholder={t('colorPlaceholder')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
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

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('description')}
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
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
                {/* Date found */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('dateFound')}
                  </label>
                  <input
                    type="date"
                    {...register('date_found')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      errors.date_found
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.date_found && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.date_found.message}
                    </p>
                  )}
                </div>

                {/* Time found */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('timeFound')}
                  </label>
                  <input
                    type="time"
                    {...register('time_found')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                {/* Location found */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('locationFound')}
                  </label>
                  <input
                    type="text"
                    {...register('found_location')}
                    placeholder={t('locationPlaceholder')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      errors.found_location
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.found_location && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.found_location.message}
                    </p>
                  )}
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
                    {photoFile 
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

            {/* Contact Info */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                {t('contactSection')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Finder name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    {...register('finder_name')}
                    placeholder={t('namePlaceholder')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      errors.finder_name
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.finder_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.finder_name.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('phone')}
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder={t('phonePlaceholder')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
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

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder={t('emailPlaceholder')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
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

                {/* Current location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('currentLocation')}
                  </label>
                  <select
                    {...register('current_location')}
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
                disabled={isSubmitting}
                className={`px-8 py-4 rounded-xl text-lg font-bold transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-yellow-500 text-white hover:bg-yellow-600'
                }`}
              >
                {isSubmitting ? t('sendingButton') : t('submit')}
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
