"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";

const FindReady: React.FC = () => {
  const t = useTranslations("FindReady"); // corresponds to your i18n namespace
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    window.scrollTo(0, 0);
  };

  return (
    <section className="py-16 bg-blue-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {t("title")}
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          {t("subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => handleNavigation("/registerpet")}
            className="bg-pet-primary text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-600 transition-colors"
          >
            {t("registerPet")}
          </button>
          <button
            onClick={() => handleNavigation("/about")}
            className="bg-gray-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-700 transition-colors"
          >
            {t("learnMore")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FindReady;
