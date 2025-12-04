"use client";

import { useEffect, useState } from "react";
import { useUsersStore } from "@/store/useUsersStore";

type TabType = "owners" | "veterinaries";

export default function UsersPage() {
  const { petOwners, veterinaries, fetchUsers, loading } = useUsersStore();
  const [activeTab, setActiveTab] = useState<TabType>("owners");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const displayUsers = activeTab === "owners" ? petOwners : veterinaries;

  return (
    <div className="p-3 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-5">Users</h1>

      {/* ✅ Beautiful Modern Tabs */}
      <div className="flex gap-3 mb-6">
        {(["owners", "veterinaries"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition shadow ${
              activeTab === tab
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab === "owners" ? "Pet Owners" : "Veterinaries"}
          </button>
        ))}
      </div>

      {/* Loading & Empty States */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading users...</p>
      ) : displayUsers.length === 0 ? (
        <p className="text-sm text-gray-500">No users found.</p>
      ) : (
        <>
          {/* ✅✅ MOBILE VIEW – BEAUTIFUL CARDS */}
          <div className="grid grid-cols-1 gap-4 sm:hidden">
            {displayUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-2xl p-4 shadow-md border"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-base">
                    {user.name || "Unnamed User"}
                  </h2>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      user.is_verified
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.is_verified ? "Verified" : "Unverified"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 break-all">
                  {user.email || "No email"}
                </p>
              </div>
            ))}
          </div>

          {/* ✅✅ DESKTOP VIEW – CLEAN TABLE */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full bg-white border rounded-xl overflow-hidden shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left border-b">Name</th>
                  <th className="px-4 py-3 text-left border-b">Email</th>
                  <th className="px-4 py-3 text-left border-b">Status</th>
                </tr>
              </thead>

              <tbody>
                {displayUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 border-b">
                      {user.name || "Unnamed User"}
                    </td>

                    <td className="px-4 py-3 border-b">
                      {user.email || "No email"}
                    </td>

                    <td className="px-4 py-3 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user.is_verified
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.is_verified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
