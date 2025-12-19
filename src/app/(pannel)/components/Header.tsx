"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FiLogOut, FiSettings, FiUser, FiHome } from "react-icons/fi";
import Link from "next/link";
import { useRolesStore } from "@/store/rolesStore";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, clearUser } = useRolesStore();
  const router = useRouter();

  const username = user?.username ?? "User";
  const role = user?.role ?? "admin";

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = useCallback(async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    clearUser();

    // Redirect based on role
    let loginRoute = "/alogin"; // default
    if (role === "petOwner") loginRoute = "/pologin";
    else if (role === "veterinary") loginRoute = "/vlogin";

    router.push(loginRoute);
  }, [clearUser, router, role]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-800 text-white py-3 border-b border-gray-700 shadow-xl z-50 relative">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* LEFT - Home + Panel */}
        <div className="flex items-center space-x-4">
          <Link 
            href={`/`}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex items-center"
          >
            <FiHome className="text-xl text-yellow-400" />
          </Link>
          <div className="flex items-center font-bold text-lg uppercase">
            <FiSettings className="mr-2 text-yellow-400" /> 
            {role} Panel
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition"
          >
            <FiUser /> {username}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg overflow-hidden dropdown-fade">
              <Link
                href={`/${role}/profile`}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                <FiUser className="text-indigo-600" />
                Profile
              </Link>

              <div className="border-t my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                <FiLogOut />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        .dropdown-fade {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}
