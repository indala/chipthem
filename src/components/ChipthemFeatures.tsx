'use client';

import { useTranslations } from 'next-intl';

export default function ChipthemFeatures() {
  const t = useTranslations('AboutMicrochipPromo');

  const features = [
    {
      key: 'certifiedProfessionals',
      color: 'from-[#2aa4ff] to-[#4cb6ff]',
      icon: (
        <svg
          className="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ),
    },
    {
      key: 'secureDatabase',
      color: 'from-[#22c55e] to-[#10b981]',
      icon: (
        <svg
          className="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
      ),
    },
    {
      key: 'provenResults',
      color: 'from-[#fb923c] to-[#f97316]',
      icon: (
        <svg
          className="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M9 16.2l-3.5-3.5L4 14.2 9 19.2 20 8.2 18.6 6.8z" />
        </svg>
      ),
    },
    {
      key: 'support247',
      color: 'from-[#a78bfa] to-[#f472b6]',
      icon: (
        <svg
          className="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ key, color, icon }) => (
            <div
              key={key}
              className="text-center bg-white rounded-2xl shadow-md p-8 hover:shadow-xl hover:-translate-y-2 transition-transform duration-300"
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-r ${color} text-white ring-4 ring-white`}
              >
                {icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {t(`${key}`)}
              </h3>
              <p className="text-sm text-gray-600">{t(`${key}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
