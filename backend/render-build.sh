#!/usr/bin/env bash
# exit on error
set -o errexit

echo "--- Installing dependencies ---"
composer install --no-dev --optimize-autoloader

echo "--- Running migrations ---"
php artisan migrate --force
php artisan db:seed --class=AdminSeeder --force

echo "--- Clearing caches ---"
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "--- Build finished ---"
