'use client';

import { useTranslations } from 'next-intl';

export default function PetProtectionSteps() {
  const t = useTranslations('AboutStats');
  

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Step 1 */}
          <div className="text-center bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full flex items-center justify-center text-base font-semibold mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {t('step1.title')}
            </h3>
            <p className="text-gray-600 text-sm">{t('step1.description')}</p>
          </div>

          {/* Step 2 */}
          <div className="text-center bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full flex items-center justify-center text-base font-semibold mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {t('step2.title')}
            </h3>
            <p className="text-gray-600 text-sm">{t('step2.description')}</p>
          </div>

          {/* Step 3 */}
          <div className="text-center bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-full flex items-center justify-center text-base font-semibold mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {t('step3.title')}
            </h3>
            <p className="text-gray-600 text-sm">{t('step3.description')}</p>
          </div>

          {/* Step 4 */}
          <div className="text-center bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-full flex items-center justify-center text-base font-semibold mx-auto mb-4">
              4
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {t('step4.title')}
            </h3>
            <p className="text-gray-600 text-sm">{t('step4.description')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
