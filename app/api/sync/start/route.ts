// app/api/sync/start/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Your sync logic goes here
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sync failed:', error);
    return NextResponse.json(
      { error: 'Sync failed', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
