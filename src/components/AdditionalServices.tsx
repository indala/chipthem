'use client';

import { useTranslations } from "next-intl";

const AdditionalServices = () => {
  const t = useTranslations("AdditionalServices");
  

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Registry Transfer */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {t("registryTransfer.title")}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t("registryTransfer.description")}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>{t("registryTransfer.transfer")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>{t("registryTransfer.update")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>{t("registryTransfer.verify")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lost Pet Support */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {t("lostPetSupport.title")}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t("lostPetSupport.description")}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">•</span>
                  <span>{t("lostPetSupport.emergency")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">•</span>
                  <span>{t("lostPetSupport.alerts")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">•</span>
                  <span>{t("lostPetSupport.reunion")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Veterinary Partnership */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-4v-4H6v-4h4V5h4v4h4v4h-4v4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {t("veterinaryPartnerships.title")}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t("veterinaryPartnerships.description")}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  <span>{t("veterinaryPartnerships.certified")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  <span>{t("veterinaryPartnerships.programs")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">•</span>
                  <span>{t("veterinaryPartnerships.training")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {t("dataManagement.title")}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t("dataManagement.description")}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>{t("dataManagement.encryption")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>{t("dataManagement.backups")}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-purple-500 mr-2">•</span>
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
