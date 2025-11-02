'use client';

import { Button } from "@/components/ui/button";
import { Home, BookOpen, Lightbulb } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export default function MicrochipPromo() {
  const router = useRouter();
  const t = useTranslations('MicrochipPromo'); // you can rename to the actual namespace if needed
  const locale = useLocale();

  // Example: you can check for RTL language manually
  const isRTL = locale === 'ar' || locale === 'he'; // adjust based on your supported locales

  return (
    <section className={`py-20 bg-green-600 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 text-white">
        <div className={`max-w-4xl mx-auto text-center ${isRTL ? 'rtl' : 'ltr'}`}>
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            {t('title')}
          </h2>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-green-500/30 backdrop-blur-sm rounded-xl p-8 border border-green-400/20">
              <div className="text-4xl font-bold text-white mb-2">5 min</div>
              <div className="text-white/90 text-lg">{t('timeToImplant')}</div>
            </div>

            <div className="bg-green-500/30 backdrop-blur-sm rounded-xl p-8 border border-green-400/20">
              <div className="text-4xl font-bold text-white mb-2">{t('lifetime')}</div>
              <div className="text-white/90 text-lg">{t('protection')}</div>
            </div>

            <div className="bg-green-500/30 backdrop-blur-sm rounded-xl p-8 border border-green-400/20">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/90 text-lg">{t('emergencySupport')}</div>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Button
              onClick={() => router.push('/registerpet')}
              size="lg"
              className="w-[280px] h-[56px] bg-white hover:bg-gray-50 text-green-600 hover:text-green-700 border-0 shadow-lg rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl font-semibold"
            >
              <Home className={`${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5`} />
              {t('registerPetNow')}
            </Button>

            <Button
              onClick={() => router.push('/about')}
              size="lg"
              className="w-[280px] h-[56px] bg-green-700 hover:bg-green-800 text-white border-0 shadow-lg rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl font-semibold"
            >
              <BookOpen className={`${isRTL ? 'ml-2' : 'mr-2'} h-5 w-5`} />
              {t('learnAboutServices')}
            </Button>
          </div>

          {/* Footer Information */}
          <div className={`flex items-center justify-center gap-2 text-white/80 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Lightbulb className={`h-4 w-4 text-yellow-300 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <span>{t('footerInfo')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
