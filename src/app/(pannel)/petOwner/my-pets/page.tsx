"use client";

import { useEffect, useState } from "react";
import { useOwnerStore } from "@/store/useOwnerStore";
import { motion } from "framer-motion";
import { FaPaw, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import Modal from "../../components/Modal";
import type { Pet } from "@/types/owners";

export default function MyPetsPage() {
  const { pets, isLoading, error, fetchOwnerData, updatePet } = useOwnerStore();
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [form, setForm] = useState({
    pet_name: "",
    pet_type: "",
    breed: "",
    sex: "",
    primary_color: "",
  });

  useEffect(() => {
    if (!pets) fetchOwnerData();
  }, [pets, fetchOwnerData]);

  const openEdit = (pet: Pet) => {
    setEditingPet(pet);
    setForm({
      pet_name: pet.pet_name || "",
      pet_type: pet.pet_type || "",
      breed: pet.breed || "",
      sex: pet.sex || "",
      primary_color: pet.primary_color || "",
    });
  };

  const closeEdit = () => {
    setEditingPet(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPet) return;

    await updatePet(editingPet.id, {
      pet_name: form.pet_name,
      pet_type: form.pet_type,
      breed: form.breed,
      sex: form.sex,
      primary_color: form.primary_color,
    });

    closeEdit();
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-sky-50 via-slate-50 to-emerald-50">
        <div className="text-center text-slate-700 text-lg font-semibold tracking-wide">
          Loading your pets...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-rose-50 via-amber-50 to-slate-50">
        <div className="text-center px-8 py-6 rounded-3xl bg-white/95 border border-rose-200 shadow-lg">
          <p className="text-rose-600 font-semibold mb-2 text-base">
            Error loading pets: {error}
          </p>
          <p className="text-slate-600 text-sm">
            Please try again in a moment or contact support.
          </p>
        </div>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-sky-50 via-slate-50 to-emerald-50">
        <div className="max-w-md w-full mx-4 p-10 text-center bg-white/95 rounded-3xl shadow-xl border border-slate-200/80">
          <FaPaw className="text-5xl text-sky-300 mx-auto mb-4" />
          <p className="text-lg text-slate-800 font-semibold">
            You don’t have any registered pets yet.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Pets are added by the admin after verification.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] bg-gradient-to-br from-sky-50 via-slate-50 to-emerald-50">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-cyan-400 to-emerald-400 shadow-md">
            <FaPaw className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              My Pets
            </h1>
            <p className="text-sm text-slate-600 font-medium">
              All your registered and verified pets in one place.
            </p>
          </div>
        </motion.div>

        {/* Pets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {pets.map((pet, index) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative overflow-hidden rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-shadow bg-gradient-to-br from-white via-sky-50/60 to-emerald-50/60"
            >
              {/* Soft gradient accents */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-10 -right-10 h-24 w-24 bg-sky-200/60 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-24 w-24 bg-emerald-200/60 blur-3xl" />
              </div>

              <div className="relative p-5 space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {pet.pet_name}
                    </h2>
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                      {pet.pet_type} • {pet.breed} • {pet.sex}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 border border-slate-200 text-xs font-medium text-slate-700">
                    <FaPaw className="text-sky-500 text-[10px]" />
                    <span>Chip: {pet.microchip_number || "N/A"}</span>
                  </div>
                </div>

                {/* Color & status */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-100 border border-sky-200">
                      <span className="h-2 w-2 rounded-full bg-sky-500" />
                    </span>
                    <span className="font-medium">
                      Color:{" "}
                      <span className="font-semibold">
                        {pet.primary_color || "N/A"}
                      </span>
                    </span>
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      pet.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : pet.status === "pending"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {pet.status === "active" && (
                      <FaCheckCircle className="text-[10px]" />
                    )}
                    {pet.status === "pending" && (
                      <FaClock className="text-[10px]" />
                    )}
                    {pet.status !== "active" && pet.status !== "pending" && (
                      <FaTimesCircle className="text-[10px]" />
                    )}
                    <span className="capitalize">{pet.status}</span>
                  </span>
                </div>

                {/* Verification */}
                <div className="mt-1 text-sm text-slate-700 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">
                      Verification:
                    </span>
                    {pet.is_verified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 text-sm font-medium">
                        <FaCheckCircle className="text-emerald-500 text-xs" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-700 text-sm font-medium">
                        <FaClock className="text-amber-500 text-xs" />
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Verified at:{" "}
                    {pet.verified_at
                      ? new Date(pet.verified_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* Subscription */}
                <div className="mt-2 text-sm space-y-0.5">
                  <span className="font-semibold text-slate-800">
                    Subscription:
                  </span>{" "}
                  <span
                    className={`font-semibold ${
                      pet.subscription_status === "active"
                        ? "text-emerald-700"
                        : "text-rose-700"
                    }`}
                  >
                    {pet.subscription_status || "N/A"}
                  </span>
                  {pet.subscription_status === "active" && (
                    <p className="text-xs text-slate-500">
                      Expires:{" "}
                      {pet.subscription_expires_at
                        ? new Date(
                            pet.subscription_expires_at
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  )}
                </div>

                {/* Created / Updated + Edit button */}
                <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center font-medium">
                  {pet.created_at && (
                    <span>
                      Created: {new Date(pet.created_at).toLocaleDateString()}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    {pet.updated_at && (
                      <span>
                        Updated: {new Date(pet.updated_at).toLocaleDateString()}
                      </span>
                    )}
                    <button
                      onClick={() => openEdit(pet)}
                      className="ml-2 text-[11px] font-semibold px-3 py-1 rounded-full bg-sky-500 text-white shadow-sm hover:bg-sky-600 transition"
                    >
                      Edit details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {editingPet && (
        <Modal title={`Edit ${editingPet.pet_name}`} onClose={closeEdit}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Pet name
              </label>
              <input
                name="pet_name"
                value={form.pet_name}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Type
              </label>
              <input
                name="pet_type"
                value={form.pet_type}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Breed
              </label>
              <input
                name="breed"
                value={form.breed}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Sex
              </label>
              <select
                name="sex"
                value={form.sex}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/60"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Primary color
              </label>
              <input
                name="primary_color"
                value={form.primary_color}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/60"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeEdit}
                className="px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold rounded-full bg-sky-500 text-white shadow hover:bg-sky-600"
              >
                Save changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
