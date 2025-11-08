
// app/(panels)/admin/layout.tsx
import React from 'react';

// 🛑 IMPORT BOOTSTRAP HERE! 🛑
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import ClientInit from './components/ClientInit';
import SwipeWrapper from './components/SwipeWrapper';
import { AnimatePresence } from 'framer-motion';

// Note: Do NOT import globals.css here

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      {/* HEADER (always visible) */}
      <ClientInit />
      <Header />

      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* SIDEBAR (scrollable, fixed width) */}
        <aside
          className="d-none d-md-flex flex-column bg-white border-end overflow-auto"
          style={{ width: '250px' }}
        >
          <Sidebar />
        </aside>

        {/* MAIN CONTENT (scrollable area) */}
        <main className="flex-grow-1 p-3 overflow-auto mb-5" style={{ height: 'calc(100vh - 56px)' }}>
            <AnimatePresence mode="wait">
              <SwipeWrapper>{children}</SwipeWrapper>
            </AnimatePresence>
        </main>
      </div>

      {/* MOBILE NAV (bottom fixed) */}
      <MobileNav />
    </div>
  );
}
