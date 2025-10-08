# System Fifty - Sports Betting Capper Website

A Next.js application for managing and displaying sports betting picks with an admin dashboard.

## Features

- 🎯 Single-page landing site with dynamic picks display
- 🔐 Admin authentication system
- 📝 Admin dashboard for creating and managing picks
- 🖼️ Image upload functionality
- 📱 Responsive design with Tailwind CSS
- 🎨 Modern UI components with Shadcn UI

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth v5
- **UI Components**: Shadcn UI + Radix UI
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel with Supabase PostgreSQL

## Deployment (Vercel)

This application is designed to run on Vercel with Supabase PostgreSQL.

### Initial Setup

1. **Deploy to Vercel**
   - Push your code to GitHub
   - Import the repository in Vercel
   - Vercel will automatically detect Next.js

2. **Set up Supabase Database**
   - In your Vercel project, go to Storage
   - Create a PostgreSQL database (Supabase)
   - The `DATABASE_URL` will be automatically added to your environment variables

3. **Add Required Environment Variables**

   In Vercel Project Settings → Environment Variables, add:

   ```
   NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
   NEXTAUTH_URL=https://your-app.vercel.app
   SEED_SECRET=<any random secret string>
   RESEND_API_KEY=<optional, for contact form>
   ```

4. **Deploy**
   - Trigger a deployment
   - Migrations will run automatically during build

5. **Seed the Database**

   After first deployment, make a POST request to seed the admin user:

   ```bash
   curl -X POST https://your-app.vercel.app/api/seed \
     -H "Content-Type: application/json" \
     -d '{"secret": "your-SEED_SECRET-value"}'
   ```

   This creates an admin account:
   - Email: `admin@systemfifty.com`
   - Password: `admin123`

   ⚠️ **IMPORTANT**: Change this password after first login!

## Usage

### Public Site

Visit the homepage to see the active pick displayed with:
- Pick title
- Optional image
- Detailed analysis/content

### Admin Access

1. Navigate to `/admin/login`
2. Sign in with admin credentials
3. Access the dashboard at `/admin/dashboard`

### Managing Picks

From the admin dashboard you can:

- **Create New Picks**: Add title, content, and optional image
- **Set Active Pick**: Choose which pick displays on the homepage
- **Delete Picks**: Remove old or unwanted picks
- **View All Picks**: See your complete pick history

Only one pick can be active at a time. Setting a new pick as active automatically deactivates the previous one.

## Environment Variables

See `.env.example` for all required environment variables:

- `DATABASE_URL` - PostgreSQL connection string (auto-added by Vercel)
- `NEXTAUTH_SECRET` - Secret for NextAuth session encryption
- `NEXTAUTH_URL` - Your application URL
- `SEED_SECRET` - Secret for database seeding endpoint
- `RESEND_API_KEY` - Optional, for contact form emails

## Project Structure

```
systemfifty/
├── app/
│   ├── page.tsx                    # Public homepage
│   ├── admin/
│   │   ├── login/page.tsx         # Admin login
│   │   └── dashboard/page.tsx     # Admin dashboard
│   └── api/
│       ├── picks/                  # Picks API routes
│       ├── upload/                 # Image upload
│       └── auth/                   # NextAuth endpoints
├── components/ui/                  # Shadcn UI components
├── lib/
│   ├── prisma.ts                  # Prisma client
│   └── utils.ts                   # Utility functions
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Seed script
├── public/uploads/                # Uploaded images
└── auth.ts                        # NextAuth configuration
```

## Database Schema

### User
- `id`: Unique identifier
- `email`: User email (unique)
- `password`: Hashed password
- `name`: Optional display name

### Pick
- `id`: Unique identifier
- `title`: Pick title
- `content`: Pick details/analysis
- `imageUrl`: Optional image path
- `isActive`: Boolean flag (only one can be true)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Scripts

- `npm run build` - Run migrations and build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database (for local development)
- `postinstall` - Automatically generates Prisma client

## License

ISC
