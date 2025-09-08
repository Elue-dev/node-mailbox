export interface EmailData {
    id: string;
    to: string | string[];
    from: string;
    subject: string;
    html: string;
    text?: string;
    timestamp: Date;
}
export interface EmailDevMailboxOptions {
    path?: string;
    maxEmails?: number;
    enableCors?: boolean;
}
//# sourceMappingURL=index.d.ts.map