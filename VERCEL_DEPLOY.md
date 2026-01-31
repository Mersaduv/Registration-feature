# راهنمای دیپلوی در Vercel

## مراحل دیپلوی

### 1. آماده‌سازی پروژه

پروژه آماده است و فایل‌های زیر اضافه شده‌اند:
- `vercel.json` - تنظیمات Vercel
- `postinstall` script در `package.json` - برای generate کردن Prisma Client

### 2. Push به GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin master
```

### 3. اتصال به Vercel

1. به [Vercel Dashboard](https://vercel.com/dashboard) بروید
2. روی "Add New Project" کلیک کنید
3. Repository خود را انتخاب کنید
4. روی "Import" کلیک کنید

### 4. تنظیم Environment Variables

در صفحه تنظیمات پروژه، به بخش "Environment Variables" بروید و موارد زیر را اضافه کنید:

#### الزامی:
- `DATABASE_URL` - Connection string دیتابیس PostgreSQL

#### اختیاری:
- `UPSTASH_REDIS_REST_URL` - برای rate limiting
- `UPSTASH_REDIS_REST_TOKEN` - برای rate limiting
- `SENTRY_DSN` - برای error tracking
- `NEXT_PUBLIC_SENTRY_DSN` - برای error tracking

### 5. تنظیم Vercel Postgres (پیشنهاد)

1. در Vercel Dashboard، به بخش "Storage" بروید
2. "Create Database" > "Postgres" را انتخاب کنید
3. یک دیتابیس جدید ایجاد کنید
4. Connection String را کپی کنید
5. آن را به عنوان `DATABASE_URL` در Environment Variables اضافه کنید

### 6. اجرای Migration

بعد از اولین دیپلوی، باید migration را اجرا کنید:

#### روش 1: از Vercel CLI
```bash
npx vercel env pull .env.local
npx prisma migrate deploy
```

#### روش 2: از Vercel Dashboard
1. به بخش "Deployments" بروید
2. آخرین deployment را باز کنید
3. در "Functions" tab، می‌توانید migration را اجرا کنید

#### روش 3: استفاده از Vercel Postgres UI
1. در Vercel Dashboard > Storage > Postgres
2. از SQL Editor استفاده کنید
3. یا از Prisma Studio استفاده کنید

### 7. Build Command

Vercel به صورت خودکار از build command استفاده می‌کند:
```bash
npm run build
```

که شامل `prisma generate` می‌شود.

### 8. بررسی دیپلوی

بعد از دیپلوی موفق:
1. به URL پروژه بروید
2. صفحه ثبت‌نام را تست کنید
3. مطمئن شوید که دیتابیس کار می‌کند

## Troubleshooting

### خطای Prisma Client
- مطمئن شوید که `postinstall` script در `package.json` وجود دارد
- مطمئن شوید که `DATABASE_URL` در Environment Variables تنظیم شده است

### خطای Connection
- بررسی کنید که `DATABASE_URL` صحیح است
- مطمئن شوید که دیتابیس در دسترس است
- برای Vercel Postgres، از Connection String از dashboard استفاده کنید

### خطای Migration
- بعد از اولین دیپلوی، migration را اجرا کنید
- می‌توانید از `prisma db push` برای development استفاده کنید

## نکات مهم

- Environment Variables را برای Production و Preview تنظیم کنید
- برای Vercel Postgres، Connection String به صورت خودکار تنظیم می‌شود
- Prisma Client در build time generate می‌شود
- برای production، از `prisma migrate deploy` استفاده کنید
