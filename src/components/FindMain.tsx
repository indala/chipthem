// components/FindMain.tsx

"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

// 💡 IMPORT the distance utility
import { haversineDistance } from "@/utils/distance";
// 💡 IMPORT the data and the type
// ASSUMPTION: Clinic type now uses 'nameKey', 'addressKey', etc., as previously defined
import { CLINICS_DATA, Clinic } from "@/data/clinics"; 

// Dynamically import map to disable SSR
const FindMap = dynamic(() => import("./FindMap"), { ssr: false });

// Helper type for the displayed clinic (with calculated distance)
// ASSUMPTION: The imported Clinic type still contains the original fields (name, address, etc.) 
// if you haven't updated it yet, but it should be updated to use keys.
// For this modification, we assume the data file structure has been updated to use keys.
type DisplayClinic = Clinic & {
    calculatedDistance?: string; // Add optional calculated distance field
};




export default function FindMain({
  userLocation,
  searchRadius,
}: {
  userLocation: { lat: number; lng: number } | null;
  searchRadius: string;
}) {
    // 1. Translation hook for general component text (e.g., button labels, titles)
    const t = useTranslations("FindMain");
    // 2. Translation hook for data text (e.g., clinic name, address, hours)
    // ASSUMPTION: Your translation file uses "clinic" as the namespace for data.
    const tClinic = useTranslations("clinic"); 

    const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);

    // Parse the radius string into a number
    const radiusKm = parseFloat(searchRadius);

    // 1. Filter by distance
    const filteredByDistance = CLINICS_DATA
        .map((clinic: Clinic) => {
            // Calculate distance for every clinic if location is known
            if (userLocation) {
                const distance = haversineDistance(
                    userLocation.lat,
                    userLocation.lng,
                    clinic.mapLat,
                    clinic.mapLng
                );

                // Create a new object with the calculated distance
                return { 
                    ...clinic, 
                    distance, 
                    calculatedDistance: `${distance.toFixed(1)} km` 
                };
            }
            // If no user location, return the original clinic object
            return clinic;
        })
        // 2. Apply the radius filter
        .filter((clinic) => {
            // If location or radius is invalid, show all (passed through map above)
            if (!userLocation || isNaN(radiusKm)) {
                return true;
            }

            // Only keep clinics whose calculated distance is within the radius
            return Number(clinic.distance!) <= radiusKm;
        }) as DisplayClinic[]; // Cast the result to the new type

    // 3. Apply the emergency filter
    const displayedClinics = showEmergencyOnly
        ? filteredByDistance.filter((c) => c.emergency)
        : filteredByDistance;


    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 py-6">
            {/* Clinic List */}
            <div className="lg:col-span-2 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-3 text-gray-800">{t("nearbyClinics")}</h2>
                <p className="text-gray-600 mb-6">{t("subtitle")}</p>

                {/* Uses the correctly filtered list */}
                {displayedClinics.map((clinic) => (
                    <div
                        key={clinic.id}
                        className="bg-white rounded-xl shadow p-5 mb-4 border hover:shadow-md transition"
                    >
                        <div className="flex justify-between">
                            <div>
                                {/* 💡 MODIFIED: Translate Name via nameKey */}
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">{tClinic(clinic.nameKey)}</h3>
                                
                                {clinic.emergency && (
                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                        {t("emergency")}
                                    </span>
                                )}
                                {/* 💡 MODIFIED: Translate Address via addressKey */}
                                <p className="text-gray-600 mt-2 text-sm">📍 {tClinic(clinic.addressKey)}</p>
                                <p className=" text-gray-600 text-sm">☎️ <Link href="tel:+962798980504" className="[direction:ltr] [unicode-bidi:bidi-override]">{clinic.phone}</Link></p>
                                {/* 💡 MODIFIED: Translate Hours via hoursKey */}
                                <p className="text-gray-500 text-sm">🕒 {tClinic(clinic.hoursKey)}</p>
                                
                                <p className="text-gray-500 text-sm mt-1">
                                    {/* ASSUMPTION: You've added 'servicesLabel' to your FindMain translations */}
                                    {t("servicesLabel")}: {tClinic(clinic.servicesKey)}
                                </p>
                            </div>
                            <div className="text-right">
                                {/* 💡 CHANGE: Use the calculatedDistance field if available, otherwise use the static one */}
                                <p className="font-bold text-green-600">
                                    {clinic.calculatedDistance || clinic.distance}
                                </p>
                                <p className="text-gray-500 text-sm">{t("away")}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Map */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow p-4">
                    <h3 className="text-lg font-bold mb-2">{t("interactiveMap")}</h3>
                    <FindMap userLocation={userLocation} clinics={displayedClinics} />
                    <div className="mt-4 space-y-2">
                        <button
                            onClick={() => setShowEmergencyOnly(false)}
                            className="w-full bg-pet-secondary text-white py-2 rounded-lg text-sm font-semibold"
                        >
                            {t("showAllClinics")}
                        </button>
                        <button
                            onClick={() => setShowEmergencyOnly(true)}
                            className="w-full bg-red-500 text-white py-2 rounded-lg text-sm font-semibold"
                        >
                            {t("emergencyOnly")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}