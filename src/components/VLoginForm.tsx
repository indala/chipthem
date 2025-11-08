  'use client';

  import React, { useState } from 'react';
  import { useTranslations, useLocale } from 'next-intl';
  import { useRouter } from 'next/navigation'; // 1. ADDED: For programmatic navigation
  import { toast } from 'sonner';             // 2. ADDED: For toast notifications
  import Link from 'next/link';               // 3. ADDED: For client-side routing

  const VLoginForm = () => {
    const router = useRouter(); // Initialize router
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ clinic_id: '', username: '', password: '' });
    const [loading, setLoading] = useState(false);
    
    // Removed local error/success states, as we will use toast
    // const [error, setError] = useState(''); 
    // const [success, setSuccess] = useState(false);

    const t = useTranslations('VLog');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const toggleClinicPassword = () => setShowPassword(!showPassword);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    // Base input classes to reduce repetition
    const baseInputClasses = 'w-full py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pet-secondary focus:border-transparent transition-all duration-200';

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const res = await fetch('/api/veterinary/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });


        if (res.status === 204) {
          // ✅ Successful login (no content, cookie set)
          toast.success(t('loginSuccess'), {
            description: t('redirecting'),
            duration: 2000,
          });

          // Navigate after a short delay to allow toast to show
          setTimeout(() => {
            router.replace('/veterinary/dashboard');
          }, 1000);
        } else if (res.status === 401) {
          toast.error(t('loginFailedTitle'), { description: t('invalidCredentials') });
        } else if (res.status === 403) {
          toast.error(t('loginFailedTitle'), { description: t('notApproved') });
        } else if (res.status === 400) {
          toast.error(t('loginFailedTitle'), { description: t('missingFields') });
        } else {
          toast.error(t('unexpectedError'));
        }
      } catch (err) {
        console.error('Veterinary login error:', err);
        toast.error(t('networkError'));
      } finally {
        setLoading(false);
      }
    }
    return (
      <section className={`py-16 bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-pet-secondary to-green-600 px-8 py-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">{t('title')}</h2>
              <p className="text-green-100 text-sm mt-2">{t('subtitle')}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6" id="clinicLoginForm">
              {/* Clinic ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('clinicId')}
                </label>
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 ${
                      isRTL ? 'right-1 pr-3' : 'left-0 pl-3'
                    } flex items-center pointer-events-none`}
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="clinic_id"
                    value={formData.clinic_id}
                    onChange={handleInputChange}
                    required
                    className={`${baseInputClasses} ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                    placeholder={t('clinicIdPlaceholder')}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{t('clinicIdNote')}</p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('username')}
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className={`${baseInputClasses} ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                  placeholder={t('usernamePlaceholder')}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    id="clinicPassword"
                    className={`${baseInputClasses} ${isRTL ? 'pr-10 pl-12' : 'pl-10 pr-12'}`}
                    placeholder={t('passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={toggleClinicPassword}
                    className={`absolute inset-y-0 ${
                      isRTL ? 'left-0 pl-3' : 'right-1 pr-3'
                    } flex items-center text-gray-400 hover:text-gray-600 transition-colors`}
                    aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                  >

                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                          // Condition 1: Hide password icon (single path)
                          <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.666 5.667a2 2 0 10-2-2m2 2l-2-2m2-1.892L19.5 7.5l-2.613-2.613a4 4 0 00-5.308.283" 
                          />
                      ) : (
                          // ✅ CORRECTED: Use a React Fragment (<>...</>) to wrap the two path elements
                          <>
                              <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                              />
                              <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                              />
                          </>
                          )}
                      </svg>
                  </button>
                </div>
              </div>

              {/* Remember Me & Support */}
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="checkbox"
                    name="remember_me"
                    id="clinic_remember_me"
                    className="w-4 h-4 text-pet-secondary border-gray-300 rounded focus:ring-pet-secondary"
                  />
                  <label
                    htmlFor="clinic_remember_me"
                    className={`${isRTL ? 'mr-2' : 'ml-2'} text-sm text-gray-700`}
                  >
                    {t('rememberMe')}
                  </label>
                </div>
                <Link
                  href="/contact?subject=clinic"
                  className="text-sm text-pet-secondary hover:text-green-600 transition-colors"
                >
                  {t('needSupport')}
                </Link>
              </div>

              {/* Error / Success - REMOVED blocks since using Sonner toast */}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pet-secondary to-green-600 text-white py-3 rounded-xl text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('loggingIn') : t('accessDashboard')}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">{t('newPartner')}</span>
                </div>
              </div>

              {/* Register */}
              <div className="text-center">
                <Link
                  href="/contact?subject=clinic"
                  className={`inline-flex items-center text-pet-secondary hover:text-green-600 transition-colors font-semibold ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                >
                  {t('partnerWithUs')}
                </Link>
              </div>
            </form>
          </div>

          {/* Security Notice */}
          <div className="mt-8 text-center">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="text-sm font-bold text-green-800 mb-2">{t('securityTitle')}</h3>
              <p className="text-xs text-green-700">{t('securityDesc')}</p>
            </div>
          </div>
        </div>
      </section>
    );
  };

  export default VLoginForm;