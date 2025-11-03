import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // 🔹 Dummy credentials (replace later with real auth logic)
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "12345";

    // 🔹 Simple validation
    if (!username || !password) {
      return NextResponse.json(
        { error: "Missing username or password." },
        { status: 400 }
      );
    }

    // 🔹 Dummy check
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Optional: set a cookie (for session simulation)
      const res = NextResponse.json({ success: true, message: "Login successful!" });
      res.cookies.set("admin_session", "dummy_token_123", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60, // 1 hour
      });
      return res;
    }

    // 🔹 Invalid credentials
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  } catch (err) {
    console.error("Login API Error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
