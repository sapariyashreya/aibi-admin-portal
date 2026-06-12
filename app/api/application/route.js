import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const job_id = searchParams.get("job_id");

    let query = `
      SELECT 
        a.application_id,
        a.applied_at,

        c.candidate_id,
        c.first_name,
        c.last_name,
        c.email,
        c.phone_no,
        c.city,

        j.job_id,
        j.job_title,
        j.work_mode,
        j.employment_type

      FROM application a
      JOIN candidate c ON a.candidate_id = c.candidate_id
      JOIN job_post j ON a.job_id = j.job_id
    `;

    let values = [];

    // if job_id is passed, filter by job
    if (job_id) {
      query += ` WHERE a.job_id = $1`;
      values.push(job_id);
    }

    const result = await pool.query(query, values);

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

    const { candidate_id, job_id } = body;

    // insert application
    const result = await pool.query(
      `INSERT INTO application (candidate_id, job_id)
       VALUES ($1, $2)
       RETURNING *`,
      [candidate_id, job_id]
    );

    return Response.json({
      success: true,
      message: "Application submitted successfully",
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

    const { application_id, status } = body;

    // update status
    const result = await pool.query(
      `UPDATE application
       SET status = $1
       WHERE application_id = $2
       RETURNING *`,
      [status, application_id]
    );

    return Response.json({
      success: true,
      message: `Application ${status.toLowerCase()} successfully`,
      data: result.rows[0]
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    });
  }
}