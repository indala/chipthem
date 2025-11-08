"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function ContactSend() {
  const t = useTranslations("Contact");
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const showMicrochip = subject === "microchip" || subject === "search";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    const formData = new FormData(e.currentTarget);
    const contactData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage(t("successMessage") || "Message sent successfully!");
        e.currentTarget.reset();
        setSubject("");
      } else {
        setSubmitMessage(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-blue-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {t("sendMessage")}
                </h2>
                <p className="text-blue-100">{t("responseTime")}</p>
              </div>

              <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                {/* Contact Information */}
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

                {/* Microchip field (conditional) */}
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

                {/* Priority Level */}
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? t("sending") : t("sendButton")}
                </button>

                {submitMessage && (
                  <p
                    className={`text-sm text-center ${
                      submitMessage.includes("success")
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
          </div>
                    {/* Contact Information Sidebar */}
          <div className="space-y-6">
            {/* General Contact */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{t('generalContact')}</h3>
              <div className="space-y-4">
                <div>
  <p className="text-sm text-gray-600 font-semibold">{t('phoneSupport')}</p>
  <Link href="tel:+1234567890" className="text-pet-primary hover:text-blue-600">
    {t('phone')}
  </Link>
</div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">{t('emailSupport')}</p>
                  <Link href="mailto:Info@chipthem.com" className="text-pet-primary hover:text-blue-600">
                    {t('supportEmail')}
                  </Link>

                </div>

              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{t('businessHours')}</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  {t('businessHoursSatThu')}
                  <br />
                  {t('businessHoursFri')}
                  <br />
                </p>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{t('quickHelp')}</h3>
              <div className="space-y-2">
                <Link href="/search" className="block text-sm text-pet-primary hover:text-blue-600">
                  {t('searchFoundPet')}
                </Link>
                <Link href="/lostfound" className="block text-sm text-pet-primary hover:text-blue-600">
                  {t('reportLostPet')}
                </Link>
                <Link href="/registerpet" className="block text-sm text-pet-primary hover:text-blue-600">
                  {t('registerPet')}
                </Link>
                <Link href="/findclinic" className="block text-sm text-pet-primary hover:text-blue-600">
                  {t('findClinic')}
                </Link>
                <Link href="/about" className="block text-sm text-pet-primary hover:text-blue-600">
                  {t('learnAboutChips')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
