"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useUsersStore, User, TabType } from "@/store/useUsersStore";
import { Pet } from "@/types/owners";
import { VeterinaryClinic } from "@/types/veterinaries"; 
import Modal from "../../components/Modal"; 
import { toast } from "sonner"; 
import { useSearchParams } from "next/navigation";


// Helper component for loading spinner
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function UsersPage() {
  const {
    users,
    fetchOwners,
    fetchVeterinaries,
    loading,
    actionStatus, 
    deletePet,
    updatePet,
    updateUserEmail,
    deleteClinic, 
    updateClinic, 
    error,
    hasMore,
    resetUsers,
    page,
  } = useUsersStore(); 
  const searchParams=useSearchParams();

  const urlTab = searchParams.get("tab");

  


  const [activeTab, setActiveTab] = useState<TabType>(urlTab === "veterinaries" ? "veterinaries" : "owners");
  const [search, setSearch] = useState("");
  const [selectedOwnerPets, setSelectedOwnerPets] = useState<Pet[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [clinicModalOpen, setClinicModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<User | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // ✅ Reusable type guards
  const isOwner = (user: User): user is Extract<User, { type: 'owners' }> => 
    user.type === 'owners';

  const isVeterinary = (user: User): user is Extract<User, { type: 'veterinaries' }> => 
    user.type === 'veterinaries';

  // Utility to get the action loading state
  const isActionLoading = (type: keyof typeof actionStatus, id: string) => {
    return actionStatus[type]?.[id]?.loading || false;
  };
  
  const loadUsers = useCallback((pageToFetch: number, currentSearch: string) => {
    if (activeTab === "owners") {
      fetchOwners(pageToFetch, currentSearch);
    } else {
      fetchVeterinaries(pageToFetch, currentSearch);
    }
  }, [activeTab, fetchOwners, fetchVeterinaries]);

  // Show Global (Fetch) Zustand errors
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

 useEffect(() => {
  // whenever tab or search changes, reset and fetch first page
  resetUsers();
  loadUsers(1, search);
}, [activeTab, search, resetUsers, loadUsers]);


  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loading || users.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadUsers(page + 1, search);
        }
      },
      { threshold: 0.8 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, loading, page, loadUsers, search, users.length]);

  // Owners' Pets Modal
  const openPetsModal = (pets: Pet[]) => {
    setSelectedOwnerPets(pets);
    setModalOpen(true);
  };

  // Clinic Modal Handler
  const openClinicModal = (clinic: User) => {
    setSelectedClinic(clinic);
    setClinicModalOpen(true);
  };

  const handleDeletePet = async (petId: string) => {
  if (confirm("Are you sure you want to delete this pet? This cannot be undone.")) {
    try {
      await deletePet(petId);
      toast.success("Pet deleted successfully.");

      // Find owner that had this pet
      const maybeOwner = users.find(
        (u) => isOwner(u) && u.pets?.some((p) => p.id === petId)
      );

      if (maybeOwner && isOwner(maybeOwner) && maybeOwner.pets && maybeOwner.pets.length <= 1) {
        // Owner is now deleted in DB → refresh owners list
        resetUsers();
        loadUsers(1, search); // reload first page for current tab/search
        setModalOpen(false);
      } else {
        // Just update pets list in modal
        setSelectedOwnerPets((prev) =>
          prev ? prev.filter((p) => p.id !== petId) : null
        );
      }
    } catch (e) {
      toast.error(`Failed to delete pet: ${(e as Error).message}`);
    }
  }
};



  // ✅ FIXED: handleDeleteUser with type guard
  const handleDeleteUser = async (user: User) => {
    const userType = activeTab === "owners" ? "Owner" : "Veterinarian";
    
    if (activeTab === "veterinaries" && isVeterinary(user)) {
      if (confirm(`Are you sure you want to delete this ${userType} (${user.name})? This cannot be undone.`)) {
        try {
          await deleteClinic(user.id);
          toast.success(`${userType} deleted successfully.`);
          setClinicModalOpen(false); 
        } catch (e) {
          toast.error(`Failed to delete ${userType}: ${(e as Error).message}`);
        }
      }
    } else {
      toast.error("Owner deletion is forbidden. Please delete pets; if the owner has only one pet, they will be removed automatically.");
    }
  };

  // ✅ FIXED: handleUpdatePet
  const handleUpdatePet = async (petId: string, updates: Partial<Pet>) => {
    try {
      await updatePet(petId, updates);
      toast.success("Pet updated successfully!");
      setSelectedOwnerPets(prev => prev ? prev.map(p => p.id === petId ? {...p, ...updates} : p) : null);
    } catch (e) {
      toast.error(`Failed to update pet: ${(e as Error).message}`);
    }
  };
  
  // ✅ FIXED: handleExtendPetSubscription
  const handleExtendPetSubscription = async (pet: Pet) => {
    const defaultExpiry = pet.subscription_expires_at ? pet.subscription_expires_at.split("T")[0] : "";
    const newExpiry = prompt(`Enter new subscription expiry for ${pet.pet_name} (YYYY-MM-DD):`, defaultExpiry);
    
    if (newExpiry) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(newExpiry)) {
        toast.error("Invalid date format. Please use YYYY-MM-DD.");
        return;
      }
      
      const updates = { 
        subscription_expires_at: new Date(newExpiry).toISOString(), 
        subscription_status: "active" 
      };

      try {
        await updatePet(pet.id, updates);
        toast.success(`Subscription extended for ${pet.pet_name}!`);
        setSelectedOwnerPets(prev => prev ? prev.map(p => p.id === pet.id ? {...p, ...updates} : p) : null);
      } catch (e) {
        toast.error(`Failed to extend subscription: ${(e as Error).message}`);
      }
    }
  };

  // ✅ FIXED: handleExtendClinicSubscription with type guard
  const handleExtendClinicSubscription = async (clinic: User) => {
    if (!isVeterinary(clinic)) {
      toast.error("This function only works for veterinary clinics.");
      return;
    }

    const userType = 'Clinic';
    const defaultExpiry = clinic.subscription_expires_at ? clinic.subscription_expires_at.split("T")[0] : "";
    const newExpiry = prompt(`Enter new subscription expiry for ${userType} ${clinic.name} (YYYY-MM-DD):`, defaultExpiry);
    
    if (newExpiry) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(newExpiry)) {
        toast.error("Invalid date format. Please use YYYY-MM-DD.");
        return;
      }

      const updates: Partial<VeterinaryClinic> = { 
        subscription_expires_at: new Date(newExpiry).toISOString(), 
        subscription_status: "active" 
      };
      
      try {
        await updateClinic(clinic.id, updates); 
        toast.success(`${userType} subscription extended successfully!`);
        setSelectedClinic(prev => prev ? {...prev, ...updates} : null); 
      } catch (e) {
        toast.error(`Failed to extend ${userType} subscription: ${(e as Error).message}`);
      }
    }
  };

  // ✅ FIXED: handleUpdateEmail
  const handleUpdateEmail = async (user: User) => {
    const newEmail = prompt(`Enter new email for ${user.name}:`, user.email);
    
    if (!newEmail || newEmail.trim() === user.email) return;
    
    if (!/\S+@\S+\.\S+/.test(newEmail.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    
    if (isActionLoading('user', user.id)) return;

    try {
      await updateUserEmail(user.id, newEmail.trim());
      toast.success("Email updated successfully!");
    } catch (e) {
      toast.error(`Failed to update email: ${(e as Error).message}`);
    }
  };



  

return (
  <div className="p-3 sm:p-6 max-w-6xl mx-auto">
    <h1 className="text-xl sm:text-2xl font-bold mb-5">Users Management</h1>

    {/* Tabs and Search */}
    <div className="flex gap-3 mb-6">
      {(["owners", "veterinaries"] as TabType[]).map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition shadow ${
            activeTab === tab
              ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {tab === "owners" ? "Pet Owners" : "Veterinaries"}
        </button>
      ))}
    </div>

    <input
      type="text"
      placeholder={`Search ${activeTab === 'owners' ? 'owners' : 'veterinaries'} by name or email...`}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="mb-6 p-3 border border-gray-300 rounded-lg w-full max-w-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
    />

    {/* ✅ PERFECTLY FIXED: Filter + Type Guards */}
    {(() => {
      const filteredUsers = activeTab === "owners" 
        ? users.filter(isOwner)
        : users.filter(isVeterinary);

      return (
        <>
          {loading && filteredUsers.length === 0 ? (
            <p className="text-base text-gray-500 p-4 bg-gray-50 rounded-lg">Loading users data, please wait...</p>
          ) : filteredUsers.length === 0 && !loading ? (
            <p className="text-base text-gray-500 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              No {activeTab === 'owners' ? 'Pet Owners' : 'Veterinaries'} found matching your search.
            </p>
          ) : (
            <>
              {/* MOBILE CARDS */}
              <div className="grid grid-cols-1 gap-4 sm:hidden">
                {filteredUsers.map((user) => {
                  const isUserUpdateLoading = isActionLoading('user', user.id);
                  const isClinicDeleteLoading = isActionLoading('clinic', user.id);
                  const isSinglePetOwner =   activeTab === "owners" &&   isOwner(user) &&   (user.pets?.length ?? 0) === 1;
               

                  return (
                    <div
                      key={user.id}
                      className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="font-bold text-base text-gray-800">{user.name}</h2>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0 ${
                            user.is_verified
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.is_verified ? "Verified" : "Unverified"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 break-all">{user.email}</p>

                      <div className="flex flex-wrap gap-2">
                        {/* View Clinic Details - SAFE for vets */}
                        {activeTab === "veterinaries" && (
                          <button
                            onClick={() => openClinicModal(user)}
                            className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700 transition"
                          >
                            View Details
                          </button>
                        )}

                        {/* ✅ FIXED: Owners' Pets with EXPLICIT type guard */}
                        {activeTab === "owners" && isOwner(user) && user.pets && user.pets.length > 0 && (
                          <button
                            onClick={() => openPetsModal(user.pets!)}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition"
                          >
                            View Pets ({user.pets.length})
                          </button>
                        )}

                        <button
                          onClick={() => handleUpdateEmail(user)}
                          disabled={isUserUpdateLoading}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition flex items-center justify-center"
                        >
                          {isUserUpdateLoading ? <Spinner /> : 'Edit Email'}
                        </button>
                        
                        <button
  onClick={() => {
    if (isSinglePetOwner) {
      const petId = user.pets![0].id;
      handleDeletePet(petId); // backend will auto‑delete owner because only one pet
    } else {
      handleDeleteUser(user); // vets / other cases
    }
  }}
  disabled={activeTab === "veterinaries" && isClinicDeleteLoading}
  className={`px-3 py-1 rounded-lg text-sm transition flex items-center justify-center ${
    activeTab === "veterinaries" && !isClinicDeleteLoading
      ? "bg-red-600 text-white hover:bg-red-700"
      : activeTab === "owners" && isSinglePetOwner
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-gray-300 text-gray-600 cursor-not-allowed"
  }`}
  title={
    activeTab === "owners"
      ? isSinglePetOwner
        ? "Delete last pet (owner will be removed automatically)."
        : "Owner has 0 or multiple pets; delete from pet dialog."
      : "Delete Veterinary"
  }
>
  {isClinicDeleteLoading ? (
    <Spinner />
  ) : activeTab === "owners" ? (
    "Delete Pet+Owner"
  ) : (
    "Delete Vet"
  )}
</button>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP TABLE */}
              <div className="hidden sm:block overflow-x-auto rounded-xl shadow-lg">
                <table className="min-w-full bg-white border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      {/* ✅ FIXED: Header with type-safe condition */}
                      {activeTab === "owners" && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pets</th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => {
                      const isUserUpdateLoading = isActionLoading('user', user.id);
                      const isClinicDeleteLoading = isActionLoading('clinic', user.id);
                      const isSinglePetOwner = activeTab === "owners" && isOwner(user) && (user.pets?.length ?? 0) === 1;

                      
                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 break-all">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                user.is_verified
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {user.is_verified ? "Verified" : "Unverified"}
                            </span>
                          </td>

                          {/* ✅ PERFECTLY FIXED: Pets column with EXPLICIT type guard */}
                          {activeTab === "owners" && isOwner(user) && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              {user.pets?.length ? (
                                <button
                                  onClick={() => openPetsModal(user.pets!)}
                                  className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition"
                                >
                                  View Pets ({user.pets.length})
                                </button>
                              ) : (
                                <span className="text-gray-500 text-sm italic">No pets</span>
                              )}
                            </td>
                          )}

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              {activeTab === "veterinaries" && (
                                <button
                                  onClick={() => openClinicModal(user)}
                                  className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700 transition"
                                >
                                  View Details
                                </button>
                              )}

                              <button
                                onClick={() => handleUpdateEmail(user)}
                                disabled={isUserUpdateLoading}
                                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition flex items-center justify-center"
                              >
                                {isUserUpdateLoading ? <Spinner /> : 'Edit Email'}
                              </button>
                              
                              <button
  onClick={() => {
    if (isSinglePetOwner) {
      const petId = user.pets![0].id;
      handleDeletePet(petId);
    } else {
      handleDeleteUser(user);
    }
  }}
  disabled={activeTab === "veterinaries" && isClinicDeleteLoading}
  className={`px-3 py-1 rounded-lg text-sm transition flex items-center justify-center ${
    activeTab === "veterinaries" && !isClinicDeleteLoading
      ? "bg-red-600 text-white hover:bg-red-700"
      : activeTab === "owners" && isSinglePetOwner
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-gray-300 text-gray-600 cursor-not-allowed"
  }`}
  title={
    activeTab === "owners"
      ? isSinglePetOwner
        ? "Delete last pet (owner will be removed automatically)."
        : "Owner has 0 or multiple pets; delete from pet dialog."
      : "Delete Veterinary"
  }
>
  {isClinicDeleteLoading ? (
    <Spinner />
  ) : activeTab === "owners" ? (
    "Delete Pet+Owner"
  ) : (
    "Delete"
  )}
</button>

                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div ref={loadMoreRef} className="h-12 flex justify-center items-center">
                {hasMore && loading && (
                  <p className="text-center text-gray-500 py-2 text-sm">Loading more users...</p>
                )}
                {!hasMore && filteredUsers.length > 0 && (
                  <p className="text-center text-gray-500 py-2 text-sm">You have reached the end of the list.</p>
                )}
              </div>
            </>
          )}
        </>
      );
    })()}

    {modalOpen && selectedOwnerPets && (
 <Modal onClose={() => setModalOpen(false)} title="Owner Details">
    {/* Owner details from users + fallback to pet.owner */}
    {(() => {
      const firstPet = selectedOwnerPets[0];

      // find the owner user first
      const userOwner = users.find(
  (u): u is Extract<User, { type: "owners" }> =>
    isOwner(u) && Array.isArray(u.pets) && u.pets.some((p: Pet) => p.id === firstPet?.id)
);



      // optional nested owner on pet
      const petOwner = firstPet?.owner;

      const ownerName =
        userOwner?.name ??
        petOwner?.full_name ??
        "Owner";

      const ownerCity =
        userOwner?.city ?? petOwner?.city;
      const ownerCountry =
        userOwner?.country ?? petOwner?.country;

      const ownerEmail =
        userOwner?.email ?? petOwner?.email;
      const ownerPhone =
              userOwner?.phone_number ?? petOwner?.phone_number;


      return (
        <div className="mb-4 border border-gray-200 bg-slate-50 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Pets of {ownerName}
              </h2>
              {(ownerCity || ownerCountry) && (
                <p className="text-sm text-gray-600">
                  {ownerCity || "—"}
                  {ownerCountry ? `, ${ownerCountry}` : ""}
                </p>
              )}
              {userOwner?.is_verified !== undefined && (
                <p className="mt-1 inline-flex items-center gap-1 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold ${
                      userOwner.is_verified
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {userOwner.is_verified
                      ? "Verified owner"
                      : "Unverified owner"}
                  </span>
                </p>
              )}
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              {ownerEmail && (
                <p>
                  <span className="font-medium">Email:</span> {ownerEmail}
                </p>
              )}
              {ownerPhone && (
                <p>
                  <span className="font-medium">Phone:</span> {ownerPhone}
                </p>
              )}
              {petOwner?.street_address && (
                <p className="text-xs text-gray-500">
                  {petOwner.street_address}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    })()}

    {/* Pets list (existing) */}
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {selectedOwnerPets.map((pet) => {
        const isPetUpdateLoading = isActionLoading("pet", pet.id);
        const isPetDeleteLoading = isActionLoading("pet", pet.id);



        return (
          <div
            key={pet.id}
            className="border border-gray-200 bg-white rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {pet.pet_name} ({pet.pet_type})
                </p>
                <p className="text-xs text-gray-500">Pet ID: {pet.id}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                  pet.is_verified
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {pet.is_verified ? "Verified" : "Unverified"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
              <p>
                <strong>Type:</strong> {pet.pet_type || "N/A"}
              </p>
              <p>
                <strong>Breed:</strong> {pet.breed || "N/A"}
              </p>
              <p>
                <strong>Sex:</strong> {pet.sex || "N/A"}
              </p>
              <p>
                <strong>Chip:</strong> {pet.microchip_number || "N/A"}
              </p>
              <p>
                <strong>Subscription:</strong> {pet.subscription_status || "N/A"}
              </p>
              <p>
                <strong>Subscription Expires:</strong>{" "}
                {pet.subscription_expires_at
                  ? new Date(
                      pet.subscription_expires_at
                    ).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div className="flex gap-2 mt-4 flex-wrap">
              <button
                onClick={() => {
                  const newChip = prompt(
                    `Enter new microchip number for ${pet.pet_name}:`,
                    pet.microchip_number || ""
                  );
                  if (newChip !== null) {
                    handleUpdatePet(pet.id, { microchip_number: newChip });
                  }
                }}
                disabled={isPetUpdateLoading}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition flex items-center justify-center"
              >
                {isPetUpdateLoading ? <Spinner /> : "Edit Chip"}
              </button>

              <button
                onClick={() => handleExtendPetSubscription(pet)}
                disabled={isPetUpdateLoading}
                className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700 transition flex items-center justify-center"
              >
                {isPetUpdateLoading ? <Spinner /> : "Extend Sub"}
              </button>

              <button
                onClick={() => handleDeletePet(pet.id)}
                disabled={isPetDeleteLoading}
                className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition flex items-center justify-center"
              >
                {isPetDeleteLoading ? <Spinner /> : "Delete Pet"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </Modal>
)}


    {/* CLINIC MODAL */}
    {clinicModalOpen && selectedClinic && isVeterinary(selectedClinic) && (
      <Modal onClose={() => setClinicModalOpen(false)} title="Veterinary Clinic Details">
 

  {(() => {
    const isClinicSubLoading = isActionLoading("clinic", selectedClinic.id);

    return (
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg max-h-[70vh] overflow-y-auto text-sm text-gray-800">
        {/* Basic info */}
        <p>
          <strong>Clinic Name:</strong>{" "}
          <span className="text-gray-700">
            {/* name is normalized in the store, clinic_name is DB field */}
            {selectedClinic.name || selectedClinic.clinic_name || "-"}
          </span>
        </p>
        <p>
          <strong>Contact Person:</strong>{" "}
          <span className="text-gray-700">
            {selectedClinic.contact_person || "-"}
          </span>
        </p>
        <p>
          <strong>Phone:</strong>{" "}
          <span className="text-gray-700">
            {selectedClinic.phone || "-"}
          </span>
        </p>
        {selectedClinic.alt_phone && (
          <p>
            <strong>Alt. Phone:</strong>{" "}
            <span className="text-gray-700">
              {selectedClinic.alt_phone}
            </span>
          </p>
        )}
        {selectedClinic.website && (
          <p>
            <strong>Website:</strong>{" "}
            <a
              href={selectedClinic.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline break-all"
            >
              {selectedClinic.website}
            </a>
          </p>
        )}
        {typeof selectedClinic.years_in_practice === "number" && (
          <p>
            <strong>Years in Practice:</strong>{" "}
            <span className="text-gray-700">
              {selectedClinic.years_in_practice}
            </span>
          </p>
        )}

        {/* Location */}
        <hr className="my-2" />
        <p className="font-semibold text-gray-900">Location</p>
        <p>
          <strong>Address:</strong>{" "}
          <span className="text-gray-700">
            {selectedClinic.street_address || "-"}
          </span>
        </p>
        <p>
          <strong>City:</strong>{" "}
          <span className="text-gray-700">
            {selectedClinic.city || "-"}
          </span>
        </p>
        <p>
          <strong>State / Province:</strong>{" "}
          <span className="text-gray-700">
            {selectedClinic.state_province || "-"}
          </span>
        </p>
        <p>
          <strong>Postal Code:</strong>{" "}
          <span className="text-gray-700">
            {selectedClinic.postal_code || "-"}
          </span>
        </p>
        <p>
          <strong>Country:</strong>{" "}
          <span className="text-gray-700">
            {selectedClinic.country || "-"}
          </span>
        </p>
        {selectedClinic.google_maps_url && (
          <p>
            <strong>Maps:</strong>{" "}
            <a
              href={selectedClinic.google_maps_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline break-all"
            >
              Open in Google Maps
            </a>
          </p>
        )}

        {/* Services */}
        <hr className="my-2" />
        <p className="font-semibold text-gray-900">Services</p>
        <p>
          <strong>Microchip Services:</strong>{" "}
          <span className="text-gray-700">
            {selectedClinic.microchip_services ? "Yes" : "No"}
          </span>
        </p>
        <p>
          <strong>Has Scanners:</strong>{" "}
          <span className="text-gray-700">
            {selectedClinic.has_microchip_scanners ? "Yes" : "No"}
          </span>
        </p>
        {selectedClinic.scanner_types && (
          <p>
            <strong>Scanner Types:</strong>{" "}
            <span className="text-gray-700">
              {Array.isArray(selectedClinic.scanner_types)
                ? selectedClinic.scanner_types.join(", ")
                : selectedClinic.scanner_types}
            </span>
          </p>
        )}
        {selectedClinic.specializations && (
          <p>
            <strong>Specializations:</strong>{" "}
            <span className="text-gray-700">
              {Array.isArray(selectedClinic.specializations)
                ? selectedClinic.specializations.join(", ")
                : selectedClinic.specializations}
            </span>
          </p>
        )}
        {selectedClinic.additional_services && (
          <p>
            <strong>Additional Services:</strong>{" "}
            <span className="text-gray-700">
              {Array.isArray(selectedClinic.additional_services)
                ? selectedClinic.additional_services.join(", ")
                : selectedClinic.additional_services}
            </span>
          </p>
        )}
        <p>
          <strong>Operating Hours:</strong>{" "}
          <span className="text-gray-700 whitespace-pre-line">
            {selectedClinic.operating_hours || "-"}
          </span>
        </p>
        <p>
          <strong>24h Emergency:</strong>{" "}
          <span className="text-gray-700">
            {selectedClinic.provides_24h_emergency ? "Yes" : "No"}
          </span>
        </p>

        {/* Subscription */}
        <hr className="my-2" />
        <p className="font-semibold text-gray-900">Subscription</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="text-gray-700 uppercase font-medium">
            {selectedClinic.subscription_status || "None"}
          </span>
        </p>
        <p className="mb-2">
          <strong>Valid Till:</strong>{" "}
          <span className="text-gray-700">
            {selectedClinic.subscription_expires_at
              ? new Date(
                  selectedClinic.subscription_expires_at
                ).toLocaleDateString()
              : "-"}
          </span>
        </p>

        <div className="flex justify-start">
          <button
            onClick={() => handleExtendClinicSubscription(selectedClinic)}
            disabled={isClinicSubLoading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition flex items-center justify-center disabled:opacity-60"
          >
            {isClinicSubLoading ? <Spinner /> : "Extend Subscription"}
          </button>
        </div>
      </div>
    );
  })()}
</Modal>

    )}
  </div>
);

}