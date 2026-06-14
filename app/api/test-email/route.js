import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "sapariyashreya@gmail.com",
      subject: "Test Email from Admin Portal",
      html: `
        <h2>Resend Working 🎉</h2>
        <p>Your email system is successfully connected.</p>
      `,
    });

    return Response.json({
      success: true,
      message: "Email sent",
      data,
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}