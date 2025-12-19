'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useRolesStore } from "@/store/rolesStore";

const Header = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Navigation");
  const router = useRouter();

  const { user, clearUser } = useRolesStore();

  const userRole = user?.role || null;
  const isLoggedIn =
    userRole !== null && userRole !== "guest";

  const isRTL = locale === "ar";

  const [activeNav, setActiveNav] = useState(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileRegisterOpen, setMobileRegisterOpen] = useState(false);
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const toggleRegister = () => setRegisterOpen((v) => !v);
  const toggleLogin = () => setLoginOpen((v) => !v);

  const getDashboardInfo = (role: string | null) => {
    switch (role) {
      case "admin":
        return { href: "/admin/dashboard", label: t("dashboard") };
      case "veterinary":
        return { href: "/veterinary/dashboard", label: t("dashboard") };
      case "petOwner":
        return { href: "/petOwner/dashboard", label: t("dashboard") };
      default:
        return null;
    }
  };

  const dashboardInfo = getDashboardInfo(userRole);

  const handleLanguageChange = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    window.location.reload();
  };

  const handleLogout = useCallback(async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    clearUser();
    router.push("/");
  }, [clearUser, router]);

  const registerRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        registerRef.current &&
        !registerRef.current.contains(event.target as Node)
      ) {
        setRegisterOpen(false);
      }
      if (
        loginRef.current &&
        !loginRef.current.contains(event.target as Node)
      ) {
        setLoginOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setActiveNav(pathname);
  }, [pathname]);

  // 🔑 Close all mobile menus on any route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileLoginOpen(false);
    setMobileRegisterOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/findclinic", label: t("findClinic") },
    { href: "/search", label: t("search") },
    { href: "/lostfound", label: t("lostFound") },
    { href: "/successstories", label: t("successStories") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <motion.nav
      key={locale}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 12,
        duration: 0.8,
      }}
      className={`header-glass fixed top-0 z-50 shadow-soft w-full ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex justify-between items-center h-20 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center group">
              <div className={isRTL ? "ml-4" : "mr-4"}>
                <Link
                  href="/"
                  className="font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                >
                  Chipthem
                </Link>
                <div className="text-xs text-gray-500 font-medium -mt-1">
                  {t("registerPet")}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div
              className={`flex items-center ${
                isRTL ? "gap-2" : "gap-2"
              }`}
            >
              {navItems.map(({ href, label }) => {
                const isLinkActive = activeNav === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setActiveNav(href)}
                    aria-current={isLinkActive ? "page" : undefined}
                    className={`group relative nav-link px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                      isLinkActive
                        ? "active text-blue-600"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    <span
                      className={`transition-all duration-300 ${
                        isLinkActive
                          ? "text-blue-600"
                          : "group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:to-emerald-500"
                      }`}
                    >
                      {label}
                    </span>
                    <span
                      className={`pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transform transition-transform duration-300 ${
                        isRTL
                          ? "left-3 right-3 origin-right"
                          : "left-3 right-3 origin-left"
                      } ${isLinkActive ? "scale-x-100" : "scale-x-0"}`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={handleLanguageChange}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 text-sm font-semibold"
              aria-label={`Switch to ${
                locale === "en" ? "Arabic" : "English"
              }`}
            >
              {locale === "en" ? "العربية" : "English"}
            </button>

            {isLoggedIn && dashboardInfo ? (
              <>
                <Link
                  href={dashboardInfo.href}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center border-0 text-white bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-lg shadow-green-200/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2"
                >
                  <svg
                    className={`w-4 h-4 ${
                      isRTL ? "ml-2" : "mr-2"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  {dashboardInfo.label}
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center border-0 text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2"
                  title={t("logout")}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <>
                {/* Desktop Register dropdown */}
                <div className="relative" ref={registerRef}>
                  <button
                    onClick={toggleRegister}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center border-0 text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-200/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2"
                    type="button"
                    aria-expanded={registerOpen}
                    aria-haspopup="true"
                  >
                    <svg
                      className={`w-4 h-4 ${
                        isRTL ? "ml-2" : "mr-2"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {t("register")}
                    <svg
                      className={`w-4 h-4 ${
                        isRTL ? "mr-1" : "ml-1"
                      } transform transition-transform duration-200 ${
                        registerOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {registerOpen && (
                    <div
                      className={`absolute mt-2 w-56 bg-white rounded-xl shadow-elegant border border-gray-100 py-2 z-50 ${
                        isRTL ? "right-0" : "left-0"
                      }`}
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <Link
                        href="/getpetmicrochipped"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                        onClick={() => setRegisterOpen(false)}
                        role="menuitem"
                      >
                        <svg
                          className={`w-4 h-4 ${
                            isRTL ? "ml-3" : "mr-3"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        {t("registerPet")}
                      </Link>
                      <Link
                        href="/vetregister"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                        onClick={() => setRegisterOpen(false)}
                        role="menuitem"
                      >
                        <svg
                          className={`w-4 h-4 ${
                            isRTL ? "ml-3" : "mr-3"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        {t("veterinaryRegister")}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Desktop Login dropdown */}
                <div className="relative" ref={loginRef}>
                  <button
                    onClick={toggleLogin}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center border-0 text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-blue-200/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
                    type="button"
                    aria-expanded={loginOpen}
                    aria-haspopup="true"
                  >
                    <svg
                      className={`w-4 h-4 ${
                        isRTL ? "ml-2" : "mr-2"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    {t("login")}
                    <svg
                      className={`w-4 h-4 ${
                        isRTL ? "mr-1" : "ml-1"
                      } transform transition-transform duration-200 ${
                        loginOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {loginOpen && (
                    <div
                      className={`absolute mt-2 w-56 bg-white rounded-xl shadow-elegant border border-gray-100 py-2 z-50 ${
                        isRTL ? "right-0" : "left-0"
                      }`}
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <Link
                        href="/pologin"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                        onClick={() => setLoginOpen(false)}
                        role="menuitem"
                      >
                        <svg
                          className={`w-4 h-4 ${
                            isRTL ? "ml-3" : "mr-3"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        {t("petOwnerLogin")}
                      </Link>
                      <Link
                        href="/vlogin"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                        onClick={() => setLoginOpen(false)}
                        role="menuitem"
                      >
                        <svg
                          className={`w-4 h-4 ${
                            isRTL ? "ml-3" : "mr-3"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        {t("veterinaryLogin")}
                      </Link>
                      <Link
                        href="/alogin"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t"
                        onClick={() => setLoginOpen(false)}
                        role="menuitem"
                      >
                        <svg
                          className={`w-4 h-4 ${
                            isRTL ? "ml-3" : "mr-3"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                          />
                        </svg>
                        {t("adminLogin")}
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={handleLanguageChange}
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg text-xs font-semibold transition-all duration-300"
              aria-label={`Switch to ${
                locale === "en" ? "Arabic" : "English"
              }`}
            >
              {locale === "en" ? "ع" : "EN"}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-pet-primary hover:bg-gray-100 transition-all duration-300 focus:outline-none"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {!mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4">
          <div className="space-y-1 mb-4">
            {navItems.map(({ href, label }) => {
              const isLinkActive = activeNav === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => {
                    setActiveNav(href);
                    setMobileOpen(false);
                    setMobileLoginOpen(false);
                    setMobileRegisterOpen(false);
                  }}
                  className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isLinkActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {isLoggedIn && dashboardInfo ? (
            <>
              <Link
                href={dashboardInfo.href}
                onClick={() => {
                  setMobileOpen(false);
                  setMobileLoginOpen(false);
                  setMobileRegisterOpen(false);
                }}
                className="w-full flex items-center justify-center bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 px-4 rounded-lg text-sm font-semibold my-2 hover:from-green-600 hover:to-teal-700 transition-all"
              >
                <svg
                  className={`w-4 h-4 ${
                    isRTL ? "ml-2" : "mr-2"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {dashboardInfo.label}
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                  setMobileLoginOpen(false);
                  setMobileRegisterOpen(false);
                }}
                className="w-full flex items-center justify-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all"
                aria-label={t("logout")}
              >
                <svg
                  className={`w-4 h-4 ${
                    isRTL ? "ml-2" : "mr-2"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              {/* Mobile register */}
              <button
                onClick={() =>
                  setMobileRegisterOpen(!mobileRegisterOpen)
                }
                className={`w-full flex items-center justify-between bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4 rounded-lg text-sm font-semibold my-2 hover:from-amber-600 hover:to-orange-600 transition-all ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
                aria-expanded={mobileRegisterOpen}
              >
                <span>{t("register")}</span>
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    mobileRegisterOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {mobileRegisterOpen && (
                <div
                  className={`space-y-2 mb-2 ${
                    isRTL ? "mr-2" : "ml-2"
                  }`}
                >
                  <Link
                    href="/getpetmicrochipped"
                    className="block bg-orange-100 text-orange-800 py-2 px-4 rounded-lg text-sm font-medium"
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileRegisterOpen(false);
                    }}
                  >
                    {t("registerPet")}
                  </Link>
                  <Link
                    href="/vetregister"
                    className="block bg-orange-100 text-orange-800 py-2 px-4 rounded-lg text-sm font-medium"
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileRegisterOpen(false);
                    }}
                  >
                    {t("veterinaryRegister")}
                  </Link>
                </div>
              )}

              {/* Mobile login */}
              <button
                onClick={() => setMobileLoginOpen(!mobileLoginOpen)}
                className={`w-full flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold my-2 hover:from-blue-600 hover:to-blue-700 transition-all ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
                aria-expanded={mobileLoginOpen}
              >
                <span>{t("login")}</span>
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    mobileLoginOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {mobileLoginOpen && (
                <div
                  className={`space-y-2 ${
                    isRTL ? "mr-2" : "ml-2"
                  }`}
                >
                  <Link
                    href="/pologin"
                    className="block bg-blue-100 text-blue-800 py-2 px-4 rounded-lg text-sm font-medium"
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileLoginOpen(false);
                    }}
                  >
                    {t("petOwnerLogin")}
                  </Link>
                  <Link
                    href="/vlogin"
                    className="block bg-blue-100 text-blue-800 py-2 px-4 rounded-lg text-sm font-medium"
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileLoginOpen(false);
                    }}
                  >
                    {t("veterinaryLogin")}
                  </Link>
                  <Link
                    href="/alogin"
                    className="block bg-gray-100 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium"
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileLoginOpen(false);
                    }}
                  >
                    {t("adminLogin")}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </motion.nav>
  );
};

export default Header;
