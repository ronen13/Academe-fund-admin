# AcadeMe.Fund — Admin Backend (מערכת עצמאית)

זהו פרויקט **Next.js עצמאי ומלא** — לוח בקרה נפרד מהשאלון עצמו, שמריץ אותו כשירות משלו ב-Render. לא נדרש מיזוג עם קוד קיים.

מה שהמערכת מאפשרת:
- צפייה בתשובות השאלון (נטענות ישירות מגיליון ה-Google Sheets הקיים, לקריאה בלבד).
- ניהול מאגר מלגות (הוספה/עריכה/מחיקה): שם, פרטים, קישור, תאריך הגשה אחרון, פרטים נוספים.
- בחירת מלגות מתאימות לכל תשובת שאלון, יצירת **קישור ייחודי** לדוח, והפקת **PDF**.
- שליחת הדוח (קישור + PDF מצורף) **במייל** ישירות ללקוח.

ההגנה על לוח הבקרה: סיסמה משותפת אחת (`ADMIN_PASSWORD`).
מאגר המלגות והדוחות מאוחסן במסד נתונים אמיתי (PostgreSQL) בשירות משלו.

---

## מבנה הפרויקט (מלא, מוכן להעלאה כמו שהוא)

```
package.json
tsconfig.json
next.config.mjs
render.yaml
.env.example
.gitignore
app/
  layout.tsx                 → עטיפת האתר (עברית, RTL, גופנים)
  page.tsx                   → עמוד בית עם קישור ללוח הבקרה
  admin/
    layout.tsx                → מסגרת עם תפריט צד (מוגן ע"י middleware)
    login/page.tsx             → מסך כניסה
    LogoutButton.tsx
    page.tsx                   → תשובות שאלון (מהגיליון)
    scholarships/
      page.tsx
      ScholarshipManager.tsx   → CRUD מלגות
    reports/
      page.tsx                  → רשימת דוחות שהופקו
      new/
        page.tsx
        ReportBuilder.tsx       → בחירת מלגות + יצירת קישור + שליחה
  report/[token]/page.tsx       → העמוד הציבורי שרואה הלקוח (קישור ייחודי)
  api/
    admin/
      login/route.ts
      logout/route.ts
      submissions/route.ts
      scholarships/route.ts
      scholarships/[id]/route.ts
      reports/route.ts
      reports/[token]/send/route.ts
    reports/[token]/pdf/route.ts   → הורדת PDF (ציבורי, לפי טוקן)
lib/
  db.ts        → חיבור Prisma
  auth.ts      → סשן מנהל (עוגייה חתומה)
  sheets.ts     → קריאה מהגיליון (Google Sheets API)
  email.ts      → שליחת מייל (Gmail SMTP)
  pdf.tsx       → הפקת ה-PDF (react-pdf)
prisma/
  schema.prisma
middleware.ts   → מגן על נתיבי /admin
```

זהו פרויקט שלם — כל הקבצים למעלה מוכנים להעלאה ישירה לריפו חדש, בלי צורך במיזוג עם אף קובץ קיים.

---

## שלב 1 — העלאה לריפו חדש

צור ריפו חדש וריק ב-GitHub, והעלה אליו את **כל** הקבצים והתיקיות שמופיעות למעלה (כולל `package.json`, `.gitignore` וכו') — בדיוק כמו שהם, בלי לשנות מבנה.

## שלב 2 — מסד נתונים (PostgreSQL ב-Render)

יש שתי דרכים — הראשונה (Blueprint) עושה הכל אוטומטית כולל את זה, ראו שלב 7. אם תרצו להקים ידנית:

1. ב-[Render Dashboard](https://dashboard.render.com): **New → PostgreSQL**.
2. תנו לו שם (למשל `academe-fund-admin-db`), בחרו תוכנית (Free מספיקה להתחלה).
3. אחרי היצירה, העתיקו את ה-**Internal Database URL** — זה יהיה `DATABASE_URL`.
4. להרצה מקומית (רשות, לבדיקה לפני פריסה):
   ```bash
   npm install
   npx prisma migrate dev --name init
   ```
   זה ייצור את הטבלאות `Scholarship`, `Report`, `ReportScholarship`.

## שלב 3 — קריאה מהגיליון (Google Sheets, לקריאה בלבד)

זו אותה שיטה כמו ל-Apps Script, אבל הפעם דרך שירות Google Cloud (Service Account) לקריאה מ-Node:

1. עברו ל-[console.cloud.google.com](https://console.cloud.google.com), צרו פרויקט (או השתמשו בקיים).
2. הפעילו **Google Sheets API** (APIs & Services → Library → Google Sheets API → Enable).
3. צרו **Service Account** (APIs & Services → Credentials → Create Credentials → Service Account).
4. בתוך ה-Service Account שנוצר → **Keys → Add Key → Create new key → JSON**. יורד קובץ JSON — משם תצטרכו:
   - `client_email` → זה יהיה `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → זה יהיה `GOOGLE_PRIVATE_KEY`
5. פתחו את הגיליון (`https://docs.google.com/spreadsheets/d/18ECp7K3wqgNGNHn1NUwt-DT81w3x0QT9KQRUzbLFH7k/edit`), **שתפו** אותו עם כתובת ה-`client_email`, הרשאת **Viewer** מספיקה (לקריאה בלבד).
6. ה-`GOOGLE_SHEET_ID` הוא המזהה מתוך הכתובת: `18ECp7K3wqgNGNHn1NUwt-DT81w3x0QT9KQRUzbLFH7k`.

## שלב 4 — שליחת מייל (Gmail)

1. בחשבון ה-Gmail/Workspace שממנו תרצו לשלוח, הפעילו אימות דו-שלבי (2-Step Verification) אם עוד לא מופעל.
2. צרו **App Password** ייעודי: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) → בחרו אפליקציה "Mail" → קבלו סיסמה בת 16 תווים.
3. זו תהיה `GMAIL_APP_PASSWORD`. **לא** הסיסמה הרגילה של Gmail.

## שלב 5 — גופן עברי ל-PDF

`@react-pdf/renderer` לא כולל תמיכה בעברית כברירת מחדל. הורידו את הגופן **Heebo** (משתמשים בו כבר באתר) מ-[Google Fonts](https://fonts.google.com/specimen/Heebo), ושמרו:

```
public/fonts/Heebo-Regular.ttf   (משקל 400)
public/fonts/Heebo-Bold.ttf      (משקל 700)
```

## שלב 6 — משתני סביבה

הוסיפו ב-Render (Environment):

```
DATABASE_URL=postgresql://...              (משלב 2)
ADMIN_PASSWORD=<בחרו סיסמה חזקה>
ADMIN_SESSION_SECRET=<מחרוזת אקראית ארוכה, למשל פלט של openssl rand -hex 32>
GOOGLE_SHEET_ID=18ECp7K3wqgNGNHn1NUwt-DT81w3x0QT9KQRUzbLFH7k
GOOGLE_SHEET_NAME=תשובות
GOOGLE_SERVICE_ACCOUNT_EMAIL=...            (משלב 3)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GMAIL_USER=you@example.com
GMAIL_APP_PASSWORD=<16 התווים משלב 4>
```

**חשוב על `GOOGLE_PRIVATE_KEY`:** בקובץ ה-JSON המפתח מגיע עם `\n` אמיתיים בתוך המחרוזת. כשמדביקים בממשק של Render, שימו אותו בתוך מרכאות והשאירו את ה-`\n` כטקסט (לא כירידת שורה) — הקוד ב-`lib/sheets.ts` וב-`Code.gs` כבר ממיר אותם בחזרה אוטומטית.

## שלב 7 — פריסה ל-Render (הדרך המומלצת — Blueprint)

בפרויקט יש קובץ `render.yaml` מוכן — הוא מגדיר בבת אחת גם את שירות ה-Web וגם מסד PostgreSQL. מכיוון שזה ריפו חדש וריק, אין שום קובץ קיים לדרוס — פשוט:

1. Push של כל הפרויקט לריפו החדש (שלב 1).
2. ב-[Render Dashboard](https://dashboard.render.com): **New → Blueprint**, בחרו את הריפו החדש — Render יזהה את `render.yaml` ויציע ליצור את השירות + מסד הנתונים יחד.
3. Render יבקש למלא את משתני הסביבה שסומנו `sync: false` (`ADMIN_PASSWORD`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`) — מלאו אותם לפי שלבים 3-4 למעלה. את `ADMIN_SESSION_SECRET` Render ייצור אוטומטית (`generateValue: true`), ואת `DATABASE_URL` הוא ימלא אוטומטית מהמסד שנוצר.
4. אשרו את היצירה. Render יבנה את הפרויקט, ירוץ `prisma migrate deploy` אוטומטית (מוגדר בתוך `buildCommand`), ויעלה את השירות.
5. גשו ל-`https://<הדומיין שנוצר>/admin/login`.


---

## איך זה עובד, בקצרה

1. **`/admin`** — טבלת תשובות שאלון, נטענת בזמן אמת מהגיליון (לא מאוחסנת אצלכם — קריאה בלבד).
2. **`/admin/scholarships`** — ניהול מאגר המלגות (מאוחסן ב-PostgreSQL).
3. לחיצה על "הכן דוח מלגות" ליד תשובה מסוימת → **`/admin/reports/new`**, עם שם/אימייל/טלפון מולאים אוטומטית מהשאלון. בוחרים אילו מלגות מתאימות, ולוחצים "יצירת דוח וקישור ייחודי".
4. נוצרת רשומת `Report` עם `token` ייחודי (למשל `/report/ck9x...`), ומופיע כפתור **"שליחה במייל + PDF ללקוח"**.
5. הלחיצה על שליחה מפיקה PDF (בעיצוב הבית — נאבי/כתום), שולחת מייל ללקוח עם קישור לעמוד הציבורי **וגם** מצרפת את ה-PDF ישירות, ומסמנת את הדוח כ"נשלח".
6. הלקוח שמקבל את הקישור רואה עמוד ציבורי נקי עם כל המלגות שנבחרו עבורו + כפתור הורדת PDF.

## מגבלות ידועות / להרחבה עתידית

- אין כרגע "התאמה אוטומטית" של מלגות לפי תשובות השאלון — הבחירה ידנית לגמרי. אפשר להוסיף בעתיד לוגיקת ניקוד/סינון לפי תשובות (למשל תחום לימודים, מצב כלכלי).
- הסיסמה משותפת לכולם (אין משתמשים נפרדים). אם בעתיד יידרש מעקב "מי עשה מה", כדאי לשדרג למערכת התחברות אמיתית (למשל NextAuth).
- `middleware.ts` שסופק כאן מגן רק על `/admin/*`. אם יש לכם middleware קיים בפרויקט — יש למזג את הלוגיקה.
