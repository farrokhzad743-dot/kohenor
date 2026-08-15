# سایت شرکت تعاونی عشایری کوه نور دهدشت — نسخه مدیریت محتوا

این نسخه برای GitHub Pages طراحی شده و برای مدیریت دائمی محتوا از Supabase استفاده می‌کند.

## امکانات
- ورود مالک با Magic Link ایمیل
- فقط ایمیل‌های موجود در `owner_access` اجازه مدیریت دارند
- ایمیل اولیه: `farrokhzad743@gmail.com`
- افزودن، ویرایش و حذف اخبار
- آپلود دائمی تصاویر اخبار در Supabase Storage
- تغییر عنوان، خلاصه و متن کامل «عشایر؛ سرمایه ملّی»
- تغییر عنوان، خلاصه و متن کامل «چگونگی تعاونی»
- سایت عمومی بدون نیاز به ورود

## راه‌اندازی
1. یک پروژه Supabase بساز.
2. فایل `supabase-schema.sql` را در SQL Editor اجرا کن.
3. در Supabase > Authentication > URL Configuration، آدرس GitHub Pages سایت را در Site URL و Redirect URLs قرار بده.
4. در `config.js` مقدارهای `supabaseUrl` و `supabaseAnonKey` را قرار بده.
5. `index.html` و `admin.html` و فایل‌های CSS/JS را در GitHub Pages قرار بده.
6. برای مدیریت سایت، `admin.html` را باز کن و با `farrokhzad743@gmail.com` لینک ورود بگیر.

## نکته امنیتی
Anon Key در سایت عمومی قابل مشاهده است؛ امنیت واقعی توسط Supabase RLS و جدول `owner_access` اعمال می‌شود. برای افزودن مالک دیگر، ابتدا ایمیل او را با دستور SQL به `owner_access` اضافه کن و سپس در `config.js` نیز به `ownerEmails` اضافه کن.

## تصاویر UUpload
تصاویر قدیمی فعلاً می‌توانند با URL فعلی نمایش داده شوند. تصاویر جدید از پنل مدیریت مستقیماً در Storage خود پروژه ذخیره می‌شوند تا وابستگی به UUpload نداشته باشند.


## دامنه برنامه‌ریزی‌شده
`https://tavonikohenor.ir`

> فایل CNAME عمداً تا زمان اتصال واقعی DNS اضافه نشده است؛ بنابراین GitHub Pages فعلاً با آدرس پیش‌فرض خود کار می‌کند.

## Final security/deployment notes
- `config.js` contains only the public Supabase URL and Publishable/Anon key. Never place the database password or `service_role` key in the repository.
- `supabase-security-final.sql` is the final RLS/Storage policy migration. Run it in the Supabase SQL Editor for the project used by this site.
- Magic-link login sends the email before checking `owner_access`; the owner check happens only after Supabase authenticates the user.
- `admin.html` no longer pre-fills the owner email.
