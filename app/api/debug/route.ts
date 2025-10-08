import { NextResponse } from 'next/server';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;

  return NextResponse.json({
    hasDbUrl: !!dbUrl,
    dbUrlPrefix: dbUrl ? dbUrl.substring(0, 20) + '...' : 'NOT SET',
    allEnvVars: Object.keys(process.env).filter(key =>
      key.includes('DATABASE') ||
      key.includes('NEXTAUTH') ||
      key.includes('SEED')
    )
  });
}
