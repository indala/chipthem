// src/hooks/useInitializeUser.ts
"use client";
import { useEffect } from "react";
import { useRolesStore } from "@/store/rolesStore";

export function useInitializeUser() {
  const { setUser } = useRolesStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("User fetch failed:", err);
      }
    };

    fetchUser();
  }, [setUser]);
}
