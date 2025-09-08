import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "<h1>✅ Express server is working!</h1><p>If you see this, the server is running correctly.</p>",
  );
});

const MAIL_BOX_PATH = "/shop/dev/mailbox";

try {
  const { attachDevMailbox, sendEmail } = require("../index");

  attachDevMailbox(app, {
    path: MAIL_BOX_PATH,
    maxEmails: 10,
    enableCors: true,
  });

  app.post("/send-test", (req, res) => {
    if (!req.body.email || !req.body.username) {
      res.status(400).json({ error: "email and username are required" });
      return;
    }

    const { email, username } = req.body;
    const emailId = sendEmail({
      to: email,
      from: "my app",
      subject: "Password Reset Request",
      html: `
      <div style="background-color: #f5f5f5; padding: 40px; font-family: Roobert, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e1e1e; padding: 30px; border-radius: 10px; color: white;">
          <h2 style="color: #26577f; text-align: center;">Password Reset Request</h2>
          <p>Hello ${username},</p>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="https://eluedev.vercel.app" style="
              background-color: #26577f;
              color: white;
              padding: 12px 25px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
              font-weight: bold;
            ">Reset Password</a>
          </p>
          <p style="font-size: 14px; color: #cccccc;">
            This link will expire in 15 minutes.
          </p>
          <p style="font-size: 14px; color: #cccccc;">
            If you did not request a password reset, you can safely ignore this email.
          </p>
        </div>
      </div>
            `,
    });
    res.json({
      success: true,
      message: "Email sent!",
      emailId,
      mailboxUrl: `http://localhost:${PORT}/${MAIL_BOX_PATH}`,
    });
  });
} catch (error: any) {
  console.error("❌ Error importing or setting up library:", error);
  console.error("Stack trace:", error.stack);

  app.get(MAIL_BOX_PATH, (req, res) => {
    res.status(500).send(`
            <h1>❌ Error Loading Dev Mailbox</h1>
            <p><strong>Error:</strong> ${error.message}</p>
            <p>Check the server console for more details.</p>
        `);
  });
}

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("✅ Server is running successfully!");
  console.log("🌐 Main page: http://localhost:" + PORT);
});

server.on("error", (error: any) => {
  console.error("❌ Server error:", error);
  if (error.code === "EADDRINUSE") {
    console.error("💡 Port 3000 is already in use. Try:");
    console.error("   - Close other applications using port 3000");
    console.error("   - Or change PORT to 3001, 3002, etc.");
  }
});
