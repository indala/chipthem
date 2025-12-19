// types/ui.d.ts
import { ReactNode } from 'react';
import { Pet } from './owners';

export interface StyledButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 
    | "primary"
    | "secondary"
    | "outline-secondary"
    | "success"
    | "danger"
    | "outline-primary";  // <-- add this

  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md';   // 👈 make it optional
}


export interface PetModalProps {
  show: boolean;
  onClose: () => void;
  pet: Pet | null;
}


export type ReportStatus = 'unresolved' | 'resolved';

export type LostReport = {
  id: string;
  created_at: string;
  pet_name: string | null;
  pet_type: string | null;
  color: string | null;
  size: string | null;
  pet_photo: string | null;
  last_seen_location: string | null;
  status: ReportStatus;
  breed: string | null;
  microchip: string | null;
  date_lost: string | null;
  time_lost: string | null;
  loss_circumstances: string | null;
  owner_name: string | null;
  phone: string | null;
  email: string | null;
  alt_phone: string | null;
};

export type FoundReport = {
  id: string;
  created_at: string;
  pet_type: string | null;
  color: string | null;
  size: string | null;
  pet_photo: string | null;
  found_location: string | null;
  status: ReportStatus;
  description: string | null;
  date_found: string | null;
  time_found: string | null;
  finder_name: string | null;
  phone: string | null;
  email: string | null;
  current_location: string | null;
};


export type UserRole = "admin" | "veterinary" | "petOwner" | "guest";