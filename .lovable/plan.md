

# שימוש ב-Gemini Deep Research API

## מצב נוכחי
הפייפליין הקיים משתמש ב-Lovable AI Gateway עם `google/gemini-2.5-flash` דרך OpenAI-compatible API. זה **לא** Deep Research אמיתי — זה prompt רגיל למודל AI.

## מה זה Deep Research של Google?
Deep Research הוא **agent** (לא מודל רגיל) שמבצע חיפוש אמיתי באינטרנט, קורא דפים, ומייצר דו"חות מצוטטים. הוא זמין דרך **Interactions API** של Google — API שונה לחלוטין מ-Chat Completions.

## האם אפשר דרך Lovable AI Gateway?
**לא.** ה-Gateway תומך רק ב-OpenAI-compatible chat completions. ה-Deep Research דורש:
- Interactions API (`generativelanguage.googleapis.com/v1beta/interactions`)
- Agent ID: `deep-research-pro-preview-12-2025`
- תהליך אסינכרוני (polling) — המחקר לוקח דקות, לא שניות
- **Gemini API Key נפרד** מ-Google AI Studio

## מה צריך לעשות

### 1. השגת Gemini API Key
צריך ליצור מפתח ב-[Google AI Studio](https://aistudio.google.com/apikey) ולשמור אותו כ-secret בפרויקט.

### 2. שכתוב ה-Edge Function
במקום לקרוא ל-Lovable AI Gateway, הפונקציה תקרא ישירות ל-Google Interactions API:

```text
1. POST /v1beta/interactions  →  מקבל interaction_id
2. GET  /v1beta/interactions/{id}  →  polling כל 10 שניות
3. כשהסטטוס "COMPLETED"  →  חילוץ התוצאות ושמירה ב-DB
```

### 3. שינויים עיקריים
- **מודל**: `deep-research-pro-preview-12-2025` (מבוסס Gemini 3.1 Pro)
- **API**: Google Interactions API (לא OpenAI-compatible)
- **זמן ריצה**: עד 10 דקות (במקום שניות) — צריך polling loop
- **תמחור**: pay-as-you-go לפי שימוש במודל + כלי חיפוש
- **הפלט**: דו"ח מצוטט עם מקורות אמיתיים מהאינטרנט

### 4. יתרונות מול המצב הנוכחי
- נתונים **אמיתיים ועדכניים** מחיפוש באינטרנט (לא ידע מאומן)
- מקורות מצוטטים ומאומתים
- יכולת לעבד מסמכים שמעלים (PDF, דוחות)

### סדר ביצוע
1. בקשת Gemini API Key מהמשתמש ושמירה כ-secret
2. שכתוב `research-data` Edge Function לשימוש ב-Interactions API
3. הוספת polling mechanism עם timeout של 10 דקות
4. פרסור התוצאות ושמירה בטבלת `data_research` הקיימת

