'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

const VLoginForm = () => {
  const router = useRouter();
  const t = useTranslations('VLog');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clinic_id: '',
    username: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePassword = () => setShowPassword(prev => !prev);

  const baseInput = `w-full py-3 border border-gray-300 rounded-xl
    focus:ring-2 focus:ring-pet-secondary focus:border-transparent
    transition-all duration-200 ps-10 pe-4`;

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
        toast.success(t('loginSuccess'), { description: t('redirecting') });

        setTimeout(() => router.replace('/veterinary/dashboard'), 1000);
      } else if (res.status === 401) {
        toast.error(t('loginFailedTitle'), { description: t('invalidCredentials') });
      } else if (res.status === 403) {
        toast.error(t('loginFailedTitle'), { description: t('notApproved') });
      } else if (res.status === 400) {
        toast.error(t('loginFailedTitle'), { description: t('missingFields') });
      } else {
        toast.error(t('unexpectedError'));
      }
    } catch (error) {
      console.error('Veterinary login error:', error);
      toast.error(t('networkError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-pet-secondary to-green-600 px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-white">{t('title')}</h2>
            <p className="text-green-100 text-sm mt-2">{t('subtitle')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">

            {/* Clinic ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('clinicId')}
              </label>

              <div className="relative">
                <span className="absolute inset-y-0 start-3 flex items-center text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </span>

                <input
                  type="text"
                  name="clinic_id"
                  value={formData.clinic_id}
                  onChange={handleInputChange}
                  required
                  placeholder={t('clinicIdPlaceholder')}
                  className={baseInput}
                />
              </div>

              <p className="text-xs text-gray-500 mt-1">{t('clinicIdNote')}</p>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('username')}
              </label>

              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder={t('usernamePlaceholder')}
                  className={`${baseInput}`}
                />
              </div>
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
                  className={`${baseInput} pe-12`}
                  placeholder={t('passwordPlaceholder')}
                />

                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.666 5.667a2 2 0 10-2-2m2 2l-2-2m2-1.892L19.5 7.5l-2.613-2.613a4 4 0 00-5.308.283"/>
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember + Links */}
            <div className="flex items-center justify-between">

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="remember_me"
                  className="w-4 h-4 rounded border-gray-300 text-pet-secondary focus:ring-pet-secondary"
                />
                {t('rememberMe')}
              </label>

              <div className="flex items-center gap-4">
                <Link
                  href="/forgot-password?role=veterinary"
                  className="text-sm text-gray-500 hover:text-green-600 transition"
                >
                  {t('forgotPassword')}
                </Link>

                <Link
                  href="/contact?subject=clinic"
                  className="text-sm text-pet-secondary hover:text-green-600 transition"
                >
                  {t('needSupport')}
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pet-secondary to-green-600
                         text-white py-3 rounded-xl text-lg font-semibold
                         hover:shadow-lg transition-transform duration-300
                         hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? t('loggingIn') : t('accessDashboard')}
            </button>

            {/* Divider */}
            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">{t('newPartner')}</span>
              </div>
            </div>

            {/* Register */}
            <div className="text-center">
              <Link
                href="/contact?subject=clinic"
                className="text-pet-secondary hover:text-green-600 font-semibold transition"
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
