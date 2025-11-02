'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export default function ProvenResults() {
  const t = useTranslations('ProvenResults');
   

  return (
    <section className="py-20 bg-sky-500">
      <div className="container mx-auto px-4 text-white">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-white/90 text-base md:text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {/* Success Rate */}
          <div className="text-center">
            <div className="mx-auto mb-4 h-28 w-28 rounded-full bg-white text-sky-600 flex items-center justify-center shadow-md">
              <span className="text-3xl font-extrabold">95%</span>
            </div>
            <div className="font-semibold text-lg">{t('successRate')}</div>
            <div className="text-white/90 text-sm">{t('successRateDesc')}</div>
          </div>

          {/* Happy Reunions */}
          <div className="text-center">
            <div className="mx-auto mb-4 h-28 w-28 rounded-full bg-white text-sky-600 flex items-center justify-center shadow-md">
              <span className="text-3xl font-extrabold">1,247</span>
            </div>
            <div className="font-semibold text-lg">{t('happyReunions')}</div>
            <div className="text-white/90 text-sm">{t('happyReunionsDesc')}</div>
          </div>

          {/* Average Hours */}
          <div className="text-center">
            <div className="mx-auto mb-4 h-28 w-28 rounded-full bg-white text-sky-600 flex items-center justify-center shadow-md">
              <span className="text-3xl font-extrabold">&lt; 24</span>
            </div>
            <div className="font-semibold text-lg">{t('averageHours')}</div>
            <div className="text-white/90 text-sm">{t('averageHoursDesc')}</div>
          </div>

          {/* Pets Protected */}
          <div className="text-center">
            <div className="mx-auto mb-4 h-28 w-28 rounded-full bg-white text-sky-600 flex items-center justify-center shadow-md">
              <span className="text-3xl font-extrabold">10K+</span>
            </div>
            <div className="font-semibold text-lg">{t('petsProtected')}</div>
            <div className="text-white/90 text-sm">{t('petsProtectedDesc')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
