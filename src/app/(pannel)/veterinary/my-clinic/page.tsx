'use client';

import { useEffect, useState, FormEvent } from 'react';
import dynamic from 'next/dynamic';
import { useVeterinaryStore } from '@/store/useVeterinaryStore';

interface MapPosition {
  lat: number;
  lng: number;
}

// Dynamically load the Leaflet map component (client only)
const DynamicClinicMap = dynamic(() => import('@/components/ClinicMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto mb-2"></div>
        <p className="text-xs text-gray-500">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MyClinicPage() {
  const { veterinary, isLoading, error, fetchVeterinaryData, updateVeterinary } =
    useVeterinaryStore();

  const [formState, setFormState] = useState({
    clinic_name: '',
    street_address: '',
    city: '',
    state_province: '',
    postal_code: '',
    country: '',
    google_maps_url: '',
    latitude: '',           // ✅ NEW
    longitude: '',          // ✅ NEW
    operating_hours: '',
    provides_24h_emergency: false,
    microchip_services: false,
    has_microchip_scanners: false,
    website: '',
    phone: '',
    alt_phone: '',
    years_in_practice: '',
    specializations: '',
    additional_services: '',
    scanner_types: '',
  });

  const [mapPosition, setMapPosition] = useState<MapPosition | null>(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState('');

  useEffect(() => {
    if (!veterinary) {
      fetchVeterinaryData();
    }
  }, [veterinary, fetchVeterinaryData]);


  // Seed form from store
  useEffect(() => {
    if (!veterinary) return;
    setFormState({
      clinic_name: veterinary.clinic_name || '',
      street_address: veterinary.street_address || '',
      city: veterinary.city || '',
      state_province: veterinary.state_province || '',
      postal_code: veterinary.postal_code || '',
      country: veterinary.country || '',
      google_maps_url: veterinary.google_maps_url || '',
      latitude: veterinary.latitude != null ? String(veterinary.latitude) : '',
      longitude: veterinary.longitude != null ? String(veterinary.longitude) : '',
      operating_hours: veterinary.operating_hours || '',
      provides_24h_emergency: !!veterinary.provides_24h_emergency,
      microchip_services: !!veterinary.microchip_services,
      has_microchip_scanners: !!veterinary.has_microchip_scanners,
      website: veterinary.website || '',
      phone: veterinary.phone || '',
      alt_phone: veterinary.alt_phone || '',
      years_in_practice:
        veterinary.years_in_practice != null
          ? String(veterinary.years_in_practice)
          : '',
      specializations: (veterinary.specializations || []).join(', '),
      additional_services: (veterinary.additional_services || []).join(', '),
      scanner_types: (veterinary.scanner_types || []).join(', '),
    });

    // If existing coords, show them on map
      // If existing coords, show them on map
  if (veterinary.latitude != null && veterinary.longitude != null) {
    const lat = Number(veterinary.latitude);
    const lng = Number(veterinary.longitude);

    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      setMapPosition({
        lat,
        lng,
      });
    }
  }

  }, [veterinary]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'google_maps_url') {
      setMapPosition(null);
      setMapError('');
      setMapLoading(false);
    }
  };

  const handleMapsUrlChange = async (url: string) => {
    if (!url.trim()) {
      setMapPosition(null);
      setMapError('');
      return;
    }

    setMapLoading(true);
    setMapError('');

    try {
      const response = await fetch('/api/maps-coords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'API failed to return coordinates.');
      }

      setFormState((prev) => ({
  ...prev,
  latitude: String(result.lat ?? ""),
  longitude: String(result.lng ?? ""),
}));


      setMapPosition({
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lng),
      });
      setMapError('');
    } catch (err: unknown) { // FIX: Changed 'any' to 'Error' on line 151
      const message =
    err instanceof Error && err.message
      ? err.message
      : 'Could not extract location. Pin your exact location in Google Maps → Share → Copy link.';

      setMapError(message);
      setMapPosition(null);
    } finally {
      setMapLoading(false);
    }
  };

  // Debounce URL changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleMapsUrlChange(formState.google_maps_url);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formState.google_maps_url]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!veterinary?.id) return;

    const payload = {
      clinic_name: formState.clinic_name.trim(),
      street_address: formState.street_address.trim() || null,
      city: formState.city.trim() || null,
      state_province: formState.state_province.trim() || null,
      postal_code: formState.postal_code.trim() || null,
      country: formState.country.trim() || null,
google_maps_url:
    formState.google_maps_url.trim() === ''
      ? undefined
      : formState.google_maps_url.trim(),
      latitude:
        formState.latitude.trim() === ''
          ? null
          : formState.latitude.trim(),
      longitude:
        formState.longitude.trim() === ''
          ? null
          : formState.longitude.trim(),
      operating_hours: formState.operating_hours.trim() || null,
      provides_24h_emergency: formState.provides_24h_emergency,
      microchip_services: formState.microchip_services,
      has_microchip_scanners: formState.has_microchip_scanners,
      website: formState.website.trim() || null,
      phone: formState.phone.trim() || null,
      alt_phone: formState.alt_phone.trim() || null,
      years_in_practice:
        formState.years_in_practice.trim() === ''
          ? null
          : Number(formState.years_in_practice),
      specializations:
        formState.specializations.trim() === ''
          ? null
          : formState.specializations.split(',').map((s) => s.trim()),
      additional_services:
        formState.additional_services.trim() === ''
          ? null
          : formState.additional_services.split(',').map((s) => s.trim()),
      scanner_types:
        formState.scanner_types.trim() === ''
          ? null
          : formState.scanner_types.split(',').map((s) => s.trim()),
    };

    await updateVeterinary(veterinary.id, payload);
  };

  if (isLoading && !veterinary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-sm">Loading clinic data…</p>
      </div>
    );
  }

  if (error && !veterinary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!veterinary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-sm">No clinic profile found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">My clinic</h1>
          <p className="text-xs text-gray-500 mt-1">
            Update your clinic details, address, and services. Changes may be
            reviewed before they appear to pet owners.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border p-4 space-y-4"
        >
          {/* Clinic info */}
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Clinic information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Clinic name
                </label>
                <input
                  type="text"
                  name="clinic_name"
                  value={formState.clinic_name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formState.website}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formState.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Alternate phone
                </label>
                <input
                  type="tel"
                  name="alt_phone"
                  value={formState.alt_phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Years in practice
                </label>
                <input
                  type="number"
                  name="years_in_practice"
                  min={0}
                  max={100}
                  value={formState.years_in_practice}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </section>

          {/* Address + map */}
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Address & location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Street address
                </label>
                <input
                  type="text"
                  name="street_address"
                  value={formState.street_address}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formState.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  name="state_province"
                  value={formState.state_province}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Postal code
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formState.postal_code}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formState.country}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  name="google_maps_url"
                  value={formState.google_maps_url}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://maps.app.goo.gl/... or https://www.google.com/maps/@lat,lng"
                />
                <p className="mt-1 text-[11px] text-gray-500">
                  Paste a Google Maps share link. Coordinates and map will update automatically.
                </p>
              </div>

              {(mapLoading || mapPosition || mapError) && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Location preview
                  </label>
                  <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                    {mapLoading ? (
                      <div className="flex items-center justify-center h-full bg-gray-50">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto mb-2"></div>
                          <p className="text-xs text-gray-500">
                            Extracting location...
                          </p>
                        </div>
                      </div>
                    ) : mapPosition ? (
                      <DynamicClinicMap
                        mapPosition={mapPosition}
                        clinicName={formState.clinic_name}
                        streetAddress={formState.street_address}
                        city={formState.city}
                        country={formState.country}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-50">
                        <p className="text-xs text-red-500 text-center px-4">
                          {mapError}
                        </p>
                      </div>
                    )}
                  </div>

                  {mapPosition && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 mb-1">
                          Latitude
                        </label>
                        <input
                          type="text"
                          value={formState.latitude}
                          readOnly
                          className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 mb-1">
                          Longitude
                        </label>
                        <input
                          type="text"
                          value={formState.longitude}
                          readOnly
                          className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-800"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Services & equipment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-gray-700">
                  <input
                    type="checkbox"
                    name="provides_24h_emergency"
                    checked={formState.provides_24h_emergency}
                    onChange={handleChange}
                    className="h-3 w-3 rounded border-gray-300"
                  />
                  24h emergency services
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-700">
                  <input
                    type="checkbox"
                    name="microchip_services"
                    checked={formState.microchip_services}
                    onChange={handleChange}
                    className="h-3 w-3 rounded border-gray-300"
                  />
                  Microchip implantation services
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-700">
                  <input
                    type="checkbox"
                    name="has_microchip_scanners"
                    checked={formState.has_microchip_scanners}
                    onChange={handleChange}
                    className="h-3 w-3 rounded border-gray-300"
                  />
                  Microchip scanners available
                </label>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Operating hours
                </label>
                <textarea
                  name="operating_hours"
                  value={formState.operating_hours}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Mon–Fri 9:00–18:00, Sat 10:00–14:00"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Specializations (comma separated)
                </label>
                <input
                  type="text"
                  name="specializations"
                  value={formState.specializations}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Dermatology, Surgery, Exotic pets"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Additional services (comma separated)
                </label>
                <input
                  type="text"
                  name="additional_services"
                  value={formState.additional_services}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Grooming, Boarding, Home visits"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Scanner types (comma separated)
                </label>
                <input
                  type="text"
                  name="scanner_types"
                  value={formState.scanner_types}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="ISO FDX-B, AVID, etc."
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            {error && (
              <p className="text-[11px] text-red-600 self-center mr-auto">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-full bg-emerald-600 text-white shadow hover:bg-emerald-700"
            >
              {isLoading ? 'Saving…' : 'Save clinic details'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}