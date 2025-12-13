import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("📧 [FEEDBACK] Request received");
  
  try {
    const { feedback } = await request.json();
    console.log("📝 [FEEDBACK] Feedback content:", feedback?.substring(0, 50) + "...");

    if (!feedback || !feedback.trim()) {
      console.log("❌ [FEEDBACK] Empty feedback received");
      return NextResponse.json(
        { error: "Feedback is required" },
        { status: 400 }
      );
    }

    // Using Resend API for sending emails
    // You can also use nodemailer, SendGrid, or any other email service
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error("❌ [FEEDBACK] RESEND_API_KEY is not configured");
      // Still return success to user but log the error
      return NextResponse.json({ success: true });
    }

    console.log("🔑 [FEEDBACK] API key found:", RESEND_API_KEY.substring(0, 10) + "...");

    const emailPayload = {
      from: "IT Wrapped <onboarding@resend.dev>",
      to: ["adeobaadedayo18@gmail.com"],
      reply_to: "adeobaadedayo18@gmail.com",
      subject: "New IT Wrapped Feedback 💡",
    };
    
    console.log("📤 [FEEDBACK] Sending email with payload:", JSON.stringify(emailPayload, null, 2));

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        ...emailPayload,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif;
                  background: #f4f4f0;
                  padding: 40px 20px;
                  line-height: 1.6;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: white;
                  border: 2px solid #000;
                  border-radius: 16px;
                  overflow: hidden;
                }
                .header {
                  background: #ff90e8;
                  padding: 40px 30px;
                  text-align: center;
                  border-bottom: 2px solid #000;
                }
                .header h1 {
                  color: #000;
                  font-size: 32px;
                  font-weight: 700;
                  letter-spacing: -0.02em;
                  margin-bottom: 8px;
                }
                .header .subtitle {
                  color: #000;
                  font-size: 16px;
                  font-weight: 500;
                  opacity: 0.8;
                }
                .content {
                  padding: 40px 30px;
                  background: white;
                }
                .greeting {
                  font-size: 18px;
                  color: #000;
                  margin-bottom: 24px;
                  font-weight: 500;
                }
                .feedback-card {
                  background: #f4f4f0;
                  border: 2px solid #000;
                  border-radius: 16px;
                  padding: 24px;
                  margin: 24px 0;
                }
                .feedback-text {
                  color: #000;
                  font-size: 16px;
                  line-height: 1.6;
                  white-space: pre-wrap;
                  word-wrap: break-word;
                }
                .timestamp {
                  display: inline-block;
                  background: #ffc900;
                  color: #000;
                  padding: 8px 16px;
                  border-radius: 999px;
                  font-size: 14px;
                  font-weight: 600;
                  margin-top: 24px;
                  border: 2px solid #000;
                }
                .divider {
                  height: 2px;
                  background: #000;
                  margin: 32px 0;
                }
                .action-section {
                  text-align: center;
                  padding: 24px;
                  background: #f1f333;
                  border-radius: 12px;
                  border: 2px solid #000;
                }
                .action-text {
                  font-size: 18px;
                  font-weight: 700;
                  color: #000;
                  margin-bottom: 8px;
                }
                .action-emoji {
                  font-size: 32px;
                  margin-bottom: 8px;
                }
                .footer {
                  background: #000;
                  color: white;
                  padding: 32px 30px;
                  text-align: center;
                  border-top: 2px solid #000;
                }
                .footer-title {
                  font-size: 20px;
                  font-weight: 700;
                  margin-bottom: 8px;
                  letter-spacing: -0.01em;
                }
                .footer-subtitle {
                  font-size: 14px;
                  opacity: 0.7;
                }
                .badge {
                  display: inline-block;
                  background: white;
                  color: #000;
                  padding: 6px 12px;
                  border-radius: 999px;
                  font-size: 12px;
                  font-weight: 600;
                  margin-top: 16px;
                  border: 1px solid rgba(255,255,255,0.2);
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>💡 ITwrapped Feedback</h1>
                  <div class="subtitle">Someone wants to make ITwrapped better!</div>
                </div>
                
                <div class="content">
                  <div class="greeting">
                    Hey! 👋 Someone just shared what would make ITwrapped better:
                  </div>
                  
                  <div class="feedback-card">
                    <div class="feedback-text">${feedback}</div>
                  </div>
                  
                  <div class="timestamp">
                    📅 ${new Date().toLocaleString("en-US", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </div>
                  
                  <div class="divider"></div>
                  
                  <div class="action-section">
                    <div class="action-emoji">🚀</div>
                    <div class="action-text">Time to build something amazing!</div>
                  </div>
                </div>
                
                <div class="footer">
                  <div class="footer-title">ITwrapped</div>
                  <div class="footer-subtitle">Spotify Wrapped for IT Internships</div>
                  <div class="badge">Feedback System</div>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    console.log("📡 [FEEDBACK] Resend response status:", response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ [FEEDBACK] Resend API error:", JSON.stringify(error, null, 2));
      console.error("❌ [FEEDBACK] Response status:", response.status);
      console.error("❌ [FEEDBACK] Response statusText:", response.statusText);
      // Still return success to avoid breaking UX
      return NextResponse.json({ success: true });
    }

    const result = await response.json();
    console.log("✅ [FEEDBACK] Email sent successfully!");
    console.log("📬 [FEEDBACK] Resend response:", JSON.stringify(result, null, 2));
    console.log("🎉 [FEEDBACK] Email ID:", result.id || "N/A");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("💥 [FEEDBACK] Unexpected error:", error);
    console.error("💥 [FEEDBACK] Error stack:", error instanceof Error ? error.stack : "N/A");
    // Return success to avoid breaking UX even if email fails
    return NextResponse.json({ success: true });
  }
}
