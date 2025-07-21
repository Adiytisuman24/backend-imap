import { NextRequest, NextResponse } from 'next/server';
import { storeProductContext } from '@/lib/services/ai-service';

export async function POST(request: NextRequest) {
  try {
    const contextData = await request.json();
    
    const context = await storeProductContext('demo-user', contextData);
    
    return NextResponse.json({ context });
  } catch (error) {
    console.error('Failed to store product context:', error);
    return NextResponse.json({ 
      error: 'Failed to store product context',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}