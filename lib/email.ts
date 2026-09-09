import nodemailer from "nodemailer";

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error("חסרים פרטי חיבור לג'ימייל (GMAIL_USER / GMAIL_APP_PASSWORD)");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendReportEmail(opts: {
  to: string;
  studentName: string;
  reportUrl: string;
  pdfBuffer: Buffer;
}) {
  const transporter = getTransporter();
  const fromUser = process.env.GMAIL_USER;

  await transporter.sendMail({
    from: `"AcadeMe.Fund" <${fromUser}>`,
    to: opts.to,
    subject: "התאמות המלגות שלך מוכנות — AcadeMe.Fund",
    html: `
      <div dir="rtl" style="font-family:Arial,sans-serif;font-size:16px;color:#15398f;line-height:1.7;">
        <p>שלום ${opts.studentName || ""},</p>
        <p>ריכזנו עבורך את המלגות והמענקים שהכי מתאימים לפרופיל שלך.</p>
        <p>
          <a href="${opts.reportUrl}" style="color:#e8690f;font-weight:bold;text-decoration:none;">
            לצפייה בדוח המלא לחצו כאן
          </a>
        </p>
        <p>קובץ PDF עם כל הפרטים מצורף גם להודעה זו.</p>
        <p>בהצלחה,<br/>צוות AcadeMe.Fund</p>
      </div>
    `,
    attachments: [
      {
        filename: "AcadeMe-Fund-Report.pdf",
        content: opts.pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}
