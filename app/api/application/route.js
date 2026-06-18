import pool from "@/lib/db";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

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

// get candidate details
const candidateResult = await pool.query(
  `SELECT first_name, email
   FROM candidate
   WHERE candidate_id = $1`,
  [candidate_id]
);

const candidateName = candidateResult.rows[0].first_name;
const candidateEmail = candidateResult.rows[0].email;
console.log("Candidate Name:", candidateName);
console.log("Candidate Email:", candidateEmail);

console.log("Sending email...");

const emailResult = await resend.emails.send({
  from: "onboarding@resend.dev",
  to: "sapariyashreya@gmail.com",
  subject: "Application Submitted Successfully",
  html: `
    <h2>Hello ${candidateName},</h2>
    <p>Your application has been submitted successfully.</p>
    <p>Our team will review your application and contact you if shortlisted.</p>
    <p>Thank you for applying.</p>
  `,
});

console.log("Email Result:", emailResult);

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

    const candidateResult = await pool.query(
  `SELECT c.first_name, c.email
   FROM application a
   JOIN candidate c
   ON a.candidate_id = c.candidate_id
   WHERE a.application_id = $1`,
  [application_id]
);

const candidateName = candidateResult.rows[0].first_name;
const candidateEmail = candidateResult.rows[0].email;

console.log("Candidate Name:", candidateName);
console.log("Candidate Email:", candidateEmail);
console.log("Status:", status);

if (status === "ACCEPTED") {
  console.log("Sending acceptance email...");

  const emailResult = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "sapariyashreya@gmail.com",
    subject: "Application Status Update",
    html: `
      <h2>Congratulations ${candidateName}! </h2>

      <p>We are pleased to inform you that your application has been shortlisted.</p>

      <p>Our team will contact you shortly regarding the next steps.</p>

      <p>Thank you for your interest in joining our organization.</p>
    `,
  });

  console.log("Acceptance Email Result:", emailResult);
}


if (status === "REJECTED") {
  console.log("Sending rejection email...");

  const emailResult = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "monksangharaj@gmail.com",
    subject: "Application Status Update",
    html: `
      <h2>Hello ${candidateName},</h2>

      <p>Thank you for taking the time to apply for the position.</p>

      <p>After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current requirements.</p>

      <p>We sincerely appreciate your interest in our organization and encourage you to apply for future opportunities that match your skills and experience.</p>

      <p>We wish you all the very best in your career journey.</p>
    `,
  });

  console.log("Rejection Email Result:", emailResult);
}

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