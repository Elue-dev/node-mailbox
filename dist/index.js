"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDevMailbox = createDevMailbox;
exports.sendEmail = sendEmail;
exports.clearEmails = clearEmails;
exports.attachDevMailbox = attachDevMailbox;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const dev_mail_ui_1 = __importDefault(require("./template/dev-mail-ui"));
class EmailDevMailbox {
    constructor(options = {}) {
        this.emails = [];
        this.options = {
            path: options.path || "/dev/mailbox",
            maxEmails: options.maxEmails || 100,
            enableCors: options.enableCors !== false,
        };
        this.router = express_1.default.Router();
        this.setupRoutes();
    }
    captureEmail(emailData) {
        const email = {
            ...emailData,
            id: (0, uuid_1.v4)(),
            timestamp: new Date(),
        };
        this.emails.unshift(email);
        if (this.emails.length > this.options.maxEmails) {
            this.emails = this.emails.slice(0, this.options.maxEmails);
        }
        console.log(`📧 Email captured: ${email.subject} (ID: ${email.id})`);
        return email.id;
    }
    clearEmails() {
        this.emails = [];
        console.log("📭 All emails cleared from dev mailbox");
    }
    getRouter() {
        return this.router;
    }
    getPath() {
        return this.options.path;
    }
    setupRoutes() {
        if (this.options.enableCors) {
            this.router.use((req, res, next) => {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
                if (req.method === "OPTIONS") {
                    res.sendStatus(200);
                }
                else {
                    next();
                }
            });
        }
        this.router.get("/", this.serveMailboxUI.bind(this));
        this.router.get("/api/emails", this.getEmails.bind(this));
        this.router.get("/api/emails/:id", this.getEmail.bind(this));
        this.router.delete("/api/emails", this.deleteAllEmails.bind(this));
        this.router.delete("/api/emails/:id", this.deleteEmail.bind(this));
        this.router.use("/assets", express_1.default.static(path_1.default.resolve(__dirname, "assets")));
    }
    serveMailboxUI(req, res) {
        const html = this.generateMailboxHTML();
        res.send(html);
    }
    getEmails(req, res) {
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
    getEmail(req, res) {
        const email = this.emails.find((e) => e.id === req.params.id);
        if (!email) {
            res.status(404).json({ error: "Email not found" });
            return;
        }
        res.json(email);
    }
    deleteAllEmails(req, res) {
        this.clearEmails();
        res.json({ message: "All emails deleted" });
    }
    deleteEmail(req, res) {
        const index = this.emails.findIndex((e) => e.id === req.params.id);
        if (index === -1) {
            res.status(404).json({ error: "Email not found" });
            return;
        }
        const deletedEmail = this.emails.splice(index, 1)[0];
        res.json({ message: "Email deleted", email: deletedEmail });
    }
    generateMailboxHTML() {
        return (0, dev_mail_ui_1.default)({
            path: this.options.path,
        });
    }
}
let devMailboxInstance = null;
function createDevMailbox(options) {
    if (!devMailboxInstance) {
        devMailboxInstance = new EmailDevMailbox(options);
    }
    return devMailboxInstance;
}
function sendEmail(emailData) {
    if (!devMailboxInstance) {
        throw new Error("Dev mailbox not initialized. Call createDevMailbox() first.");
    }
    return devMailboxInstance.captureEmail(emailData);
}
function clearEmails() {
    if (!devMailboxInstance) {
        throw new Error("Dev mailbox not initialized. Call createDevMailbox() first.");
    }
    devMailboxInstance.clearEmails();
}
function attachDevMailbox(app, options) {
    const mailbox = createDevMailbox(options);
    app.use(mailbox.getPath(), mailbox.getRouter());
    console.log(`📧 Dev Mailbox available at: ${mailbox.getPath()}`);
    return mailbox;
}
exports.default = {
    createDevMailbox,
    sendEmail,
    clearEmails,
    attachDevMailbox,
};
//# sourceMappingURL=index.js.map