import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@systemfifty.com' },
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: 'Database already seeded',
        admin: { email: existingAdmin.email }
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.create({
      data: {
        email: 'admin@systemfifty.com',
        password: hashedPassword,
        name: 'Admin',
      },
    });

    return NextResponse.json({
      message: 'Database seeded successfully',
      admin: { email: admin.email },
      warning: 'IMPORTANT: Change the admin password after first login!'
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
