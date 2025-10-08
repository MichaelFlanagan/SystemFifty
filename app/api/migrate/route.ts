import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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

    console.log('Running database migrations...');

    // Run migrations
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy');

    console.log('Migration output:', stdout);
    if (stderr) {
      console.error('Migration errors:', stderr);
    }

    return NextResponse.json({
      message: 'Migrations completed successfully',
      output: stdout,
      warnings: stderr || null
    });
  } catch (error) {
    console.error('Migration error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorOutput = (error as any).stdout || '';
    const errorDetails = (error as any).stderr || '';

    return NextResponse.json(
      {
        error: 'Failed to run migrations',
        message: errorMessage,
        output: errorOutput,
        details: errorDetails
      },
      { status: 500 }
    );
  }
}
