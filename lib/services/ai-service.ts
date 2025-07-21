import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { supabaseAdmin } from '@/lib/supabase';
import { ProcessedEmail } from './imap-service';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});

const INDEX_NAME = 'email-context';

export type EmailCategory = 'Interested' | 'Meeting Booked' | 'Not Interested' | 'Spam' | 'Out of Office' | 'Uncategorized';

const CATEGORIZATION_PROMPT = `
Analyze the following email and categorize it into one of these categories:
- Interested: The sender shows interest in a product/service/opportunity, job applications, business inquiries
- Meeting Booked: The email is about scheduling, confirming, or discussing meetings/interviews
- Not Interested: The sender explicitly declines, rejects, or shows no interest
- Spam: Promotional emails, advertisements, marketing content, or unwanted solicitations
- Out of Office: Automatic out-of-office replies, vacation responses

Email details:
From: {from}
Subject: {subject}
Body: {body}

Respond with only the category name (exactly as listed above).
`;

export async function classifyEmail(email: ProcessedEmail): Promise<EmailCategory> {
  try {
    const prompt = CATEGORIZATION_PROMPT
      .replace('{from}', email.from_email)
      .replace('{subject}', email.subject)
      .replace('{body}', email.body.substring(0, 1000));

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert email classifier. Classify emails accurately into the given categories based on content and intent.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 50
    });

    const category = response.choices[0]?.message?.content?.trim();
    
    const validCategories: EmailCategory[] = [
      'Interested', 'Meeting Booked', 'Not Interested', 'Spam', 'Out of Office'
    ];
    
    if (validCategories.includes(category as EmailCategory)) {
      return category as EmailCategory;
    }
    
    return 'Uncategorized';
  } catch (error) {
    console.error('Failed to categorize email:', error);
    return 'Uncategorized';
  }
}

export async function initializeVectorStore() {
  try {
    const indexList = await pinecone.listIndexes();
    const indexExists = indexList.indexes?.some(index => index.name === INDEX_NAME);

    if (!indexExists) {
      await pinecone.createIndex({
        name: INDEX_NAME,
        dimension: 1536,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      
      console.log('✅ Vector store initialized');
    }
  } catch (error) {
    console.error('Failed to initialize vector store:', error);
  }
}

export async function storeProductContext(userId: string, context: any) {
  try {
    // Store in Supabase
    const { data, error } = await supabaseAdmin
      .from('product_contexts')
      .upsert({
        user_id: userId,
        name: context.name,
        description: context.description,
        meeting_link: context.meeting_link,
        outreach_agenda: context.outreach_agenda
      });

    if (error) throw error;

    // Store in vector database
    await initializeVectorStore();
    const index = pinecone.index(INDEX_NAME);
    
    const text = `Product: ${context.name}. Description: ${context.description}. Outreach: ${context.outreach_agenda}. Meeting: ${context.meeting_link}`;
    const embedding = await createEmbedding(text);
    
    await index.upsert([
      {
        id: `${userId}-${context.name}`,
        values: embedding,
        metadata: {
          userId,
          name: context.name,
          description: context.description,
          meetingLink: context.meeting_link,
          outreachAgenda: context.outreach_agenda,
          type: 'product_context'
        }
      }
    ]);

    console.log('✅ Product context stored in vector database');
    return data;
  } catch (error) {
    console.error('Failed to store product context:', error);
    throw error;
  }
}

export async function generateSuggestedReply(email: ProcessedEmail, userId: string): Promise<string> {
  try {
    await initializeVectorStore();
    const index = pinecone.index(INDEX_NAME);
    
    // Create embedding for the email
    const emailText = `${email.subject} ${email.body}`;
    const emailEmbedding = await createEmbedding(emailText);
    
    // Query for similar contexts
    const queryResponse = await index.query({
      vector: emailEmbedding,
      topK: 3,
      includeMetadata: true,
      filter: { 
        userId: userId,
        type: 'product_context' 
      }
    });

    let contextInfo = '';
    if (queryResponse.matches && queryResponse.matches.length > 0) {
      const bestMatch = queryResponse.matches[0];
      const context = bestMatch.metadata;
      
      contextInfo = `
Product Context:
- Name: ${context?.name}
- Description: ${context?.description}
- Meeting Link: ${context?.meetingLink}
- Outreach Agenda: ${context?.outreachAgenda}
      `;
    } else {
      // Fallback to database context
      const { data: contexts } = await supabaseAdmin
        .from('product_contexts')
        .select('*')
        .eq('user_id', userId)
        .limit(1);

      if (contexts && contexts.length > 0) {
        const context = contexts[0];
        contextInfo = `
Product Context:
- Name: ${context.name}
- Description: ${context.description}
- Meeting Link: ${context.meeting_link}
- Outreach Agenda: ${context.outreach_agenda}
        `;
      }
    }

    const prompt = `
Based on the following email and product context, generate a professional, personalized reply:

Email from: ${email.from_email}
Email subject: ${email.subject}
Email content: ${email.body.substring(0, 500)}

${contextInfo}

Generate a professional reply that:
1. Acknowledges their message appropriately
2. Shows enthusiasm and professionalism
3. Provides relevant information based on the context
4. Includes the meeting booking link if appropriate
5. Maintains a warm, professional tone
6. Is concise but comprehensive

Reply:
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional email assistant. Generate helpful, personalized replies that sound natural and professional. Always be courteous and match the tone of the incoming email.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 400
    });

    return response.choices[0]?.message?.content?.trim() || 'Thank you for your email. I\'ll get back to you shortly with more information.';
  } catch (error) {
    console.error('Failed to generate suggested reply:', error);
    return 'Thank you for your email. I appreciate your interest and will get back to you shortly.';
  }
}

async function createEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text
  });
  
  return response.data[0].embedding;
}