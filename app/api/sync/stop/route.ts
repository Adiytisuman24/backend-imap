import { NextResponse } from 'next/server';
import { imapService } from '@/lib/services/imap-service';
import { sendSlackAlert } from '@/lib/services/notification-service';

export async function POST() {
  try {
    await imapService.stopSync();
    
    await sendSlackAlert('🛑 Email synchronization stopped', 'info');
    
    return NextResponse.json({ 
      message: 'Email synchronization stopped'
    });
  } catch (error) {
    console.error('Failed to stop synchronization:', error);
    return NextResponse.json({ 
      error: 'Failed to stop synchronization' 
    }, { status: 500 });
  }
}