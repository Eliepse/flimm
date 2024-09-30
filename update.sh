#!/bin/bash

TODAY="$(date +%Y%m%d)"

# Database backup
docker compose cp app:/app/database/sqlite/database.sqlite ../database-flimm-"$TODAY".sqlite || exit 1

# Prepare the new version
docker compose build || exit 1

# Start maintenance
docker compose exec -ti app php artisan down || exit 1
docker compose up -d || exit 1
docker compose exec -ti app php artisan migrate --force || exit 1

# Optimize
docker compose exec -ti app php artisan optimize || exit 1

# Re-enable the app
docker compose exec -ti app php artisan up || exit 1
