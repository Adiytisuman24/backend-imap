export interface EmailAccount {
  id: string;
  email: string;
  imapHost: string;
  imapPort: number;
  username: string;
  password: string;
  isActive: boolean;
  lastSync: Date;
}

export interface Email {
  id: string;
  messageId: string;
  accountId: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  htmlBody?: string;
  date: Date;
  folder: string;
  category: EmailCategory;
  isRead: boolean;
  attachments: EmailAttachment[];
  headers: Record<string, string>;
}

export interface EmailAttachment {
  filename: string;
  contentType: string;
  size: number;
  contentId?: string;
}

export type EmailCategory = 'Interested' | 'Meeting Booked' | 'Not Interested' | 'Spam' | 'Out of Office' | 'Uncategorized';

export interface SearchFilters {
  query?: string;
  accountId?: string;
  folder?: string;
  category?: EmailCategory;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface SuggestedReply {
  id: string;
  emailId: string;
  content: string;
  confidence: number;
  context: string;
}

export interface ProductContext {
  id: string;
  name: string;
  description: string;
  meetingLink: string;
  outreachAgenda: string;
}