# OneBox - AI Email Aggregator

A powerful email aggregation platform that synchronizes multiple IMAP email accounts in real-time, categorizes emails using AI, and provides intelligent reply suggestions using RAG (Retrieval-Augmented Generation).

## 🚀 Features

### ✅ Implemented Features

- **Real-Time Email Synchronization**: Sync multiple IMAP accounts using persistent IDLE connections
- **Supabase Integration**: Secure, scalable database with real-time capabilities
- **AI-Powered Categorization**: Automatically categorize emails into Interested, Meeting Booked, Not Interested, Spam, and Out of Office
- **Slack & Webhook Integration**: Get notifications for interested emails
- **Modern Frontend Interface**: Clean, responsive UI built with Next.js and Tailwind CSS
- **RAG-Powered Suggested Replies**: Context-aware reply generation using vector databases and LLMs
- **Encrypted Credential Storage**: Secure password encryption for email accounts
- **Real-time Notifications**: Slack alerts and webhook triggers with detailed email information

### 🎯 Core Functionality

1. **Multi-Account Email Sync**: Connect Gmail, Outlook, Yahoo, and other IMAP providers
2. **Smart Email Search**: Advanced search with filters by account, folder, and category
3. **AI Email Classification**: OpenAI-powered categorization for efficient email management
4. **Real-time Notifications**: Slack alerts and webhook triggers for important emails
5. **RAG Reply Generation**: Context-aware AI replies using vector database and product information
6. **Analytics Dashboard**: Comprehensive insights into email performance and metrics

## 🛠️ Technology Stack

- **Frontend**: Next.js 13, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Node.js
- **Database**: Supabase (PostgreSQL with real-time capabilities)
- **Email Processing**: node-imap, mailparser
- **AI/ML**: OpenAI GPT-4, text-embedding-ada-002
- **Vector Database**: Pinecone (for RAG)
- **Notifications**: Slack Web API, Webhooks
- **Security**: CryptoJS for password encryption, Row Level Security

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd onebox-email-aggregator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   ```bash
   # Create a new Supabase project at https://supabase.com
   # Run the SQL migration from lib/database/migrations.sql
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and credentials
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## ⚙️ Configuration

### Supabase Setup

1. **Create a Supabase Project**: Visit [supabase.com](https://supabase.com) and create a new project
2. **Run Migrations**: Execute the SQL from `lib/database/migrations.sql` in your Supabase SQL editor
3. **Get API Keys**: Copy your project URL and anon key from the Supabase dashboard
4. **Configure RLS**: Row Level Security is automatically enabled for data protection

### Email Accounts

1. **Gmail Setup**:
   - Enable 2-factor authentication
   - Generate an App Password
   - Use `imap.gmail.com:993`

2. **Outlook Setup**:
   - Use your regular password or App Password
   - Use `outlook.office365.com:993`

### Required API Keys

- **Supabase Keys**: Project URL, anon key, and service role key
- **OpenAI API Key**: For email categorization and reply generation
- **Pinecone API Key**: For vector storage and RAG functionality
- **Slack Bot Token**: For notification integration (optional)

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
OPENAI_API_KEY=your-openai-api-key
PINECONE_API_KEY=your-pinecone-api-key
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_CHANNEL=#email-notifications
WEBHOOK_URL=https://webhook.site/your-unique-id
ENCRYPTION_SECRET=your-encryption-secret-key
```

## 🎮 Usage

1. **Add Email Accounts**: Configure your IMAP accounts in the Accounts tab
2. **Start Synchronization**: Begin real-time email sync
3. **Configure AI Context**: Set up your product information for RAG-powered AI replies
4. **Monitor Analytics**: Track email performance and categorization metrics
5. **Generate AI Replies**: Get intelligent reply suggestions for interested emails

## 🔧 API Endpoints

- `GET /api/accounts` - List email accounts
- `POST /api/accounts` - Add new email account
- `PUT /api/accounts/[id]` - Update email account
- `POST /api/sync/start` - Start email synchronization
- `POST /api/sync/stop` - Stop email synchronization
- `GET /api/emails/search` - Search emails with filters
- `GET /api/emails/[id]/reply` - Generate AI reply suggestion
- `POST /api/product-context` - Save AI context for replies

## 🏗️ Architecture

```
├── app/                    # Next.js app directory
├── components/            # React components
├── lib/                   # Core functionality
│   ├── supabase.ts        # Database client
│   ├── services/          # Core services
│   │   ├── imap-service.ts     # Email synchronization
│   │   ├── ai-service.ts       # AI categorization & RAG
│   │   └── notification-service.ts # Slack/webhook integration
│   └── database/          # Database migrations
└── README.md
```

## 🤖 RAG Implementation

The system uses Retrieval-Augmented Generation (RAG) for intelligent reply suggestions:

1. **Vector Storage**: Product context is embedded and stored in Pinecone
2. **Semantic Search**: Incoming emails are matched against stored contexts
3. **Context Retrieval**: Relevant product information is retrieved based on similarity
4. **Reply Generation**: GPT-4 generates personalized replies using the retrieved context

### Example RAG Flow:

**Training Data**: "I am applying for a job position. If the lead is interested, share the meeting booking link: https://cal.com/example"

**Email Received**: "Hi, Your resume has been shortlisted. When will be a good time for you to attend the technical interview?"

**AI Reply Suggestion**: "Thank you for shortlisting my profile! I'm excited about this opportunity and would love to discuss further. You can book a time slot that works for you here: https://cal.com/example"

## 🎯 Email Categories

- **Interested**: Emails showing genuine interest in your product/service
- **Meeting Booked**: Scheduling confirmations and meeting-related emails
- **Not Interested**: Explicit rejections or disinterest
- **Spam**: Promotional content and unwanted emails
- **Out of Office**: Automated responses and vacation replies

## 📊 Analytics Features

- Email volume and categorization metrics
- Response rate tracking
- Performance insights and recommendations
- Category distribution visualization
- Response time analytics

## 🔒 Security

- Supabase Row Level Security (RLS) for data protection
- Encrypted password storage using CryptoJS
- App passwords for Gmail integration
- IMAP over TLS connections
- Environment variable configuration
- No hardcoded secrets

## 🚀 Deployment

The application is configured for easy deployment on platforms like Vercel, with Supabase as the managed database.

## 📝 Development Notes

- Comprehensive error handling and user feedback
- Real-time email synchronization with IDLE mode
- Encrypted credential storage for security
- The application includes comprehensive error handling and user feedback

## 🤝 Contributing

This is a demonstration project built for a technical assessment. Feel free to extend and improve the functionality!

## 📄 License

MIT License - See LICENSE file for details

image :<img width="1905" height="909" alt="Screenshot 2025-07-21 165928" src="https://github.com/user-attachments/assets/8e9377b6-ee3b-42fa-863b-3145e9eca4a5" />
<img width="1901" height="899" alt="Screenshot 2025-07-21 165941" src="https://
github.com/user-attachments/assets/ad72e22a-a00f-4a9b-8e55-0062956cb3a2" />
<img width="1880" height="894" alt="Screenshot 2025-07-21 165954" src="https://github.com/user-attachments/assets/3143db10-8d89-4861-815f-e2ae81cef693" />

git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Adiytisuman24/backend-imap.git
git push -u origin main
