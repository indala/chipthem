"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

// Define a proper interface for search results
interface SearchResult {
  petName: string;
  petType: string;
  petColor: string;
  ownerName: string;
  phone: string;
  email: string;
}

export default function MicrochipSearch() {
  const t = useTranslations("SearchSearch");

  const [chipNumber, setChipNumber] = useState("");
  const [searching, setSearching] = useState(false);
  const [found, setFound] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const search = async () => {
    if (chipNumber.length !== 15) {
      alert(t("invalidNumber"));
      return;
    }

    setSearching(true);
    setFound(false);
    setNotFound(false);

    try {
      const response = await fetch(`/api/search?chipNumber=${chipNumber}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: { found: boolean; result?: SearchResult } = await response.json();

      if (data.found && data.result) {
        setFound(true);
        setSearchResult(data.result);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error searching chip:", error);
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl shadow-2xl overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-400 px-8 py-10 text-center rounded-t-2xl">
            <h2 className="text-3xl font-extrabold text-white">{t("title")}</h2>
            <p className="text-sm text-blue-100 mt-2">{t("subtitle")}</p>
          </div>

          {/* White Card */}
          <div className="bg-white px-8 py-8 -mt-6 rounded-b-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                search();
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("microchipNumber")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={chipNumber}
                    onChange={(e) => setChipNumber(e.target.value)}
                    required
                    maxLength={15}
                    pattern="[0-9]{15}"
                    placeholder="123456789012345"
                    className="w-full px-4 py-4 pl-16 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200 font-mono text-lg text-center placeholder-gray-300"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-2">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C10.9 2 10 2.9 10 4S10.9 6 12 6 14 5.1 14 4 13.1 2 12 2M21 9V7L15 1H5C3.89 1 3 1.89 3 3V9H21M3 19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V11H3V19M5 19V13H19V19H5M8 15H10V17H8V15M6 15H7V17H6V15M12 15H16V17H12V15"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{t("instruction")}</p>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={searching}
                className={`w-full py-4 rounded-lg text-lg font-semibold transition-all duration-200 flex items-center justify-center gap-3 ${
                  searching
                    ? "opacity-75 cursor-not-allowed"
                    : "shadow-md bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                }`}
              >
                {searching ? t("searchingDatabase") : t("searchDatabase")}
              </button>
            </form>

            {/* Search Results */}
            {found && searchResult && (
              <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  {t("petFound")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg p-6">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">{t("petInfo")}</h4>
                    <p>
                      <strong>{t("name")}: </strong> {searchResult.petName}
                    </p>
                    <p>
                      <strong>{t("typeBreed")}: </strong> {searchResult.petType}
                    </p>
                    <p>
                      <strong>{t("color")}: </strong> {searchResult.petColor}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">{t("ownerContact")}</h4>
                    <p>
                      <strong>{t("name")}: </strong> {searchResult.ownerName}
                    </p>
                    <p>
                      <strong>{t("phone")}: </strong>{" "}
                      <a
                        href={`tel:${searchResult.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {searchResult.phone}
                      </a>
                    </p>
                    <p>
                      <strong>{t("email")}: </strong>{" "}
                      <a
                        href={`mailto:${searchResult.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {searchResult.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {notFound && (
              <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-800">{t("notFound")}</h3>
                <p className="text-red-700 mt-2">{t("notInDatabase")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
