export const metadata = {
  title: "AcadeMe.Fund — לוח בקרה",
  description: "לוח ניהול פנימי: תשובות שאלון, מאגר מלגות, ודוחות התאמה לסטודנטים.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;700;800;900&family=Heebo:wght@400;500;600;700&display=swap"
        />
      </head>
      <body style={{ margin: 0, background: "#f7f9fc" }}>{children}</body>
    </html>
  );
}
