import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM job_post ORDER BY created_at DESC"
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
      job_title,
      job_description,
      employment_type,
      work_mode,
      primary_location,
      job_level,
      external_url,
      require_resume,
      expiry_date,
      job_poster_url
    } = body;

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
        job_poster_url
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [
        job_title,
        job_description,
        employment_type,
        work_mode,
        primary_location,
        job_level,
        external_url,
        require_resume,
        expiry_date,
        job_poster_url
      ]
    );

    return Response.json({
      success: true,
      message: "Job created successfully",
      data: result.rows[0]
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    });
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
      job_poster_url
    } = body;

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
           modified_date=CURRENT_TIMESTAMP
       WHERE job_id=$11
       RETURNING *`,
      [
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
        job_id
      ]
    );

    return Response.json({
      success: true,
      message: "Job updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { job_id } = body;

    const result = await pool.query(
      "DELETE FROM job_post WHERE job_id = $1 RETURNING *",
      [job_id]
    );

    return Response.json({
      success: true,
      message: "Job deleted successfully",
      data: result.rows[0]
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    });
  }
}