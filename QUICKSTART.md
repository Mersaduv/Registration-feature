# Quick Start Guide

## Prerequisites

- Node.js 20+ installed
- PostgreSQL database (local or cloud)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `env.example.txt` to `.env`:

```bash
# On Windows PowerShell
Copy-Item env.example.txt .env

# On Linux/Mac
cp env.example.txt .env
```

Edit `.env` and set your `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/reqr?schema=public"
```

### 3. Set Up Database

Generate Prisma Client:

```bash
npm run db:generate
```

Create database and run migrations:

```bash
npm run db:push
```

Or if you prefer migrations:

```bash
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Navigate to [http://localhost:3000/register](http://localhost:3000/register) to test the registration form.

## Testing the Registration

1. Go to http://localhost:3000/register
2. Fill in the form:
   - Name: Your full name
   - Email: A valid email address
   - Password: At least 8 characters with uppercase, lowercase, and number
3. Submit the form
4. You should see a success toast notification

## Troubleshooting

### Database Connection Error

- Make sure PostgreSQL is running
- Verify `DATABASE_URL` in `.env` is correct
- Check database credentials

### Prisma Client Not Generated

Run: `npm run db:generate`

### Port Already in Use

Change the port: `npm run dev -- -p 3001`

## Next Steps

- Set up Upstash Redis for rate limiting (optional)
- Configure Sentry for error tracking (optional)
- Deploy to Vercel (see README.md)
