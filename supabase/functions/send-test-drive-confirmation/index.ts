import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface TestDriveConfirmationRequest {
  customerEmail: string;
  customerName: string;
  carName: string;
  preferredDate: string;
  preferredTime: string;
  phone: string;
}

interface ResendEmailPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

async function sendEmail(payload: ResendEmailPayload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Resend API error: ${res.status} - ${errorText}`);
  }
  return res.json();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      customerEmail,
      customerName,
      carName,
      preferredDate,
      preferredTime,
      phone,
    }: TestDriveConfirmationRequest = await req.json();

    if (!customerEmail || !customerName || !carName) {
      throw new Error("Missing required fields");
    }

    // Send confirmation to customer
    const customerEmailResponse = await sendEmail({
      from: "Auto Pulse <noreply@autopulse.com>",
      to: [customerEmail],
      subject: `Test Drive Confirmed - ${carName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: #d4af37; margin: 0; font-size: 24px;">Test Drive Confirmed! 🚗</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Dear ${customerName},</p>
            <p>Thank you for booking a test drive with Auto Pulse. Here are your booking details:</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Vehicle:</strong> ${carName}</p>
              <p><strong>Date:</strong> ${preferredDate}</p>
              <p><strong>Time:</strong> ${preferredTime}</p>
              <p><strong>Contact:</strong> ${phone}</p>
            </div>
            <p>Our team will reach out to confirm the appointment. If you have any questions, feel free to contact us.</p>
            <p style="margin-top: 30px;">Best regards,<br><strong>The Auto Pulse Team</strong></p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Customer email sent:", customerEmailResponse);

    // Optionally send admin notification (if admin email is configured)
    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    if (adminEmail) {
      await sendEmail({
        from: "Auto Pulse <noreply@autopulse.com>",
        to: [adminEmail],
        subject: `New Test Drive Booking - ${carName}`,
        html: `
          <h2>New Test Drive Booking</h2>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Vehicle:</strong> ${carName}</p>
          <p><strong>Date:</strong> ${preferredDate}</p>
          <p><strong>Time:</strong> ${preferredTime}</p>
        `,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error sending test drive confirmation:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
