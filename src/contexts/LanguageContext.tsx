import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "he";

interface LanguageContextType {
  lang: Language;
  toggle: () => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<string, Record<Language, string>> = {
  "app.title": { en: "Force Posture", he: "מצבת כוחות" },
  "app.subtitle": { en: "USA · Israel · Iran", he: "ארה״ב · ישראל · איראן" },
  "country.usa": { en: "USA", he: "ארה״ב" },
  "country.israel": { en: "Israel", he: "ישראל" },
  "country.iran": { en: "Iran", he: "איראן" },
  "cat.active": { en: "Active Military Personnel", he: "אנשי צבא בשירות פעיל" },
  "cat.reserve": { en: "Reserve Personnel", he: "כוח מילואים" },
  "cat.aircraft": { en: "Fighter / Attack Aircraft", he: "מטוסי קרב / תקיפה" },
  "cat.tanks": { en: "Tanks (MBTs)", he: 'טנקים (קרב ראשי)' },
  "cat.naval": { en: "Naval Vessels", he: "כלי שיט צבאיים" },
  "cat.missiles": { en: "Missile Systems", he: "מערכות טילים" },
  "cat.budget": { en: "Defense Budget (USD)", he: "תקציב ביטחון (דולר)" },
  "cat.nuclear": { en: "Nuclear Warheads", he: "ראשי נפץ גרעיניים" },
  "label.source": { en: "Source", he: "מקור" },
  "label.change": { en: "Change", he: "שינוי" },
  "label.na": { en: "N/A", he: "לא רלוונטי" },
  "label.est": { en: "est.", he: "הערכה" },
  "lang.toggle": { en: "עברית", he: "English" },
  "footer.disclaimer": { 
    en: "Data based on publicly available estimates. Sources: GlobalFirepower 2024, IISS, SIPRI.", 
    he: "הנתונים מבוססים על הערכות פומביות. מקורות: GlobalFirepower 2024, IISS, SIPRI." 
  },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem("force-lang") as Language) || "he";
  });

  useEffect(() => {
    localStorage.setItem("force-lang", lang);
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = () => setLang((l) => (l === "en" ? "he" : "en"));

  const t = (key: string) => translations[key]?.[lang] || key;

  const dir = lang === "he" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, toggle, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
};
