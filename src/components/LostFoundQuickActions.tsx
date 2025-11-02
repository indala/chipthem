'use client';
import { useTranslations } from 'next-intl';

const LostFoundQuickActions = () => {
  const t= useTranslations("LostFoundQuickActions");

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Successful Reunions */}
          <div className="bg-green-50 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">1,247</div>
            <p className="text-gray-700 font-semibold">{t('successfulReunions')}</p>
            <p className="text-sm text-gray-500">{t('successfulReunionsDesc')}</p>
          </div>

          {/* Emergency Support */}
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
            <p className="text-gray-700 font-semibold">{t('emergencySupport')}</p>
            <p className="text-sm text-gray-500">{t('emergencySupportDesc')}</p>
          </div>

          {/* Average Reunion Time */}
          <div className="bg-orange-50 rounded-xl p-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">&lt; 24hrs</div>
            <p className="text-gray-700 font-semibold">{t('averageReunionTime')}</p>
            <p className="text-sm text-gray-500">{t('averageReunionTimeDesc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LostFoundQuickActions;