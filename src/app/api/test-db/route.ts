import { NextResponse } from "next/server";
import pool from "@/lib/pgClient";

export async function GET() {
  let client;
  try {
    client = await pool.connect();
    
    // 1. Check tables exist
    const tables = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);
    
    // 2. Test admins table
    const admins = await client.query("SELECT * FROM admins LIMIT 1");
    
    return NextResponse.json({ 
      success: true,
      tables: tables.rows.map((row: any) => row.tablename),
      admins_count: admins.rowCount,
      sample_admin: admins.rows[0] || 'No admins yet'
    });
  } catch (err: any) {
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
