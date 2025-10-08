import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    console.log("[Upload API] Starting upload...");
    const session = await auth();
    console.log("[Upload API] Session:", session ? "authenticated" : "not authenticated");

    if (!session) {
      console.log("[Upload API] Unauthorized - no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("[Upload API] No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("[Upload API] File received:", file.name, file.size, "bytes");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + "-" + file.name;
    const filepath = join(uploadsDir, filename);

    await writeFile(filepath, buffer);
    console.log("[Upload API] File saved to:", filepath);

    const url = `/uploads/${filename}`;
    console.log("[Upload API] Returning URL:", url);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("[Upload API] Error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
