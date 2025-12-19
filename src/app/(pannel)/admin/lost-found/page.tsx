'use client';

import { useEffect, useState } from 'react'; // <-- Added useState
import { useReportStore } from '@/store/useReportStore';
import LostPetsGrid from '../../components/LostPetsGrid';
import FoundPetsGrid from '../../components/FoundPetsGrid';
import { useSearchParams } from "next/navigation";

// Removed: Tabs, Tab, Container imports from 'react-bootstrap'

export default function LostFoundPage() {
  const searchParams=useSearchParams();

  const urlTab = searchParams.get("tab");
  const { fetchLostReports, fetchFoundReports } = useReportStore();
  const [activeTab, setActiveTab] = useState(urlTab==='found'? 'found': 'lost'); // State to manage active tab

  useEffect(() => {
    fetchLostReports();
    fetchFoundReports();
  }, [fetchLostReports, fetchFoundReports]);

  // Function to render the correct grid based on the active tab
  const renderContent = () => {
    if (activeTab === 'lost') {
      return <LostPetsGrid />;
    }
    return <FoundPetsGrid />;
  };

  // Utility function for shared tab styling
  const getTabClasses = (key:'lost'| 'found') =>
    `px-4 py-2 text-lg font-medium cursor-pointer transition-colors duration-200 ${
      activeTab === key
        ? 'text-indigo-600 border-b-2 border-indigo-600' // Active tab styles
        : 'text-gray-500 hover:text-gray-700' // Inactive tab styles
    }`;

  return (
    // Replaced <Container fluid className="py-4"> with a Tailwind-styled div
    <div className="container mx-auto px-4 py-8 max-w-7xl"> 
      
      {/* Replaced h1 with Tailwind classes for equivalent styling */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Lost & Found Pet Reports
      </h1>
      
      {/* Replaced <Tabs> with a styled div */}
      <div className="border-b border-gray-200 mb-6">
        <div 
          id="lost-found-tabs" 
          className="flex space-x-4" // Use flex to lay out the tabs horizontally
        >
          {/* Replaced <Tab eventKey="lost" title="Lost Pets"> */}
          <button
            onClick={() => setActiveTab('lost')}
            className={getTabClasses('lost')}
            aria-selected={activeTab === 'lost'}
            role="tab"
          >
            Lost Pets
          </button>

          {/* Replaced <Tab eventKey="found" title="Found Pets"> */}
          <button
            onClick={() => setActiveTab('found')}
            className={getTabClasses('found')}
            aria-selected={activeTab === 'found'}
            role="tab"
          >
            Found Pets
          </button>
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="pt-4" role="tabpanel">
        {renderContent()}
      </div>
    </div>
  );
}