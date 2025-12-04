"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl"; // Keeping the translation hook for structural text

// =======================================================
// 🛡️ STRONG VALIDATION HELPERS
// =======================================================

/**
 * 1. Stricter Email Validation
 */
const isValidEmail = (email: string): boolean => {
    // Regex ensures a standard email format: letters, numbers, specific symbols (._%+-) 
    // in the local part, @, domain (letters, numbers, hyphens), and TLD of 2+ chars.
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

/**v
 * 2. Stricter Phone Validation
 * - Cleans phone number before validation.
 */
const isValidPhone = (phone: string, isRequired: boolean): boolean => {
    // Remove common formatting characters like spaces, parentheses, and dashes
    const cleanedPhone = phone.replace(/[\s()+-]/g, ''); 
    
    if (isRequired && cleanedPhone.length === 0) return false;
    if (cleanedPhone.length === 0) return true; // Allows optional fields to be empty

    // Check if it's strictly digits and within a reasonable length (7 to 15 digits)
    const phoneRegex = /^\d{7,15}$/; 
    return phoneRegex.test(cleanedPhone);
};

/**
 * 3. Strong Password Validation
 * - Enforces minimum length and character complexity.
 */
const isStrongPassword = (password: string): boolean => {
    // Increased minimum length to 10 for better security
    if (password.length < 10) return false; 
    
    // Requires: 1+ lowercase, 1+ uppercase, 1+ digit, 1+ special character (!@#$%^&*)
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,}$/;
    return strongRegex.test(password);
};

/**
 * 4. Website URL Validation
 * - Checks for basic domain structure and optional protocols.
 */
const isValidWebsite = (url: string): boolean => {
    if (url.trim() === "") return true; // Optional field allowed to be empty
    const urlRegex = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})$/;
    return urlRegex.test(url.trim());
};

/**
 * 5. Alpha-Space Validation (for names and city/country)
 * - Restricts input to letters (including accented characters), spaces, hyphens, and periods.
 */
const isAlphaSpace = (text: string): boolean => {
    if (text.trim() === "") return false;
    // The 'u' flag enables Unicode property escapes (\p{L} for any letter).
    const alphaSpaceRegex = /^[\p{L}\s.-]+$/u; 
    return alphaSpaceRegex.test(text.trim());
};


// =======================================================
// 🏥 VETERINARY CLINIC REGISTRATION COMPONENT
// =======================================================

const VeterinaryClinicRegistration = () => {
    // Keeping these hooks as they handle the overall component localization
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

        // --- A. ACCOUNT VALIDATION ---
        
        // A1. Required Fields: Email, Password, Confirm Password
        if (!formData.email || !formData.password || !formData.confirmPassword) {
            setErrorMessage("Please fill in all required account fields (Email, Password, Confirm Password).");
            return false;
        }

        // A2. Password Match
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("The passwords do not match.");
            return false;
        }

        // A3. Email Format
        if (!isValidEmail(formData.email)) {
            setErrorMessage("Please enter a valid email address format.");
            return false;
        }

        // A4. Password Strength (now stronger)
        if (!isStrongPassword(formData.password)) {
            setErrorMessage("Password must be at least 10 characters and include uppercase, lowercase, a number, and a special character (!@#$%^&*).");
            return false;
        }
        
        // --- B. CLINIC & CONTACT VALIDATION (Required Field Check & Format Check) ---

        // B1. Required Clinic/Address Fields
        if (!formData.clinicName.trim() || !formData.contact_person.trim() || !formData.phone.trim() || 
            !formData.streetAddress.trim() || !formData.city.trim() || !formData.country.trim()) {
            setErrorMessage("Please fill in all required Clinic and Address fields.");
            return false;
        }

        // B2. Name/Location Fields (Alpha-Space Check to prevent simple injection)
        if (!isAlphaSpace(formData.clinicName) || !isAlphaSpace(formData.contact_person) || 
            (formData.stateProvince && formData.stateProvince.trim() !== "" && !isAlphaSpace(formData.stateProvince)) || 
            !isAlphaSpace(formData.city) || !isAlphaSpace(formData.country)) {
            setErrorMessage("Name, City, State/Province, and Country fields can only contain letters, spaces, hyphens, and periods."); 
            return false;
        }

        // B3. Phone Number Format (Primary Phone is required, so pass 'true')
        if (!isValidPhone(formData.phone, true)) {
            setErrorMessage("The primary phone number format is invalid. Must be between 7 and 15 digits.");
            return false;
        }
        
        // B4. Alt Phone (Optional, but if filled, must be valid)
        if (formData.alt_phone.trim() !== "" && !isValidPhone(formData.alt_phone, false)) {
             setErrorMessage("The alternative phone number format is invalid. Must be between 7 and 15 digits.");
             return false;
        }

        // B5. Website URL
        if (formData.website.trim() !== "" && !isValidWebsite(formData.website)) {
            setErrorMessage("The website URL format is invalid. Please include http:// or https:// or www.");
            return false;
        }
        
        // B6. Years in Practice (Numeric, Non-Negative, and Reasonable Range)
        const years = parseInt(formData.yearsInPractice);
        if (formData.yearsInPractice.trim() !== "" && (isNaN(years) || years < 0 || years > 100)) {
            setErrorMessage("Years in practice must be a reasonable non-negative number (0-100).");
            return false;
        }
        
        // B7. License Number & Postal Code (Allow Alphanumeric, spaces, and hyphens/dashes)
        const codeRegex = /^[a-zA-Z0-9\s-]+$/;
        
        if (formData.veterinaryLicenseNumber.trim() !== "" && !codeRegex.test(formData.veterinaryLicenseNumber.trim())) {
             setErrorMessage("Veterinary license number can only contain letters, numbers, spaces, and hyphens.");
             return false;
        }
        
        if (formData.postalCode.trim() !== "" && !codeRegex.test(formData.postalCode.trim())) {
            setErrorMessage("Postal code can only contain letters, numbers, spaces, and hyphens.");
            return false;
        }

        // B8. Operating Hours (Simple length check to ensure it's not accidentally deleted)
        if (formData.operatingHours.length < 10) {
            setErrorMessage("Please provide valid operating hours.");
            return false;
        }

        // B9. Long Text Fields (Additional Services, Scanner Types, Specializations)
        // Set a max length (e.g., 500 chars)
        const maxLen = 500;
        if (formData.additionalServices.length > maxLen || formData.scannerTypes.length > maxLen || formData.specializations.length > maxLen) {
            setErrorMessage(`Text fields (Services, Scanners, Specializations) cannot exceed ${maxLen} characters.`);
            return false;
        }

        // --- C. MANDATORY CHECKBOXES ---

        if (!formData.termsAccepted || !formData.dataAccuracyConfirmed || !formData.professionalConfirmation || !formData.consentForReferrals) {
            setErrorMessage("You must agree to all mandatory terms and confirmations to register.");
            return false;
        }

        return true;
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // RUN VALIDATION
        if (!validateForm()) {
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
                setErrorMessage(result.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage("An unexpected network error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    // =======================================================
    // 🎨 COMPONENT JSX (INCLUDING THE PROVIDED HALF)
    // =======================================================
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
                        {/* Display Error Message (placed higher for better visibility) */}
                        {errorMessage && (
                            <div className="mb-6 p-4 text-sm text-red-800 rounded-lg bg-red-50 font-semibold border border-red-200" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        
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
                                        {t('email')} 
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
                                        {t('password')} 
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        required
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
                                        {t('confirmPassword')} 
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
                                        {t('clinicName')} 
                                    </label>
                                    <input
                                        type="text"
                                        name="clinicName"
                                        required
                                        maxLength={100} 
                                        value={formData.clinicName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('clinicNamePlaceholder')}
                                    />
                                </div>

                                {/* Contact Person */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('contactPerson')} 
                                    </label>
                                    <input
                                        type="text"
                                        name="contact_person"
                                        required
                                        maxLength={100} 
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
                                        maxLength={50} 
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
                                        {t('phone')} 
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
                                        max={100} 
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
                                        {t('streetAddress')} 
                                    </label>
                                    <input
                                        type="text"
                                        name="streetAddress"
                                        required
                                        maxLength={150} 
                                        value={formData.streetAddress}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('streetAddressPlaceholder')}
                                    />
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('city')} 
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        maxLength={50}
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
                                        maxLength={50}
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
                                        maxLength={20}
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('postalCodePlaceholder')}
                                    />
                                </div>

                                {/* Country */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('country')} 
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        required
                                        maxLength={50}
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
                                        {t('operatingHours')} 
                                    </label>
                                    <textarea
                                        name="operatingHours"
                                        rows={7}
                                        required
                                        maxLength={500}
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
                                        maxLength={500}
                                        value={formData.scannerTypes}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('scannerTypesPlaceholder')}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {t('scannerNote')}
                                    </p>
                                </div>

                                {/* Additional Services */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                         {t('additionalServices')}
                                    </label>
                                    <textarea
                                        name="additionalServices"
                                        rows={3}
                                        maxLength={500}
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
                                        maxLength={255}
                                        value={formData.specializations}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"
                                        placeholder={t('specializationsPlaceholder')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms and Agreement Section */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                <span className="bg-red-600 text-white w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-bold mr-3">
                                    6
                                </span>
                                {t('termsAgreement')}
                            </h3>
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
                                            {t('infoAccurate')} 
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
                                            {t('licensedProfessional')} 
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
                                            {t('dataUsageConsent')} 
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

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                                    isLoading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                                }`}
                            >
                                {isLoading ? tCommon('loading') || 'Submitting...' : t('submitButton')}
                            </button>
                          
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