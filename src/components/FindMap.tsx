"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
// 💡 Import useEffect to handle map updates after initial render
import { useEffect } from "react"; 

// Leaflet's CSS must be imported globally (in `src/app/globals.css`) for Next.js apps.

const userIcon = new L.Icon({
 iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
 iconSize: [30, 30],
});

const clinicIcon = new L.Icon({
 iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448337.png",
 iconSize: [30, 30],
});

type Clinic = {
 id: string | number;
 name: string;
 address?: string;
 mapLat: number;
 mapLng: number;
};

// 💡 NEW HELPER COMPONENT: Recenter map view when coordinates change
function MapCenterUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap(); // Accesses the Leaflet map instance
  
  useEffect(() => {
    // This runs whenever lat or lng changes
    map.setView([lat, lng], map.getZoom()); 
  }, [lat, lng, map]);
  
  return null; // This component doesn't render anything visible
}

export default function FindMap({
 userLocation,
 clinics,
}: {
 userLocation: { lat: number; lng: number } | null;
 clinics: Clinic[];
}) {
    // Default location (e.g., Amman, Jordan) if userLocation is null
    const defaultCenter = [31.9883, 35.8701] as [number, number];

 return (
  <div className="h-96 rounded-lg overflow-hidden">
     <MapContainer
      {...({
       center: userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter,
       zoom: 12,
       style: { width: "100%", height: "100%" },
      } as unknown as Record<string, unknown>)}
     >
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* 💡 RENDER UPDATER: Recenter the map whenever userLocation changes */}
        {userLocation && (
            <MapCenterUpdater lat={userLocation.lat} lng={userLocation.lng} />
        )}

    {userLocation && (
     <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
      <Popup>You are here</Popup>
     </Marker>
    )}
    {clinics.map((clinic) => (
     <Marker key={clinic.id} position={[clinic.mapLat, clinic.mapLng]} icon={clinicIcon}>
      <Popup>
       <strong>{clinic.name}</strong>
       <br />
       {clinic.address}
      </Popup>
     </Marker>
    ))}
   </MapContainer>
  </div>
 );
}