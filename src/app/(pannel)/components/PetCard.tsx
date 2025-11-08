"use client";

import { motion } from "framer-motion";
import { Button } from "react-bootstrap";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { usePetsStore } from "@/store/usePetsStore";
import { Pet } from "@/types/owners";
import { toast } from "sonner"; // ✅ Sonner for toast notifications

interface PetCardProps {
  pet: Pet;
  index: number;
  onView: (pet: Pet) => void;
}

export default function PetCard({ pet, index, onView }: PetCardProps) {
  const { verifyPet, rejectPet } = usePetsStore();

  const getStatusIcon = (pet: Pet) => {
    if (pet.is_verified) return <CheckCircle className="text-success" size={20} />;
    if (pet.status === "pending") return <Clock className="text-warning" size={20} />;
    return <XCircle className="text-danger" size={20} />;
  };

  const handleAccept = () => {
    if (!pet.id) {
      toast.error("Missing pet information");
      return;
    }

    toast.promise(
      verifyPet(pet.id),
      {
        loading: "Verifying pet...",
        success: "Pet verified successfully!",
        error: "Failed to verify pet. Please try again.",
      }
    );
  };

  const handleReject = () => {
    if (!pet.id) {
      toast.error("Missing pet information");
      return;
    }

    toast.promise(
      rejectPet(pet.id),
      {
        loading: "Rejecting pet...",
        success: "Pet rejected successfully!",
        error: "Failed to reject pet. Please try again.",
      }
    );
  };

  return (
    <motion.div
      key={pet.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border rounded-4 shadow-sm p-3 d-flex flex-column justify-content-between"
      style={{ width: "260px" }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-semibold text-truncate mb-0">{pet.pet_name}</h6>
        {getStatusIcon(pet)}
      </div>

      {/* Pet Type */}
      <p className="text-muted small mb-1">{pet.pet_type || "Unknown type"}</p>

      {/* Owner Info */}
      {pet.owner && (
        <p className="text-muted small mb-3 text-truncate">
          👤 {pet.owner.full_name} ({pet.owner.email})
        </p>
      )}

      {/* Buttons */}
      <div className="d-flex justify-content-between mt-auto">
        <Button size="sm" variant="outline-primary" onClick={() => onView(pet)}>
          View
        </Button>
        <Button
          size="sm"
          variant="success"
          disabled={pet.is_verified}
          onClick={handleAccept}
        >
          Accept
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={handleReject}
        >
          Reject
        </Button>
      </div>
    </motion.div>
  );
}
