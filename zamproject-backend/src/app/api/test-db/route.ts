import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get all tables in the public schema
    const tablesResult = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    const tablesArray = tablesResult as unknown as any[];
    const tables = tablesArray.map((row: any) => row.table_name);

    // Get table counts
    const tableInfo: Record<string, any> = {};
    for (const tableName of tables) {
      try {
        const result = await db.execute(sql`SELECT COUNT(*) as count FROM ${sql.identifier(tableName)}`);
        const resultArray = result as unknown as any[];
        tableInfo[tableName] = resultArray[0]?.count || 0;
      } catch (error) {
        tableInfo[tableName] = 'error';
      }
    }

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      tables_count: tables.length,
      tables: tableInfo,
      database_connected: true,
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[API] Test DB failed:', error);
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      database_connected: false,
    }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
