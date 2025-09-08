import { Router } from "express";
import { EmailData, EmailDevMailboxOptions } from "./types";
declare class EmailDevMailbox {
    private emails;
    private options;
    private router;
    constructor(options?: EmailDevMailboxOptions);
    captureEmail(emailData: Omit<EmailData, "id" | "timestamp">): string;
    clearEmails(): void;
    getRouter(): Router;
    getPath(): string;
    private setupRoutes;
    private serveMailboxUI;
    private getEmails;
    private getEmail;
    private deleteAllEmails;
    private deleteEmail;
    private generateMailboxHTML;
}
export declare function createDevMailbox(options?: EmailDevMailboxOptions): EmailDevMailbox;
export declare function sendEmail(emailData: Omit<EmailData, "id" | "timestamp">): string;
export declare function clearEmails(): void;
export declare function attachDevMailbox(app: any, options?: EmailDevMailboxOptions): EmailDevMailbox;
declare const _default: {
    createDevMailbox: typeof createDevMailbox;
    sendEmail: typeof sendEmail;
    clearEmails: typeof clearEmails;
    attachDevMailbox: typeof attachDevMailbox;
};
export default _default;
//# sourceMappingURL=index.d.ts.map