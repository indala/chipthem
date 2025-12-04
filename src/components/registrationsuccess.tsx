'use client';

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import VetVerificationHero from "@/components/VetVerificationHero";
import RegisterHero from "./RegisterHero";

interface RegistrationSuccessProps {
  type: "vet" | "pet";
}

export default function RegistrationSuccess({ type }: RegistrationSuccessProps) {
  const router = useRouter();
  const namespace = type === "pet" ? "PetRegistrationSuccess" : "VetRegistrationSuccess";
  const t = useTranslations(namespace);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      {type !== "pet" ? (
        <VetVerificationHero />
      ) : (
        <RegisterHero />
      )}

      {/* Confirmation Content */}
      <motion.section
        className="flex-grow flex flex-col items-center justify-center text-center px-4 py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-xl bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-semibold text-green-700 mb-4">
            {t("title")}
          </h2>

          <p className="text-gray-600 mb-6">
            {t("description1")} <strong>ChipThem</strong>.<br />
            {t("description2")}{" "}
            <span className="text-blue-600 font-medium">
              {t("underVerification")}
            </span>{" "}
            {t("description3")}
          </p>

          <p className="text-gray-500 mb-8">
            {t("emailNotice")}
          </p>

          <button
            onClick={() => router.replace("/")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            {t("returnHome")}
          </button>
        </div>
      </motion.section>
    </main>
  );
}
