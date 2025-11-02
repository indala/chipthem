// src/data/clinics.ts

export type Clinic = {
  id: number;
  name: string;
  emergency: boolean;
  address: string;
  phone: string;
  hours: string;
  rating: number;
  services: string;
  mapLat: number;
  mapLng: number;
  distance: string; // Placeholder for display, ideally calculated
  email: string;
};

export const CLINICS_DATA: Clinic[] = [
  {
    id: 1,
    name: "Amazon Veterinary Center",
    emergency: true,
    address: "Al-Ruwaad Complex - 8, Amman, Jordan",
    phone: "+962 7 9206 2032",
    hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM",
    rating: 4.7,
    services: "Microchipping, Vaccinations, Surgery",
    mapLat: 31.9883,
    mapLng: 35.8701,
    distance: "2.3 km",
    email: "info@cityvet.com",
  },
  
];