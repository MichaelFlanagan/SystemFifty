import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;

  const result: any = {
    hasDbUrl: !!dbUrl,
    dbUrlPrefix: dbUrl ? dbUrl.substring(0, 30) + '...' : 'NOT SET',
    allEnvVars: Object.keys(process.env).filter(key =>
      key.includes('DATABASE') ||
      key.includes('NEXTAUTH') ||
      key.includes('SEED')
    )
  };

  // Try to connect to the database
  try {
    await prisma.$queryRaw`SELECT 1 as test`;
    result.dbConnection = 'SUCCESS';
  } catch (error) {
    result.dbConnection = 'FAILED';
    result.dbError = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json(result);
}
