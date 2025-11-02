"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface FindSearchsProps {
  radius: string;
  locationInput: string;
  onRadiusChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onUseMyLocation: () => void;
  onSearch: () => void;
}

const FindSearchs: React.FC<FindSearchsProps> = ({
  radius,
  locationInput,
  onRadiusChange,
  onLocationChange,
  onUseMyLocation,
  onSearch,
}) => {
  const t = useTranslations("FindSearch");

  return (
    <section className="pt-6 pb-8 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Location Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={onUseMyLocation}
              className="bg-pet-secondary hover:bg-pet-secondary/80 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
              </svg>
              {t("useMyLocation")}
            </button>

            <div className="flex items-center gap-2">
              <label htmlFor="radius" className="text-sm font-medium text-gray-700">
                {t("searchRadius")}
              </label>
              <select
                id="radius"
                value={radius}
                onChange={(e) => onRadiusChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
              </select>
            </div>
          </div>

          {/* Manual Location Input */}
          <div className="flex gap-2">
            <input
              type="text"
              id="location-input"
              placeholder={t("enterCityOrAddress")}
              className="border border-gray-300 rounded-lg px-4 py-2 w-64"
              value={locationInput}
              onChange={(e) => onLocationChange(e.target.value)}
            />
            <button
              onClick={onSearch}
              className="bg-pet-primary hover:bg-pet-primary/80 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {t("search")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindSearchs;
