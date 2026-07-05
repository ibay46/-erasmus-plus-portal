#!/bin/sh
# Neon's unpooled connection can still be cold-starting when the build kicks off,
# which makes `prisma migrate deploy` miss its 10s advisory-lock timeout (P1002).
# Retry a few times with a short backoff; if the unpooled endpoint still won't
# respond, fall back to the pooled DATABASE_URL (fine for our plain ALTER TABLE
# migrations, and reliably warm since the app's normal runtime traffic uses it).

max_attempts=3
attempt=1

until DATABASE_URL="${DATABASE_URL_UNPOOLED:-$DATABASE_URL}" npx prisma migrate deploy; do
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "prisma migrate deploy via unpooled URL failed after $max_attempts attempts, falling back to pooled DATABASE_URL..."
    exec npx prisma migrate deploy
  fi
  echo "prisma migrate deploy failed (attempt $attempt/$max_attempts), retrying in 6s..."
  attempt=$((attempt + 1))
  sleep 6
done
