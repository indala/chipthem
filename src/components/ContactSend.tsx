"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Send } from "lucide-react";

export default function ContactSend() {
  const t = useTranslations("Contact");

  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const showMicrochip = subject === "microchip" || subject === "search";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    setSubmitMessage(t("sending"));

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Bad response");
      }

      const json = await res.json();

      if (json.success) {
        setSubmitMessage(t("successMessage"));

        // Reset form safely
        if (formEl) {
          formEl.reset();
        }
        setSubject("");
      } else {
        setSubmitMessage(json.message || t("errorFallback"));
      }
    } catch (err) {
      console.error(err);
      setSubmitMessage(t("errorFallback"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORM AREA */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {t("sendMessage")}
              </h2>
              <p className="text-blue-100">{t("responseTime")}</p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
              {/* First + Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("firstName")}
                  </label>
                  <input
                    name="firstName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("lastName")}
                  </label>
                  <input
                    name="lastName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("email")}
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("phoneNumber")}
                  </label>
                  <input
                    name="phoneNumber"
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("subject")}
                </label>

                <select
                  name="subject"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t("selectTopic")}</option>
                  <option value="general">{t("generalInquiry")}</option>
                  <option value="registration">{t("petRegistrationHelp")}</option>
                  <option value="search">{t("microchipSearchIssue")}</option>
                  <option value="lost-pet">{t("lostPetEmergency")}</option>
                  <option value="found-pet">{t("foundPetReport")}</option>
                  <option value="clinic">{t("veterinaryClinicServices")}</option>
                  <option value="success-story">{t("shareSuccessStory")}</option>
                  <option value="technical">{t("technicalSupport")}</option>
                  <option value="billing">{t("billingQuestion")}</option>
                  <option value="mp">{t("mp")}</option>
                  <option value="other">{t("other")}</option>
                </select>
              </div>

              {/* Microchip conditional field */}
              {showMicrochip && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("microchipNumber")}
                  </label>
                  <input
                    name="microchip_number"
                    maxLength={15}
                    placeholder={t("microchipPlaceholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              )}

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("priorityLevel")}
                </label>

                <select
                  name="priorityLevel"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t("selectpriorityLevel")}</option>
                  <option value="Low">{t("priority_Level_Low")}</option>
                  <option value="Normal">{t("Priority_Level_Normal")}</option>
                  <option value="Urgent">{t("Priority_Level_Urgent")}</option>
                  <option value="Emergency">{t("Priority_Level_Emergency")}</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("message")}
                </label>
                <textarea
                  name="message"
                  rows={6}
                  required
                  placeholder={t("messagePlaceholder")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>{t("sending")}</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>{t("sendButton")}</span>
                  </>
                )}
              </button>

              {/* Status Text */}
              {submitMessage && (
                <p
                  className={`text-sm text-center ${
                    submitMessage === t("successMessage")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {submitMessage}
                </p>
              )}

              <p className="text-sm text-gray-500 text-center">
                {t("responseNote")}
              </p>
            </form>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* Contact Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {t("generalContact")}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    {t("phoneSupport")}
                  </p>
                  <Link
                    href="tel:+962798980504"
                    className="text-pet-primary [direction:ltr] [unicode-bidi:bidi-override] hover:text-blue-600"
                  >
                    {t("phone")}
                  </Link>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    {t("emailSupport")}
                  </p>
                  <Link
                    href="mailto:Info@chipthem.com"
                    className="text-pet-primary hover:text-blue-600"
                  >
                    {t("supportEmail")}
                  </Link>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {t("businessHours")}
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>{t("businessHoursSatThu")}</p>
                <p>{t("businessHoursFri")}</p>
              </div>
            </div>

            {/* Quick Help Links */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {t("quickHelp")}
              </h3>

              <div className="space-y-2 text-sm">
                <Link href="/search" className="block text-pet-primary hover:text-blue-600">
                  {t("searchFoundPet")}
                </Link>

                <Link href="/lostfound" className="block text-pet-primary hover:text-blue-600">
                  {t("reportLostPet")}
                </Link>

                <Link href="/registerpet" className="block text-pet-primary hover:text-blue-600">
                  {t("registerPet")}
                </Link>

                <Link href="/findclinic" className="block text-pet-primary hover:text-blue-600">
                  {t("findClinic")}
                </Link>

                <Link href="/about" className="block text-pet-primary hover:text-blue-600">
                  {t("learnAboutChips")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
