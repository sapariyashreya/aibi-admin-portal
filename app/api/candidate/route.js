import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT * FROM candidate`
    );

    return Response.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const {
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
    } = body;

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
      ]
    );

    return Response.json({
      success: true,
      message: "Candidate created successfully",
      data: result.rows[0]
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    });
  }
}