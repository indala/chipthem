"use client";

import { useState, useEffect } from "react"; // 💡 Import useEffect
import FindSearchs from "./FindSearchs";
import FindMain from "./FindMain";
import "leaflet/dist/leaflet.css";

// --- Mock Geocoding Function ---
// In a real app, this would be an API call (e.g., fetch from OpenCage or Google Maps)
const mockGeocode = (address: string): { lat: number; lng: number } | null => {
  const lowerAddress = address.toLowerCase();

  // --- 🌍 Locations Near Default (Amman, Jordan) ---

  if (lowerAddress.includes("amman")) {
    return { lat: 31.9566, lng: 35.9457 };
  }
  if (lowerAddress.includes("jerusalem")) {
    return { lat: 31.7683, lng: 35.2137 };
  }
  if (lowerAddress.includes("tel aviv")) {
    return { lat: 32.0853, lng: 34.7818 };
  }
  if (lowerAddress.includes("beirut")) {
    return { lat: 33.8938, lng: 35.5018 };
  }
  if (lowerAddress.includes("damascus")) {
    return { lat: 33.5132, lng: 36.2913 };
  }
  if (lowerAddress.includes("riyadh")) {
    return { lat: 24.7136, lng: 46.6753 };
  }

  // --- 🌐 Global Capitals and Cities ---

  if (lowerAddress.includes("london")) {
    return { lat: 51.5074, lng: 0.1278 };
  }
  if (lowerAddress.includes("paris")) {
    return { lat: 48.8566, lng: 2.3522 };
  }
  if (lowerAddress.includes("tokyo")) {
    return { lat: 35.6895, lng: 139.6917 };
  }
  if (lowerAddress.includes("new york")) {
    return { lat: 40.7128, lng: -74.0060 };
  }
  if (lowerAddress.includes("delhi")) {
    return { lat: 28.6139, lng: 77.2090 };
  }
  if (lowerAddress.includes("sydney")) {
    return { lat: -33.8688, lng: 151.2093 };
  }
  if (lowerAddress.includes("brasilia")) {
    return { lat: -15.7797, lng: -47.9297 };
  }

  // Fallback for unrecognized addresses
  return null;
};
// ------------------------------

export default function FindClinicsPage() {
const [radius, setRadius] = useState("25");
const [locationInput, setLocationInput] = useState("");
const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
const [locationError, setLocationError] = useState<string | null>(null); // 💡 State for errors

// Default location (e.g., Amman, Jordan)
const defaultLocation = { lat: 31.9883, lng: 35.8701 }; 

const handleUseMyLocation = () => {
   setLocationError(null); // Clear any previous error
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
      // 💡 Replaced alert() with state update
      setLocationError("Please enable location access or enter an address.");
      setCurrentLocation(defaultLocation); 
     }
   );
  } else {
   // 💡 Replaced alert() with state update
   setLocationError("Geolocation is not supported by your browser. Please enter an address.");
   setCurrentLocation(defaultLocation);
  }
};

const handleSearch = () => {
   setLocationError(null); // Clear any previous error
  console.log(`Searching clinics near "${locationInput}" within ${radius} km`);
   
   // 💡 IMPLEMENTING GEOCODING LOGIC
   const geocodedLocation = mockGeocode(locationInput);
   
   if (geocodedLocation) {
     setCurrentLocation(geocodedLocation);
     console.log("Geocoded location set:", geocodedLocation);
   } else {
     // Geocoding failed, use default and inform user
     setLocationError(`Could not find coordinates for "${locationInput}". Showing default location.`);
     setCurrentLocation(defaultLocation);
   }
};

// Initialize location on component mount
useEffect(() => {
  let mounted = true;

  const initializeLocation = async () => {
    if (!currentLocation && mounted) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (mounted) {
              setCurrentLocation({ 
                lat: position.coords.latitude, 
                lng: position.coords.longitude 
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
    }
  };

  initializeLocation();
  return () => { mounted = false; };
}, []);


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
   {/* Display the location error message to the user */}
 {locationError && (
  <p className="text-center text-red-700 bg-red-100 p-2 font-medium border-b">
   ⚠️ {locationError}
  </p>
 )}
 
 <FindMain userLocation={currentLocation} searchRadius={radius} /> 
 </div>
);
}