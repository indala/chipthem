"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRolesStore } from "@/store/rolesStore";

import { FaUserCircle, FaUserTag, FaCalendarAlt } from "react-icons/fa";

type UserRole = "admin" | "veterinary" | "petOwner" | "guest";

// Generate color from string (consistent for same username)
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 55%)`;
}

// Component to generate WhatsApp-style local avatar
const ProfileAvatar = ({ username }: { username: string }) => {
  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2); // Max 2 letters like WA

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

export default function ProfilePage() {
  const { user } = useRolesStore();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <FaUserCircle size={80} className="text-gray-500 mb-3" />
        <h4 className="text-xl font-semibold">No user logged in</h4>
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  const roleColors: Record<UserRole, string> = {
    admin: "bg-red-500",
    veterinary: "bg-green-500",
    petOwner: "bg-indigo-500",
    guest: "bg-gray-500",
  };

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
              <ProfileAvatar username={user.username} />

              <h5 className="mt-3 text-xl font-semibold text-gray-900">
                {user.username}
              </h5>

              <span
                className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium uppercase text-white ${roleColors[user.role as UserRole]}`}
              >
                {user.role}
              </span>
            </div>

            {/* Right side info */}
            <div className="w-full md:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-500 flex items-center">
                    <FaUserTag className="mr-2 text-gray-400" />
                    User ID
                  </p>
                  <p className="font-bold text-lg text-gray-900">{user.id}</p>
                </div>

                <div>
                  <p className="mb-1 text-sm font-medium text-gray-500 flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-400" />
                    Joined
                  </p>
                  <p className="font-bold text-lg text-gray-900">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
