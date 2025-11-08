"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { getNavItemsByRole } from "./NavigationData";
import { useRolesStore } from "@/store/rolesStore";

const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useRolesStore();
  const role = user?.role || "guest";
  const navItems = getNavItemsByRole(role);

  return (
    <motion.nav
      className="d-md-none fixed-bottom bg-light border-top shadow-sm d-flex justify-content-around align-items-center py-2 px-2 overflow-auto gap-4"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        zIndex: 1050,
        height: 70,
        WebkitOverflowScrolling: "touch",
        msOverflowStyle: "none", // IE and Edge
        scrollbarWidth: "none", // Firefox
        overflowX: "hidden",
        overflowY: "auto",

        
      }}
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <motion.div
            key={href}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            className="text-center"
          >
            <Link
              href={href}
              className={`d-flex flex-column  align-items-center text-decoration-none ${
                isActive ? "text-primary" : "text-secondary"
              }`}
              style={{ fontSize: "0.8rem" }}
            >
              <Icon size={20} className="mb-1" />
              <span>{label.split(" ")[0]}</span>
            </Link>
          </motion.div>
        );
      })}
      
    </motion.nav>
    
  );
  
};


export default MobileNav;
