"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Owner } from "@/types/owners";
import {
  FaPaw,
  FaCheckCircle,
  FaClock,
  FaUserEdit,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { useOwnerStore } from "@/store/useOwnerStore";
import { Pet } from "@/types/owners";

/* ================= OWNER DASHBOARD ================= */
export default function OwnerDashboard() {
  const { owner, pets, isLoading, error, fetchOwnerData } = useOwnerStore();

  useEffect(() => {
    if (!owner) fetchOwnerData();
  }, [owner, fetchOwnerData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-500 font-medium">
        Loading your dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-medium">
        {error}
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No owner data found.
      </div>
    );
  }

  const totalPets = pets.length;
  const verifiedPets = pets.filter((p) => p.is_verified).length;
  const pendingPets = totalPets - verifiedPets;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 space-y-10">

        {/* ================= HERO ================= */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-10 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),transparent_60%)]" />

          <div className="relative">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-pink-200 drop-shadow-[0_5px_15px_rgba(0,0,0,0.35)]">
              Welcome back, {owner.full_name.split(" ")[0]} 👋
            </h1>

            <p className="mt-3 text-indigo-100 max-w-xl">
              Your pet ownership overview, verification status & subscriptions.
            </p>
          </div>
        </motion.div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            icon={<FaPaw />}
            label="Total Pets"
            value={totalPets}
            valueColor="text-indigo-600"
            gradient="bg-gradient-to-br from-indigo-500 to-blue-500"
          />
          <StatCard
            icon={<FaCheckCircle />}
            label="Verified"
            value={verifiedPets}
            valueColor="text-emerald-600"
            gradient="bg-gradient-to-br from-emerald-500 to-green-500"
          />
          <StatCard
            icon={<FaClock />}
            label="Pending"
            value={pendingPets}
            valueColor="text-orange-500"
            gradient="bg-gradient-to-br from-orange-400 to-pink-500"
          />
        </div>

        {/* ================= QUICK ACTION ================= */}
        <Link
          href="/petOwner/profile"
          className="group flex items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 text-white shadow-xl transition hover:scale-[1.02]"
        >
          <span className="text-lg font-semibold tracking-wide">
            Edit Profile
          </span>
          <FaUserEdit className="text-xl transition group-hover:scale-110" />
        </Link>

        {/* ================= CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <OwnerProfile owner={owner} />
          <div className="lg:col-span-2">
            <PetList pets={pets} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({
  icon,
  label,
  value,
  gradient,
  valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  gradient: string;
  valueColor: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 p-6 shadow-xl"
    >
      <div className={`inline-flex rounded-xl p-3 text-white shadow-lg ${gradient}`}>
        {icon}
      </div>

      <h3 className={`mt-4 text-4xl font-extrabold ${valueColor}`}>
        {value}
      </h3>

      <p className="text-gray-600 font-medium">{label}</p>
    </motion.div>
  );
}

/* ================= OWNER PROFILE ================= */
function OwnerProfile({ owner }: { owner: Owner }) {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-xl border border-white/40">
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
        Owner Profile
      </h2>

      <div className="space-y-4 text-sm">
        <ProfileRow icon={<FaEnvelope />} label="Email" value={owner.email} />
        <ProfileRow icon={<FaPhone />} label="Phone" value={owner.phone_number || "—"} />
        <ProfileRow
          icon={<FaMapMarkerAlt />}
          label="Address"
          value={`${owner.city || ""} ${owner.country || ""}`.trim() || "—"}
        />
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3">
        <span className="text-sm font-medium text-gray-600">
          Verification Status
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            owner.is_verified
              ? "bg-green-100 text-green-700 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
              : "bg-orange-100 text-orange-700 shadow-[0_0_10px_rgba(251,146,60,0.4)]"
          }`}
        >
          {owner.is_verified ? "Verified" : "Pending"}
        </span>
      </div>
    </div>
  );
}

function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-indigo-500">{icon}</div>
      <div>
        <p className="text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

/* ================= PET LIST ================= */
function PetList({ pets }: { pets: Pet[] }) {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-xl border border-white/40">
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-6">
        My Pets
      </h2>

      {pets.length === 0 && (
        <p className="text-center text-gray-500">
          No pets registered yet.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pets.map((pet) => (
          <motion.div
            key={pet.id}
            whileHover={{ scale: 1.03 }}
            className="rounded-xl bg-white/80 backdrop-blur-lg border border-white/40 p-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-indigo-700">
                {pet.pet_name}
              </h3>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  pet.subscription_status === "active"
                    ? "bg-green-100 text-green-700"
                    : pet.subscription_status === "expired"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {pet.subscription_status || "none"}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-600">
              Type: <span className="text-gray-800">{pet.pet_type}</span>
            </p>
            <p className="text-sm text-gray-600">
              Breed: <span className="text-gray-800">{pet.breed}</span>
            </p>
            <p className="text-sm text-gray-600">
              Microchip: <span className="text-gray-800">{pet.microchip_number}</span>
            </p>

            <div className="mt-3 text-xs font-semibold">
              <span
                className={
                  pet.is_verified
                    ? "text-green-600"
                    : "text-orange-500"
                }
              >
                {pet.is_verified ? "Verified" : "Pending Verification"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
