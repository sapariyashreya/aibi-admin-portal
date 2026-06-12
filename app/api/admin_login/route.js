import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // check admin credentials in DB
    const result = await pool.query(
      `SELECT * FROM admin_login 
       WHERE email = $1 AND password_hash = $2`,
      [email, password]
    );

    // if no match
    if (result.rows.length === 0) {
      return Response.json({
        success: false,
        message: "Invalid email or password"
      });
    }

    return Response.json({
      success: true,
      message: "Login successful",
      admin: {
        admin_id: result.rows[0].admin_id,
        email: result.rows[0].email
      }
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    });
  }
}