"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Clinic } from "@/data/clinics";

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [30, 30],
});

const clinicIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448337.png",
  iconSize: [30, 30],
});

// Recenter map when user location changes
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
}: {
  userLocation: { lat: number; lng: number } | null;
  clinics: Clinic[];  // ✔️ use the real Clinic type
}) {
  const tClinic = useTranslations("clinic");  // ✔️ translations for keys

  const defaultCenter = [31.9883, 35.8701] as [number, number];

  return (
    <div className="h-96 rounded-lg overflow-hidden ">
      <MapContainer
        center={userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter}
        zoom={12}
        className="z-10"
        style={{ width: "100%", height: "100%" }}

      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {userLocation && (
          <MapCenterUpdater lat={userLocation.lat} lng={userLocation.lng} />
        )}

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {clinics.map((clinic) => (
          <Marker
            key={clinic.id}
            position={[clinic.mapLat, clinic.mapLng]}
            icon={clinicIcon}
          >
            <Popup>
              <strong>{tClinic(clinic.nameKey)}</strong>
              <br />
              {tClinic(clinic.addressKey)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
