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
  path?: string; // Default: '/dev/mailbox'
  maxEmails?: number; // Default: 100
  enableCors?: boolean; // Default: true
}
