import express, { Request, Response, Router } from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { EmailData, EmailDevMailboxOptions } from "./types";
import fs from "fs";

class EmailDevMailbox {
  private emails: EmailData[] = [];
  private options: Required<EmailDevMailboxOptions>;
  private router: Router;

  constructor(options: EmailDevMailboxOptions = {}) {
    this.options = {
      path: options.path || "/dev/mailbox",
      appName: options.appName || "Node App",
      maxEmails: options.maxEmails || 100,
      enableCors: options.enableCors !== false,
    };

    this.router = express.Router();
    this.setupRoutes();
  }

  public captureEmail(emailData: Omit<EmailData, "id" | "timestamp">): string {
    const email: EmailData = {
      ...emailData,
      id: uuidv4(),
      timestamp: new Date(),
    };

    this.emails.unshift(email);

    if (this.emails.length > this.options.maxEmails) {
      this.emails = this.emails.slice(0, this.options.maxEmails);
    }

    console.log(`📭 Email captured: ${email.subject} (ID: ${email.id})`);
    return email.id;
  }

  public clearEmails(): void {
    this.emails = [];
    console.log("📭 All emails cleared from dev mailbox");
  }

  public getRouter(): Router {
    return this.router;
  }

  public getPath(): string {
    return this.options.path;
  }

  private setupRoutes(): void {
    if (this.options.enableCors) {
      this.router.use((req: Request, res: Response, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept",
        );
        res.header(
          "Access-Control-Allow-Methods",
          "GET, POST, DELETE, OPTIONS",
        );
        if (req.method === "OPTIONS") {
          res.sendStatus(200);
        } else {
          next();
        }
      });
    }

    this.router.get("/", this.serveMailboxUI.bind(this));

    this.router.get("/api/emails", this.getEmails.bind(this));
    this.router.get("/api/emails/:id", this.getEmail.bind(this));
    this.router.delete("/api/emails", this.deleteAllEmails.bind(this));
    this.router.delete("/api/emails/:id", this.deleteEmail.bind(this));

    this.router.use(
      "/assets",
      express.static(path.resolve(__dirname, "assets")),
    );
  }

  private serveMailboxUI(req: Request, res: Response): void {
    const filePath = path.resolve(__dirname, "ui/index.html");
    let html = fs.readFileSync(filePath, "utf-8");

    html = html.replace(/__PATH__/g, this.options.path);
    html = html.replace(/__APP_NAME__/g, this.options.appName);
    res.send(html);
  }

  private getEmails(req: Request, res: Response): void {
    res.json({
      emails: this.emails.map((email) => ({
        id: email.id,
        to: email.to,
        from: email.from,
        subject: email.subject,
        timestamp: email.timestamp,
        html: email.html,
      })),
      count: this.emails.length,
    });
  }

  private getEmail(req: Request, res: Response): void {
    const email = this.emails.find((e) => e.id === req.params.id);
    if (!email) {
      res.status(404).json({ error: "Email not found" });
      return;
    }
    res.json(email);
  }

  private deleteAllEmails(req: Request, res: Response): void {
    this.clearEmails();
    res.json({ message: "All emails deleted" });
  }

  private deleteEmail(req: Request, res: Response): void {
    const index = this.emails.findIndex((e) => e.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: "Email not found" });
      return;
    }

    const deletedEmail = this.emails.splice(index, 1)[0];
    res.json({ message: "Email deleted", email: deletedEmail });
  }
}

let devMailboxInstance: EmailDevMailbox | null = null;

export function createDevMailbox(
  options?: EmailDevMailboxOptions,
): EmailDevMailbox {
  if (!devMailboxInstance) {
    devMailboxInstance = new EmailDevMailbox(options);
  }
  return devMailboxInstance;
}

export function sendEmail(
  emailData: Omit<EmailData, "id" | "timestamp">,
): string {
  if (!devMailboxInstance) {
    throw new Error(
      "Dev mailbox not initialized. Call createDevMailbox() first.",
    );
  }
  return devMailboxInstance.captureEmail(emailData);
}

export function clearEmails(): void {
  if (!devMailboxInstance) {
    throw new Error(
      "Dev mailbox not initialized. Call createDevMailbox() first.",
    );
  }
  devMailboxInstance.clearEmails();
}

export function attachDevMailbox(
  app: any,
  options?: EmailDevMailboxOptions,
): EmailDevMailbox {
  const mailbox = createDevMailbox(options);
  app.use(mailbox.getPath(), mailbox.getRouter());

  console.log(`📭 Dev Mailbox available at: ${mailbox.getPath()}`);
  return mailbox;
}

export default {
  createDevMailbox,
  sendEmail,
  clearEmails,
  attachDevMailbox,
};
