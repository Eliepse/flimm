FROM dunglas/frankenphp:php8.3 AS base

WORKDIR /app
VOLUME /app/database/sqlite
VOLUME /app/database/storage

RUN install-php-extensions pdo_mysql gd intl zip opcache exif sqlite3

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

#RUN \
#	adduser -D ${USER}; \
#	# Add additional capability to bind to port 80 and 443
#	setcap CAP_NET_BIND_SERVICE=+eip /usr/local/bin/frankenphp; \
#	# Give write access to /data/caddy and /config/caddy
#	chown -R ${USER}:${USER} /data/caddy && chown -R ${USER}:${USER} /config/caddy



FROM base AS dev
COPY docker/php/99-php-dev.ini $PHP_INI_DIR/conf.d/99-php-dev.ini
RUN cp $PHP_INI_DIR/php.ini-development $PHP_INI_DIR/php.ini



FROM node:24-alpine AS front-build
WORKDIR /app
COPY . /app
RUN corepack enable pnpm &&\
    pnpm install &&\
	pnpm run build &&\
	pnpm store prune &&\
    rm -rf node_modules



FROM base AS preprod
ENV DB_DATABASE=/app/database/sqlite/database.sqlite

COPY docker/php/99-php-prod.ini $PHP_INI_DIR/conf.d/99-php-prod.ini
COPY . /app
COPY --from=front-build /app/public ./public

RUN cp $PHP_INI_DIR/php.ini-production $PHP_INI_DIR/php.ini &&\
    composer install --no-dev -oa --prefer-dist && \
    php artisan storage:link

FROM base AS prod
COPY --from=preprod /app /app
COPY .env /app/.env

