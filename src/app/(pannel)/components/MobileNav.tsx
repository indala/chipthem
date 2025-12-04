'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { getNavItemsByRole } from './NavigationData';
import { useRolesStore } from '@/store/rolesStore';

const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useRolesStore();
  const role = user?.role || 'guest';
  const navItems = getNavItemsByRole(role);

  return (
    <motion.nav
      // Replaced Bootstrap classes with Tailwind:
      // d-md-none -> hidden md:flex (or just hidden md:flex/block depending on your default container)
      // fixed-bottom -> fixed bottom-0
      // bg-light -> bg-white (or bg-gray-50)
      // border-top -> border-t border-gray-200
      // shadow-sm -> shadow-lg
      // d-flex justify-content-around align-items-center -> flex justify-around items-center
      // py-2 px-2 overflow-auto gap-4 -> py-3 px-4 space-x-4
      
      // The `md:hidden` ensures it only appears on mobile screens
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-xl flex justify-around items-center py-3 px-2 overflow-x-auto md:hidden"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        zIndex: 1050,
        height: 70,
        // Removed non-standard CSS for scrolling, relying on Tailwind's overflow-x-auto
      }}
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <motion.div
            key={href}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            className="flex-shrink-0 text-center"
          >
            <Link
              href={href}
              // Replaced Bootstrap classes with Tailwind:
              // d-flex flex-column align-items-center -> flex flex-col items-center
              // text-decoration-none -> no-underline (not strictly needed since Link often resets this)
              // text-primary / text-secondary -> Conditional text colors
              className={`flex flex-col items-center text-sm font-medium transition-colors duration-150 ${
                isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={24} className="mb-0.5" /> {/* Increased icon size for mobile touch target */}
              <span className="text-xs">{label.split(' ')[0]}</span>
            </Link>
          </motion.div>
        );
      })}
    </motion.nav>
  );
};

export default MobileNav;