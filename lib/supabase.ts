import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface Database {
  public: {
    Tables: {
      email_accounts: {
        Row: {
          id: string
          user_id: string
          email: string
          imap_host: string
          imap_port: number
          username: string
          password: string
          is_active: boolean
          last_sync: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          imap_host: string
          imap_port: number
          username: string
          password: string
          is_active?: boolean
          last_sync?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          imap_host?: string
          imap_port?: number
          username?: string
          password?: string
          is_active?: boolean
          last_sync?: string
          updated_at?: string
        }
      }
      emails: {
        Row: {
          id: string
          message_id: string
          account_id: string
          from_email: string
          to_emails: string[]
          subject: string
          body: string
          html_body: string | null
          date: string
          folder: string
          category: string
          is_read: boolean
          attachments: any[]
          headers: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          message_id: string
          account_id: string
          from_email: string
          to_emails: string[]
          subject: string
          body: string
          html_body?: string | null
          date: string
          folder: string
          category?: string
          is_read?: boolean
          attachments?: any[]
          headers?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          account_id?: string
          from_email?: string
          to_emails?: string[]
          subject?: string
          body?: string
          html_body?: string | null
          date?: string
          folder?: string
          category?: string
          is_read?: boolean
          attachments?: any[]
          headers?: any
          updated_at?: string
        }
      }
      product_contexts: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          meeting_link: string
          outreach_agenda: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description: string
          meeting_link: string
          outreach_agenda: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          meeting_link?: string
          outreach_agenda?: string
          updated_at?: string
        }
      }
    }
  }
}