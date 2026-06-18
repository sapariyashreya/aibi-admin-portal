import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM job_post ORDER BY created_at DESC"
    );

    return Response.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      job_title,
      job_description,
      employment_type,
      work_mode,
      primary_location,
      job_level,
      external_url,
      require_resume,
      expiry_date,
      job_poster_url,
      is_active, // from admin/addjob toggle
    } = body;

    // Minimal validation (required fields)
    if (
      !job_title ||
      !job_description ||
      !employment_type ||
      !work_mode ||
      !primary_location ||
      !expiry_date
    ) {
      return Response.json(
        { success: false, message: "Missing required job fields." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO job_post (
        job_title,
        job_description,
        employment_type,
        work_mode,
        primary_location,
        job_level,
        external_url,
        require_resume,
        expiry_date,
        job_poster_url,
        is_active
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *`,
      [
        job_title,
        job_description,
        employment_type,
        work_mode,
        primary_location,
        job_level || null,
        external_url || null,
        require_resume ?? true,
        expiry_date,
        job_poster_url || null,
        is_active ?? true, // default to true if not provided
      ]
    );

    return Response.json(
      {
        success: true,
        message: "Job created successfully",
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();

    const {
      job_id,
      job_title,
      job_description,
      employment_type,
      work_mode,
      primary_location,
      job_level,
      external_url,
      require_resume,
      expiry_date,
      job_poster_url,
      is_active, // NEW
    } = body;

    if (!job_id) {
      return Response.json(
        { success: false, message: "job_id is required for update." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE job_post
       SET job_title=$1,
           job_description=$2,
           employment_type=$3,
           work_mode=$4,
           primary_location=$5,
           job_level=$6,
           external_url=$7,
           require_resume=$8,
           expiry_date=$9,
           job_poster_url=$10,
           is_active=$11,
           modified_date=CURRENT_TIMESTAMP
       WHERE job_id=$12
       RETURNING *`,
      [
        job_title,
        job_description,
        employment_type,
        work_mode,
        primary_location,
        job_level || null,
        external_url || null,
        require_resume ?? true,
        expiry_date,
        job_poster_url || null,
        is_active ?? true,
        job_id,
      ]
    );

    return Response.json({
      success: true,
      message: "Job updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { job_id } = body;

    if (!job_id) {
      return Response.json(
        { success: false, message: "job_id is required for delete." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "DELETE FROM job_post WHERE job_id = $1 RETURNING *",
      [job_id]
    );

    return Response.json({
      success: true,
      message: "Job deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}