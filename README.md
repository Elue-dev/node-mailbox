# 📧 Node Mailbox

A **development email preview tool** for Node.js inspired by Phoenix Swoosh for Elixir.
Capture and preview emails in a web UI without needing SMTP or third-party email providers.
Built for **Express.js** projects.

---

## ✨ Features

- 📥 Capture all outgoing dev emails into an in-memory mailbox
- 🌐 Preview emails instantly in a browser (`/dev/mailbox`)
- 💾 **Persistent storage** with IndexedDB - emails survive server restarts
- 🗑️ Delete one or all emails from the mailbox
- ⚡ Zero setup SMTP — everything works out of the box
- 🛠️ Configurable path, max stored emails, and CORS support

---

## 🚀 Installation

```bash
npm install node-mailbox --save-dev
# or
yarn add node-mailbox --dev
```

---

## 📦 Usage (Express Example)

Add the dev mailbox to your Express app:

```ts
import express from "express";
import { attachDevMailbox, sendEmail } from "node-mailbox";

const app = express();
const PORT = 3000;

app.use(express.json());

// Attach the dev mailbox at /dev/mailbox
attachDevMailbox(app, {
  path: "/dev/mailbox", // optional (default)
  maxEmails: 500, // optional, default: 500
  enableCors: true, // optional, default: true
});

// Example endpoint that sends a test email
app.post("/send-test", (req, res) => {
  const { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).json({ error: "email and username are required" });
  }

  const emailId = sendEmail({
    to: email,
    from: "myapp@example.com",
    subject: "Password Reset Request",
    html: `
      <h2>Password Reset Request</h2>
      <p>Hello ${username}, click the button below to reset your password:</p>
      <a href="https://example.com/reset" style="color: white; background: #26577f; padding: 10px 20px; border-radius: 5px;">Reset Password</a>
    `,
  });

  res.json({
    success: true,
    message: "Email sent!",
    emailId,
    mailboxUrl: `http://localhost:${PORT}/dev/mailbox`,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
});
```

---

## 🔍 API

### `attachDevMailbox(app, options?)`

Attach the mailbox UI and API routes to your Express app.

Options:

- `path` _(string, default: "/dev/mailbox")_ – where the mailbox UI lives
- `maxEmails` _(number, default: 500)_ – how many emails to keep in memory
- `enableCors` _(boolean, default: true)_ – whether to allow CORS requests

---

### `sendEmail(emailData)`

Capture a new email in the dev mailbox.

Parameters:

- `to` _(string)_ – recipient
- `from` _(string)_ – sender
- `subject` _(string)_ – subject line
- `html` _(string)_ – email body (HTML supported)

Returns:

- `id` _(string)_ – unique ID of the stored email

---

### `clearEmails()`

Remove all stored emails from the mailbox.

---

### `createDevMailbox(options?)`

Manually create a mailbox instance (advanced use).

---

## 🌐 Mailbox UI

Once set up (assuming you are using PORT 3000 and a path of /dev/mailbox), visit:

```
http://localhost:3000/dev/mailbox
```

You'll see:

- Inbox of captured emails
- Email preview with full HTML rendering
- **Persistent email storage** - emails remain after server restarts
- Delete buttons for individual/all emails
- Search functionality across all emails

---

## 💾 Data Persistence

**Node Mailbox** uses **IndexedDB** in the browser to persist emails locally:

- ✅ **Emails survive server restarts** (nodemon, crashes, deployments)
- ✅ **Automatic syncing** when server comes back online
- ✅ **Browser-based storage** - no server-side database needed
- 🗑️ **User-controlled cleanup** - emails persist until manually deleted

**Note**: Emails are stored in your browser's IndexedDB. Clearing browser data will remove stored emails.

---

## 📂 Example

Check the [example folder](./src/example) for a complete Express setup.

Run it with:

```bash
npm run example
```

---

## ⚠️ Notes

- This tool is **dev-only**. Do **not** use it in production.
- Currently supports **Express.js only**.
  (Fastify/Bun/Hono adapters may come later.)
- Emails are stored **in-memory on server** + **IndexedDB in browser** for persistence.

---

## 📜 License

MIT © [Wisdom Elue](https://github.com/elue-dev)
