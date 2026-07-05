#!/bin/sh
# Neon's unpooled connection can still be cold-starting when the build kicks off,
# which makes `prisma migrate deploy` miss its 10s advisory-lock timeout (P1002).
# Retry a few times with a short backoff instead of failing the whole build.

migrate_url="${DATABASE_URL_UNPOOLED:-$DATABASE_URL}"
max_attempts=5
attempt=1

until DATABASE_URL="$migrate_url" npx prisma migrate deploy; do
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "prisma migrate deploy failed after $max_attempts attempts"
    exit 1
  fi
  echo "prisma migrate deploy failed (attempt $attempt/$max_attempts), retrying in 6s..."
  attempt=$((attempt + 1))
  sleep 6
done
