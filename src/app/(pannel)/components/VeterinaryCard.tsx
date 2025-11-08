"use client";

import { motion } from "framer-motion";
import { Button } from "react-bootstrap";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useVeterinariesStore } from "@/store/useVeterinariesStore";
import { VeterinaryClinic } from "@/types/veterinaries";
import { toast } from "sonner";

interface VeterinaryCardProps {
  vet: VeterinaryClinic;
  index: number;
  onView: (vet: VeterinaryClinic) => void;
}

export default function VeterinaryCard({ vet, index, onView }: VeterinaryCardProps) {
  const { verifyVeterinary, rejectVeterinary } = useVeterinariesStore();

  const getStatusIcon = (vet: VeterinaryClinic) => {
    if (vet.is_verified) return <CheckCircle className="text-success" size={20} />;
    if (vet.status === "pending") return <Clock className="text-warning" size={20} />;
    return <XCircle className="text-danger" size={20} />;
  };

  const handleAccept = () => {
    if (!vet.id) {
      toast.error("Missing veterinary clinic information");
      return;
    }

    toast.promise(verifyVeterinary(vet.id), {
      loading: "Verifying clinic...",
      success: "Clinic verified successfully!",
      error: "Failed to verify. Please try again.",
    });
  };

  const handleReject = () => {
    if (!vet.id) {
      toast.error("Missing veterinary clinic information");
      return;
    }

    toast.promise(rejectVeterinary(vet.id), {
      loading: "Rejecting...",
      success: "Clinic rejected successfully.",
      error: "Failed to reject. Please try again.",
    });
  };

  return (
    <motion.div
      key={vet.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border rounded-4 shadow-sm p-3 d-flex flex-column justify-content-between"
      style={{ width: "260px" }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-semibold text-truncate mb-0">{vet.clinic_name}</h6>
        {getStatusIcon(vet)}
      </div>

      {/* Contact Info */}
      <p className="text-muted small mb-1 text-truncate">📧 {vet.email}</p>
      {vet.phone && <p className="text-muted small mb-2 text-truncate">📞 {vet.phone}</p>}

      {/* Info */}
      <p className="text-muted small mb-3">
        🩺 {vet.license_number ? `License: ${vet.license_number}` : "No license info"}
      </p>

      {/* Buttons */}
      <div className="d-flex justify-content-between mt-auto">
        <Button size="sm" variant="outline-primary" onClick={() => onView(vet)}>
          View
        </Button>
        <Button size="sm" variant="success" disabled={vet.is_verified} onClick={handleAccept}>
          Accept
        </Button>
        <Button size="sm" variant="danger" onClick={handleReject}>
          Reject
        </Button>
      </div>
    </motion.div>
  );
}
