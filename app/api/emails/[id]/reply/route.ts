import { NextRequest, NextResponse } from 'next/server';
import { generateSuggestedReply } from '@/lib/services/ai-service';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch the email from Supabase
    const { data: email, error } = await supabase
      .from('emails')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }
    const suggestedReply = await generateSuggestedReply(email, 'demo-user');
    
    return NextResponse.json({ 
      emailId: params.id,
      suggestedReply,
      confidence: 0.85,
      email: {
        subject: email.subject,
        from: email.from_email,
        category: email.category
      }
    });
  } catch (error) {
    console.error('Failed to generate reply suggestion:', error);
    return NextResponse.json({ 
      error: 'Failed to generate reply suggestion',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}