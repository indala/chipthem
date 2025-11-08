"use client";

import { useInitializeUser } from "@/hooks/useInitializeUser";

export default function ClientInit() {
  useInitializeUser();
  return null;
}
