'use client';
import { useTranslations } from "next-intl";


const SuccessStoriesHero = () => {
  const t= useTranslations("SuccessStoriesHero");
  return (
    <section className="bg-gradient-to-r from-pet-primary to-pet-secondary py-24 relative overflow-hidden hero-bg">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-1"
        style={{ 
          backgroundImage: `url("/hero.jpg")`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full  flex-col items-center justify-start pt-16 text-center">
        {/* max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {t('title')}
        </h1>
        <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
          {t('subtitle')}
        </p>

        {/* Success Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold text-white mb-2">1,247</div>
            <p className="text-sm text-green-100">{t('successfulReunions')}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold text-white mb-2">95%</div>
            <p className="text-sm text-green-100">{t('successRate')}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold text-white mb-2">&lt; 24hrs</div>
            <p className="text-sm text-green-100">{t('averageReunionTime')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesHero;
