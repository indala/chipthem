import { NextResponse } from "next/server";
import { sendEmail } from "@/utils/sendEmail";

export async function POST(req: Request) {
  try {
    // Parse JSON body
    const data = await req.json();
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      subject,
      message,
      microchip_number,
      priorityLevel,
    } = data;

    // Basic validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // --- Email Sending Logic ---

    // 1. Define email recipient and subject
    const recipient ="info@chipthem.com";
    const emailSubject = `New Contact Form Inquiry: ${subject}`;

    // 2. Construct the HTML email body
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #0056b3;">New Contact Message</h2>
        <p>You have received a new message through the website contact form.</p>
        <hr style="border: 1px solid #ddd;">
        <h3 style="color: #333;">Contact Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${firstName} ${lastName}</li>
          <li><strong>Email:</strong> <a href="mailto:${email}">${email}</a></li>
          ${phoneNumber ? `<li><strong>Phone:</strong> ${phoneNumber}</li>` : ''}
        </ul>
        <h3 style="color: #333;">Message Details:</h3>
        <ul>
          <li><strong>Priority:</strong> ${priorityLevel || 'Not set'}</li>
          <li><strong>Subject:</strong> ${subject}</li>
          ${microchip_number ? `<li><strong>Microchip #:</strong> ${microchip_number}</li>` : ''}
        </ul>
        <h3 style="color: #333;">Message:</h3>
        <div style="background-color: #f9f9f9; border: 1px solid #eee; padding: 15px; border-radius: 5px;">
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <hr style="border: 1px solid #ddd;">
        <p style="font-size: 0.9em; color: #888;">This email was sent on ${new Date().toLocaleString()}.</p>
      </div>
    `;

    // 3. Send the email
    const emailSent = await sendEmail({
      to: recipient,
      subject: emailSubject,
      html: htmlBody,
    });

    // 4. Handle response based on email success
    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: "Your message has been sent successfully!",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to send your message. Please try again later." },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("❌ Error handling contact form:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
