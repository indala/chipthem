import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // ✅ App Router only
import { supabaseServerClient } from '@/lib/supabaseServerClient';

export async function GET(req: Request) {
  try {
    const cookieStore =await cookies();
    const adminToken = cookieStore?.get('admin_token') || null;

    if (!adminToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    

    // ✅ Proceed with your paginated query
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabaseServerClient
      .from('veterinary_clinics')
      .select('*', { count: 'exact' })
      .eq('status', 'pending') 
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching veterinary clinics:', error);
      return NextResponse.json({ success: false, message: 'Fetch failed' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      veterinary_clinics: data,
      pagination: {
        currentPage: page,
        totalVeterinaryClinics: count || 0,
        hasMore: count ? to + 1 < count : false,
      },
    });
  } catch (err) {
    console.error('GET veterinary clinics error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}