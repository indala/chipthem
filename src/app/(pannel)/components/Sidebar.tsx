"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Nav } from "react-bootstrap";
import { motion } from "framer-motion";
import { getNavItemsByRole } from "./NavigationData";
import { useRolesStore } from "@/store/rolesStore";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useRolesStore();
  const role = user?.role || "guest";

  const navItems = getNavItemsByRole(role) || [];

  return (
    <motion.div
      className="bg-light text-dark  p-3 d-flex flex-column shadow-sm"
      style={{ width: 240 }}
      initial={{ x: -240, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >


      <Nav className="flex-column">
        {navItems.length > 0 ? (
          navItems.map(({ href, label, icon: Icon }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Nav.Item className="mb-2">
                <Link
                  href={href}
                  className={`d-flex align-items-center p-2 rounded text-decoration-none text-dark ${
                    pathname === href ? "bg-secondary text-white" : ""
                  }`}
                >
                  {Icon && (
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="me-2"
                    >
                      <Icon size={18} />
                    </motion.div>
                  )}
                  <motion.span whileHover={{ x: 4 }}>{label}</motion.span>
                </Link>
              </Nav.Item>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-muted mt-4">
            No navigation available
          </div>
        )}
      </Nav>
    </motion.div>
  );
};

export default Sidebar;
