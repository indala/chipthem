'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePetsStore } from '@/store/usePetsStore';
import PetCard from '@/app/(pannel)/components/PetCard';
import { Pet } from '@/types/owners';
import { FaPaw, FaTimes, FaSpinner, FaUser } from 'react-icons/fa';
import { StyledButtonProps, PetModalProps } from '@/types/types';

// --- Spinner ---
const LoadingSpinner = () => (
  <FaSpinner className="animate-spin text-indigo-500 w-5 h-5 mr-2" />
);

// --- Button ---
const StyledButton = ({
  onClick,
  disabled,
  variant,
  children,
  className = '',
}: StyledButtonProps) => {
  let baseClasses =
    'px-6 py-3 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 ';

  if (variant === 'secondary') {
    baseClasses += 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-300';
  } else if (variant === 'outline-secondary') {
    baseClasses += 'border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-200';
  } else {
    baseClasses += 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-300';
  }

  if (disabled) {
    baseClasses += ' opacity-50 cursor-not-allowed';
  }

  return (
    <button
      type="button" // ✅ IMPORTANT FIX
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${className} flex items-center justify-center`}
    >
      {children}
    </button>
  );
};

// --- Modal ---
const PetModal = ({ show, onClose, pet }: PetModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const lastActiveElement = useRef<HTMLElement | null>(null);

  // ✅ ESC + Focus Trap + Restore Focus
  useEffect(() => {
    if (!show) return;

    lastActiveElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    setTimeout(() => {
      modalRef.current?.querySelector<HTMLElement>('button')?.focus();
    }, 0);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      lastActiveElement.current?.focus();
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h5 className="text-xl font-bold">Pet Details</h5>
          <button type="button" onClick={onClose}>
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {pet ? (
            <>
              <h5 className="text-2xl font-semibold mb-1">{pet.pet_name}</h5>
              <p className="text-gray-500 mb-3">{pet.pet_type || 'Unknown type'}</p>

              <div className="bg-gray-100 p-3 rounded mb-4">
                <strong>Status:</strong> {pet.status || 'N/A'} –{' '}
                <span className={pet.is_verified ? 'text-green-600' : 'text-yellow-600'}>
                  {pet.is_verified ? 'Verified' : 'Unverified'}
                </span>
              </div>

              {pet.owner && (
                <div className="border-t pt-4">
                  <h6 className="font-bold mb-2 flex items-center">
                    <FaUser className="mr-2" /> Owner
                  </h6>
                  <p>{pet.owner.full_name}</p>
                  <p>{pet.owner.email}</p>
                  {pet.owner.phone_number && <p>{pet.owner.phone_number}</p>}
                  {pet.owner.city && (
                    <p>
                      {pet.owner.city}, {pet.owner.country || ''}
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-center py-6">
              <LoadingSpinner />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t">
          <StyledButton variant="secondary" onClick={onClose}>
            Close
          </StyledButton>
        </div>
      </div>
    </div>
  );
};

// --- Page ---
export default function PetsPage() {
  const { pets, hasMore, loading } = usePetsStore();
  const storeFetchPets = usePetsStore((state) => state.fetchPets);
  const storeSubscribeRealtime = usePetsStore((state) => state.subscribeRealtime);

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchPets = useCallback((reset?: boolean) => {
    storeFetchPets(reset);
  }, [storeFetchPets]);

  const subscribeRealtime = useCallback(() => {
    return storeSubscribeRealtime();
  }, [storeSubscribeRealtime]);

  useEffect(() => {
    fetchPets(true);
  }, [fetchPets]);

  useEffect(() => {
    const unsub = subscribeRealtime();
    return () => unsub?.();
  }, [subscribeRealtime]);

  const openModal = (pet: Pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <FaPaw className="mr-3" /> Pet Verification
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pets.map((pet, index) => (
          <PetCard key={pet.id} pet={pet} index={index} onView={openModal} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <StyledButton
            onClick={() => fetchPets()}
            disabled={loading}
            variant="outline-secondary"
            className="min-w-[200px]"
          >
            {loading ? (
              <>
                <LoadingSpinner /> Loading...
              </>
            ) : (
              'Load More Pets'
            )}
          </StyledButton>
        </div>
      )}

      <PetModal show={showModal} onClose={closeModal} pet={selectedPet} />
    </div>
  );
}
