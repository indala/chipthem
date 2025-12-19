// app/(panels)/components/navigationData.ts
import React from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  PawPrint,
  Home,
  FileBarChart,
  AlertTriangle,
  CheckCircle2,
  User,
  ClipboardList,
  Building2,
} from "lucide-react";
import type { UserRole } from "@/types/types";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};


export const getNavItemsByRole = (role: UserRole): NavItem[] => {
  switch (role) {
    // 🧑‍💼 ADMIN PANEL NAVIGATION
    case "admin":
      return [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/manage-users", label: "Manage Users", icon: Users },
        { href: "/admin/analytics", label: "Analytics & Reports", icon: FileBarChart },
        {
          href: "/admin/verifications/petOwner",
          label: "Owner & Pet Verifications",
          icon: ClipboardList,
        },
        {
          href: "/admin/verifications/veterinary",
          label: "Veterinary Verification",
          icon: CheckCircle2,
        },
        {
          href: "/admin/lost-found",
          label: "Lost & Found Reports",
          icon: AlertTriangle,
        },
      ];

    // 🧑‍⚕️ VETERINARY PANEL NAVIGATION (FINAL)
    case "veterinary":
      return [
        { href: "/veterinary/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/veterinary/my-clinic", label: "My Clinic", icon: Building2 },
        { href: "/veterinary/profile", label: "Profile", icon: User },
        { href: "/veterinary/settings", label: "Settings", icon: Settings },
      ];

    // 🐾 PET OWNER PANEL NAVIGATION
    case "petOwner":
      return [
        { href: "/petOwner/dashboard", label: "My Dashboard", icon: LayoutDashboard },
        { href: "/petOwner/my-pets", label: "My Pets", icon: PawPrint },
        { href: "/petOwner/profile", label: "Profile", icon: User },
        { href: "/petOwner/settings", label: "Settings", icon: Settings },
      ];

    // 🌍 DEFAULT PUBLIC
    default:
      return [{ href: "/", label: "Home", icon: Home }];
  }
};
