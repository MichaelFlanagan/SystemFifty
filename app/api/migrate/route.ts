import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Get the secret from the request
    const { secret } = await request.json();

    // Verify the secret matches the environment variable
    if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'DATABASE_URL environment variable is not set' },
        { status: 500 }
      );
    }

    console.log('Testing database connection...');

    // Test database connection by running a simple query
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      message: 'Database connection successful. Migrations should have run during build time. If you need to run migrations manually, use: npx prisma migrate deploy locally or update the build script.',
      note: 'This endpoint verifies the database is accessible. Actual migrations run during the Vercel build process via the build script.'
    });
  } catch (error) {
    console.error('Database connection error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Failed to connect to database',
        message: errorMessage,
        help: 'Make sure DATABASE_URL is correctly configured in Vercel environment variables and the database is accessible.'
      },
      { status: 500 }
    );
  }
}
