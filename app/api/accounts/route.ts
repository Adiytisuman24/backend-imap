// app/api/accounts/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Accounts route working!' });
}
