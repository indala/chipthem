import React from "react";
import { useTranslations } from "next-intl";

const RegisterHero: React.FC = () => {
  const t = useTranslations("RegisterHero");

  return (
    <section className="bg-gradient-to-r from-pet-primary to-pet-secondary py-16">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-start pt-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('title')}</h1>
        <p className="text-xl text-blue-100 mb-8">
          {t('subtitle')}
        </p>

        {/* Registration Steps */}
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex items-center text-white bg-white/20 px-4 py-2 rounded-lg">
            <div className="w-8 h-8 bg-white text-pet-primary rounded-full flex items-center justify-center font-bold mr-3">
              1
            </div>
            <span>{t('step1')}</span>
          </div>
          <div className="hidden md:block text-white">→</div>
          <div className="flex items-center text-white">
            <div className="w-8 h-8 bg-white text-pet-primary rounded-full flex items-center justify-center font-bold mr-3">
              2
            </div>
            <span className="font-semibold">{t('step2')}</span>
          </div>
          <div className="hidden md:block text-white">→</div>
          <div className="flex items-center text-white">
            <div className="w-8 h-8 bg-white/30 text-white rounded-full flex items-center justify-center font-bold mr-3">
              3
            </div>
            <span>{t('step3')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterHero;
