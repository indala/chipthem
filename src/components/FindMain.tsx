"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { haversineDistance } from "@/utils/distance";
import { useClinicsStore, ClinicAPIResponse } from "@/store/useClinicsStore";

const FindMap = dynamic(() => import("./FindMap"), { ssr: false });

// Display type with optional distance
type DisplayClinic = ClinicAPIResponse & {
  distance?: number;
  calculatedDistance?: string;
};

export default function FindMain({
  userLocation,
  searchRadius,
  onClinicSelect,
  selectedClinicLocation,
  

}: {
  userLocation: { lat: number; lng: number } | null;
  searchRadius: string;
  onClinicSelect: (lat: number, lng: number) => void;
  selectedClinicLocation: { lat: number; lng: number } | null;

}) {
  const t = useTranslations("FindMain");

  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);

  const clinics = useClinicsStore((state) => state.clinics);
  const loading = useClinicsStore((state) => state.loading);
  const error = useClinicsStore((state) => state.error);
  const fetchClinics = useClinicsStore((state) => state.fetchClinics);

  useEffect(() => {
  const { clinics, loading } = useClinicsStore.getState();
  if (clinics.length === 0 && !loading) {
    fetchClinics();
  }
}, [fetchClinics]);


  const radiusKm = Number(searchRadius);

  // 1️⃣ Normalize clinics with optional distance
  const clinicsWithDistance: DisplayClinic[] = clinics.map((clinic) => {
    if (!userLocation) {
      return clinic;
    }

    const distance = haversineDistance(
      userLocation.lat,
      userLocation.lng,
      clinic.lat,
      clinic.lng
    );

    return {
      ...clinic,
      distance,
      calculatedDistance: `${distance.toFixed(1)} km`,
    };
  });

  // 2️⃣ Filter by radius
  const filteredByDistance = clinicsWithDistance.filter((clinic) => {
    if (userLocation === null) {
  return true; // show ALL clinics if location not available
}

if (!searchRadius || Number.isNaN(radiusKm)) {
    return true;
  }

  return clinic.distance !== undefined && clinic.distance <= radiusKm;

  });

  // 3️⃣ Emergency filter
  const displayedClinics = showEmergencyOnly
    ? filteredByDistance.filter((c) => c.is_24h)
    : filteredByDistance;

  if (loading) {
    return (
      <div className="px-4 py-6 text-center text-gray-600">
        {t("loading") || "Loading clinics..."}
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 py-6">
      {/* Clinic List */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold mb-3">{t("nearbyClinics")}</h2>
        <p className="text-gray-600 mb-6">{t("subtitle")}</p>

        {displayedClinics.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {t("noClinicsFound")}
          </p>
        ) : (
          displayedClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white rounded-xl shadow p-5 mb-4 border"
              onClick={() => onClinicSelect(clinic.lat, clinic.lng)}

            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{clinic.name}</h3>

                  {clinic.is_24h && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      {t("emergency")}
                    </span>
                  )}

                  <p className="text-sm mt-2">📍 {clinic.address}</p>

                  {clinic.phone && (
                    <p className="text-sm">
                      ☎️{" "}
                      <Link href={`tel:${clinic.phone}`}>
                        {clinic.phone}
                      </Link>
                    </p>
                  )}

                  {clinic.hours && (
                    <p className="text-sm">🕒 {clinic.hours}</p>
                  )}
                </div>

                <div className="text-right">
  {userLocation && clinic.calculatedDistance ? (
    <>
      <p className="font-bold text-green-600">
        {clinic.calculatedDistance}
      </p>
      <p className="text-gray-500 text-sm">{t("away")}</p>
    </>
  ) : null}
</div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Map */}
      <div>
        <FindMap userLocation={userLocation} clinics={displayedClinics} 
        selectedClinic={selectedClinicLocation}
/>

        <div className="mt-4 space-y-2">
          <button
            onClick={() => setShowEmergencyOnly(false)}
            className="w-full bg-pet-secondary text-white py-2 rounded-lg"
          >
            {t("showAllClinics")}
          </button>

          <button
            onClick={() => setShowEmergencyOnly(true)}
            className="w-full bg-red-500 text-white py-2 rounded-lg"
          >
            {t("emergencyOnly")}
          </button>
        </div>
      </div>
    </div>
  );
}
