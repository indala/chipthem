"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaUserCircle, FaUserTag, FaCalendarAlt } from "react-icons/fa";
import { useOwnerStore } from "@/store/useOwnerStore";


// Generate color from string (consistent for same username)
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 55%)`;
}

// Avatar component
const ProfileAvatar = ({ username }: { username: string }) => {
  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const bgColor = stringToColor(username);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-md transition"
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </motion.div>
  );
};

export default function PetOwnerProfilePage() {
  const { owner, pets, fetchOwnerData, isLoading, error } = useOwnerStore();

  useEffect(() => {
    fetchOwnerData();
  }, [fetchOwnerData]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  if (!owner) {
    return <div className="p-4 text-center text-gray-600">Owner not found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 max-w-4xl mx-auto"
    >
      <div className="bg-white shadow-xl border border-gray-100 rounded-xl overflow-hidden">
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center mb-0">
            <FaUserCircle className="mr-2 text-indigo-600" /> Profile
          </h4>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center mb-6 md:space-x-8">
            {/* Left: Avatar */}
            <div className="w-full md:w-1/4 text-center mb-4 md:mb-0">
              <ProfileAvatar username={owner.full_name} />
              <h5 className="mt-3 text-xl font-semibold text-gray-900">{owner.full_name}</h5>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium uppercase text-white bg-indigo-500">
                Pet Owner
              </span>
            </div>

            {/* Right side info */}
            <div className="w-full md:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-500 flex items-center">
                    <FaUserTag className="mr-2 text-gray-400" />
                    Owner ID
                  </p>
                  <p className="font-bold text-lg text-gray-900">{owner.id}</p>
                </div>

                <div>
                  <p className="mb-1 text-sm font-medium text-gray-500 flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-400" />
                    Verified At
                  </p>
                  <p className="font-bold text-lg text-gray-900">
                    {owner.verified_at ? new Date(owner.verified_at).toLocaleDateString() : "Not verified"}
                  </p>
                </div>
              </div>

              {/* Pets List */}
              <div>
                <h5 className="text-lg font-semibold text-gray-800 mb-3">My Pets</h5>
                {pets.length === 0 ? (
                  <p className="text-gray-600">No pets found.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {pets.map((pet) => (
                      <div key={pet.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                        <h6 className="font-semibold text-lg mb-1">{pet.pet_name}</h6>
                        <p className="text-gray-500 mb-1">
                          <strong>Type:</strong> {pet.pet_type || "Unknown"}
                        </p>
                        <p className="text-gray-500">
                          <strong>Microchip:</strong> {pet.microchip_number || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
