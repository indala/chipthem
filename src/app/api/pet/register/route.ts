import { NextResponse, NextRequest } from 'next/server';

// Define the expected minimal structure for request body (optional, but good practice)
interface RegistrationRequestData {
  fullName: string;
  email: string;
  password: string;
  microchipNumber: string;
}

/**
 * Handle POST requests for user and pet registration.
 * Endpoint: /api/admin/register
 */
export async function POST(request: NextRequest) {
  try {
    const data: RegistrationRequestData = await request.json();

    // --- 1. Basic Server-Side Validation ---
    
    // Check for critical required fields
    if (!data.fullName || !data.email || !data.password || !data.microchipNumber) {
      return NextResponse.json(
        { message: 'Missing required fields: fullName, email, password, and microchipNumber are essential.' },
        { status: 400 } // Bad Request
      );
    }
    
    // --- 2. Simulation Logic (DEMO DATA) ---
    
    // Simulate a pre-existing user (e.g., email or ID conflict)
    if (data.email === 'test@conflict.com') {
      return NextResponse.json(
        { message: 'This email is already registered.' },
        { status: 409 } // Conflict
      );
    }

    // Simulate an existing microchip number conflict
    if (data.microchipNumber === '123456789012345') {
      return NextResponse.json(
        { message: 'The microchip number is already associated with another account.' },
        { status: 409 } // Conflict
      );
    }

    // --- 3. Mock Success Response ---
    
    // In a real application, you would:
    // 1. Hash the password.
    // 2. Save the owner and pet data to your database.
    // 3. Send a confirmation email.

    const mockResponse = {
      success: true,
      message: 'Registration successful! Redirecting to confirmation page.',
      userId: 'mock-user-' + Math.random().toString(36).substring(2, 9),
      petId: 'mock-pet-' + Math.random().toString(36).substring(2, 9),
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return a successful response
    return NextResponse.json(mockResponse, { status: 201 }); // Created
    
  } catch (error) {
    console.error('API Registration Error:', error);
    
    return NextResponse.json(
      { message: 'Internal Server Error during registration process.' },
      { status: 500 }
    );
  }
}

// Optional: Prevent other HTTP methods if not needed
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}