
import { cookies } from 'next/headers';
import * as jose from 'jose';

// Define the expected structure of the JWT payload
interface TokenPayload {
  role: string;
  id: string; // Subject, which we use for the user's ID
  [key: string]: unknown; // Allow other properties
}

/**
 * Verifies the JWT from cookies and returns the entire payload.
 * It checks for 'admin_token', 'veterinary_token', and 'petOwner_token' in that order.
 * This function is the single source of truth for API route authentication.
 * @returns {Promise<TokenPayload | null>} The token's payload, or null if unauthorized.
 */
export async function verifyTokenAndGetPayload(): Promise<TokenPayload | null> {
  try {
    // Per the logic in api/auth/me, we await the cookieStore.
    const cookieStore = await cookies();

    // Check for all possible tokens in the correct order of priority.
    const adminToken = cookieStore.get("admin_token")?.value;
    const vetToken = cookieStore.get("veterinary_token")?.value;
    const petOwnerToken = cookieStore.get("petOwner_token")?.value;

    const token = adminToken || vetToken || petOwnerToken;
    

    if (!token) {
      return null; // No token found
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jose.jwtVerify(token, secret);

    // Validate the essential parts of the payload.
    if (payload && typeof payload.role === 'string' && payload.id) {
      
      return payload as TokenPayload;
    }

    return null; // Payload is invalid
  } catch (error) {
    console.error("JWT Verification Error in lib/auth:", error);
    return null; // Catches invalid/expired tokens or other errors
  }
}
