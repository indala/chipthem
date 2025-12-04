// src/data/clinics.ts (Revised for keys)

export type Clinic = {
  id: number;
  nameKey: string;     // <-- Use a key
  emergency: boolean;
  addressKey: string;  // <-- Use a key
  phone: string;
  hoursKey: string;    // <-- Use a key
  rating: number;
  servicesKey: string; // <-- Use a key
  mapLat: number;
  mapLng: number;
  distance: string;
  email: string;
};

export const CLINICS_DATA: Clinic[] = [
  {
    id: 1,
    nameKey: "amazon_vet_center.name",
    emergency: false,
    addressKey: "amazon_vet_center.address_ruwaad",
    phone: "+962 7 9206 2032",
    hoursKey: "hours.sat_thru_thu_10pm_fri_2pm",
    rating: 4.7,
    servicesKey: "services.default",
    mapLat: 31.9883,
    mapLng: 35.8701,
    distance: "2.3 km",
    email: "info@cityvet.com",
  },
];