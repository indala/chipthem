import { NextResponse } from "next/server";

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

    // Dummy "save" simulation (you can replace this with Supabase or email sending later)
    console.log("📩 New Contact Message Received:");
    console.log({
      name: `${firstName} ${lastName}`,
      email,
      phoneNumber,
      subject,
      message,
      microchip_number,
      priorityLevel,
      receivedAt: new Date().toISOString(),
    });

    // Simulated success response
    return NextResponse.json({
      success: true,
      message: "Your message has been received successfully!",
    });
  } catch (error) {
    console.error("❌ Error handling contact form:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
