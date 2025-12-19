"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}

export default function Modal({ children, onClose, title }: ModalProps) {
  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
      {/* BACKDROP */}a
      <Dialog.Overlay
        className="
          fixed inset-0 
          bg-black/40 
          backdrop-blur-sm 
          z-[9998]
        "
      />

      {/* MODAL CONTENT */}
      <Dialog.Content
        className="
          fixed top-1/2 left-1/2 
          -translate-x-1/2 -translate-y-1/2
          bg-white rounded-xl shadow-xl
          w-[90%] max-w-md

          /* 💥 Fix overflow issue */
          max-h-[90vh] overflow-y-auto

          /* Smooth scaling animation */
          data-[state=open]:animate-in
          data-[state=open]:fade-in-0
          data-[state=open]:zoom-in-95
          data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0
          data-[state=closed]:zoom-out-95

          p-6
          z-[9999]
          focus:outline-none
        "
      >
        {/* TITLE */}
        <Dialog.Title className="text-lg font-semibold mb-3">
          {title ?? "Modal"}
        </Dialog.Title>

        {/* CLOSE BUTTON */}
        <Dialog.Close
          onClick={onClose}
          className="
            absolute top-4 right-4 
            text-gray-500 hover:text-gray-700 
            transition
          "
        >
          <X size={20} />
        </Dialog.Close>

        {/* CONTENT */}
        {children}
      </Dialog.Content>
    </Dialog.Root>
  );
}
