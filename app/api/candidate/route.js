import { NextResponse } from "next/server";
import pool from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

// GET /api/candidate  -> list candidates
export async function GET() {
  try {
    const result = await pool.query(`SELECT * FROM candidate`);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error in GET /api/candidate:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Helper: convert file (Blob) to base64 string
async function fileToBase64(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,` + buffer.toString("base64");
}

// POST /api/candidate -> multipart/form-data (fields + resume)
export async function POST(req) {
  try {
    const formData = await req.formData();

    const first_name = formData.get("first_name");
    const middle_name = formData.get("middle_name");
    const last_name = formData.get("last_name");
    const country_code = formData.get("country_code");
    const address = formData.get("address");
    const city = formData.get("city");
    const state = formData.get("state");
    const pincode = formData.get("pincode");
    const email = formData.get("email");
    const phone_no = formData.get("phone_no");
    const portfolio_url = formData.get("portfolio_url");
    const gender = formData.get("gender");
    const resumeFile = formData.get("resume"); // name must match frontend

    // Required field validation
    if (
      !first_name ||
      !last_name ||
      !country_code ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !email ||
      !phone_no ||
      !gender ||
      !resumeFile
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields or resume file." },
        { status: 400 }
      );
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format." },
        { status: 400 }
      );
    }

    // 1) Upload resume to Cloudinary
    const base64File = await fileToBase64(resumeFile);

    const uploadResult = await cloudinary.uploader.upload(base64File, {
      folder: process.env.CLOUDINARY_UPLOAD_FOLDER || "admin_integration_resumes",
      resource_type: "auto",
    });

    const resume_url = uploadResult.secure_url;

    // 2) Insert candidate in Postgres
    const result = await pool.query(
      `INSERT INTO candidate (
        first_name,
        middle_name,
        last_name,
        country_code,
        address,
        city,
        state,
        pincode,
        resume_url,
        email,
        phone_no,
        portfolio_url,
        gender
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      ) RETURNING *`,
      [
        first_name,
        middle_name || null,
        last_name,
        country_code,
        address,
        city,
        state,
        pincode,
        resume_url,
        email,
        phone_no,
        portfolio_url || null,
        gender,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Candidate created successfully",
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/candidate:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}