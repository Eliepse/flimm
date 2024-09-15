# FLiMM

## Deploy in production

### Prepare the project

- Copy `.env.example` to `.env` and customize as need
- Copy `compose.prod.yml` to `compose.override.yml` and customize as need

```shell
# Copy and customize
cp .env.example .env
cp compose.prod.yml compose.override.yml

docker compose build
docker compose up -d
docker compose exec -ti php php artisan down
docker compose exec -ti php php artisan migrate
docker compose exec -ti php php artisan storage:link
docker compose exec -ti php php artisan up
```

```bash
# Only on first run
#touch database/sqlite/database.sqlite

# Start and update
docker compose build --no-cache
docker compose up -d --wait
docker compose exec php php artisan migrate
```
