# Next.js Registration Feature

A production-ready registration feature built with Next.js (App Router), TypeScript, Prisma, and modern best practices for high performance, security, and scalability.

## Features

- ✅ **Registration Form** with name, email, and password fields
- ✅ **Client-side & Server-side Validation** using Zod
- ✅ **Password Hashing** with Argon2 (secure and performant)
- ✅ **Unique Email Enforcement** at database level
- ✅ **Rate Limiting** using Upstash Redis (optional)
- ✅ **Modern UI** with Tailwind CSS and accessible components
- ✅ **Error Handling** with proper HTTP status codes (201, 422, 409, 500)
- ✅ **Toast Notifications** for user feedback
- ✅ **TypeScript** throughout the codebase
- ✅ **Tests** (unit and integration)
- ✅ **CI/CD** with GitHub Actions
- ✅ **Vercel-ready** deployment configuration

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **ORM**: Prisma
- **Database**: PostgreSQL (Vercel Postgres recommended)
- **Validation**: Zod
- **Forms**: React Hook Form
- **Password Hashing**: Argon2
- **Rate Limiting**: Upstash Redis (optional)
- **Testing**: Jest, React Testing Library
- **Monitoring**: Sentry (optional)

## Prerequisites

- Node.js 20+ 
- npm or pnpm
- PostgreSQL database (local or cloud)
- (Optional) Upstash Redis account for rate limiting
- (Optional) Sentry account for error tracking

## Local Development Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Reqr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

# Optional: Upstash Redis for rate limiting
UPSTASH_REDIS_REST_URL="your-upstash-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"

# Optional: Sentry for error tracking
SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_SENTRY_DSN="your-public-sentry-dsn"
```

### 4. Set up the database

Generate Prisma Client:

```bash
npm run db:generate
```

Run database migrations:

```bash
npm run db:migrate
```

Or push the schema directly (for development):

```bash
npm run db:push
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Navigate to [http://localhost:3000/register](http://localhost:3000/register) to see the registration form.

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── register/
│   │       └── route.ts          # POST /api/register endpoint
│   ├── register/
│   │   └── page.tsx              # Registration page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   └── ui/
│       ├── button.tsx            # Button component
│       ├── input.tsx             # Input component
│       └── toast.tsx             # Toast notification component
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── validation.ts             # Zod schemas
│   ├── password.ts               # Password hashing utilities
│   └── rate-limit.ts             # Rate limiting utilities
├── prisma/
│   └── schema.prisma             # Database schema
├── __tests__/
│   ├── api/
│   │   └── register.test.ts      # API route tests
│   └── lib/
│       └── validation.test.ts    # Validation tests
└── .github/
    └── workflows/
        └── ci.yml                # GitHub Actions CI
```

## API Documentation

### POST /api/register

Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Success Response (201):**
```json
{
  "message": "Registration successful",
  "userId": 123
}
```

**Validation Error (422):**
```json
{
  "errors": {
    "email": ["Invalid email format"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

**Conflict Error (409):**
```json
{
  "message": "Email already registered"
}
```

**Rate Limit Error (429):**
```json
{
  "message": "Too many requests. Please try again later."
}
```

## Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}
```

## Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `UPSTASH_REDIS_REST_URL` (optional)
   - `UPSTASH_REDIS_REST_TOKEN` (optional)
   - `SENTRY_DSN` (optional)

### 3. Set up Vercel Postgres (Recommended)

1. In Vercel dashboard, go to Storage → Create Database → Postgres
2. Copy the `DATABASE_URL` and add it to environment variables
3. Run migrations after first deploy:
   ```bash
   npx prisma migrate deploy
   ```
   Or use Vercel's built-in migration support

### 4. Deploy

Vercel will automatically deploy on every push to main branch.

## Performance Optimizations

- **Database Indexing**: Unique index on email for fast lookups
- **Connection Pooling**: Prisma handles connection pooling automatically
- **Prepared Statements**: Prisma uses prepared statements by default
- **Rate Limiting**: Prevents abuse and ensures fair usage
- **Password Hashing**: Argon2 with optimized parameters for security and performance

## Security Features

- ✅ Password hashing with Argon2 (never stored in plain text)
- ✅ Input validation (client and server)
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection (React escapes by default)
- ✅ Rate limiting (prevents brute force)
- ✅ HTTPS (automatic on Vercel)
- ✅ Environment variables for secrets

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `UPSTASH_REDIS_REST_URL` | No | Upstash Redis REST URL for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash Redis REST token |
| `SENTRY_DSN` | No | Sentry DSN for error tracking |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Public Sentry DSN |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database (dev)
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check database is running and accessible
- Ensure firewall allows connections

### Rate Limiting Not Working

- Verify Upstash Redis credentials are set
- Rate limiting is optional - app works without it
- Check Upstash dashboard for usage

### Build Errors

- Run `npm run db:generate` before building
- Ensure all environment variables are set
- Check TypeScript errors with `npm run lint`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.
