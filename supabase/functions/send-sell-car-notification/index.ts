import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SellCarNotificationRequest {
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  askingPrice: number;
  mileage: string;
  condition: string;
}

async function sendEmail(payload: { from: string; to: string[]; subject: string; html: string }) {
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
    // Validate auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const {
      sellerName,
      sellerEmail,
      sellerPhone,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      askingPrice,
      mileage,
      condition,
    }: SellCarNotificationRequest = await req.json();

    if (!sellerName || !sellerEmail || !vehicleMake || !vehicleModel) {
      throw new Error("Missing required fields");
    }

    const vehicleTitle = `${vehicleYear} ${vehicleMake} ${vehicleModel}`;
    const formattedPrice = new Intl.NumberFormat("en-IN").format(askingPrice);

    // Send confirmation to seller
    await sendEmail({
      from: "Auto Pulse <noreply@autopulse.com>",
      to: [sellerEmail],
      subject: `Sell Car Request Received - ${vehicleTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: #d4af37; margin: 0; font-size: 24px;">Sell Car Request Received! 🚗</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Dear ${sellerName},</p>
            <p>Thank you for submitting your vehicle for sale with Auto Pulse. Here are your listing details:</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Vehicle:</strong> ${vehicleTitle}</p>
              <p><strong>Mileage:</strong> ${mileage}</p>
              <p><strong>Condition:</strong> ${condition}</p>
              <p><strong>Asking Price:</strong> ₹${formattedPrice}</p>
            </div>
            <p>Our team will review your listing and reach out to you shortly. If you have any questions, feel free to contact us.</p>
            <p style="margin-top: 30px;">Best regards,<br><strong>The Auto Pulse Team</strong></p>
          </div>
        </body>
        </html>
      `,
    });

    // Send admin notification
    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    if (adminEmail) {
      await sendEmail({
        from: "Auto Pulse <noreply@autopulse.com>",
        to: [adminEmail],
        subject: `New Sell Car Request - ${vehicleTitle}`,
        html: `
          <h2>New Sell Car Request</h2>
          <p><strong>Seller:</strong> ${sellerName}</p>
          <p><strong>Email:</strong> ${sellerEmail}</p>
          <p><strong>Phone:</strong> ${sellerPhone}</p>
          <p><strong>Vehicle:</strong> ${vehicleTitle}</p>
          <p><strong>Mileage:</strong> ${mileage}</p>
          <p><strong>Condition:</strong> ${condition}</p>
          <p><strong>Asking Price:</strong> ₹${formattedPrice}</p>
        `,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error sending sell car notification:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
