#!/bin/bash

docker compose build
docker compose exec -ti php php artisan down
docker compose up -d
docker compose exec -ti php php artisan migrate
docker compose exec -ti php php artisan up
