// app/(panels)/admin/layout.tsx

// ❌ Removed: import 'bootstrap/dist/css/bootstrap.min.css'; ❌

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import ClientInit from './components/ClientInit';
import SwipeWrapper from './components/SwipeWrapper';
import { AnimatePresence } from 'framer-motion';

// Define the sidebar width (240px, consistent with the Sidebar component conversion)
const SIDEBAR_WIDTH = '240px'; 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Replaced: d-flex flex-column vh-100 bg-light
    <div className="flex flex-col h-screen bg-gray-100">
      
      {/* HEADER (always visible) */}
      <ClientInit />
      <Header /> {/* Note: Header is fixed, see previous conversion */}

      {/* Main Layout Area: Sidebar and Content */}
      {/* Replaced: d-flex flex-grow-1 overflow-hidden */}
      <div className="flex flex-grow overflow-hidden pt-12 md:pt-0"> {/* Added pt-12 to account for fixed Header height on mobile */}

        {/* SIDEBAR (scrollable, fixed width) */}
        <aside
          // Replaced: d-none d-md-flex flex-column bg-white border-end overflow-auto
          className="hidden md:flex flex-col bg-white border-r border-gray-200 overflow-y-auto overflow-x-hidden flex-shrink-0"
          style={{ width: SIDEBAR_WIDTH }} // Set fixed width
        >
          <Sidebar />
        </aside>

        {/* MAIN CONTENT (scrollable area) */}
        {/* Replaced: flex-grow-1 p-3 overflow-auto mb-5 */}
        <main 
          className="flex-grow overflow-y-auto p-4 md:p-6 mb-14 md:pb-6" 
        >
          <AnimatePresence mode="wait">
            <SwipeWrapper>{children}</SwipeWrapper>
          </AnimatePresence>
          {/* Add padding at the bottom for the fixed MobileNav */}
          <div className="h-[70px] md:hidden" />
        </main>
      </div>

      {/* MOBILE NAV (bottom fixed) */}
      <MobileNav />
    </div>
  );
}