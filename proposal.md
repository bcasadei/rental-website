# Project: Rental Booking App

## Features:

📄 Rental listings page (SSR/SSG)
🔍 Filtering (by location, type, date)
🗓️ Availability calendar (Accuity?)
🧾 Booking form + Stripe/PayPal checkout
👩‍💼 Admin area to manage listings
📦 CMS or DB integration (Sanity or Supabase)\*\*
📄 Gallery page for location photos

## Deliverables

-Figma prototype
-Postgres database
-Next.js or React frontend
-Live site on Vercel

# Database Schema

## 📘 Tables Overview

### 👤 Users

- `id` (PK): Unique user ID
- `name`: Full name
- `email`: User's email address
- `password_hash`: Hashed password
- `role`: 'customer', 'admin', etc.
- `created_at`: Account creation date

### 🏠 Rentals

- `id` (PK): Unique rental ID
- `title`: Name/title of the rental
- `description`: Detailed description
- `size`: Locker size
- `image_url`: Link to image
- `price_per_month`: Monthly rental rate
- `price_per_day`: Daily rental rate
- `available`: Rental availability window
- `created_at`: Listing creation date

### 📅 Bookings

- `id` (PK): Booking ID
- `user_id` (FK): Linked user
- `rental_id` (FK): Linked rental
- `start_time` / `end_time`: Rental period
- `status`: Booking status ('pending', 'confirmed', etc.)
- `total_price`: Calculated total
- `created_at`: Booking creation date

### 💳 Payments

- `id` (PK): Payment ID
- `booking_id` (FK): Associated booking
- `amount`: Amount paid
- `status`: Payment status
- `payment_method`: Stripe, PayPal, etc.
- `transaction_id`: Gateway reference
- `created_at`: Payment timestamp

### 📆 Availability (Optional)

- `id` (PK): Entry ID
- `rental_id` (FK): Linked rental
- `date`: Date in question
- `is_available`: Boolean flag
