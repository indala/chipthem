'use client';

// 1. Core Imports
import { useState, ComponentPropsWithoutRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";

// 2. Zod & React Hook Form Imports
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const requiredCheckbox = (msg: string) =>
        z.boolean().refine(v => v === true, { message: msg });

// --- ZOD SCHEMA DEFINITION ---
// Define the validation schema using Zod
const RegisterSchema = z.object({
    // --- Owner Info ---
    fullName: z.string().min(1, { message: 'fieldRequired' }),
    email: z.string().email({ message: 'invalidEmail' }),
    
    // Password uses the StrongPassword criteria
    password: z.string().min(8, { message: 'passwordNote' })
        .refine(val => /[a-z]/.test(val), { message: 'weakPassword' })
        .refine(val => /[A-Z]/.test(val), { message: 'weakPassword' })
        .refine(val => /\d/.test(val), { message: 'weakPassword' }),
        
    confirmPassword: z.string().min(8, { message: 'fieldRequired' }),
    phoneNumber: z.string().min(7, { message: 'invalidPhone' })
        .refine(val => /^[\d\s()+-]{7,20}$/.test(val.trim()), { message: 'invalidPhone' }),
    
    streetAddress: z.string().min(1, { message: 'fieldRequired' }),
    city: z.string().min(1, { message: 'fieldRequired' }),
    country: z.string().min(1, { message: 'fieldRequired' }),
    
    // --- Pet Info ---
    microchipNumber: z.string().length(15, { message: 'microchipLength' }),
    petName: z.string().min(1, { message: 'fieldRequired' }),
    petType: z.string().min(1, { message: 'fieldRequired' }), // Assuming options are not empty
    breed: z.string().min(1, { message: 'fieldRequired' }),
    sex: z.string().min(1, { message: 'fieldRequired' }), // Assuming options are not empty
    primaryColor: z.string().min(1, { message: 'fieldRequired' }),

    // --- Terms & Conditions ---
    termsAccepted: requiredCheckbox("termsRequired"),
    dataAccuracyConfirmed: requiredCheckbox("dataAccuracyRequired"),
    ownershipConfirmed: requiredCheckbox("ownershipRequired"),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'passwordsMismatch',
    path: ['confirmPassword'], // Set the error on the confirmPassword field
});

 
// Infer the TypeScript type from the Zod schema
type FormData = z.infer<typeof RegisterSchema>;


// --- New Password Strength Meter Component (Logic Kept) ---
const PasswordStrengthMeter = ({ password = "" }: { password?: string }) => {
    const t = useTranslations("RegisterMenu"); 

    const strength = useMemo(() => {
        let score = 0;
        if (!password) return 0;
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
                return t('passwordStrength.weak');
            case 2:
            case 3:
                return t('passwordStrength.medium');
            case 4:
                return t('passwordStrength.strong');
            case 5:
                return t('passwordStrength.veryStrong');
            default:
                return "";
        }
    };
    
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
    const currentScore = strength > 0 ? strength - 1 : 0;

    return (
        <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-gray-600">{t('passwordStrength.title')}</span>
                <span className={`text-xs font-bold ${strength === 0 ? 'text-gray-400' : strengthColors[currentScore].replace('bg', 'text')}`}>
                    {getStrengthLabel()}
                </span>
            </div>
            <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div 
                        key={index} 
                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                            strength > index 
                                ? strengthColors[currentScore] 
                                : 'bg-gray-200'
                        }`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

// --- Main Component ---
const RegisterMenu = () => {
    const router = useRouter();
    const t = useTranslations('RegisterMenu');
    const locale = useLocale();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 3. Initialize React Hook Form
    const { 
        register, 
        handleSubmit: hookFormSubmit, // Rename handleSubmit to avoid conflict
        watch,
        formState: { errors } 
    } = useForm<FormData>({
        resolver: zodResolver(RegisterSchema),
        mode: 'onTouched', // Validate on blur/change
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            // ... (rest of the fields initialized to empty string/false)
            phoneNumber: '',
            streetAddress: '',
            city: '',
            country: '',
            microchipNumber: '',
            petName: '',
            petType: '',
            breed: '',
            sex: '',
            primaryColor: '',
            termsAccepted: false,
            dataAccuracyConfirmed: false,
            ownershipConfirmed: false,
        },
    });

    // Watch the password field for the strength meter
    const password = watch('password');


    // 4. New Submit Handler (Only contains API logic, validation is handled by RHF)
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setIsSubmitting(true);
        
        // --- API Call ---
        try {
            const res = await fetch('/api/pet/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            }); 
            
            const apiData = await res.json(); 

            if (!res.ok) {
                const errorMessage = apiData.message || t('registrationGenericError');
                toast.error(errorMessage);
                return;
            }
            
            // Success case
            toast.success(apiData.message || t('registrationSuccess'));
            router.push('/registersuccesspet');
        } catch (err) {
            console.error("Fetch Error:", err);
            toast.error(t('networkError'));
        } finally {
            setIsSubmitting(false);
        }
    };


    // 5. Modified Render Input - Uses RHF's register and displays Zod errors
    const renderInput = (
        name: keyof FormData,
        labelKey: string,
        type: string = 'text',
        placeholderKey?: string,
        extraProps: ComponentPropsWithoutRef<'input'> = {}
    ) => {
        const isPasswordField = name === 'password';
        const error = errors[name];

        return (
            <div className={isPasswordField ? 'col-span-1 md:col-span-2' : ''}>
                <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(labelKey)}
                </label>
                <input
                    id={name}
                    type={type}
                    // --- RHF Integration ---
                    {...register(name)}
                    // -----------------------
                    placeholder={placeholderKey ? t(placeholderKey) : ''}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200 
                        ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-pet-primary focus:border-transparent'}
                    `}
                    {...extraProps}
                />
                {/* --- Error Message Display --- */}
                {error && (
                    <p className="mt-1 text-sm text-red-600">
                        {/* Translate the error message code returned by Zod */}
                        {t(error.message as string, { field: t(labelKey) })}
                    </p>
                )}
                
                {isPasswordField && <PasswordStrengthMeter password={password} />}
            </div>
        );
    };

    // 6. Modified Render Select - Uses RHF's register
    const renderSelect = (name: keyof FormData, labelKey: string, options: { value: string, textKey: string }[]) => {
        const error = errors[name];

        return (
            <div>
                <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
                    {t(labelKey)}
                </label>
                <select
                    id={name}
                    // --- RHF Integration ---
                    {...register(name)}
                    // -----------------------
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200 
                        ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-pet-primary focus:border-transparent'}
                    `}
                >
                    <option value="">{t(`select${name.charAt(0).toUpperCase() + name.slice(1)}`)}</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {t(option.textKey)}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-1 text-sm text-red-600">
                        {t(error.message as string, { field: t(labelKey) })}
                    </p>
                )}
            </div>
        );
    };

    // 7. Modified Render Checkbox - Uses RHF's register
    // 7. Modified Render Checkbox - Uses RHF's register (FIXED)
const renderCheckbox = (name: keyof FormData, textKey: string, linkProps?: { href: string, linkTextKey: string }[]) => {
    // Determine the error object for the specific field
    const error = errors[name];
    
    // Check if the current language is RTL to control layout logic
    const isRTL = locale === 'ar'; 

    return (
        // Wrapper div for block spacing and proper flow
        <div>
            {/* The label/flex container handles the checkbox and text */}
            <label className={`flex items-start space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <input
                    type="checkbox"
                    // --- RHF Integration ---
                    {...register(name)}
                    // -----------------------
                    className={`mt-1 h-4 w-4 text-pet-primary border-gray-300 rounded shrink-0 ${isRTL ? 'ml-3' : ''}`}
                />
                <span className="text-sm text-gray-700">
                    {/* Checkbox Text */}
                    {t(textKey)}
                    {/* Link Props */}
                    {linkProps && linkProps.map((link, index) => (
                        <span key={link.href}>
                            {/* NOTE: You might need to adjust translation keys for 'and' depending on your i18n file structure. */}
                            {index > 0 && t('and')} <Link href={link.href} className="text-pet-primary hover:underline">{t(link.linkTextKey)}</Link>
                        </span>
                    ))}
                </span>
            </label>
            
            {/* --- Error Message Display (Placed outside the label for block flow) --- */}
            {error && (
                <p className={`mt-1 text-sm text-red-600 ${isRTL ? 'ms-auto ps-7' : 'pl-7'}`}>
                    {/* We only need to translate the error code from Zod here, which is 'acceptAllTerms' */}
                    {t(error.message as string)}
                </p>
            )}
        </div>
    );
};


    return (
        <section className="pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('title')}</h2>
                        <p className="text-gray-600">{t('subtitle')}</p>
                    </div>
                    {/* Use hookFormSubmit wrapper for form submission */}
                    <form onSubmit={hookFormSubmit(onSubmit)} className="px-8 py-8 space-y-10">
                        
                        {/* Owner Info */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                1. {t('ownerInfo')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Required fields automatically set by Zod schema */}
                                {renderInput('fullName', 'fullName', 'text')}
                                {renderInput('email', 'email', 'email')}
                                
                                {renderInput('password', 'password', 'password', undefined, { minLength: 8 })}
                                {renderInput('confirmPassword', 'confirmPassword', 'password', undefined, { minLength: 8 })}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-1 md:col-span-2">
                                    {renderInput('phoneNumber', 'phone', 'tel')}
                                    {renderInput('streetAddress', 'address', 'text')}
                                    {renderInput('city', 'city', 'text')}
                                    {renderInput('country', 'country', 'text')}
                                </div>
                            </div>
                        </div>

                        {/* Pet Info */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                2. {t('petInfo')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {renderInput('microchipNumber', 'microchipNumber', 'text', undefined, { maxLength: 15 })}
                                {renderInput('petName', 'petName', 'text')}
                                
                                {/* Pet Type Select */}
                                {renderSelect('petType', 'petType', [
                                    { value: "Dog", textKey: "dog" },
                                    { value: "Cat", textKey: "cat" },
                                    { value: "Bird", textKey: "bird" },
                                    { value: "Other", textKey: "other" },
                                ])}
                                
                                {renderInput('breed', 'breed', 'text')}
                                
                                {/* Sex Select */}
                                {renderSelect('sex', 'sex', [
                                    { value: "Male", textKey: "male" },
                                    { value: "Female", textKey: "female" },
                                    // Add other options if needed, e.g., maleNeutered, femaleSpayed
                                ])}
                                
                                {renderInput('primaryColor', 'primaryColor', 'text')}
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="bg-gray-50 rounded-lg p-6 border space-y-3">
                            {/* Terms and Privacy Policy Checkbox */}
                            {renderCheckbox('termsAccepted', 'agreeTo', [
                                { href: "/terms", linkTextKey: "termsOfService" },
                                { href: "/policy", linkTextKey: "privacyPolicy" },
                            ])}

                            {/* Data Accuracy Checkbox */}
                            {renderCheckbox('dataAccuracyConfirmed', 'certifyAccurate')}

                            {/* Ownership Checkbox */}
                            {renderCheckbox('ownershipConfirmed', 'confirmOwnership')}
                        </div>

                        {/* Submit */}
                        <div className="text-center mt-10">
                            <button
                                type="submit"
                                disabled={isSubmitting} // Disable during API call
                                className={`bg-gradient-to-r from-pet-primary to-pet-secondary text-white px-12 py-4 rounded-xl text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 ${
                                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin h-5 w-5" /> {t('submitting')}
                                    </span>
                                ) : (
                                    t('submitButton')
                                )}
                            </button>
                            <p className="text-sm text-gray-500 mt-4">{t('submitNote')}</p>
                        </div>
                    </form>
                </div>

                <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 flex items-center">
                    <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"></path>
                    </svg>
                    <div>
                        <h4 className="font-semibold text-green-800">{t('securityTitle')}</h4>
                        <p className="text-green-700 text-sm">{t('securityDesc')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RegisterMenu;