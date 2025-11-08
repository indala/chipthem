'use client';

import { FiMail, FiPhone, FiGlobe, FiMapPin, FiClock, FiCheckCircle } from 'react-icons/fi';
import { VeterinaryClinic } from '@/types/veterinaries';

interface VeterinaryProfileProps {
  veterinary: VeterinaryClinic | null;
}

const VeterinaryProfile = ({ veterinary }: VeterinaryProfileProps) => {
  if (!veterinary) return null;

  const { clinic_name, contact_person, email, phone, alt_phone, website, street_address, city, state_province, postal_code, country, operating_hours, provides_24h_emergency, is_verified, status } = veterinary;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{clinic_name}</h2>
          <div className={`flex items-center mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-semibold ${is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            <FiCheckCircle className="mr-2" />
            {status}
          </div>
        </div>

        {contact_person && <p className="text-lg text-gray-600 mb-6">Contact: {contact_person}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Contact Information</h3>
            <div className="flex items-center"><FiMail className="mr-3 text-gray-500" /><span>{email}</span></div>
            {phone && <div className="flex items-center"><FiPhone className="mr-3 text-gray-500" /><span>{phone}</span></div>}
            {alt_phone && <div className="flex items-center"><FiPhone className="mr-3 text-gray-500" /><span>{alt_phone} (Alt)</span></div>}
            {website && <div className="flex items-center"><FiGlobe className="mr-3 text-gray-500" /><a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{website}</a></div>}
          </div>

          {/* Address Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Address</h3>
            <div className="flex items-start">
              <FiMapPin className="mr-3 mt-1 text-gray-500" />
              <div>
                <p>{street_address}</p>
                <p>{city}, {state_province} {postal_code}</p>
                <p>{country}</p>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Operating Hours</h3>
            <div className="flex items-center"><FiClock className="mr-3 text-gray-500" /><span>{operating_hours}</span></div>
            {provides_24h_emergency && <div className="flex items-center mt-2 text-green-700 font-semibold"><FiCheckCircle className="mr-2" /><span>24/7 Emergency Services</span></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeterinaryProfile;
