import Imap from 'node-imap';
import { simpleParser } from 'mailparser';
import { EventEmitter } from 'events';
import { supabaseAdmin } from '@/lib/supabase';
import { classifyEmail } from './ai-service';
import { sendSlackNotification, triggerWebhook } from './notification-service';
import CryptoJS from 'crypto-js';

export interface EmailAccount {
  id: string;
  email: string;
  imap_host: string;
  imap_port: number;
  username: string;
  password: string;
  is_active: boolean;
}

export interface ProcessedEmail {
  id: string;
  message_id: string;
  account_id: string;
  from_email: string;
  to_emails: string[];
  subject: string;
  body: string;
  html_body?: string;
  date: Date;
  folder: string;
  category: string;
  is_read: boolean;
  attachments: any[];
  headers: any;
}

class ImapService extends EventEmitter {
  private connections: Map<string, Imap> = new Map();
  private isRunning: boolean = false;

  async startSync(accounts: EmailAccount[]) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🚀 Starting email synchronization...');

    for (const account of accounts.filter(acc => acc.is_active)) {
      await this.setupImapConnection(account);
    }
  }

  private async setupImapConnection(account: EmailAccount) {
    try {
      // Decrypt password
      const decryptedPassword = this.decryptPassword(account.password);
      
      const config = {
        user: account.username,
        password: decryptedPassword,
        host: account.imap_host,
        port: account.imap_port,
        tls: true,
        tlsOptions: {
          rejectUnauthorized: false
        },
        connTimeout: 60000,
        authTimeout: 30000,
        keepalive: {
          interval: 10000,
          idleInterval: 300000,
          forceNoop: true
        }
      };

      const imap = new Imap(config);
      this.connections.set(account.id, imap);

      imap.once('ready', () => {
        console.log(`✅ IMAP connection ready for ${account.email}`);
        this.syncRecentEmails(account, imap);
        this.setupIdleMode(account, imap);
      });

      imap.once('error', (err: Error) => {
        console.error(`❌ IMAP connection error for ${account.email}:`, err);
        this.emit('error', { accountId: account.id, error: err });
        // Attempt to reconnect after delay
        setTimeout(() => {
          if (this.isRunning) {
            this.setupImapConnection(account);
          }
        }, 30000);
      });

      imap.once('end', () => {
        console.log(`🔌 IMAP connection ended for ${account.email}`);
        // Attempt to reconnect after delay
        setTimeout(() => {
          if (this.isRunning) {
            this.setupImapConnection(account);
          }
        }, 10000);
      });

      imap.connect();
    } catch (error) {
      console.error(`Failed to setup IMAP connection for ${account.email}:`, error);
    }
  }

  private async syncRecentEmails(account: EmailAccount, imap: Imap) {
    return new Promise((resolve, reject) => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err) {
          reject(err);
          return;
        }

        // Fetch emails from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const searchCriteria = ['ALL', ['SINCE', thirtyDaysAgo.toISOString().split('T')[0]]];
        
        imap.search(searchCriteria, (err, results) => {
          if (err) {
            reject(err);
            return;
          }

          if (results.length === 0) {
            console.log(`📭 No recent emails found for ${account.email}`);
            resolve(null);
            return;
          }

          console.log(`📧 Found ${results.length} emails for ${account.email}`);

          const fetch = imap.fetch(results, {
            bodies: '',
            envelope: true,
            struct: true
          });

          let processedCount = 0;
          const totalEmails = results.length;

          fetch.on('message', (msg, seqno) => {
            this.processMessage(account, msg, seqno, 'INBOX').then(() => {
              processedCount++;
              if (processedCount === totalEmails) {
                resolve(null);
              }
            });
          });

          fetch.once('error', reject);
        });
      });
    });
  }

  private setupIdleMode(account: EmailAccount, imap: Imap) {
    imap.openBox('INBOX', false, (err, box) => {
      if (err) {
        console.error(`Failed to open INBOX for IDLE mode:`, err);
        return;
      }

      imap.on('mail', (numNewMsgs) => {
        console.log(`📬 New mail received for ${account.email}: ${numNewMsgs} messages`);
        this.fetchNewEmails(account, imap);
      });

      // Start IDLE mode
      try {
        imap.idle();
        console.log(`💤 IDLE mode activated for ${account.email}`);
      } catch (error) {
        console.error(`Failed to start IDLE mode for ${account.email}:`, error);
      }
    });
  }

  private async fetchNewEmails(account: EmailAccount, imap: Imap) {
    return new Promise((resolve, reject) => {
      imap.search(['UNSEEN'], (err, results) => {
        if (err) {
          reject(err);
          return;
        }

        if (results.length === 0) {
          resolve(null);
          return;
        }

        console.log(`📨 Processing ${results.length} new emails for ${account.email}`);

        const fetch = imap.fetch(results, {
          bodies: '',
          envelope: true,
          struct: true
        });

        let processedCount = 0;

        fetch.on('message', (msg, seqno) => {
          this.processMessage(account, msg, seqno, 'INBOX').then(() => {
            processedCount++;
            if (processedCount === results.length) {
              // Resume IDLE mode after processing
              try {
                imap.idle();
              } catch (error) {
                console.error('Failed to resume IDLE mode:', error);
              }
              resolve(null);
            }
          });
        });

        fetch.once('error', reject);
      });
    });
  }

  private async processMessage(account: EmailAccount, msg: any, seqno: number, folder: string): Promise<void> {
    return new Promise((resolve) => {
      msg.on('body', (stream: any) => {
        simpleParser(stream, async (err, parsed) => {
          if (err) {
            console.error('Failed to parse email:', err);
            resolve();
            return;
          }

          try {
            const emailId = `${account.id}-${parsed.messageId || seqno}-${Date.now()}`;
            
            const email: ProcessedEmail = {
              id: emailId,
              message_id: parsed.messageId || `${account.id}-${seqno}-${Date.now()}`,
              account_id: account.id,
              from_email: parsed.from?.text || '',
              to_emails: parsed.to?.text ? [parsed.to.text] : [],
              subject: parsed.subject || '',
              body: parsed.text || '',
              html_body: parsed.html || undefined,
              date: parsed.date || new Date(),
              folder,
              category: 'Uncategorized',
              is_read: false,
              attachments: parsed.attachments?.map(att => ({
                filename: att.filename || 'unknown',
                contentType: att.contentType || 'application/octet-stream',
                size: att.size || 0,
                contentId: att.contentId
              })) || [],
              headers: parsed.headers || {}
            };

            // AI categorization
            email.category = await classifyEmail(email);
            
            // Store in Supabase
            await this.storeEmail(email);
            
            // Trigger notifications for interested emails
            if (email.category === 'Interested') {
              await sendSlackNotification(email, account);
              await triggerWebhook(email, account);
            }
            
            this.emit('newEmail', email);
            console.log(`✅ Processed email: ${email.subject} (${email.category})`);
          } catch (error) {
            console.error('Failed to process email:', error);
          }
          
          resolve();
        });
      });

      msg.once('attributes', (attrs: any) => {
        // Handle email attributes if needed
      });
    });
  }

  private async storeEmail(email: ProcessedEmail) {
    try {
      const { error } = await supabaseAdmin
        .from('emails')
        .upsert({
          id: email.id,
          message_id: email.message_id,
          account_id: email.account_id,
          from_email: email.from_email,
          to_emails: email.to_emails,
          subject: email.subject,
          body: email.body,
          html_body: email.html_body,
          date: email.date.toISOString(),
          folder: email.folder,
          category: email.category,
          is_read: email.is_read,
          attachments: email.attachments,
          headers: email.headers
        }, {
          onConflict: 'message_id,account_id'
        });

      if (error) {
        console.error('Failed to store email in Supabase:', error);
      }
    } catch (error) {
      console.error('Failed to store email:', error);
    }
  }

  private encryptPassword(password: string): string {
    const secretKey = process.env.ENCRYPTION_SECRET || 'default-secret-key';
    return CryptoJS.AES.encrypt(password, secretKey).toString();
  }

  private decryptPassword(encryptedPassword: string): string {
    const secretKey = process.env.ENCRYPTION_SECRET || 'default-secret-key';
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  async stopSync() {
    this.isRunning = false;
    
    for (const [accountId, imap] of this.connections) {
      try {
        imap.end();
      } catch (error) {
        console.error(`Failed to close IMAP connection for ${accountId}:`, error);
      }
    }
    
    this.connections.clear();
    console.log('🛑 Email synchronization stopped');
  }
}

export const imapService = new ImapService();