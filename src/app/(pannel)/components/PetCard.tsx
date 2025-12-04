'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { usePetsStore } from '@/store/usePetsStore';
import { Pet } from '@/types/owners';
import { toast } from 'sonner';
import { StyledButtonProps } from '@/types/types';
import { useState } from 'react';

interface PetCardProps {
  pet: Pet;
  index: number;
  onView: (pet: Pet) => void;
}

// --- Tailwind Utility Component: StyledButton ---
const StyledButton = ({
  onClick,
  disabled,
  variant,
  size,
  children,
  className = '',
}: StyledButtonProps) => {
  let baseClasses =
    'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ';

  if (size === 'sm') {
    baseClasses += 'px-3 py-1 text-sm ';
  } else {
    baseClasses += 'px-4 py-2 ';
  }

  if (variant === 'success') {
    baseClasses +=
      'bg-green-600 hover:bg-green-700 text-white focus:ring-green-300';
  } else if (variant === 'danger') {
    baseClasses +=
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300';
  } else if (variant === 'outline-primary') {
    baseClasses +=
      'border border-indigo-500 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-200';
  } else {
    baseClasses +=
      'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300';
  }

  if (disabled) {
    baseClasses += ' opacity-50 cursor-not-allowed';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </button>
  );
};
// --- End StyledButton ---

export default function PetCard({ pet, index, onView }: PetCardProps) {
  const { verifyPet, rejectPet } = usePetsStore();
  const [actionLoading, setActionLoading] = useState(false);

  const getStatusIcon = (pet: Pet) => {
    if (pet.is_verified)
      return <CheckCircle className="text-green-500" size={20} />;
    if (pet.status === 'pending')
      return <Clock className="text-yellow-500" size={20} />;
    return <XCircle className="text-red-500" size={20} />;
  };

  const handleAccept = async () => {
  if (!pet.id || !pet.owner?.id) {
    toast.error('Missing pet or owner information');
    return;
  }

  if (actionLoading) return;

  setActionLoading(true);

  try {
    await toast.promise(verifyPet(pet.owner?.id, pet.id), {
      loading: 'Verifying pet...',
      success: 'Pet verified successfully!',
      error: 'Failed to verify pet. Please try again.',
    });
  } finally {
    setActionLoading(false);
  }
};

const handleReject = async () => {
  if (!pet.id || !pet.owner?.id) {
    toast.error('Missing pet or owner information');
    return;
  }

  if (actionLoading) return;

  setActionLoading(true);

  try {
    await toast.promise(rejectPet(pet.owner?.id, pet.id), {
      loading: 'Rejecting pet...',
      success: 'Pet rejected successfully!',
      error: 'Failed to reject pet. Please try again.',
    });
  } finally {
    setActionLoading(false);
  }
};


  return (
    <motion.div
      key={pet.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col justify-between h-full"
    >
      {/* Card Content */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h6 className="font-semibold text-lg truncate mb-0 text-gray-800">
            {pet.pet_name}
          </h6>
          {getStatusIcon(pet)}
        </div>

        <p className="text-gray-500 text-sm mb-1">
          {pet.pet_type || 'Unknown type'}
        </p>

        {pet.owner && (
          <p className="text-gray-500 text-sm mb-3 truncate">
            👤 {pet.owner.full_name} ({pet.owner.email})
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-auto space-x-2 pt-3 border-t border-gray-100">
        <StyledButton
          size="sm"
          variant="outline-primary"
          onClick={() => onView(pet)}
          className="w-1/3"
        >
          View
        </StyledButton>

        <StyledButton
          size="sm"
          variant="success"
          disabled={pet.is_verified || actionLoading}
          onClick={handleAccept}
          className="w-1/3"
        >
          Accept
        </StyledButton>

        <StyledButton
          size="sm"
          variant="danger"
          disabled={actionLoading}
          onClick={handleReject}
          className="w-1/3"
        >
          Reject
        </StyledButton>
      </div>
    </motion.div>
  );
}
