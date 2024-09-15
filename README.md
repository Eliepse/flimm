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
docker compose exec -ti app php artisan down
docker compose exec -ti app php artisan migrate
docker compose exec -ti app php artisan storage:link
docker compose exec -ti app php artisan up
```
