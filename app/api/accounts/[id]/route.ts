import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import CryptoJS from 'crypto-js';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    
    // Encrypt password if provided
    if (updates.password) {
      const secretKey = process.env.ENCRYPTION_SECRET || 'default-secret-key';
      updates.password = CryptoJS.AES.encrypt(updates.password, secretKey).toString();
    }
    
    const { data: account, error } = await supabase
      .from('email_accounts')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();
    
    const account = dataStore.getAccount(params.id);
    return NextResponse.json({ account });
  } catch (error) {
    console.error('Failed to update account:', error);
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
  }
}

    if (error) {
      console.error('Failed to update account:', error);
      return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
    }
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    // Don't return password in response
    const sanitizedAccount = {
      ...account,
    const { error } = await supabase
      .from('email_accounts')
      .delete()
      .eq('id', params.id);
    };
    if (error) {
      console.error('Failed to delete account:', error);
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }
  try {
    return NextResponse.json({ account: sanitizedAccount });
  } catch (error) {
    console.error('Failed to delete account:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}