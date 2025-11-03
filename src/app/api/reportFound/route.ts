import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse multipart/form-data (works for FormData submissions)
    const formData = await req.formData();

    // Extract text fields
    const pet_type = formData.get("pet_type");
    const size = formData.get("size");
    const color = formData.get("color");
    const description = formData.get("description");
    const date_found = formData.get("date_found");
    const time_found = formData.get("time_found");
    const found_location = formData.get("found_location");
    const finder_name = formData.get("finder_name");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const current_location = formData.get("current_location");

    // Extract file
    const pet_photo = formData.get("pet_photo") as File | null;

    // ✅ Dummy log
    console.log("📦 Found Pet Report Received:");
    console.log({
      pet_type,
      size,
      color,
      description,
      date_found,
      time_found,
      found_location,
      finder_name,
      phone,
      email,
      current_location,
      pet_photo: pet_photo
        ? {
            name: pet_photo.name,
            type: pet_photo.type,
            size: pet_photo.size,
          }
        : "No photo uploaded",
    });

    // ✅ You can later upload the file to Supabase Storage, AWS S3, or Cloudinary here.

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Found pet report received successfully!",
    });
  } catch (error) {
    console.error("❌ Error handling found pet report:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit report." },
      { status: 500 }
    );
  }
}
