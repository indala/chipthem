import React from 'react';
import { useTranslations } from 'next-intl';

const POHero: React.FC = () => {
  const t = useTranslations("POHero");

  return (
    <>

      <div className="bg-blue-500 text-center from-pet-primary to-pet-secondary pt-32 py-16">
        <div className="mb-8">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <span className="text-2xl mr-3" role="img" aria-label="home">
              🏠
            </span>
            <span className="text-sm font-semibold text-white">{t('badge')}</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('title')}</h1>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
          {t('subtitle')}
        </p>
      </div>
    </>
  );
};

export default POHero;
