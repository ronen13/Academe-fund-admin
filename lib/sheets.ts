import { google } from "googleapis";

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error("חסר GOOGLE_SERVICE_ACCOUNT_JSON");
  }
  let creds: { client_email: string; private_key: string };
  try {
    creds = JSON.parse(raw);
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON אינו JSON תקין");
  }
  return new google.auth.JWT(creds.client_email, undefined, creds.private_key, [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
  ]);
}

export type Submission = Record<string, string> & { _row: number };

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
