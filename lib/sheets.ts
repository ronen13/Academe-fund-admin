import { google } from "googleapis";

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  if (!email || !key) {
    throw new Error("חסרים פרטי חיבור ל-Google Sheets (GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY)");
  }
  return new google.auth.JWT(email, undefined, key, [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
  ]);
}

export type Submission = Record<string, string> & { _row: number };

/**
 * קורא את כל שורות הטאב "תשובות" מהגיליון של השאלון, וממפה כל שורה
 * לאובייקט לפי שמות העמודות בשורת הכותרות (שורה 1).
 */
export async function fetchSubmissions(): Promise<Submission[]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error("חסר GOOGLE_SHEET_ID");
  }
  const sheetName = process.env.GOOGLE_SHEET_NAME || "תשובות";

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:AZ`,
  });

  const rows = res.data.values || [];
  if (rows.length === 0) return [];

  const headers = rows[0] as string[];
  return rows.slice(1).map((row, i) => {
    const obj: Submission = { _row: i + 2 } as Submission;
    headers.forEach((h, idx) => {
      obj[h] = (row[idx] as string) ?? "";
    });
    return obj;
  });
}
