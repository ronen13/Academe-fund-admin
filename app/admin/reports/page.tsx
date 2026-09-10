export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db";

export default async function ReportsListPage() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { scholarship: true } } },
  });

  const thStyle: React.CSSProperties = { padding: 10, fontSize: 13, color: "#6e8fd6" };
  const tdStyle: React.CSSProperties = { padding: 10, fontSize: 14 };

  return (
    <div>
      <h1 style={{ fontFamily: "Rubik, sans-serif", color: "#0f2e73" }}>דוחות שהופקו</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20, background: "#fff" }}>
        <thead>
          <tr style={{ textAlign: "right", borderBottom: "2px solid #f7a75c" }}>
            <th style={thStyle}>שם</th>
            <th style={thStyle}>אימייל</th>
            <th style={thStyle}>מלגות</th>
            <th style={thStyle}>נשלח</th>
            <th style={thStyle}>קישור</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={tdStyle}>{r.studentName}</td>
              <td style={tdStyle}>{r.studentEmail}</td>
              <td style={tdStyle}>{r.items.length}</td>
              <td style={tdStyle}>{r.sentAt ? new Date(r.sentAt).toLocaleDateString("he-IL") : "—"}</td>
              <td style={tdStyle}>
                <a href={`/report/${r.token}`} target="_blank" rel="noopener" style={{ color: "#e8690f" }}>
                  צפייה
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
