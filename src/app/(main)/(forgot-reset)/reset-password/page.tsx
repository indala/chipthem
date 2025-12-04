"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const t = useTranslations("ResetPassword");
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);
  const [redirectCountdown, setRedirectCountdown] = useState(3); // seconds

  // Check if token is missing
  useEffect(() => {
    if (!token) {
      toast.error(t("tokenMissing"));
      setValidToken(false);
      const countdown = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            router.replace("/"); // redirect home
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [token, t, router]);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!newPassword || !confirmPassword) {
    toast.error(t("fillFields"));
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error(t("passwordMismatch"));
    return;
  }

  if (newPassword.length < 6) {
    toast.error(t("minLength"));
    return;
  }

  try {
    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(t("success"));

      // Role-based redirect
      let redirectUrl = "/login"; // default
      switch (data.role) {
        case "po":
          redirectUrl = "/pologin";
          break;
        case "v":
          redirectUrl = "/vlogin";
          break;
        case "a":
          redirectUrl = "/alogin";
          break;
      }

      setTimeout(() => router.push(redirectUrl), 1500);
    } else {
      toast.error(data.message || t("error"));

      // Token expired/invalid handling
      if (data.message?.toLowerCase().includes("expired") || data.message?.toLowerCase().includes("invalid")) {
        setValidToken(false);
        let countdown = 5;
        const interval = setInterval(() => {
          countdown -= 1;
          if (countdown <= 0) {
            clearInterval(interval);
            router.replace("/forgot-password");
          }
        }, 1000);
      }
    }
  } catch (err) {
    console.error(err);
    toast.error(t("networkError"));
  } finally {
    setLoading(false);
  }
};


  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-10">
        <p className="text-white text-center">
          {t("tokenInvalid")}. Redirecting in {redirectCountdown} seconds...
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-10">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          {t("title")}
        </h1>
        <p className="text-gray-600 text-center mb-6">{t("subtitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("newPassword")}
            </label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 outline-none"
              placeholder={t("newPasswordPlaceholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("confirmPassword")}
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-900 outline-none"
              placeholder={t("confirmPasswordPlaceholder")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black transition disabled:opacity-50"
          >
            {loading ? t("loading") : t("button")}
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-500 text-center">{t("note")}</p>
      </div>
    </section>
  );
}
