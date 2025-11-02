'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function AboutHero() {
  const t = useTranslations('AboutHero'); // or your correct namespace
  

  return (
    <section className="bg-gradient-to-r from-pet-primary to-pet-secondary py-24 relative overflow-hidden hero-bg">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg" // placed in /public/hero.jpg
          alt="About Hero Background"
          fill
          priority
          className="object-cover object-center opacity-100"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex-col items-center justify-start pt-16 text-center">
        <div className="max-w-7xl mx-auto">
          {/* Pill Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center rounded-full px-6 py-3 bg-white/10 border border-white/20 backdrop-blur-sm">
              <span className="text-2xl mr-3" role="img" aria-label="hospital">
                🏥
              </span>
              <span className="text-sm font-semibold text-white">
                {t('badge')}
              </span>
            </div>
          </div>

          <h1
            id="about-hero-title"
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg"
          >
            {t('title')}
          </h1>

          <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>
      </div>
    </section>
  );
}
