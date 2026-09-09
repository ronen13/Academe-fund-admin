import React from "react";
import path from "path";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";

// חייבים גופן שתומך בעברית — הפונטים המובנים של react-pdf (Helvetica וכו') לא תומכים.
// יש להוריד את הקבצים ולהניח אותם תחת public/fonts/ (ראה README-ADMIN.md).
Font.register({
  family: "Heebo",
  fonts: [
    { src: path.join(process.cwd(), "public/fonts/Heebo-Regular.ttf"), fontWeight: 400 },
    { src: path.join(process.cwd(), "public/fonts/Heebo-Bold.ttf"), fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Heebo" },
  header: { fontSize: 20, marginBottom: 4, color: "#15398f", textAlign: "right", fontWeight: 700 },
  sub: { fontSize: 11, color: "#6e8fd6", marginBottom: 24, textAlign: "right" },
  card: {
    borderWidth: 1.2,
    borderColor: "#f7a75c",
    borderRadius: 6,
    padding: 14,
    marginBottom: 12,
  },
  name: { fontSize: 14, color: "#e8690f", marginBottom: 6, textAlign: "right", fontWeight: 700 },
  detail: { fontSize: 10.5, color: "#15398f", marginBottom: 4, textAlign: "right", lineHeight: 1.5 },
  label: { fontSize: 9, color: "#6e8fd6", textAlign: "right", marginBottom: 2 },
});

export type ReportScholarshipItem = {
  name: string;
  details: string;
  link?: string | null;
  deadline?: string | null;
  moreInfo?: string | null;
};

export function ReportDocument({
  studentName,
  items,
}: {
  studentName: string;
  items: ReportScholarshipItem[];
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>AcadeMe.Fund — דוח התאמות מלגות</Text>
        {studentName ? <Text style={styles.sub}>הוכן עבור: {studentName}</Text> : null}
        {items.map((it, idx) => (
          <View style={styles.card} key={idx} wrap={false}>
            <Text style={styles.name}>{it.name}</Text>
            {it.details ? <Text style={styles.detail}>{it.details}</Text> : null}
            {it.deadline ? <Text style={styles.label}>מועד הגשה אחרון: {it.deadline}</Text> : null}
            {it.link ? <Text style={styles.label}>קישור: {it.link}</Text> : null}
            {it.moreInfo ? <Text style={styles.label}>{it.moreInfo}</Text> : null}
          </View>
        ))}
      </Page>
    </Document>
  );
}

export async function renderReportPdf(
  studentName: string,
  items: ReportScholarshipItem[]
): Promise<Buffer> {
  return renderToBuffer(<ReportDocument studentName={studentName} items={items} />);
}
