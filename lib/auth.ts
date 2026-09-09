import crypto from "crypto";

export const SESSION_COOKIE_NAME = "academe_admin_session";

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET env var");
  }
  return secret;
}

function sign(value: string): string {
  const h = crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
  return `${value}.${h}`;
}

export function createSessionCookieValue(): string {
  return sign("ok");
}

export function isValidSession(cookieValue: string | undefined | null): boolean {
  if (!cookieValue) return false;
  const [value, sig] = cookieValue.split(".");
  if (!value || !sig || value !== "ok") return false;
  const expected = crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}
