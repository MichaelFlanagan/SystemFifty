#!/bin/bash

# Try to run migrations with a timeout, but don't fail the build if it doesn't work
echo "Attempting to run database migrations..."

# Run migrations with a 30 second timeout
if timeout 30s npx prisma migrate deploy; then
  echo "✓ Migrations completed successfully"
else
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 124 ]; then
    echo "⚠ Migrations timed out after 30 seconds"
  else
    echo "⚠ Migrations failed or skipped"
  fi
  echo ""
  echo "This is expected if:"
  echo "  - Database connection is slow or unavailable during build"
  echo "  - Migrations have already been run"
  echo "  - Database is not yet configured"
  echo ""
  echo "The app will still deploy. Database should be accessible at runtime."
fi

exit 0
