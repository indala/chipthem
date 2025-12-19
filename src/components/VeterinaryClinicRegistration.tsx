"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useMemo } from "react";

// =======================================================
// 🛡️ ZOD VALIDATION SCHEMA
// =======================================================

const buildVetRegistrationSchema = (t: (key: string) => string) => {
  const phoneRegex = /^\d{7,15}$/;
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
  const googleMapsRegex =
    /^(https?:\/\/)?(maps\.google\.[a-z.]+\/|((www\.)?google\.[a-z.]+\/maps\/)|(goo\.gl\/maps\/)|(maps\.app\.goo\.gl\/))/;

  const requiredCheckbox = (msg: string) =>
    z.boolean().refine(v => v === true, { message: msg });

  return z
    .object({
      email: z.string().email({ message: t("errors.invalidEmail") }),

      password: z
        .string()
        .min(10, { message: t("errors.passwordTooShort") })
        .regex(strongPasswordRegex, {
          message: t("errors.passwordNotStrong"),
        }),

      confirmPassword: z.string(),

      clinicName: z
        .string()
        .min(1, { message: t("errors.clinicNameRequired") }),
      contact_person: z
        .string()
        .min(1, { message: t("errors.contactPersonRequired") }),

      veterinaryLicenseNumber: z.string().optional(),

      phone: z.string().regex(phoneRegex, { message: t("errors.invalidPhone") }),

      alt_phone: z
        .string()
        .optional()
        .refine(val => !val || phoneRegex.test(val), {
          message: t("errors.invalidAltPhone"),
        }),

      website: z
        .string()
        .url({ message: t("errors.invalidWebsite") })
        .optional()
        .or(z.literal("")),

      googleMapsUrl: z
        .string()
        .min(1, { message: t("errors.googleMapsUrlRequired") })
        .refine(val => googleMapsRegex.test(val), {
          message: t("errors.invalidGoogleMapsUrl"),
        }),

      yearsInPractice: z
        .number()
        .min(0, { message: t("errors.invalidYearsPractice") })
        .max(100, { message: t("errors.invalidYearsPractice") }),

      streetAddress: z
        .string()
        .min(1, { message: t("errors.streetAddressRequired") }),
      city: z.string().min(1, { message: t("errors.cityRequired") }),
      stateProvince: z.string().optional(),
      postalCode: z.string().optional(),

      country: z.string().min(1, { message: t("errors.countryRequired") }),

      operatingHours: z
        .string()
        .min(10, { message: t("errors.operatingHoursRequired") }),

      provides24HourEmergency: z.boolean(),
      microchip_services: z.boolean(),
      hasMicrochipScanners: z.boolean(),

      scannerTypes: z.string().max(500).optional(),
      additionalServices: z.string().max(500).optional(),
      specializations: z.string().max(255).optional(),

      termsAccepted: requiredCheckbox(t("errors.termsRequired")),
      dataAccuracyConfirmed: requiredCheckbox(
        t("errors.dataAccuracyRequired")
      ),
      professionalConfirmation: requiredCheckbox(
        t("errors.professionalConfirmationRequired")
      ),
      consentForReferrals: requiredCheckbox(
        t("errors.consentForReferralsRequired")
      ),

      emailUpdatesOptIn: z.boolean(),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: t("errors.passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });
};

type VetRegistrationFormSchema = ReturnType<typeof buildVetRegistrationSchema>;
type VetRegistrationFormData = z.infer<VetRegistrationFormSchema>;

// =======================================================
// 🏋️‍♀️ PASSWORD STRENGTH METER COMPONENT
// =======================================================

const PasswordStrengthMeter = ({ password = "" }: { password?: string }) => {
  const t = useTranslations("VetRegister.passwordStrength");

  const strength = useMemo(() => {
    let score = 0;
    if (!password) return score;

    if (password.length >= 10) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;

    return score;
  }, [password]);

  const getStrengthLabel = () => {
    switch (strength) {
      case 0:
      case 1:
        return t("weak");
      case 2:
      case 3:
        return t("medium");
      case 4:
        return t("strong");
      case 5:
        return t("veryStrong");
      default:
        return "";
    }
  };

  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
  ];

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-gray-600">
          {t("title")}
        </span>
        <span className="text-xs font-bold text-gray-700">
          {getStrengthLabel()}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full ${
              strength > index ? strengthColors[strength - 1] : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// =======================================================
// 🏥 VETERINARY CLINIC REGISTRATION COMPONENT
// =======================================================

const VeterinaryClinicRegistration = () => {
  const t = useTranslations("VetRegister");
  const tCommon = useTranslations("Common");
  const router = useRouter();

  const schema = buildVetRegistrationSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<VetRegistrationFormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      clinicName: "",
      contact_person: "",
      veterinaryLicenseNumber: "",
      phone: "",
      alt_phone: "",
      website: "",
      googleMapsUrl: "",
      yearsInPractice: 0,
      streetAddress: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      country: "",
      operatingHours: t("defaultHours"),
      provides24HourEmergency: false,
      microchip_services: true,
      hasMicrochipScanners: true,
      scannerTypes: "",
      additionalServices: "",
      specializations: "",
      termsAccepted: false,
      dataAccuracyConfirmed: false,
      professionalConfirmation: false,
      consentForReferrals: false,
      emailUpdatesOptIn: false,
    },
  });

  const [apiError, setApiError] = useState("");
  const passwordValue = useWatch({ control, name: "password" });

  const onSubmit = async (data: VetRegistrationFormData) => {
    setApiError("");
    try {
      const response = await fetch("/api/veterinary/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        router.push("/registersuccessvet");
      } else {
        setApiError(
          result.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      setApiError("An unexpected network error occurred.");
    }
  };

  const renderError = (fieldName: keyof VetRegistrationFormData) =>
    errors[fieldName] && (
      <p className="text-sm text-red-600 mt-1">
        {errors[fieldName]?.message}
      </p>
    );




    return (
        <section className="pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {t('form.title')}
                        </h2>
                        <p className="text-gray-600">
                            {t('form.subtitle')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8">
                        {apiError && (
                            <div className="mb-6 p-4 text-sm text-red-800 rounded-lg bg-red-50 font-semibold border border-red-200" role="alert">
                                {apiError}
                            </div>
                        )}
                        
                        <div className="mb-12">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                <span className="bg-green-600 text-white w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold mr-3">1</span>
                                {t('accountInfo')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('email')}</label>
                                    <input
                                        type="email"
                                        {...register("email")}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                                        placeholder={t('emailPlaceholder')}
                                    />
                                    {renderError("email")}
                                </div>
                                <div />
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('password')}</label>
                                    <input
                                        type="password"
                                        {...register("password")}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                                        placeholder={t('passwordPlaceholder')}
                                    />
                                    {renderError("password")}
                                    <PasswordStrengthMeter password={passwordValue} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('confirmPassword')}</label>
                                    <input
                                        type="password"
                                        {...register("confirmPassword")}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                                        placeholder={t('confirmPasswordPlaceholder')}
                                    />
                                    {renderError("confirmPassword")}
                                </div>
                            </div>
                        </div>

                        <div className="mb-12">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                <span className="bg-blue-600 text-white w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold mr-3">2</span>
                                {t('clinicInfo')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('clinicName')}</label>
                                    <input type="text" {...register("clinicName")} maxLength={100} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600" placeholder={t('clinicNamePlaceholder')} />
                                    {renderError("clinicName")}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('contactPerson')}</label>
                                    <input type="text" {...register("contact_person")} maxLength={100} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600" placeholder={t('contactPersonPlaceholder')} />
                                    {renderError("contact_person")}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('licenseNumber')}</label>
                                    <input type="text" {...register("veterinaryLicenseNumber")} maxLength={50} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600" placeholder={t('licenseNumberPlaceholder')} />
                                    {renderError("veterinaryLicenseNumber")}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('phone')}</label>
                                    <input type="tel" {...register("phone")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600" placeholder={t('phonePlaceholder')} />
                                    {renderError("phone")}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('altPhone')}</label>
                                    <input type="tel" {...register("alt_phone")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600" placeholder={t('altPhonePlaceholder')} />
                                    {renderError("alt_phone")}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('website')}</label>
                                    <input type="url" {...register("website")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600" placeholder={t('websitePlaceholder')} />
                                    {renderError("website")}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('yearsPractice')}</label>
                                    <input type="number" {...register("yearsInPractice",{ valueAsNumber: true })}  pattern="[0-9]{1,3}" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600" placeholder={t('yearsPracticePlaceholder')} />
                                    {renderError("yearsInPractice")}
                                </div>
                            </div>
                        </div>

                        <div className="mb-12">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                <span className="bg-purple-600 text-white w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold mr-3">3</span>
                                {t('locationInfo')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('streetAddress')}</label>
                                    <input type="text" {...register("streetAddress")} maxLength={150} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600" placeholder={t('streetAddressPlaceholder')} />
                                    {renderError("streetAddress")}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('city')}</label>
                                    <input type="text" {...register("city")} maxLength={50} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600" placeholder={t('cityPlaceholder')} />
                                    {renderError("city")}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('stateProvince')}</label>
                                    <input type="text" {...register("stateProvince")} maxLength={50} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600" placeholder={t('stateProvincePlaceholder')} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('postalCode')}</label>
                                    <input type="text" {...register("postalCode")} maxLength={20} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600" placeholder={t('postalCodePlaceholder')} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('country')}</label>
                                    <input type="text" {...register("country")} maxLength={50} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600" placeholder={t('countryPlaceholder')} />
                                    {renderError("country")}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('googleMapsUrl')}</label>
                                    <input type="url" {...register("googleMapsUrl")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600" placeholder={t('googleMapsUrlPlaceholder')} />
                                    {renderError("googleMapsUrl")}
                                </div>
                            </div>
                        </div>

                        <div className="mb-12">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                <span className="bg-orange-600 text-white w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold mr-3">4</span>
                                {t('hoursOperation')}
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('operatingHours')}</label>
                                    <textarea {...register("operatingHours")} rows={7} maxLength={500} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600" placeholder={t('hoursPlaceholder')} />
                                    {renderError("operatingHours")}
                                </div>
                                <div>
                                    <label className="flex items-center">
                                        <input type="checkbox" {...register("provides24HourEmergency")} className="mr-3 h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded" />
                                        <span className="text-sm font-semibold text-gray-700">{t('emergencyServices')}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mb-12">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                <span className="bg-indigo-600 text-white w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold mr-3">5</span>
                                {t('microchipServices')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="flex items-center mb-4">
                                        <input type="checkbox" {...register("microchip_services")} className="mr-3 h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded" />
                                        <span className="text-sm font-semibold text-gray-700">{t('microchipImplant')}</span>
                                    </label>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="flex items-center mb-4">
                                        <input type="checkbox" {...register("hasMicrochipScanners")} className="mr-3 h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded" />
                                        <span className="text-sm font-semibold text-gray-700">{t('scannersAvailable')}</span>
                                    </label>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('scannerTypes')}</label>
                                    <input type="text" {...register("scannerTypes")} maxLength={500} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600" placeholder={t('scannerTypesPlaceholder')} />
                                    {renderError("scannerTypes")}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('additionalServices')}</label>
                                    <textarea {...register("additionalServices")} rows={3} maxLength={500} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600" placeholder={t('additionalServicesPlaceholder')} />
                                    {renderError("additionalServices")}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('specializations')}</label>
                                    <input type="text" {...register("specializations")} maxLength={255} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600" placeholder={t('specializationsPlaceholder')} />
                                    {renderError("specializations")}
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                <span className="bg-red-600 text-white w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold mr-3">6</span>
                                {t('termsAgreement')}
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-6 border">
                                <h4 className="font-semibold text-gray-800 mb-4">{t('termsAgreement')}</h4>
                                <div className="space-y-3">
                                    <label className="flex items-start">
                                        <input type="checkbox" {...register("termsAccepted")} className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded" />
                                        <span className="text-sm text-gray-700">
                                            {t('termsAgree')}{" "}
                                            <Link href="/terms" className="text-green-600 hover:underline">{t('termsOfService')}</Link> {" "}
                                            {tCommon('and')}{" "}
                                            <Link href="/privacy" className="text-green-600 hover:underline">{t('privacyPolicy')}</Link>
                                        </span>
                                    </label>
                                    {renderError("termsAccepted")}
                                    <label className="flex items-start">
                                        <input type="checkbox" {...register("dataAccuracyConfirmed")} className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded" />
                                        <span className="text-sm text-gray-700">{t('infoAccurate')}</span>
                                    </label>
                                    {renderError("dataAccuracyConfirmed")}
                                    <label className="flex items-start">
                                        <input type="checkbox" {...register("professionalConfirmation")} className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded" />
                                        <span className="text-sm text-gray-700">{t('licensedProfessional')}</span>
                                    </label>
                                    {renderError("professionalConfirmation")}
                                    <label className="flex items-start">
                                        <input type="checkbox" {...register("consentForReferrals")} className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded" />
                                        <span className="text-sm text-gray-700">{t('dataUsageConsent')}</span>
                                    </label>
                                    {renderError("consentForReferrals")}
                                    <label className="flex items-start">
                                        <input type="checkbox" {...register("emailUpdatesOptIn")} className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded" />
                                        <span className="text-sm text-gray-700">{t('emailUpdates')}</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                                }`}
                            >
                                {isSubmitting ? tCommon('loading') || 'Submitting...' : t('submitButton')}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /> 
                        </svg>
                        <div>
                            <h4 className="font-semibold text-blue-800">{t('verificationTitle')}</h4>
                            <p className="text-blue-700 text-sm">{t('verificationDesc')}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold text-green-800 mb-3">{t('benefitsTitle')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-700 text-sm">
                        {[
                            t('benefit1'),
                            t('benefit2'),
                            t('benefit3'),
                            t('benefit4'),
                        ].map((benefit, idx) => (
                            <div key={idx} className="flex items-center">
                                <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VeterinaryClinicRegistration