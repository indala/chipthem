// app/(panels)/components/navigationData.ts
import React from "react";
import {
  LayoutDashboard,
  Users,
  //Settings,
  //PawPrint,
  //CalendarDays,
 // Search,
  Home,
  //FileBarChart,
  AlertTriangle,
  CheckCircle2,
 // MapPin,
 // User,
  ClipboardList,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

export const getNavItemsByRole = (role: string): NavItem[] => {
  switch (role) {
    // 🧑‍💼 ADMIN PANEL NAVIGATION
    case "admin":
      return [
       // { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
       { href: "/admin/manage-users", label: "Manage Users", icon: Users },
      //  { href: "/admin/manage-pets", label: "Manage Pets", icon: PawPrint },
       // { href: "/admin/reports", label: "Analytics & Reports", icon: FileBarChart },
        { href: "/admin/verifications/petOwner", label: "Owner & Pet Verifications", icon: ClipboardList },
        { href: "/admin/verifications/veterinary", label: "Veterinary Verification", icon: CheckCircle2 },
        { href: "/admin/lost-found", label: "Lost & Found Reports", icon: AlertTriangle },

       // { href: "/admin/settings", label: "Settings", icon: Settings },
      ];

    // 🧑‍⚕️ VETERINARY PANEL NAVIGATION
    case "veterinary":
      return [
        { href: "/veterinary/dashboard", label: "Dashboard", icon: LayoutDashboard },
       // { href: "/veterinary/pets", label: "Registered Pets", icon: PawPrint },
       // { href: "/veterinary/appointments", label: "Appointments", icon: CalendarDays },
       // { href: "/veterinary/verifications", label: "Verifications", icon: CheckCircle2 },
       // { href: "/veterinary/settings", label: "Settings", icon: Settings },
      ];

    // 🐾 PET OWNER PANEL NAVIGATION
    case "petOwner":
      return [
        { href: "/petOwner/dashboard", label: "My Dashboard", icon: LayoutDashboard },
       // { href: "/petOwner/my-pets", label: "My Pets", icon: PawPrint },
       // { href: "/petOwner/lost-found", label: "Lost & Found", icon: Search },
       // { href: "/petOwner/nearby-clinics", label: "Nearby Clinics", icon: MapPin },
       // { href: "/petOwner/profile", label: "Profile", icon: User },
       // { href: "/petOwner/settings", label: "Settings", icon: Settings },
      ];

    // 🌍 DEFAULT PUBLIC
    default:
      return [{ href: "/", label: "Home", icon: Home }];
  }
};
