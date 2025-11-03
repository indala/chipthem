import { NextRequest, NextResponse } from 'next/server';

// Define the expected structure for the incoming request body
// NOTE: This should match the formData state structure from the client component
interface RegistrationData {
    email: string;
    password: string;
    confirmPassword: string;
    clinicName: string;
    contact_person: string;
    veterinaryLicenseNumber: string;
    phone: string;
    alt_phone: string;
    website: string;
    yearsInPractice: string;
    streetAddress: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    operatingHours: string;
    provides24HourEmergency: boolean;
    microchip_services: boolean;
    hasMicrochipScanners: boolean;
    scannerTypes: string;
    additionalServices: string;
    specializations: string;
    termsAccepted: boolean;
    dataAccuracyConfirmed: boolean;
    professionalConfirmation: boolean;
    consentForReferrals: boolean;
    emailUpdatesOptIn: boolean;
}

// Handler for POST requests to /api/veterinary/register
export async function POST(request: NextRequest) {
    try {
        const data: RegistrationData = await request.json();

        // 1. Basic Data Validation (Check for required fields, license format, etc.)
        if (!data.email || !data.password || !data.clinicName || !data.country) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields.' }, 
                { status: 400 } // Bad Request
            );
        }

        // The client already checks for password match, but a server-side check is good practice
        if (data.password !== data.confirmPassword) {
             return NextResponse.json(
                { success: false, message: 'Passwords do not match.' }, 
                { status: 400 }
            );
        }

        // 2. Database Operations (Placeholder)
        // In a real application, this is where you would:
        // - Hash the password (e.g., using bcrypt)
        // - Check if the email already exists in your database
        // - Save the new veterinary clinic and contact person to the database
        
        console.log('Attempting to register new clinic:', data.clinicName);
        // await db.saveClinic({ ...data, password: hashedPassword });
        
        // 3. Success Response
        // This is the response that triggers router.push('/registersuccessvet') in your client component
        return NextResponse.json(
            { success: true, message: 'Registration successful. Verification email sent.' },
            { status: 201 } // Created
        );

    } catch (error) {
        console.error('API Registration Error:', error);
        
        // 4. Error Response
        return NextResponse.json(
            { success: false, message: 'Internal server error during registration.' },
            { status: 500 } // Internal Server Error
        );
    }
}

// It's good practice to export a GET handler even if it's not used, 
// to prevent accidental direct access showing a generic 404/405 error.
export async function GET() {
    return NextResponse.json(
        { message: 'Method Not Allowed' }, 
        { status: 405 }
    );
}