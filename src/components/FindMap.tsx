"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import type { ClinicAPIResponse } from "@/store/useClinicsStore";

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [30, 30],
});

const clinicIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448337.png",
  iconSize: [30, 30],
});

// Recenter map when center changes
function MapCenterUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);

  return null;
}

export default function FindMap({
  userLocation,
  clinics,
  selectedClinic,
}: {
  userLocation: { lat: number; lng: number } | null;
  clinics: (ClinicAPIResponse & { calculatedDistance?: string; distance?: number })[];
  selectedClinic?: { lat: number; lng: number } | null;
}) {
  const defaultCenter: [number, number] = [31.9883, 35.8701];

  const center: [number, number] =
    selectedClinic
      ? [selectedClinic.lat, selectedClinic.lng]
      : userLocation
      ? [userLocation.lat, userLocation.lng]
      : defaultCenter;

  return (
    <div className="h-96 rounded-lg overflow-hidden ">
      <MapContainer
        center={center}
        zoom={12}
        className="z-10"
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapCenterUpdater lat={center[0]} lng={center[1]} />

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {clinics.map((clinic) => (
          <Marker
            key={clinic.id}
            position={[clinic.lat, clinic.lng]}
            icon={clinicIcon}
          >
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
