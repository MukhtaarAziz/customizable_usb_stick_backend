# Customizable USB Stick Backend + Frontend

This repository contains a full-stack application for a customizable USB stick product, with a Laravel backend API and a React frontend.

## Project Structure

- `backend/` — Laravel API backend
- `frontend/` — React + Vite frontend
- `PROJECT_STRUCTURE_AR.md` — Arabic project structure overview

## Backend

The backend lives in `backend/` and is built with Laravel.

Key features:
- RESTful API endpoints
- Eloquent models for products, orders, customers, and more
- Database migrations and seeders
- Authentication support

Common commands:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## Frontend

The frontend lives in `frontend/` and is built with React + Vite.

Key features:
- React user interface for product and order management
- Vite development server and fast builds
- Bootstrap-based responsive styling

Common commands:

```bash
cd frontend
npm install
npm run dev
```

## Configuration

### Backend configuration

The backend stores environment settings in `backend/.env`. Key settings include:

```env
APP_NAME="Customizable USB Stick"
APP_URL=http://localhost:8000
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=usb_stick_db
DB_USERNAME=root
DB_PASSWORD=
```

Important backend config files:
- `backend/config/app.php`
- `backend/config/database.php`
- `backend/config/filesystems.php`
- `backend/config/auth.php`

### Frontend configuration

The frontend stores environment settings in `frontend/.env`.

Common frontend variables:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Important frontend config files:
- `frontend/vite.config.js`
- `frontend/package.json`

## Authentication and API Endpoints

### Authentication flow

The backend uses Laravel Sanctum for API authentication.

Public auth endpoints:
- `POST /api/login` — authenticate admin or client user and receive a token
- `POST /api/logout` — revoke the current token
- `GET /api/me` — return the current authenticated user

Role-based access:
- Client users can access public catalog and order endpoints
- Admin users require the `admin` middleware for management routes

### Client-facing endpoints

Public frontend endpoints:
- `GET /api/games`
- `GET /api/programs`
- `GET /api/platforms`
- `GET /api/packages`
- `GET /api/categories`
- `GET /api/governorates`
- `GET /api/usb-sticks`
- `GET /api/storage-device-types`
- `GET /api/storage-devices`
- `POST /api/customers` — client registration
- `POST /api/package-orders` — create package order
- `POST /api/usb-stick-orders` — create USB order
- `POST /api/storage-device-orders` — create storage device order

Authenticated client endpoints:
- `GET /api/cart` — view cart
- `POST /api/cart/sync` — synchronize cart
- `DELETE /api/cart` — clear cart

### Admin endpoints

Admin routes require `auth:sanctum` and `admin` middleware.

User management:
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`
- `PATCH /api/users/{id}/role`

Customer management:
- `GET /api/customers`
- `GET /api/customers/{id}`
- `PUT /api/customers/{id}`
- `DELETE /api/customers/{id}`

Dashboard and order management:
- `GET /api/admin/dashboard`
- `GET /api/admin/orders`
- `GET /api/admin/package-orders`
- `GET /api/admin/usb-stick-orders`
- `PATCH /api/admin/orders/{id}/status`
- `PATCH /api/admin/package-orders/{id}/status`
- `PATCH /api/admin/usb-stick-orders/{id}/status`

Package and catalog management:
- `POST /api/games`
- `PUT /api/games/{id}`
- `PATCH /api/games/{id}/active`
- `DELETE /api/games/{id}`
- `POST /api/programs`
- `PUT /api/programs/{id}`
- `PATCH /api/programs/{id}/active`
- `DELETE /api/programs/{id}`
- `POST /api/packages`
- `PUT /api/packages/{id}`
- `POST /api/packages/{package}/items`
- `DELETE /api/packages/{package}/items/{item}`
- `DELETE /api/packages/{id}`
- `POST /api/storage-devices`
- `PUT /api/storage-devices/{id}`
- `DELETE /api/storage-devices/{id}`

## Connecting Frontend and Backend

The frontend communicates with the backend through API calls. Configure the backend URL in `frontend/.env` with a variable similar to:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Getting Started

1. Start the backend:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

2. Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

3. Open the frontend URL provided by Vite and use the application.

## Notes

- `backend/README.md` contains backend-specific documentation.
- `frontend/README.md` contains frontend-specific documentation.
- `PROJECT_STRUCTURE_AR.md` contains an Arabic overview of the repository layout.
