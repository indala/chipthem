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


