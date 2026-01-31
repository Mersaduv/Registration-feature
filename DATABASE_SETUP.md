# راهنمای تنظیم دیتابیس

## گزینه 1: استفاده از Supabase (پیشنهاد - رایگان و سریع)

1. به [Supabase](https://supabase.com) بروید و یک حساب رایگان ایجاد کنید
2. یک پروژه جدید ایجاد کنید
3. در Settings > Database، Connection String را کپی کنید
4. Connection String را در فایل `.env` قرار دهید:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?schema=public"
```

## گزینه 2: استفاده از Neon (رایگان)

1. به [Neon](https://neon.tech) بروید و یک حساب رایگان ایجاد کنید
2. یک پروژه جدید ایجاد کنید
3. Connection String را کپی کنید
4. در فایل `.env` قرار دهید:

```env
DATABASE_URL="postgresql://[YOUR-CONNECTION-STRING]"
```

## گزینه 3: استفاده از Vercel Postgres

1. در Vercel dashboard، به Storage بروید
2. Postgres database ایجاد کنید
3. Connection String را کپی کنید
4. در فایل `.env` قرار دهید

## گزینه 4: دیتابیس محلی PostgreSQL

اگر PostgreSQL روی سیستم شما نصب است:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/reqr?schema=public"
```

## مراحل بعد از تنظیم DATABASE_URL

1. فایل `.env` را در root پروژه ایجاد کنید
2. `DATABASE_URL` را تنظیم کنید
3. Prisma Client را generate کنید:
   ```bash
   npm run db:generate
   ```
4. Schema را به دیتابیس push کنید:
   ```bash
   npm run db:push
   ```
5. سرور را restart کنید:
   ```bash
   npm run dev
   ```

## نکات مهم

- فایل `.env` در `.gitignore` است و commit نمی‌شود
- برای production، environment variables را در Vercel تنظیم کنید
- Supabase و Neon هر دو رایگان هستند و برای development مناسب‌اند
