"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const t = useTranslations("PetOwnerLogin");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();

  const togglePassword = () => setShowPassword((v) => !v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/pet/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      switch (res.status) {
        case 204:
          toast.success(t("loginSuccess"));
          setTimeout(() => router.replace("/petOwner/dashboard"), 1000);
          break;

        case 400:
          toast.error(t("missingFields"));
          break;

        case 401:
          toast.error(t("invalidCredentials"));
          break;

        case 403:
          toast.error(t("notVerified"));
          break;

        case 404:
          toast.error(t("notFound"));
          break;

        default:
          toast.error(t("serverError"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("networkError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`py-16 bg-gray-50 ${isRTL ? "rtl" : ""}`}>
      <div className="max-w-md mx-auto px-5">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-pet-primary to-blue-600 px-8 py-6 text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              {/* User Icon */}
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-white">{t("title")}</h2>
            <p className="text-blue-100 text-sm mt-2">{t("subtitle")}</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                {t("email")}
              </label>

              <div className="relative">
                <input
                  type="email"
                  value={email}
                  autoComplete="email"
                  required
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$"
                  title={t("invalidEmail")}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pet-primary pl-10 pr-4`}
                  placeholder={t("emailPlaceholder")}
                />

                {/* Email Icon */}
                <svg
                  className="w-5 h-5 text-gray-400 absolute inset-y-0 left-3 my-auto pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                {t("password")}
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  autoComplete="current-password"
                  required
                  minLength={6}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pet-primary pl-10 pr-12"
                  placeholder={t("passwordPlaceholder")}
                />

                {/* Password Icon */}
                <svg
                  className="w-5 h-5 text-gray-400 absolute inset-y-0 left-3 my-auto pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>

                {/* Show/Hide Button */}
                <button
                  type="button"
                  aria-label="Toggle Password Visibility"
                  onClick={togglePassword}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18M10.58 10.58A2 2 0 0112 10a2 2 0 011.42.58m1.8 1.8A3 3 0 0112 15a3 3 0 01-2.12-.88"
                      />
                      <path
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7a9.964 9.964 0 01-2.98 4.324"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* REMEMBER ME + FORGOT PASSWORD */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  id="remember_me"
                  className="w-4 h-4"
                />
                {t("rememberMe")}
              </label>

              <a
                href="/forgot-password?role=petOwner"
                className="text-sm text-pet-primary hover:text-blue-600"
              >
                {t("forgotPassword")}
              </a>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pet-primary to-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? t("loggingIn") : t("loginButton")}
            </button>
          </form>
        </div>

        {/* INFO */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-blue-800 mb-2">
              {t("secureLogin")}
            </h3>
            <p className="text-xs text-blue-700">{t("securityDesc")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
