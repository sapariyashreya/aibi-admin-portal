import pool from "@/lib/db";

export async function GET(request, context) {
  try {
    const { id } = await context.params;

    const result = await pool.query(
      "SELECT * FROM candidate WHERE candidate_id = $1",
      [id]
    );

    return Response.json({
      success: true,
      data: result.rows[0] || null
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: error.message
      },
      { status: 500 }
    );
  }
}

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
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
      gender,
      status
    } = body;

    const result = await pool.query(
      `UPDATE candidate
       SET first_name = $1,
           middle_name = $2,
           last_name = $3,
           country_code = $4,
           address = $5,
           city = $6,
           state = $7,
           pincode = $8,
           resume_url = $9,
           email = $10,
           phone_no = $11,
           portfolio_url = $12,
           gender = $13,
           status = $14
       WHERE candidate_id = $15
       RETURNING *`,
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
        gender,
        status,
        id
      ]
    );

    return Response.json({
      success: true,
      message: "Candidate updated successfully",
      data: result.rows[0] || null
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;

    const result = await pool.query(
      "DELETE FROM candidate WHERE candidate_id = $1 RETURNING *",
      [id]
    );

    return Response.json({
      success: true,
      message: "Candidate deleted successfully",
      data: result.rows[0] || null
    });

  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}