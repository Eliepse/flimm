# FLiMM

## Deploy in production

### Prepare the project

- Copy `.env.example` to `.env` and customize as need
- Copy `compose.prod.yml` to `compose.override.yml` and customize as need

```bash
# Only on first run
#touch database/sqlite/database.sqlite

# Start and update
docker compose build --no-cache
docker compose up -d --wait
docker compose exec php php artisan migrate
```
