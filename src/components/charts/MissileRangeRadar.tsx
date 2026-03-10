import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getIranMissiles } from "@/data/arsenalData";

// Production estimates (units/year) — sourced from CSIS, IISS
const productionEstimates: Record<string, { 
  ratePerYear: number; 
  currentRatePerYear: number;
  currentQty: number;
  noteEn: string; noteHe: string;
  currentNoteEn: string; currentNoteHe: string;
}> = {
  "fateh-110": { ratePerYear: 100, currentRatePerYear: 40, currentQty: 180, noteEn: "Mature production line", noteHe: "קו ייצור בוגר", currentNoteEn: "Facilities hit — reduced capacity", currentNoteHe: "מתקנים נפגעו — קיבולת מופחתת" },
  "zolfaghar": { ratePerYear: 60, currentRatePerYear: 25, currentQty: 120, noteEn: "Active production", noteHe: "ייצור פעיל", currentNoteEn: "Supply chain disrupted", currentNoteHe: "שרשרת אספקה שובשה" },
  "shahab-3": { ratePerYear: 30, currentRatePerYear: 10, currentQty: 200, noteEn: "Slowed — shifting to solid-fuel", noteHe: "מואט — מעבר לדלק מוצק", currentNoteEn: "Low priority — aging system", currentNoteHe: "עדיפות נמוכה — מערכת מתיישנת" },
  "haj-qassem": { ratePerYear: 40, currentRatePerYear: 20, currentQty: 90, noteEn: "Priority production line", noteHe: "קו ייצור בעדיפות", currentNoteEn: "Partial damage to line", currentNoteHe: "נזק חלקי לקו הייצור" },
  "fattah-1": { ratePerYear: 15, currentRatePerYear: 8, currentQty: 50, noteEn: "New — limited production", noteHe: "חדש — ייצור מוגבל", currentNoteEn: "Still ramping up", currentNoteHe: "עדיין בהרצה" },
  "kheibar-shekan": { ratePerYear: 50, currentRatePerYear: 20, currentQty: 100, noteEn: "High priority", noteHe: "עדיפות גבוהה", currentNoteEn: "Key facilities targeted", currentNoteHe: "מתקני מפתח הותקפו" },
  "sejjil": { ratePerYear: 20, currentRatePerYear: 5, currentQty: 60, noteEn: "Complex — dual-stage solid", noteHe: "מורכב — דו-שלבי מוצק", currentNoteEn: "Severely degraded", currentNoteHe: "נפגע קשות" },
  "khorramshahr": { ratePerYear: 10, currentRatePerYear: 3, currentQty: 40, noteEn: "Limited — liquid fuel", noteHe: "מוגבל — דלק נוזלי", currentNoteEn: "Near halt", currentNoteHe: "כמעט עצירה" },
};

const propulsionLabels: Record<string, Record<string, string>> = {
  solid: { en: "Solid", he: "מוצק" },
  liquid: { en: "Liquid", he: "נוזלי" },
  "dual-stage-solid": { en: "Dual-stage solid", he: "דו-שלבי מוצק" },
  turbojet: { en: "Turbojet", he: "טורבוסילון" },
};

const MissileRangeRadar: React.FC = () => {
  const { lang, t } = useLanguage();
  const iranMissiles = getIranMissiles();

  const formatUSD = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val}`;
  };

  return (
    <div className="w-full space-y-3" dir={lang === "he" ? "rtl" : "ltr"}>
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-start font-heebo font-bold px-3 py-2.5 text-foreground">{t("missile.name")}</th>
              <th className="text-center font-heebo font-bold px-2 py-2.5 text-foreground">{t("missile.type")}</th>
              <th className="text-center font-heebo font-bold px-2 py-2.5 text-foreground">{t("missile.range")}</th>
              <th className="text-center font-heebo font-bold px-2 py-2.5 text-foreground">{t("missile.warhead")}</th>
              <th className="text-center font-heebo font-bold px-2 py-2.5 text-foreground">{t("missile.qty")}</th>
              <th className="text-center font-heebo font-bold px-2 py-2.5 text-foreground">{t("missile.cost")}</th>
              <th className="text-center font-heebo font-bold px-2 py-2.5 text-foreground hidden sm:table-cell">{t("missile.propulsion")}</th>
              <th className="text-center font-heebo font-bold px-2 py-2.5 text-foreground hidden md:table-cell">{t("missile.production")}</th>
            </tr>
          </thead>
          <tbody>
            {iranMissiles.map((m, i) => {
              const prod = productionEstimates[m.id];
              return (
                <tr key={m.id} className={`border-b border-border/50 transition-colors hover:bg-muted/20 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                  <td className="px-3 py-2.5">
                    <div className="font-heebo font-bold text-foreground text-sm">
                      {lang === "he" ? m.nameHe : m.nameEn}
                    </div>
                    {m.noteEn && (
                      <div className="text-[10px] text-muted-foreground font-frank mt-0.5 leading-tight">
                        {lang === "he" ? m.noteHe : m.noteEn}
                      </div>
                    )}
                  </td>
                  <td className="text-center px-2 py-2.5">
                    <span className="px-1.5 py-0.5 rounded bg-iran/10 text-iran font-heebo font-bold text-[10px]">
                      {m.category}
                    </span>
                  </td>
                  <td className="text-center px-2 py-2.5 font-frank tabular-nums text-foreground">
                    {m.rangeKm.toLocaleString()} {lang === "he" ? "ק\"מ" : "km"}
                  </td>
                  <td className="text-center px-2 py-2.5 font-frank tabular-nums text-foreground">
                    {m.warheadKg ? `${m.warheadKg} ${lang === "he" ? "ק\"ג" : "kg"}` : "—"}
                  </td>
                  <td className="text-center px-2 py-2.5">
                    <span className="font-heebo font-bold text-foreground text-sm">
                      {m.preWarQty ? m.preWarQty.toLocaleString() : "—"}
                    </span>
                  </td>
                  <td className="text-center px-2 py-2.5 font-frank tabular-nums text-foreground">
                    {m.unitCostUSD ? formatUSD(m.unitCostUSD) : "—"}
                  </td>
                  <td className="text-center px-2 py-2.5 font-frank text-muted-foreground hidden sm:table-cell">
                    {propulsionLabels[m.propulsion]?.[lang] || m.propulsion}
                  </td>
                  <td className="text-center px-2 py-2.5 hidden md:table-cell">
                    {prod ? (
                      <div>
                        <span className="font-heebo font-bold text-primary text-sm">{prod.ratePerYear}</span>
                        <span className="text-muted-foreground font-frank text-[10px]"> /{lang === "he" ? "שנה" : "yr"}</span>
                        <div className="text-[9px] text-muted-foreground font-frank mt-0.5">
                          {lang === "he" ? prod.noteHe : prod.noteEn}
                        </div>
                      </div>
                    ) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Total summary */}
      <div className="flex flex-wrap items-center gap-4 px-3 py-2 bg-muted/20 rounded-lg border border-border/50">
        <div className="text-xs font-frank text-muted-foreground">
          <span className="font-heebo font-bold text-foreground text-sm">
            {iranMissiles.reduce((s, m) => s + (m.preWarQty || 0), 0).toLocaleString()}
          </span>
          {" "}{lang === "he" ? "סה\"כ טילים טרום מלחמה" : "total pre-war missiles"}
        </div>
        <div className="text-xs font-frank text-muted-foreground">
          <span className="font-heebo font-bold text-foreground text-sm">
            {formatUSD(iranMissiles.reduce((s, m) => s + (m.preWarQty || 0) * (m.unitCostUSD || 0), 0))}
          </span>
          {" "}{lang === "he" ? "שווי ארסנל מוערך" : "est. arsenal value"}
        </div>
        <div className="text-xs font-frank text-muted-foreground">
          <span className="font-heebo font-bold text-primary text-sm">
            ~{Object.values(productionEstimates).reduce((s, p) => s + p.ratePerYear, 0)}
          </span>
          {" "}{lang === "he" ? "ייצור שנתי מוערך" : "est. annual production"}
        </div>
      </div>

      {/* Source note */}
      <p className="text-[9px] text-muted-foreground font-frank px-1">
        {lang === "he" 
          ? "* נתוני ייצור מבוססים על הערכות CSIS ו-IISS. כמויות בפועל עשויות להיות שונות."
          : "* Production data based on CSIS and IISS estimates. Actual quantities may differ."
        }
      </p>
    </div>
  );
};

export default MissileRangeRadar;
