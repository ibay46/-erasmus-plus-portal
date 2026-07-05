#!/bin/sh
# Neon's unpooled connection can still be cold-starting when the build kicks off,
# which makes `prisma migrate deploy` miss its 10s advisory-lock timeout (P1002).
# Retry a few times with backoff on the unpooled URL; if that still won't
# respond, retry a couple more times against the pooled DATABASE_URL (which
# the app's normal runtime traffic keeps warm).

try() {
  url="$1"
  attempts="$2"
  n=1
  while [ "$n" -le "$attempts" ]; do
    if DATABASE_URL="$url" npx prisma migrate deploy; then
      return 0
    fi
    echo "prisma migrate deploy failed (attempt $n/$attempts on this URL)"
    n=$((n + 1))
    [ "$n" -le "$attempts" ] && sleep 10
  done
  return 1
}

if try "${DATABASE_URL_UNPOOLED:-$DATABASE_URL}" 4; then
  exit 0
fi

echo "unpooled attempts exhausted, falling back to pooled DATABASE_URL..."
if try "$DATABASE_URL" 3; then
  exit 0
fi

echo "prisma migrate deploy failed on both unpooled and pooled URLs"
exit 1
