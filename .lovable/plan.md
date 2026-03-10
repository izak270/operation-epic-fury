
# קישור כפתורי הטילים במפה לטבלת הטילים

## מה נעשה
כשלוחצים על טיל במפה (MissileRangeMap), הדף יגלול אוטומטית לטבלת הטילים (MissileRangeRadar) וידגיש את השורה המתאימה.

## גישה טכנית

1. **MissileRangeRadar** — הוסיף `id` לכל שורת טבלה (`id={`missile-row-${m.id}`}`) והוסף prop `highlightId` אופציונלי שמדגיש שורה ספציפית עם אנימציה.

2. **ChartsSection** — הוסף state משותף `highlightedMissileId`. העבר callback ל-MissileRangeMap ו-prop ל-MissileRangeRadar. כשנלחץ טיל במפה:
   - עדכן את ה-state
   - גלול (`scrollIntoView`) לשורה המתאימה בטבלה (#9 ברשימת הגרפים)

3. **MissileRangeMap** — הוסף prop `onMissileClick?: (id: string) => void`. בלחיצה על כפתור טיל, קרא ל-callback.

4. **הדגשה** — השורה המודגשת תקבל רקע `bg-primary/20` עם אנימציית fade-out אחרי 3 שניות.
