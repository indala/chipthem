"use client";

import React from "react";
import { useTranslations } from "next-intl";

const SearchHero: React.FC = () => {
  const t = useTranslations("SearchHero");

  return (
    <section className="bg-gradient-to-r from-pet-primary to-pet-secondary py-24 relative overflow-hidden hero-bg">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-100"
        style={{
          backgroundImage: `url("/hero.jpg")`,
          backgroundAttachment: "fixed",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex-col items-center justify-start pt-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-md">
          {t("title")}
        </h1>
        <p className="mt-3 text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
          {t("subtitle")}
        </p>

        {/* Info Card */}
        <div className="mt-10 bg-white/20 backdrop-blur-md rounded-2xl p-8 max-w-3xl w-full mx-auto flex items-center justify-center gap-6 shadow-2xl">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-md bg-white flex items-center justify-center">
              <svg
                className="w-7 h-7 text-slate-700"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2C10.9 2 10 2.9 10 4S10.9 6 12 6 14 5.1 14 4 13.1 2 12 2M21 9V7L15 1H5C3.89 1 3 1.89 3 3V9H21M3 19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V11H3V19M5 19V13H19V19H5M8 15H10V17H8V15M6 15H7V17H6V15M12 15H16V17H12V15"></path>
              </svg>
            </div>
          </div>

          <div className="text-left">
            <h3 className="text-white font-semibold text-base">
              {t("howToFindTitle")}
            </h3>
            <p className="text-blue-100/90 text-sm mt-1 max-w-xl">
              {t("howToFindDesc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchHero;
