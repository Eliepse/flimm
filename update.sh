#!/bin/bash

docker compose build
docker compose exec -ti app php artisan down
docker compose up -d
docker compose exec -ti app php artisan migrate
docker compose exec -ti app php artisan optimize
docker compose exec -ti app php artisan up
