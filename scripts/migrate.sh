#!/bin/bash

# Try to run migrations, but don't fail the build if it doesn't work
echo "Attempting to run database migrations..."

if npx prisma migrate deploy; then
  echo "✓ Migrations completed successfully"
else
  echo "⚠ Migrations failed or skipped - this is expected if:"
  echo "  - Database is not yet configured"
  echo "  - Database connection is not available during build"
  echo "  - Migrations have already been run"
  echo ""
  echo "You can run migrations manually using the /api/migrate endpoint after deployment."
fi

exit 0
