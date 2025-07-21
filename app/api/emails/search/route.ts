import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { query, accountId, dateFrom, dateTo, offset = 0, limit = 20 } = await req.json();
    const supabase = createServerComponentClient({ cookies });

    let supabaseQuery = supabase.from('emails').select('*', { count: 'exact' });

    if (query) {
      supabaseQuery = supabaseQuery.or(
        `subject.ilike.%${query}%,body.ilike.%${query}%,from_email.ilike.%${query}%`
      );
    }

    if (accountId && accountId !== 'all') {
      supabaseQuery = supabaseQuery.eq('account_id', accountId);
    }

    if (dateFrom) {
      supabaseQuery = supabaseQuery.gte('date', dateFrom);
    }

    if (dateTo) {
      supabaseQuery = supabaseQuery.lte('date', dateTo);
    }

    const { data: emails, error, count } = await supabaseQuery
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase query failed:', error);
      return NextResponse.json({ error: 'Supabase error' }, { status: 500 });
    }

    return NextResponse.json({ emails, total: count });
  } catch (err) {
    console.error('Search route error:', err);
    return NextResponse.json({ error: 'Server error', message: String(err) }, { status: 500 });
  }
}
