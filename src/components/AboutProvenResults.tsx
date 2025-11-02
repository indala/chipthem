'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function AboutProvenResults() {
 const router = useRouter();
 const t = useTranslations('Pricing');


 const handleNavigate = (path: string) => {
  router.push(`/${path}`);
 };

 return (
  <section className="py-16 bg-gray-50">
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
     {/* Basic Package */}
     <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-8 text-center">
       <h3 className="text-xl font-bold text-gray-800 mb-4">
        {t('basic.title')}
       </h3>
       <div className="text-3xl font-bold text-pet-primary mb-6">
        {t('basic.price')}
       </div>
       <p className="text-gray-600 mb-6">{t('basic.description')}</p>

       <div className="space-y-3 text-sm text-gray-700 mb-8 text-left">
        {['database', 'access', 'support', 'updates', 'emergency'].map(
         (key) => (
          <div key={key} className="flex items-center">
           <span className="bg-green-500 text-white w-4 h-4 rounded flex items-center justify-center text-xs mr-3">
            ✓
           </span>
           <span>{t(`basic.features.${key}`)}</span>
          </div>
         )
        )}
       </div>

       <Button
        onClick={() => handleNavigate('registerpet')}
        className="w-full bg-blue-400 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition-colors"
       >
        {t('basic.button')}
       </Button>
      </div>
     </div>

     {/* Complete Package */}
     <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-blue-500 relative">
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
       <span className="bg-pet-primary text-white px-4 py-1 rounded-full text-sm font-bold">
        {t('complete.badge')}
       </span>
      </div>

      <div className="p-8 pt-10 text-center">
       <h3 className="text-xl font-bold text-gray-800 mb-4">
        {t('complete.title')}
       </h3>
       <div className="text-3xl font-bold text-pet-primary mb-6">
        {t('complete.price')}
       </div>
       <p className="text-gray-600 mb-6">{t('complete.description')}</p>

       <div className="space-y-3 text-sm text-gray-700 mb-8 text-left">
        {['chipping', 'registration', 'updates', 'emergency'].map(
         (key) => (
          <div key={key} className="flex items-center">
           <span className="bg-green-500 text-white w-4 h-4 rounded flex items-center justify-center text-xs mr-3">
            ✓
           </span>
                      {/* ✅ FIX: Removed conditional logic and use t() for all keys for consistency */}
           <span>
            {t(`complete.features.${key}`)}
           </span>
          </div>
         )
        )}
       </div>

       <Button
        onClick={() => handleNavigate('registerpet')}
        className="w-full bg-blue-400 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition-colors"
       >
        {t('complete.button')}
       </Button>
      </div>
     </div>

     {/* Home Visit Package */}
     <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-8 text-center">
       <h3 className="text-xl font-bold text-gray-800 mb-4">
        {t('home.title')}
       </h3>
       <div className="text-3xl font-bold text-pet-primary mb-6">
        {t('home.price')}
       </div>
       <p className="text-gray-600 mb-6">{t('home.description')}</p>

       <div className="space-y-3 text-sm text-gray-700 mb-8 text-left">
        {['chipping', 'complete', 'scheduling', 'discounts', 'comfort'].map(
         (key) => (
          <div key={key} className="flex items-center">
           <span className="bg-green-500 text-white w-4 h-4 rounded flex items-center justify-center text-xs mr-3">
            ✓
           </span>
           <span>{t(`home.features.${key}`)}</span>
          </div>
         )
        )}
       </div>

       <Button
        onClick={() => handleNavigate('contact')}
        className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
       >
        {t('home.button')}
       </Button>
      </div>
     </div>
    </div>
   </div>
  </section>
 );
}