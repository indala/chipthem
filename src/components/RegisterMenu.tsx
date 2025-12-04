'use client';

import { useState, FormEvent, ChangeEvent, ComponentPropsWithoutRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react'; // Spinner icon
import { toast } from "sonner"; // <--- Import toast from sonner
import { useLocale } from 'next-intl';


interface FormData {
 fullName: string;
 email: string;
 password: string;
 confirmPassword: string;
 phoneNumber: string;
 streetAddress: string;
 city: string;
 country: string;
 microchipNumber: string;
 petName: string;
 petType: string;
 breed: string;
 sex: string;
 primaryColor: string;
 termsAccepted: boolean;
 dataAccuracyConfirmed: boolean;
 ownershipConfirmed: boolean;
}

// Validation Functions (Kept the same)
const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone: string): boolean => /^[\d\s()+-]{7,20}$/.test(phone.trim());
const isStrongPassword = (password: string): boolean =>
 password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);

const RegisterMenu = () => {
 const router = useRouter();
 const t = useTranslations('RegisterMenu');
 const locale = useLocale();
const isRTL = locale === 'ar';


 const [formData, setFormData] = useState<FormData>({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  streetAddress: '',
  city: '',
  country: '',
  microchipNumber: '',
  petName: '',
  petType: '',
  breed: '',
  sex: '',
  primaryColor: '',
  termsAccepted: false,
  dataAccuracyConfirmed: false,
  ownershipConfirmed: false,
 });

 const [isSubmitting, setIsSubmitting] = useState(false);
 // Removed local 'error' state since we're using toasts

 const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
 ) => {
  const { name, type, value, checked } = e.target as HTMLInputElement;
  setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
 };

 const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  

  // --- 1. Client-Side Validation ---
  const requiredFields = [
   'fullName', 'email', 'password', 'confirmPassword', 'phoneNumber', 'streetAddress',
   'city', 'country', 'microchipNumber', 'petName', 'petType', 'breed', 'sex', 'primaryColor',
  ] as (keyof FormData)[];

  for (const field of requiredFields) {
   if (!formData[field] || String(formData[field]).trim() === '') {
    toast.error(t('fieldRequired', { field: t(field) })); // Use translation for field name
    setIsSubmitting(false);
    return;
   }
  }

  if (!isValidEmail(formData.email)) {
   toast.error(t('invalidEmail'));
   setIsSubmitting(false);
   return;
  }

  if (formData.password !== formData.confirmPassword) {
   toast.error(t('passwordsMismatch'));
   setIsSubmitting(false);
   return;
  }
    
    if (!isStrongPassword(formData.password)) {
   toast.error(t('weakPassword'));
   setIsSubmitting(false);
   return;
  }

  if (!isValidPhone(formData.phoneNumber)) {
   toast.error(t('invalidPhone'));
   setIsSubmitting(false);
   return;
  }

  if (!/^\d{15}$/.test(formData.microchipNumber)) {
   toast.error(t('microchipLength'));
   setIsSubmitting(false);
   return;
  }

  if (!formData.termsAccepted || !formData.dataAccuracyConfirmed || !formData.ownershipConfirmed) {
   toast.error(t('acceptAllTerms'));
   setIsSubmitting(false);
   return;
  }

  // --- 2. API Call ---
  try {
   const res = await fetch('/api/pet/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
   });
        
      // Ensure we always parse JSON response
      const data = await res.json(); 

   if (!res.ok) {
        // Handle specific server errors returned by the API route
        const errorMessage = data.message || t('registrationGenericError');
        toast.error(errorMessage);
        return;
      }
      
      // Success case
      toast.success(data.message || t('registrationSuccess'));
   router.push('/registersuccesspet');
  } catch (err) {
      console.error("Fetch Error:", err);
      // Fallback for network or parsing errors
   toast.error(t('networkError'));
  } finally {
   setIsSubmitting(false);
  }
 };

 const renderInput = (
  name: keyof FormData,
  labelKey: string,
  type: string = 'text',
  required: boolean = false,
  placeholderKey?: string,
  extraProps: ComponentPropsWithoutRef<'input'> = {}
 ) => (
  <div>
   <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
    {t(labelKey)}
   </label>
   <input
    id={name}
    name={name}
    type={type}
    required={required}
    value={String(formData[name])}
    onChange={handleChange}
    placeholder={placeholderKey ? t(placeholderKey) : ''}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pet-primary focus:border-transparent transition-all duration-200"
    {...extraProps}
   />
  </div>
 );

  return (
    <section className="pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('title')}</h2>
            <p className="text-gray-600">{t('subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-10">
            

            {/* Owner Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                1. {t('ownerInfo')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('fullName', 'fullName', 'text', true)}
                {renderInput('email', 'email', 'email', true)}
                {renderInput('password', 'password', 'password', true, undefined, { minLength: 8 })}
                {renderInput('confirmPassword', 'confirmPassword', 'password', true, undefined, { minLength: 8 })}
                {renderInput('phoneNumber', 'phone', 'tel', true)}
                {renderInput('streetAddress', 'address', 'text', true)}
                {renderInput('city', 'city', 'text', true)}
                {renderInput('country', 'country', 'text', true)}
              </div>
            </div>

            {/* Pet Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                2. {t('petInfo')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('microchipNumber', 'microchipNumber', 'text', true, undefined, { maxLength: 15 })}
                {renderInput('petName', 'petName', 'text', true)}
                <div>
                  <label htmlFor="petType" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('petType')}
                  </label>
                  <select
                    id="petType"
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
                    <option value="Other">{t('other')}</option>
                  </select>
                </div>
                {renderInput('breed', 'breed', 'text', true)}
                <div>
                  <label htmlFor="sex" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('sex')}
                  </label>
                  <select
                    id="sex"
                    name="sex"
                    required
                    value={formData.sex}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pet-primary focus:border-transparent transition-all duration-200"
                  >
                    <option value="">{t('selectSex')}</option>
                    <option value="Male">{t('male')}</option>
                    <option value="Female">{t('female')}</option>
                  </select>
                </div>
                {renderInput('primaryColor', 'primaryColor', 'text', true)}
              </div>
            </div>

            {/* Terms */}
            <div className="bg-gray-50 rounded-lg p-6 border">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className={`mt-1 h-4 w-4 text-pet-primary border-gray-300 rounded ${isRTL ? 'ml-3' : 'mr-3'}`}
                  required
                />
                <span className="text-sm text-gray-700">
                  {t('agreeTo')} <Link href="/terms" className="text-pet-primary hover:underline">{t('termsOfService')}</Link> {t('and')} <Link href="/policy" className="text-pet-primary hover:underline">{t('privacyPolicy')}</Link>
                </span>
              </label>

              <label className="flex items-start space-x-3 mt-3">
                <input
                  type="checkbox"
                  name="dataAccuracyConfirmed"
                  checked={formData.dataAccuracyConfirmed}
                  onChange={handleChange}
                  className={`mt-1 h-4 w-4 text-pet-primary border-gray-300 rounded ${isRTL ? 'ml-3' : 'mr-3'}`}
                  required
                />
                <span className="text-sm text-gray-700">{t('certifyAccurate')}</span>
              </label>

              <label className="flex items-start space-x-3 mt-3">
                <input
                  type="checkbox"
                  name="ownershipConfirmed"
                  checked={formData.ownershipConfirmed}
                  onChange={handleChange}
                  className={`mt-1 h-4 w-4 text-pet-primary border-gray-300 rounded ${isRTL ? 'ml-3' : 'mr-3'}`}
                  required
                />
                <span className="text-sm text-gray-700">{t('confirmOwnership')}</span>
              </label>
            </div>

            {/* Submit */}
            <div className="text-center mt-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-gradient-to-r from-pet-primary to-pet-secondary text-white px-12 py-4 rounded-xl text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" /> {t('submitting')}
                  </span>
                ) : (
                  t('submitButton')
                )}
              </button>
              <p className="text-sm text-gray-500 mt-4">{t('submitNote')}</p>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 flex items-center">
          <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"></path>
          </svg>
          <div>
            <h4 className="font-semibold text-green-800">{t('securityTitle')}</h4>
            <p className="text-green-700 text-sm">{t('securityDesc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterMenu;
