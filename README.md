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
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth v5
- **UI Components**: Shadcn UI + Radix UI
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up the database:

```bash
npx prisma migrate dev
```

3. Seed the admin user:

```bash
npm run seed
```

This creates an admin account:
- Email: `admin@systemfifty.com`
- Password: `admin123`

⚠️ **IMPORTANT**: Change this password after first login!

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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

The `.env` file contains:

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-secret-key-change-this-in-production"
AUTH_TRUST_HOST="true"
```

For production, update `AUTH_SECRET` with a secure random string.

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

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with admin user

## License

ISC
