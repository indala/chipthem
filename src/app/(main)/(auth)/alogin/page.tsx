"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminLoginPage() {
  const t = useTranslations("AdminLogin");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 204) {
        toast.success(t("loginSuccess"));
        router.replace("/admin/dashboard");
      } else if (res.status === 401) {
        toast.error(t("invalidCredentials"));
      } else {
        toast.error(t("unexpectedError"));
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(t("networkError"));
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full py-3 ps-12 pe-4 border border-gray-300 rounded-lg " +
    "focus:ring-2 focus:ring-gray-800 focus:border-transparent " +
    "transition-all duration-200 bg-white";

  const iconBase =
    "absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none";

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 flex items-center justify-center pt-28 pb-12 relative">
      {/* Background Animation */}
      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse" />
      </div>

      <div className="max-w-md w-full mx-4 relative z-10">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-white mb-1">{t("title")}</h1>
            <p className="text-gray-300 text-sm">{t("subtitle")}</p>
          </div>

          {/* Login Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("username")}
                </label>

                <div className="relative">
                  <span className={iconBase}>
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </span>

                  <input
                    type="text"
                    name="username"
                    required
                    autoComplete="username"
                    className={inputBase}
                    placeholder={t("usernamePlaceholder")}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("password")}
                </label>

                <div className="relative">
                  <span className={iconBase}>
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>

                  <input
                    type="password"
                    name="password"
                    required
                    autoComplete="current-password"
                    className={inputBase}
                    placeholder={t("passwordPlaceholder")}
                  />
                </div>
              </div>

              {/* Remember Me + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="remember"
                    className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-800"
                  />
                  {t("rememberMe")}
                </label>

                <Link
                  href="/forgot-password?role=admin"
                  className="text-sm text-gray-800 hover:text-gray-600 transition-colors"
                >
                  {t("forgotPassword")}
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 rounded-lg font-semibold
                           hover:from-gray-900 hover:to-black focus:ring-2 focus:ring-gray-800 focus:ring-offset-2
                           transition-all duration-200 transform hover:scale-[1.03] disabled:opacity-50"
              >
                {loading ? t("loading") : t("loginButton")}
              </button>

              {/* Security Notice */}
              <p className="text-center text-xs text-gray-500 mt-3">
                {t("securityNotice")}
              </p>
            </form>
          </div>
        </div>

        {/* Security Features */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            {t("securityFeatures.title")}
          </h3>

          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center text-white mb-2">
              <svg className="w-5 h-5 text-green-400 me-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{t(`securityFeatures.feature${i}`)}</span>
            </div>
          ))}
        </div>

        {/* Emergency Contact */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            {t("emergencyContact")}{" "}
            <a href="tel:+962798980504" className="text-white font-semibold hover:text-gray-300 [direction:ltr] [unicode-bidi:bidi-override]">
              {t("emergencyPhone")}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
