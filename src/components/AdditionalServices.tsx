'use client';

import { useTranslations, useLocale } from "next-intl"; // Import useLocale

const AdditionalServices = () => {
  const t = useTranslations("AdditionalServices");
  const locale = useLocale(); // Get the current locale (e.g., 'en', 'ar', 'he')

  // Define RTL locales. You should adjust this based on your supported languages.
  const isRtl = ['ar', 'he', 'fa'].includes(locale); 

  // Use Tailwind's logical properties for spacing (start/end instead of left/right)
  // This helps simplify the component logic.

  return (
    // 1. Add 'dir' attribute for RTL support on the main section
    <section className="py-20 bg-gray-50" dir={isRtl ? 'rtl' : 'ltr'}> 
      {/* Increased vertical padding to py-20 for better spacing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16"> 
          {/* Increased margin-bottom to mb-16 */}
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6"> 
            {/* Adjusted size and weight for better emphasis */}
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            {/* Adjusted size and max-width */}
            {t("subtitle")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10"> 
          {/* Increased gap to gap-10 for better separation */}
          
          {/* Registry Transfer */}
          <div className="bg-white rounded-3xl p-6 shadow-xl ring-1 ring-gray-100 hover:shadow-2xl transition-all duration-500">
            <div className="p-4">
              <div className="flex items-start mb-6"> {/* items-start for better alignment */}
                {/* Use 'flex-shrink-0' to prevent icon shrinking */}
                <div className="w-14 h-14 bg-blue-500 flex-shrink-0 rounded-full flex items-center justify-center me-4"> 
                  {/* me-4 (margin-inline-end: 1rem) replaces mr-4/ml-4 */}
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {t("registryTransfer.title")}
                  </h3>
                  <p className="text-gray-600 text-base">
                    {t("registryTransfer.description")}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-700 pt-4"> {/* Added padding top */}
                <div className="flex items-center">
                  <span className="text-blue-500 me-3">•</span> {/* me-3 replaces mr-2/ml-2 */}
                  <span>{t("registryTransfer.transfer")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-500 me-3">•</span>
                  <span>{t("registryTransfer.update")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-500 me-3">•</span>
                  <span>{t("registryTransfer.verify")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lost Pet Support (Structure replicated with logical margins) */}
          <div className="bg-white rounded-3xl p-6 shadow-xl ring-1 ring-gray-100 hover:shadow-2xl transition-all duration-500">
            <div className="p-4">
              <div className="flex items-start mb-6">
                <div className="w-14 h-14 bg-red-500 flex-shrink-0 rounded-full flex items-center justify-center me-4">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {t("lostPetSupport.title")}
                  </h3>
                  <p className="text-gray-600 text-base">
                    {t("lostPetSupport.description")}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-700 pt-4">
                <div className="flex items-center">
                  <span className="text-red-500 me-3">•</span>
                  <span>{t("lostPetSupport.emergency")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 me-3">•</span>
                  <span>{t("lostPetSupport.alerts")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 me-3">•</span>
                  <span>{t("lostPetSupport.reunion")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Veterinary Partnership (Structure replicated with logical margins) */}
          <div className="bg-white rounded-3xl p-6 shadow-xl ring-1 ring-gray-100 hover:shadow-2xl transition-all duration-500">
            <div className="p-4">
              <div className="flex items-start mb-6">
                <div className="w-14 h-14 bg-green-500 flex-shrink-0 rounded-full flex items-center justify-center me-4">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-4v-4H6v-4h4V5h4v4h4v4h-4v4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {t("veterinaryPartnerships.title")}
                  </h3>
                  <p className="text-gray-600 text-base">
                    {t("veterinaryPartnerships.description")}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-700 pt-4">
                <div className="flex items-center">
                  <span className="text-green-500 me-3">•</span>
                  <span>{t("veterinaryPartnerships.certified")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 me-3">•</span>
                  <span>{t("veterinaryPartnerships.programs")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 me-3">•</span>
                  <span>{t("veterinaryPartnerships.training")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Management (Structure replicated with logical margins) */}
          <div className="bg-white rounded-3xl p-6 shadow-xl ring-1 ring-gray-100 hover:shadow-2xl transition-all duration-500">
            <div className="p-4">
              <div className="flex items-start mb-6">
                <div className="w-14 h-14 bg-purple-500 flex-shrink-0 rounded-full flex items-center justify-center me-4">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {t("dataManagement.title")}
                  </h3>
                  <p className="text-gray-600 text-base">
                    {t("dataManagement.description")}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-700 pt-4">
                <div className="flex items-center">
                  <span className="text-purple-500 me-3">•</span>
                  <span>{t("dataManagement.encryption")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-purple-500 me-3">•</span>
                  <span>{t("dataManagement.backups")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-purple-500 me-3">•</span>
                  <span>{t("dataManagement.privacy")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdditionalServices;