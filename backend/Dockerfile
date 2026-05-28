FROM php:8.4-apache

# 1. Install sistem dependensi & ekstensi PHP yang dibutuhkan Laravel
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libpq-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_pgsql zip

# 2. Aktifkan Apache mod_rewrite
RUN a2enmod rewrite

# 3. Ubah DocumentRoot Apache ke folder /public Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 4. Ubah port Apache ke 8080 (standar Google Cloud Run)
RUN sed -i 's/80/8080/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# 5. Set working directory
WORKDIR /var/www/html

# 6. Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 7. Copy file aplikasi ke dalam container
COPY . .

# 8. Install dependensi PHP (production)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# 9. Atur permission untuk folder storage dan cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 10. Optimize Laravel
RUN php artisan route:cache && \
    php artisan view:cache

# 11. Expose port 8080
EXPOSE 8080

# 12. Jalankan Apache
CMD ["apache2-foreground"]
