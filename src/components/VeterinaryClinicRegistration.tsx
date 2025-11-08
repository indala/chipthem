"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

// --- VALIDATION HELPERS ---

// Basic Email validation (more comprehensive validation should be server-side)
const isValidEmail = (email: string): boolean => {
    // Basic regex for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Simple phone number validation (allows numbers, spaces, dashes, and parentheses)
const isValidPhone = (phone: string): boolean => {
    // Allows 10-15 digits, optionally with basic international formatting (parentheses, spaces, dashes)
    const phoneRegex = /^[\d\s()+-]{7,20}$/; 
    return phoneRegex.test(phone.trim()) || phone.trim() === "";
};

// Password strength validation (e.g., at least 8 chars, one uppercase, one lowercase, one number)
const isStrongPassword = (password: string): boolean => {
    if (password.length < 8) return false;
    // Lookahead for at least one lowercase letter
    if (!/(?=.*[a-z])/.test(password)) return false; 
    // Lookahead for at least one uppercase letter
    if (!/(?=.*[A-Z])/.test(password)) return false; 
    // Lookahead for at least one digit
    if (!/(?=.*\d)/.test(password)) return false; 
    return true;
};

// --------------------------

const VeterinaryClinicRegistration = () => {
    const t = useTranslations("VetRegister");
    const tCommon = useTranslations("Common");
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        clinicName: "",
        contact_person: "",
        veterinaryLicenseNumber: "",
        phone: "",
        alt_phone: "",
        website: "",
        yearsInPractice: "",
        streetAddress: "",
        city: "",
        stateProvince: "",
        postalCode: "",
        country: "",
        operatingHours:
            "Monday: 8:00 AM - 6:00 PM\nTuesday: 8:00 AM - 6:00 PM\nWednesday: 8:00 AM - 6:00 PM\nThursday: 8:00 AM - 6:00 PM\nFriday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM\nSunday: Closed",
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
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    /**
     * Centralized validation logic for the entire form.
     * @returns boolean - true if validation passes, false otherwise.
     */
    const validateForm = () => {
        // Clear previous error
        setErrorMessage("");

        // 1. Password Match
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage(t('passwordMismatch'));
            return false;
        }

        // 2. Required Fields (Email, Clinic Name, Contact Person, Phone, Address, City, Country)
        if (!formData.email || !formData.clinicName || !formData.contact_person || !formData.phone || !formData.streetAddress || !formData.city || !formData.country) {
            setErrorMessage(t('missingRequiredFields'));
            return false;
        }

        // 3. Email Format
        if (!isValidEmail(formData.email)) {
            setErrorMessage(t('invalidEmailFormat'));
            return false;
        }

        // 4. Password Strength
        if (!isStrongPassword(formData.password)) {
            setErrorMessage(t('passwordNotStrong'));
            // You should define this translation key in your locale files
            // E.g. "passwordNotStrong": "Password must be at least 8 characters and include uppercase, lowercase, and a number."
            return false;
        }
        
        // 5. Phone Number Format
        if (!isValidPhone(formData.phone)) {
            setErrorMessage(t('invalidPhoneFormat'));
            return false;
        }
        
        // 6. Mandatory Checkboxes (Checked by HTML 'required', but good to double-check)
        if (!formData.termsAccepted || !formData.dataAccuracyConfirmed || !formData.professionalConfirmation || !formData.consentForReferrals) {
            setErrorMessage(t('mustAcceptTerms'));
            return false;
        }

        // Optional: Check if yearsInPractice is a reasonable number
        const years = parseInt(formData.yearsInPractice);
        if (formData.yearsInPractice && (isNaN(years) || years < 0 || years > 100)) {
            setErrorMessage(t('invalidYearsInPractice'));
            return false;
        }

        return true;
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // RUN VALIDATION
        if (!validateForm()) {
            // Error message is already set by validateForm()
            return;
        }

        setIsLoading(true);
        setErrorMessage(''); // Clear any existing errors before submission

        try {
            // NOTE: Using a relative API path assumes your Next.js project has a handler at this endpoint.
            const response = await fetch('/api/veterinary/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Send the sanitised data to the backend
                body: JSON.stringify(formData), 
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Use router.push() for Next.js navigation
                router.push('/registersuccessvet');
            } else {
                // Use backend error message, or a general failure message
                setErrorMessage(result.message || t('registrationFailed'));
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage(t('unexpectedError'));
        } finally {
            setIsLoading(false);
        }
    }; // <--- CLOSED THE FUNCTION

    return (
        <section className="pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {t('form.title')}
                        </h2>
                        <p className="text-gray-600">
                            {t('form.subtitle')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-8 py-8">
                        {/* Account Information Section */}
                        <div className="mb-12">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                <span className="bg-green-600 text-white w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold mr-3">
                                    1
                                </span>
                                {t('accountInfo')}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('email')} *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('emailPlaceholder')}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {t('emailNote')}
                                    </p>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('password')} *
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        // minLength is now handled by isStrongPassword check
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('passwordPlaceholder')}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">{t('passwordNote')}</p>
                                </div>

                                {/* Confirm Password */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('confirmPassword')} *
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('confirmPasswordPlaceholder')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Clinic Information Section */}
                        <div className="mb-12">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                <span className="bg-blue-600 text-white w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold mr-3">
                                    2
                                </span>
                                {t('clinicInfo')}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Clinic Name */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('clinicName')} *
                                    </label>
                                    <input
                                        type="text"
                                        name="clinicName"
                                        required
                                        value={formData.clinicName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('clinicNamePlaceholder')}
                                    />
                                </div>

                                {/* Contact Person */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('contactPerson')} *
                                    </label>
                                    <input
                                        type="text"
                                        name="contact_person"
                                        required
                                        value={formData.contact_person}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('contactPersonPlaceholder')}
                                    />
                                </div>

                                {/* License Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('licenseNumber')}
                                    </label>
                                    <input
                                        type="text"
                                        name="veterinaryLicenseNumber"
                                        value={formData.veterinaryLicenseNumber}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('licenseNumberPlaceholder')}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {t('licenseNote')}
                                    </p>
                                </div>

                                {/* Primary Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('phone')} *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('phonePlaceholder')}
                                    />
                                </div>

                                {/* Alternative Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('altPhone')}
                                    </label>
                                    <input
                                        type="tel"
                                        name="alt_phone"
                                        value={formData.alt_phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('altPhonePlaceholder')}
                                    />
                                </div>

                                {/* website */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('website')}
                                    </label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('websitePlaceholder')}
                                    />
                                </div>

                                {/* Years in Practice */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('yearsPractice')}
                                    </label>
                                    <input
                                        type="number"
                                        name="yearsInPractice"
                                        min={0}
                                        max={50}
                                        value={formData.yearsInPractice}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('yearsPracticePlaceholder')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Information Section */}
                        <div className="mb-12">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                <span className="bg-purple-600 text-white w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold mr-3">
                                    3
                                </span>
                                {t('locationInfo')}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* streetAddress */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('streetAddress')} *
                                    </label>
                                    <input
                                        type="text"
                                        name="streetAddress"
                                        required
                                        value={formData.streetAddress}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('streetAddressPlaceholder')}
                                    />
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('city')} *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('cityPlaceholder')}
                                    />
                                </div>

                                {/* stateProvince/Province */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('stateProvince')}
                                    </label>
                                    <input
                                        type="text"
                                        name="stateProvince"
                                        value={formData.stateProvince}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('stateProvincePlaceholder')}
                                    />
                                </div>

                                {/* Postal Code */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('postalCode')}
                                    </label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('postalCodePlaceholder')}
                                    />
                                </div>

                                {/* Country */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('country')} *
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        required
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('countryPlaceholder')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Hours of Operation Section */}
                        <div className="mb-12">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                <span className="bg-orange-600 text-white w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold mr-3">
                                    4
                                </span>
                                {t('hoursOperation')}
                            </h3>

                            <div className="grid grid-cols-1 gap-6">
                                {/* Operating Hours */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('operatingHours')} *
                                    </label>
                                    <textarea
                                        name="operatingHours"
                                        rows={7}
                                        required
                                        value={formData.operatingHours}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('hoursPlaceholder')}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {t('hoursNote')}
                                    </p>
                                </div>

                                {/* Emergency Services */}
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="provides24HourEmergency"
                                            checked={formData.provides24HourEmergency}
                                            onChange={handleChange}
                                            value="1"
                                            className="mr-3 h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded"
                                        />
                                        <span className="text-sm font-semibold text-gray-700">
                                            {t('emergencyServices')}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Microchip Services Section */}
                        <div className="mb-12">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                <span className="bg-indigo-600 text-white w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold mr-3">
                                    5
                                </span>
                                {t('microchipServices')}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Microchip Services Available */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center mb-4">
                                        <input
                                            type="checkbox"
                                            name="microchip_services"
                                            checked={formData.microchip_services}
                                            onChange={handleChange}
                                            value="1"
                                            className="mr-3 h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded"
                                        />
                                        <span className="text-sm font-semibold text-gray-700">
                                            {t('microchipImplant')}
                                        </span>
                                    </label>
                                </div>

                                {/* Scanner Available */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center mb-4">
                                        <input
                                            type="checkbox"
                                            name="hasMicrochipScanners"
                                            checked={formData.hasMicrochipScanners}
                                            onChange={handleChange}
                                            value="1"
                                            className="mr-3 h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded"
                                        />
                                        <span className="text-sm font-semibold text-gray-700">
                                            {t('scannersAvailable')}
                                        </span>
                                    </label>
                                </div>

                                {/* Scanner Types */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('scannerTypes')}
                                    </label>
                                    <input
                                        type="text"
                                        name="scannerTypes"
                                        value={formData.scannerTypes}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('scannerTypesPlaceholder')}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {t('scannerNote')}
                                    </p>
                                </div>

                                {/* Services Offered */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('additionalServices')}
                                    </label>
                                    <textarea
                                        name="additionalServices"
                                        rows={3}
                                        value={formData.additionalServices}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('additionalServicesPlaceholder')}
                                    />
                                </div>

                                {/* Specializations */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('specializations')}
                                    </label>
                                    <input
                                        type="text"
                                        name="specializations"
                                        value={formData.specializations}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('specializationsPlaceholder')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms and Agreement */}
                        <div className="mb-8">
                            <div className="bg-gray-50 rounded-lg p-6 border">
                                <h4 className="font-semibold text-gray-800 mb-4">
                                    {t('termsAgreement')}
                                </h4>
                                <div className="space-y-3">
                                    {/* Terms Accepted Checkbox */}
                                    <label className="flex items-start">
                                        <input
                                            type="checkbox"
                                            name="termsAccepted"
                                            required
                                            checked={formData.termsAccepted}
                                            onChange={handleChange}
                                            className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {t('termsAgree')}{" "}
                                            <Link
                                                href="/terms" 
                                                className="text-green-600 hover:underline"
                                            >
                                                {t('termsOfService')}
                                            </Link>{" "}
                                            {tCommon('and')}{" "}
                                            <Link
                                                href="/privacy" 
                                                className="text-green-600 hover:underline"
                                            >
                                                {t('privacyPolicy')}
                                            </Link>{" "}
                                            *
                                        </span>
                                    </label>
                                    
                                    {/* Data Accuracy Checkbox */}
                                    <label className="flex items-start">
                                        <input
                                            type="checkbox"
                                            name="dataAccuracyConfirmed"
                                            required
                                            checked={formData.dataAccuracyConfirmed}
                                            onChange={handleChange}
                                            className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {t('infoAccurate')} *
                                        </span>
                                    </label>
                                    
                                    {/* Professional Confirmation Checkbox */}
                                    <label className="flex items-start">
                                        <input
                                            type="checkbox"
                                            name="professionalConfirmation"
                                            required
                                            checked={formData.professionalConfirmation}
                                            onChange={handleChange}
                                            className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {t('licensedProfessional')} *
                                        </span>
                                    </label>
                                    
                                    {/* Consent for Referrals Checkbox */}
                                    <label className="flex items-start">
                                        <input
                                            type="checkbox"
                                            name="consentForReferrals"
                                            required
                                            checked={formData.consentForReferrals}
                                            onChange={handleChange}
                                            className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {t('dataUsageConsent')} *
                                        </span>
                                    </label>
                                    
                                    {/* Email Updates Opt-In Checkbox */}
                                    <label className="flex items-start">
                                        <input
                                            type="checkbox"
                                            name="emailUpdatesOptIn"
                                            checked={formData.emailUpdatesOptIn}
                                            onChange={handleChange}
                                            className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {t('emailUpdates')}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <svg
                                        className="w-5 h-5 text-red-600 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        focusable="false"
                                    >
                                        {/* Error/Alert Icon path */}
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /> 
                                    </svg>
                                    <span className="text-red-800 text-sm">{errorMessage}</span>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`bg-gradient-to-r from-green-600 to-blue-600 text-white px-12 py-4 rounded-xl text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? tCommon('loading') || 'Submitting...' : t('submitButton')}
                            </button>
                            <p className="text-sm text-gray-500 mt-4">
                                {t('submitNote')}
                            </p>
                        </div>
                    </form>
                </div>

                {/* Information Notice */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <svg
                            className="w-6 h-6 text-blue-600 mr-3"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            focusable="false"
                        >
                            {/* Info Icon path */}
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /> 
                        </svg>
                        <div>
                            <h4 className="font-semibold text-blue-800">{t('verificationTitle')}</h4>
                            <p className="text-blue-700 text-sm">
                                {t('verificationDesc')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold text-green-800 mb-3">
                        {t('benefitsTitle')}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-700 text-sm">
                        {[
                            t('benefit1'),
                            t('benefit2'),
                            t('benefit3'),
                            t('benefit4'),
                        ].map((benefit, idx) => (
                            <div key={idx} className="flex items-center">
                                <svg
                                    className="w-4 h-4 text-green-600 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                    focusable="false"
                                >
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

export default VeterinaryClinicRegistration;