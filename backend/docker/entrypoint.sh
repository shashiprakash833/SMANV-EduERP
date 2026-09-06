#!/bin/sh
set -e

echo "--> SMANV EduERP Backend Starting..."

if [ "$DB_ENGINE" = "django.db.backends.postgresql" ]; then
    echo "--> Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
    while ! nc -z "$DB_HOST" "$DB_PORT"; do
        sleep 0.5
    done
    echo "--> PostgreSQL is ready!"
fi

echo "--> Running Database Migrations..."
python manage.py migrate --noinput

echo "--> Collecting Static Files..."
python manage.py collectstatic --noinput --clear || true

echo "--> Starting Server..."
exec "$@"
