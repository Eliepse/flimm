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


FROM base AS preprod

ENV DB_DATABASE=/app/database/sqlite/database.sqlite
ENV NODE_VERSION=20.17.0
ENV NVM_DIR=/root/.nvm
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

COPY docker/php/99-php-prod.ini $PHP_INI_DIR/conf.d/99-php-prod.ini
COPY . /app

RUN mkdir $NVM_DIR &&\
    cp $PHP_INI_DIR/php.ini-production $PHP_INI_DIR/php.ini &&\
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash &&\
    . "$NVM_DIR/nvm.sh" &&\
    nvm install ${NODE_VERSION} &&\
   	nvm use v${NODE_VERSION} &&\
    nvm alias default v${NODE_VERSION} &&\
    corepack enable pnpm &&\
    pnpm install &&\
    pnpm run build &&\
    pnpm store prune &&\
    nvm deactivate ${NODE_VERSION} &&\
    nvm uninstall ${NODE_VERSION} &&\
    nvm unload &&\
    rm -rf node_modules &&\
    rm -rf "$NVM_DIR" &&\
    apt clean &&\
    composer install --no-dev -oa --prefer-dist && \
    php artisan storage:link

FROM base AS prod
COPY --from=preprod /app /app
COPY .env /app/.env

