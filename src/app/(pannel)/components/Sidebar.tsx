'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
// Removed: Nav import from "react-bootstrap"
import { motion } from 'framer-motion';
import { getNavItemsByRole } from './NavigationData';
import { useRolesStore } from '@/store/rolesStore';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useRolesStore();
  const role = user?.role || 'guest';

  const navItems = getNavItemsByRole(role) || [];

  return (
    <motion.div
      // Replaced Bootstrap classes with Tailwind:
      // bg-light text-dark p-3 d-flex flex-column shadow-sm
      // width: 240px -> w-60 (Tailwind's utility for 240px)
      className="bg-gray-50 text-gray-800 p-4 flex flex-col shadow-md w-60 min-h-screen"
      initial={{ x: -240, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Replaced <Nav className="flex-column"> */}
      <div className="flex flex-col space-y-2">
        {navItems.length > 0 ? (
          navItems.map(({ href, label, icon: Icon }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              {/* Replaced <Nav.Item className="mb-2"> */}
              <div className="mb-1">
                <Link
                  href={href}
                  // Replaced Bootstrap classes with Tailwind:
                  // d-flex align-items-center p-2 rounded text-decoration-none text-dark
                  // bg-secondary text-white
                  className={`flex items-center p-3 rounded-lg no-underline transition-colors duration-200 ${
                    pathname === href
                      ? 'bg-indigo-600 text-white shadow-md' // Active state (Primary color)
                      : 'text-gray-700 hover:bg-gray-200' // Inactive state
                  }`}
                >
                  {Icon && (
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="mr-3 flex-shrink-0"
                    >
                      <Icon size={18} />
                    </motion.div>
                  )}
                  {/* Preserved framer-motion span */}
                  <motion.span whileHover={{ x: 4 }} className="font-medium text-sm">
                    {label}
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4 text-sm">No navigation available</div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;