"use client";

import { useState, useEffect,useMemo  } from "react";
import FindSearchs from "./FindSearchs";
import FindMain from "./FindMain";
import "leaflet/dist/leaflet.css";

// --- Mock Geocoding Function ---
const mockGeocode = (address: string): { lat: number; lng: number } | null => {
  const lowerAddress = address.toLowerCase();

  const locations: Record<string, { lat: number; lng: number }> = {
    amman: { lat: 31.9566, lng: 35.9457 },
    jerusalem: { lat: 31.7683, lng: 35.2137 },
    "tel aviv": { lat: 32.0853, lng: 34.7818 },
    beirut: { lat: 33.8938, lng: 35.5018 },
    damascus: { lat: 33.5132, lng: 36.2913 },
    riyadh: { lat: 24.7136, lng: 46.6753 },
    london: { lat: 51.5074, lng: 0.1278 },
    paris: { lat: 48.8566, lng: 2.3522 },
    tokyo: { lat: 35.6895, lng: 139.6917 },
    "new york": { lat: 40.7128, lng: -74.006 },
    delhi: { lat: 28.6139, lng: 77.209 },
    sydney: { lat: -33.8688, lng: 151.2093 },
    brasilia: { lat: -15.7797, lng: -47.9297 },
  };

  for (const city in locations) {
    if (lowerAddress.includes(city)) return locations[city];
  }
  return null;
};
// ------------------------------

export default function FindClinicsPage() {
  const [radius, setRadius] = useState("25");
  const [locationInput, setLocationInput] = useState("");
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

const defaultLocation = useMemo(() => ({ lat: 31.9883, lng: 35.8701 }), []);

  const handleUseMyLocation = () => {
    setLocationError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCurrentLocation(userPos);
          console.log("User Location Set:", userPos);
          setLocationInput("");
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Please enable location access or enter an address.");
          setCurrentLocation(defaultLocation);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser. Please enter an address.");
      setCurrentLocation(defaultLocation);
    }
  };

  const handleSearch = () => {
    setLocationError(null);
    console.log(`Searching clinics near "${locationInput}" within ${radius} km`);

    const geocodedLocation = mockGeocode(locationInput);

    if (geocodedLocation) {
      setCurrentLocation(geocodedLocation);
      console.log("Geocoded location set:", geocodedLocation);
    } else {
      setLocationError(`Could not find coordinates for "${locationInput}". Showing default location.`);
      setCurrentLocation(defaultLocation);
    }
  };

  // ✅ Cleaned up effect (no warning now)
  useEffect(() => {
    let mounted = true;

    const initializeLocation = async () => {
      if (!mounted) return;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (mounted) {
              setCurrentLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            }
          },
          () => {
            if (mounted) {
              setLocationError("Please enable location access or enter an address.");
              setCurrentLocation(defaultLocation);
            }
          }
        );
      } else {
        if (mounted) {
          setLocationError("Geolocation is not supported by your browser.");
          setCurrentLocation(defaultLocation);
        }
      }
    };

    initializeLocation();
    return () => {
      mounted = false;
    };
  }, [defaultLocation]); // ✅ only depends on defaultLocation (stable constant)

  return (
    <div>
      <FindSearchs
        radius={radius}
        locationInput={locationInput}
        onRadiusChange={setRadius}
        onLocationChange={setLocationInput}
        onUseMyLocation={handleUseMyLocation}
        onSearch={handleSearch}
      />

      {locationError && (
        <p className="text-center text-red-700 bg-red-100 p-2 font-medium border-b">
          ⚠️ {locationError}
        </p>
      )}

      <FindMain userLocation={currentLocation} searchRadius={radius} />
    </div>
  );
}
