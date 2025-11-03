import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Parse multipart form data
    const formData = await request.formData();

    // Extract basic fields
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Log for debugging
    console.log("📩 Received Lost Pet Report:", data);

    // Handle uploaded file if exists
    const file = formData.get("pet_photo");
    if (file && file instanceof File) {
      console.log("📸 Uploaded file name:", file.name);
      console.log("📸 File type:", file.type);
      console.log("📸 File size:", file.size, "bytes");
      // In a real app, you'd upload this to Supabase, Cloudinary, etc.
    }

    // Simulate successful save
    return NextResponse.json(
      { message: "Lost pet report received successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error handling lost pet report:", error);
    return NextResponse.json(
      { message: "Failed to submit lost pet report." },
      { status: 500 }
    );
  }
}
