"use client";

import React, { useState } from "react";
import {  useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const t = useTranslations("ForgotPassword");
  const params = useSearchParams();

  const [loading, setLoading] = useState(false);
  const role = params.get("role");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t("emailSent"));
      } else {
        toast.error(data.message || t("error"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("networkError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-10">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          {t("title")}
        </h1>

        <p className="text-gray-600 text-center mb-6">
          {t("subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("email")}
            </label>

            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 outline-none"
              placeholder={t("emailPlaceholder")}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black transition disabled:opacity-50"
          >
            {loading ? t("loading") : t("button")}
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-500 text-center">
          {t("security")}
        </p>

      </div>
    </section>
  );
}
