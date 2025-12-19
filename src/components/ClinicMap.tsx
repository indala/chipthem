// src/components/ClinicMap.tsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

// Types for clarity
interface MapPosition {
  lat: number;
  lng: number;
}
interface ClinicMapProps {
  mapPosition: MapPosition;
  clinicName: string;
  streetAddress: string;
  city: string;
  country: string;
}

// 1. Icon definition (must be defined outside MapContainer)
const clinicIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448337.png",
  iconSize: [30, 30],
});

// 2. Map updater hook (must be defined inside MapContainer)
function MapCenterUpdater({ position }: { position: MapPosition }) {
  const map = useMap();

  // Reset map view whenever position changes
  useEffect(() => {
    map.setView([position.lat, position.lng], 15);
  }, [position, map]);

  return null;
}

// 3. Main Map Component
export default function ClinicMap({ 
  mapPosition, 
  clinicName, 
  streetAddress, 
  city, 
  country 
}: ClinicMapProps) {
    console.log(mapPosition)

  return (
    <MapContainer
      center={[mapPosition.lat, mapPosition.lng]}
      zoom={15}
      className="z-10" // Make sure this is high enough to show over other elements
      style={{ width: "100%", height: "100%" }}
      // Note: key attribute forces Leaflet to re-initialize completely when coordinates change
      key={`${mapPosition.lat}-${mapPosition.lng}`} 
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapCenterUpdater position={mapPosition} />
      <Marker position={[mapPosition.lat, mapPosition.lng]} icon={clinicIcon}>
        <Popup>
          <strong>{clinicName || 'Your clinic'}</strong>
          <br />
          {streetAddress && `${streetAddress}, `}
          {city && `${city}, `}
          {country && country}
        </Popup>
      </Marker>
    </MapContainer>
  );
}