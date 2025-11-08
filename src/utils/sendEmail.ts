import { Resend } from "resend";

// ✅ Initialize Resend client safely
const resend = new Resend(process.env.RESEND_API_KEY || "");

/**
 * Sends an email using Resend API
 *
 * @param to - recipient email address (string or array)
 * @param subject - email subject line
 * @param html - HTML email body
 * @returns boolean indicating success or failure
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[]; // ✅ support multiple recipients
  subject: string;
  html: string;
}): Promise<boolean> {
  try {
    const response = await resend.emails.send({
      from: "ChipThem <info@chipthem.com>", // ✅ must match verified domain in Resend dashboard
      to,
      subject,
      html,
    });

    if (response.error) {
      console.error("❌ Resend API error:", response.error);
      return false;
    }

    console.log("✅ Email sent successfully:", response.data?.id || response);
    return true;
  } catch (error: unknown) {
    // ✅ Type-safe error handling
    if (error instanceof Error) {
      console.error("❌ Email send failed:", error.message);
    } else {
      console.error("❌ Email send failed:", error);
    }
    return false;
  }
}
