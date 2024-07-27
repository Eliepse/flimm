FROM dunglas/frankenphp:php8.3-alpine

#ARG USER=www-data

WORKDIR /app

# add additional extensions here:
RUN install-php-extensions pdo_mysql gd intl zip opcache exif sqlite3

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

#RUN \
#	adduser -D ${USER}; \
#	# Add additional capability to bind to port 80 and 443
#	setcap CAP_NET_BIND_SERVICE=+eip /usr/local/bin/frankenphp; \
#	# Give write access to /data/caddy and /config/caddy
#	chown -R ${USER}:${USER} /data/caddy && chown -R ${USER}:${USER} /config/caddy

RUN cp $PHP_INI_DIR/php.ini-development $PHP_INI_DIR/php.ini
COPY docker/php/custom.ini $PHP_INI_DIR/conf.d/99-custom.ini

#USER ${USER}


