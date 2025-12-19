'use client';

import { motion } from 'framer-motion';
// Removed: Button import from "react-bootstrap"
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useVeterinariesStore } from '@/store/useVeterinariesStore';
import { VeterinaryClinic } from '@/types/veterinaries';
import { toast } from 'sonner';
import { FaEye, FaCheckCircle as FaCheck, FaTimesCircle } from 'react-icons/fa'; // Icons for buttons
import { StyledButtonProps } from '@/types/types';

interface VeterinaryCardProps {
  vet: VeterinaryClinic;
  index: number;
  onView: (vet: VeterinaryClinic) => void;
}

// --- Tailwind Utility Component: StyledButton (Reused from PetCard logic) ---
const StyledButton = ({ onClick, disabled, variant, size, children, className = '' }: StyledButtonProps) => {
  let baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 flex items-center justify-center ';
  
  // Size conversion (sm is default here)
  if (size === 'sm') {
    baseClasses += 'px-3 py-1 text-sm ';
  } else {
    baseClasses += 'px-4 py-2 ';
  }

  // Variant conversion
  if (variant === 'success') {
    baseClasses += 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-300';
  } else if (variant === 'danger') {
    baseClasses += 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300';
  } else if (variant === 'outline-primary') {
    // Primary theme for the 'View' button
    baseClasses += 'border border-indigo-500 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-200';
  } else {
    baseClasses += 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300';
  }

  if (disabled) {
    baseClasses += ' opacity-50 cursor-not-allowed';
  }

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
};
// --- End StyledButton ---


export default function VeterinaryCard({ vet, index, onView }: VeterinaryCardProps) {
  const { verifyVeterinary, rejectVeterinary } = useVeterinariesStore();

  const getStatusIcon = (vet: VeterinaryClinic) => {
    // Mapping Bootstrap text color utilities to Tailwind utilities
    if (vet.is_verified) return <CheckCircle className="text-green-500" size={20} />; // text-success -> text-green-500
    if (vet.status === 'pending') return <Clock className="text-yellow-500" size={20} />; // text-warning -> text-yellow-500
    return <XCircle className="text-red-500" size={20} />; // text-danger -> text-red-500
  };

  const handleAccept = () => {
    if (!vet.id) {
      toast.error('Missing veterinary clinic information');
      return;
    }

    toast.promise(verifyVeterinary(vet.id), {
      loading: 'Verifying clinic...',
      success: 'Clinic verified successfully!',
      error: 'Failed to verify. Please try again.',
    });
  };

  const handleReject = () => {
    if (!vet.id) {
      toast.error('Missing veterinary clinic information');
      return;
    }

    toast.promise(rejectVeterinary(vet.id), {
      loading: 'Rejecting...',
      success: 'Clinic rejected successfully.',
      error: 'Failed to reject. Please try again.',
    });
  };

  return (
    <motion.div
      key={vet.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }} 
      // Replaced Bootstrap classes with Tailwind:
      // bg-white border rounded-4 shadow-sm p-3 -> bg-white border border-gray-200 rounded-xl shadow-md p-4
      // d-flex flex-column justify-content-between -> flex flex-col justify-between
      // Removed inline style: style={{ width: "260px" }}
      className="bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col justify-between h-full"
    >
      {/* Card Content Area */}
      <div>
        {/* Header */}
        {/* d-flex justify-content-between align-items-center mb-2 -> flex justify-between items-center mb-2 */}
        <div className="flex justify-between items-center mb-2">
          {/* fw-semibold text-truncate mb-0 -> font-semibold text-lg truncate text-gray-800 */}
          <h6 className="font-semibold text-lg truncate mb-0 text-gray-800">{vet.clinic_name}</h6>
          {getStatusIcon(vet)}
        </div>

        {/* Contact Info */}
        {/* text-muted small mb-1 text-truncate -> text-gray-500 text-sm mb-1 truncate */}
        <p className="text-gray-500 text-sm mb-1 truncate flex items-center">
            <span className="mr-1">📧</span> {vet.email}
        </p>
        {vet.phone && 
            <p className="text-gray-500 text-sm mb-2 truncate flex items-center">
                <span className="mr-1">📞</span> {vet.phone}
            </p>
        }

        {/* License Info */}
        <p className="text-gray-500 text-sm mb-3">
          🩺 {vet.license_number ? `License: ${vet.license_number}` : 'No license info'}
        </p>
      </div>

      {/* Buttons */}
      {/* d-flex justify-content-between mt-auto -> flex justify-between mt-auto space-x-2 */}
      <div className="flex justify-between mt-auto space-x-2 pt-3 border-t border-gray-100">
        <StyledButton 
          size="sm" 
          variant="outline-primary" 
          onClick={() => onView(vet)}
          className="w-1/3"
        >
          <FaEye className="mr-1" /> View
        </StyledButton>
        <StyledButton
          size="sm"
          variant="success"
          disabled={vet.is_verified}
          onClick={handleAccept}
          className="w-1/3"
        >
          <FaCheck className="mr-1" /> Accept
        </StyledButton>
        <StyledButton
          size="sm"
          variant="danger"
          onClick={handleReject}
          className="w-1/3"
        >
          <FaTimesCircle className="mr-1" /> Reject
        </StyledButton>
      </div>
    </motion.div>
  );
}