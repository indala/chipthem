'use client';
import { useTranslations } from "next-intl";

const SuccessStoriesRecent = () => {
  const t= useTranslations('SuccessStoriesRecent');

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('title')}</h2>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Story 1 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-green-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{t('max.title')}</h3>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm text-white">{t('max.time')}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                  <img src="https://pet-microchip-system.mrehman.com/assets/images/Max.jpg" alt={t('max.petType')} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{t('max.petName')} - {t('max.petType')}</h4>
                  <p className="text-sm text-gray-600">{t('max.location')}</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-4">
                {t('max.story')}
              </blockquote>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">- {t('max.author')}</p>
                <div className="flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-sm font-semibold">{t('reunited')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Story 2 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{t('luna.title')}</h3>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm text-white">{t('luna.time')}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                  <img src="https://pet-microchip-system.mrehman.com/assets/images/Luna.jpg" alt={t('luna.petType')} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{t('luna.petName')} - {t('luna.petType')}</h4>
                  <p className="text-sm text-gray-600">{t('luna.location')}</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-4">
                {t('luna.story')}
              </blockquote>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">- {t('luna.author')}</p>
                <div className="flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-sm font-semibold">{t('reunited')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Story 3 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-purple-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{t('Bonduk.title')}</h3>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm text-white">{t('Bonduk.time')}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                  <img src="https://pet-microchip-system.mrehman.com/assets/images/Buddy.jpg" alt={t('Bonduk.petType')} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{t('Bonduk.petName')} - {t('Bonduk.petType')}</h4>
                  <p className="text-sm text-gray-600">{t('Bonduk.location')}</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-4">
                {t('Bonduk.story')}
              </blockquote>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">- {t('Bonduk.author')}</p>
                <div className="flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-sm font-semibold">{t('reunited')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Story 4 */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-orange-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{t('milo.title')}</h3>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm text-white">{t('milo.time')}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                  <img src="https://pet-microchip-system.mrehman.com/assets/images/milo.jpg" alt={t('milo.petType')} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{t('milo.petName')} - {t('milo.petType')}</h4>
                  <p className="text-sm text-gray-600">{t('milo.location')}</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic mb-4">
                {t('milo.story')}
              </blockquote>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">- {t('milo.author')}</p>
                <div className="flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-sm font-semibold">{t('reunited')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesRecent;