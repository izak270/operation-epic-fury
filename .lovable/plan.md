

## כן, אני יכול לעמוד בזה. הנה התוכנית המפורטת:

התוכנית כוללת יצירת **5 קבצי נתונים חדשים**, **10 קומפוננטות גרפים**, **קומפוננטת מעטפת**, ועדכון הדף הראשי והתרגומים.

### שלב 1 — קבצי נתונים (5 קבצים)

**`src/data/launchData.ts`** — ציר זמן יומי של שיגורים איראניים (28 בפב׳ – 9 במרץ 2026): טילים בליסטיים, כטב"מים, אירוע מקושר, אחוז יירוט, משגרים כשירים שנותרו.

**`src/data/arsenalData.ts`** — מלאי טילים מפורט לאיראן (Fateh-110, Shahab-3, Sejjil, Fattah-1, Kheibar Shekan וכו׳): טווח, הנעה, משקל ראש קרב, כמות טרום-מלחמה, עלות מוערכת, סיווג מקור.

**`src/data/uraniumData.ts`** — אבני דרך בהעשרה: תאריך, רמת העשרה (5%/20%/60%), כמות בק"ג, סטטוס IAEA.

**`src/data/costData.ts`** — עלות תקיפה מול הגנה (עלות טיל איראני vs מיירט Arrow 3/SM-3) + פירוט הוצאות חימושים אמריקאיים ב-100 שעות ראשונות (TLAM, JASSM, SM-2/3/6).

**`src/data/targetDistribution.ts`** — פיזור גיאוגרפי של אש איראנית (UAE 48%, ישראל 12.8%, כווית, וכו׳).

### שלב 2 — קומפוננטות גרפים (10 קבצים ב-`src/components/charts/`)

כולם משתמשים ב-`recharts` (כבר מותקן) ותומכים בדו-לשוניות:

1. **PersonnelChart** — Horizontal Stacked Bar ← `militaryData.ts`
2. **FireRateCollapseChart** — Area/Line (קריסת קצב אש) ← `launchData.ts`
3. **DualLaunchChart** — Dual Area (בליסטי + כטב"מ) ← `launchData.ts`
4. **CostComparisonChart** — Grouped Bar, log scale ← `costData.ts`
5. **TargetDistributionChart** — Donut ← `targetDistribution.ts`
6. **CapabilityErosionChart** — Bubble Scatter 4D ← `launchData.ts`
7. **USMunitionsTreemap** — Treemap ← `costData.ts`
8. **UraniumStatusChart** — Stacked Bar ← `uraniumData.ts`
9. **MissileRangeRadar** — Radar ← `arsenalData.ts`
10. **CasualtyBreakdownChart** — Pie ← `militaryData.ts` v1

### שלב 3 — מעטפת ואינטגרציה

**`src/components/ChartsSection.tsx`** — מרנדר את כל 10 הגרפים בגלילה אנכית, כל אחד בכרטיס כהה עם כותרת דו-לשונית, כתובית מקור, ו-tooltip.

**`src/pages/Index.tsx`** — הוספת טאב ניווט דביק "נתונים | גרפים" בהדר, ו-`ChartsSection` מתחת למודולי הכוח הקיימים.

**`src/contexts/LanguageContext.tsx`** — הוספת ~30 מפתחות תרגום חדשים לכותרות גרפים, תוויות צירים, tooltips וכותרות מקטעים.

### עקרונות עיצוב (נשמרים)

- ערכת נושא כהה, צבעי מדינות (כחול/אפור/ירוק), אדום לאבדות
- Heebo לכותרות, Frank Ruhl Libre לתוויות
- ללא אייקונים פיגורטיביים, ללא גיימיפיקציה
- RTL/LTR מלא בכל הגרפים

### סדר ביצוע

אבצע את זה ב-3 גלים: נתונים ← גרפים ← אינטגרציה. זה פרויקט גדול אבל ישים לחלוטין עם הכלים הקיימים.

