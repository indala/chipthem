'use client';

import { useState, FormEvent, ChangeEvent, ComponentPropsWithoutRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link for internal routing
import { useTranslations } from 'next-intl';

// Define a type for your form data for better type safety
interface FormData {
  fullName: string;
  nationalIdNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  alternativePhone: string;
  streetAddress: string;
  city: string;
  country: string;
  microchipNumber: string;
  petName: string;
  petType: string;
  breed: string;
  sex: string;
  primaryColor: string;
  age: string;
  weight: string;
  specialMarkings: string;
  veterinaryClinicName: string;
  veterinaryPhone: string;
  microchipImplantDate: string;
  microchipLocation: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  relationshipToOwner: string;
  termsAccepted: boolean;
  dataAccuracyConfirmed: boolean;
  ownershipConfirmed: boolean;
  emailUpdatesOptIn: boolean;
}

const RegisterMenu = () => {
  const router = useRouter();
  // We use 'RegisterMenu' as the base key for translations
  const t = useTranslations('RegisterMenu');

  // Initial State: All fields are correctly defined here
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    nationalIdNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    alternativePhone: '',
    streetAddress: '',
    city: '',
    country: '',
    microchipNumber: '',
    petName: '',
    petType: '',
    breed: '',
    sex: '',
    primaryColor: '',
    age: '',
    weight: '',
    specialMarkings: '',
    veterinaryClinicName: '',
    veterinaryPhone: '',
    microchipImplantDate: '',
    microchipLocation: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    relationshipToOwner: '',
    termsAccepted: false,
    dataAccuracyConfirmed: false,
    ownershipConfirmed: false,
    emailUpdatesOptIn: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for displaying submission errors

  // Unified change handler
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    // Handle the specific types for TS
    const { name, type, value } = target as HTMLInputElement;
    const checked = (target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear any previous error message when the user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Clear previous errors

    // --- CRITICAL CLIENT-SIDE VALIDATION: Password Match ---
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordMismatchError') || 'Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Use Next.js API route path (e.g., /api/admin/register)
      const res = await fetch('/api/pet/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        // Attempt to get a specific error message from the API
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed with status: ' + res.status);
      }

      // Next.js router for client-side navigation
      router.push('/registersuccess');
    } catch (error) {
      console.error('Error:', error);
      // Set a user-friendly error message
      setError((error as Error).message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to render a common input field structure
  const renderInput = (
    name: keyof FormData,
    labelKey: string,
    type: string = 'text',
    required: boolean = false,
    isFullWidth: boolean = false,
    placeholderKey?: string,
    noteKey?: string,
    extraProps: ComponentPropsWithoutRef<'input'> = {}
  ) => (
    <div className={isFullWidth ? 'md:col-span-2' : ''}>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
        {t(labelKey)}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        required={required}
        value={String(formData[name])} // Value is cast to string for input
        onChange={handleChange}
        placeholder={placeholderKey ? t(placeholderKey) : ''}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pet-primary focus:border-transparent transition-all duration-200"
        {...extraProps}
      />
      {noteKey && (
        <p className="text-sm text-gray-500 mt-1">{t(noteKey)}</p>
      )}
    </div>
  );



  return (
    <section className="pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t('title')}
            </h2>
            <p className="text-gray-600">{t('subtitle')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8">
            
            {/* Display Submission Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm" role="alert">
                <p className="font-bold">Registration Error:</p>
                <p>{error}</p>
              </div>
            )}


            {/* --- 1. Owner Information Section --- */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                <span className="bg-pet-primary text-white w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold mr-3">
                  1
                </span>
                {t('ownerInfo')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full Name */}
                {renderInput('fullName', 'fullName', 'text', true, true, 'fullNamePlaceholder')}
                
                {/* National ID Number */}
                {renderInput('nationalIdNumber', 'nationalId', 'text', true, false, 'nationalIdPlaceholder', 'nationalIdNote')}
                
                {/* Email */}
                {renderInput('email', 'email', 'email', true, false, 'emailPlaceholder')}

                {/* Password */}
                {renderInput('password', 'password', 'password', true, false, 'passwordPlaceholder', 'passwordNote', { minLength: 8 })}

                {/* Confirm Password */}
                {renderInput('confirmPassword', 'confirmPassword', 'password', true, false, 'confirmPasswordPlaceholder', undefined, { minLength: 8 })}

                {/* Phone */}
                {renderInput('phoneNumber', 'phone', 'tel', true, false, 'phonePlaceholder')}

                {/* Alternative Phone */}
                {renderInput('alternativePhone', 'altPhone', 'tel', false, false, 'altPhonePlaceholder')}

                {/* Street Address */}
                {renderInput('streetAddress', 'address', 'text', true, true, 'addressPlaceholder')}

                {/* City */}
                {renderInput('city', 'city', 'text', true, false, 'cityPlaceholder')}

                {/* Country */}
                {renderInput('country', 'country', 'text', true, false, 'countryPlaceholder')}

              </div>
            </div>

            {/* --- 2. Pet Information Section --- */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                <span className="bg-pet-secondary text-white w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                {t('petInfo')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Microchip Number */}
                {renderInput('microchipNumber', 'microchipNumber', 'text', true, true, 'microchipNumberPlaceholder', 'microchipNumberNote', { maxLength: 15, pattern: "\\d{15}", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pet-primary focus:border-transparent transition-all duration-200 font-mono text-lg" })}

                {/* Pet Name */}
                {renderInput('petName', 'petName', 'text', true, false, 'petNamePlaceholder')}

                {/* Pet Type (Select) */}
                <div>
                  <label htmlFor='petType' className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('petType')}
                  </label>
                  <select
                    id='petType'
                    name="petType"
                    required
                    value={formData.petType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pet-primary focus:border-transparent transition-all duration-200"
                  >
                    <option value="">{t('selectPetType')}</option>
                    <option value="Dog">{t('dog')}</option>
                    <option value="Cat">{t('cat')}</option>
                    <option value="Bird">{t('bird')}</option>
                    <option value="Rabbit">{t('rabbit')}</option>
                    <option value="Ferret">{t('ferret')}</option>
                    <option value="Other">{t('other')}</option>
                  </select>
                </div>

                {/* Breed */}
                {renderInput('breed', 'breed', 'text', true, false, 'breedPlaceholder')}

                {/* Sex (Select) */}
                <div>
                  <label htmlFor='sex' className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('sex')}
                  </label>
                  <select
                    id='sex'
                    name="sex"
                    required
                    value={formData.sex}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pet-primary focus:border-transparent transition-all duration-200"
                  >
                    <option value="">{t('selectSex')}</option>
                    <option value="Male">{t('male')}</option>
                    <option value="Female">{t('female')}</option>
                    <option value="Male - Neutered">{t('maleNeutered')}</option>
                    <option value="Female - Spayed">{t('femaleSpayed')}</option>
                    <option value="Other">{t('other')}</option>
                  </select>
                </div>

                {/* Color */}
                {renderInput('primaryColor', 'primaryColor', 'text', true, false, 'primaryColorPlaceholder')}

                {/* Age */}
                {renderInput('age', 'age', 'text', false, false, 'agePlaceholder')}

                {/* Weight */}
                {renderInput('weight', 'weight', 'text', false, false, 'weightPlaceholder')}

                {/* Special Markings (Textarea) */}
                <div className="md:col-span-2">
                  <label htmlFor='specialMarkings' className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('specialMarkings')}
                  </label>
                  <textarea
                    id='specialMarkings'
                    name="specialMarkings"
                    rows={3}
                    value={formData.specialMarkings}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pet-primary focus:border-transparent transition-all duration-200"
                    placeholder={t('specialMarkingsPlaceholder')}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* --- 3. Veterinary Information --- */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                <span className="bg-pet-accent text-white w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold mr-3">
                  3
                </span>
                {t('vetInfo')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Vet Clinic Name */}
                {renderInput('veterinaryClinicName', 'vetClinicName', 'text', false, false, 'vetClinicPlaceholder')}

                {/* Vet Phone */}
                {renderInput('veterinaryPhone', 'vetPhone', 'tel', false, false, 'vetPhonePlaceholder')}

                {/* Microchip Implant Date */}
                {renderInput('microchipImplantDate', 'microchipDate', 'date', false, false)}

                {/* Microchip Location (Select) */}
                <div>
                  <label htmlFor='microchipLocation' className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('microchipLocation')}
                  </label>
                  <select
                    id='microchipLocation'
                    name="microchipLocation"
                    value={formData.microchipLocation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pet-primary focus:border-transparent transition-all duration-200"
                  >
                    <option value="">{t('selectLocation')}</option>
                    <option value="Between shoulder blades">{t('betweenShoulderBlades')}</option>
                    <option value="Left shoulder blade">{t('leftShoulderBlade')}</option>
                    <option value="Right shoulder blade">{t('rightShoulderBlade')}</option>
                    <option value="Other">{t('other')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* --- 4. Emergency Contact --- */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                <span className="bg-purple-500 text-white w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold mr-3">
                  4
                </span>
                {t('emergencyContact')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Emergency Contact Name */}
                {renderInput('emergencyContactName', 'emergencyName', 'text', false, false, 'emergencyNamePlaceholder')}
                
                {/* Emergency Contact Phone */}
                {renderInput('emergencyContactPhone', 'emergencyPhone', 'tel', false, false, 'emergencyPhonePlaceholder')}

                {/* Relationship */}
                {renderInput('relationshipToOwner', 'relationship', 'text', false, true, 'relationshipPlaceholder')}
              </div>
            </div>

            {/* --- 5. Terms and Agreement --- */}
            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-6 border">
                <h4 className="font-semibold text-gray-800 mb-4">
                  {t('termsTitle')}
                </h4>
                <div className="space-y-3">
                  
                  {/* Terms Accepted Checkbox - UPDATED INLINE WITH TWO LINKS */}
                  <label htmlFor='termsAccepted' className="flex items-start">
                    <input
                      id='termsAccepted'
                      type="checkbox"
                      name="termsAccepted"
                      required
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="mt-1 mr-3 h-4 w-4 text-pet-primary focus:ring-pet-primary border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      {t('agreeTo')} {/* Corresponds to 'I agree to the' */}
                      {" "}
                      <Link
                        href="/terms" // Use Next.js Link for internal route /terms
                        className="text-pet-primary hover:underline"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {t('termsOfService')} {/* Corresponds to 'Terms of Service' */}
                      </Link>
                      {" "}
                      {t('and')} {/* Corresponds to 'and' */}
                      {" "}
                      <Link
                        href="/policy" // Use Next.js Link for internal route /policy
                        className="text-pet-primary hover:underline"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {t('privacyPolicy')} {/* Corresponds to 'Privacy Policy' */}
                      </Link>
                      {' *'} {/* Added the required asterisk back */}
                    </span>
                  </label>
                  {/* Data Accuracy Checkbox */}
                  <label htmlFor='dataAccuracyConfirmed' className="flex items-start">
                    <input
                      id='dataAccuracyConfirmed'
                      type="checkbox"
                      name="dataAccuracyConfirmed"
                      required
                      checked={formData.dataAccuracyConfirmed}
                      onChange={handleChange}
                      className="mt-1 mr-3 h-4 w-4 text-pet-primary focus:ring-pet-primary border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      {t('certifyAccurate')}
                    </span>
                  </label>

                  {/* Ownership Confirmed Checkbox */}
                  <label htmlFor='ownershipConfirmed' className="flex items-start">
                    <input
                      id='ownershipConfirmed'
                      type="checkbox"
                      name="ownershipConfirmed"
                      required
                      checked={formData.ownershipConfirmed}
                      onChange={handleChange}
                      className="mt-1 mr-3 h-4 w-4 text-pet-primary focus:ring-pet-primary border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      {t('confirmOwnership')}
                    </span>
                  </label>

                  {/* Email Updates Opt-In Checkbox */}
                  <label htmlFor='emailUpdatesOptIn' className="flex items-start">
                    <input
                      id='emailUpdatesOptIn'
                      type="checkbox"
                      name="emailUpdatesOptIn"
                      checked={formData.emailUpdatesOptIn}
                      onChange={handleChange}
                      className="mt-1 mr-3 h-4 w-4 text-pet-primary focus:ring-pet-primary border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      {t('emailUpdates')}
                    </span>
                  </label>

                </div>
              </div>
            </div>


            {/* Submit */}
            <div className="text-center mt-10">
              <button
                type="submit"
                disabled={isSubmitting || !formData.termsAccepted || !formData.dataAccuracyConfirmed || !formData.ownershipConfirmed}
                className={`bg-gradient-to-r from-pet-primary to-pet-secondary text-white px-12 py-4 rounded-xl text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 ${
                  isSubmitting || !formData.termsAccepted || !formData.dataAccuracyConfirmed || !formData.ownershipConfirmed ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? t('submitting') : t('submitButton')}
              </button>
              <p className="text-sm text-gray-500 mt-4">{t('submitNote')}</p>
            </div>
          </form>
        </div>
        {/* Security Notice */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-green-600 mr-3"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="false"
            >
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"></path>
            </svg>
            <div>
              <h4 className="font-semibold text-green-800">
                {t('securityTitle')}
              </h4>
              <p className="text-green-700 text-sm">
                {t('securityDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterMenu;