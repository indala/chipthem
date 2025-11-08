'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const PONeed: React.FC = () => {
  const t = useTranslations('PoNeed'); // 👈 match your JSON key name exactly (lowercase)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('title')}</h2>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Forgot Password */}
          <div className="text-center bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-pet-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{t('forgotPassword')}</h3>
            <p className="text-sm text-gray-600 mb-4">{t('forgotPasswordDesc')}</p>

            <Link href="/forgot-password" className="text-pet-primary hover:text-blue-600 transition-colors font-semibold">
              {t('resetPassword')}
            </Link>
          </div>

          {/* Account Issues */}
          <div className="text-center bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{t('accountIssues')}</h3>
            <p className="text-sm text-gray-600 mb-4">{t('accountIssuesDesc')}</p>

            <Link href="/contact" className="text-orange-500 hover:text-orange-600 transition-colors font-semibold">
              {t('getSupport')}
            </Link>
          </div>

          {/* Create Account */}
          <div className="text-center bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{t('newPetOwner')}</h3>
            <p className="text-sm text-gray-600 mb-4">{t('newPetOwnerDesc')}</p>

            <Link href="/getpetmicrochipped" className="text-green-500 hover:text-green-600 transition-colors font-semibold">
              {t('registerPet')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PONeed;
