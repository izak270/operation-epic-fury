import React from "react";

const SOURCE_URLS: Record<string, string> = {
  // GlobalFirepower — country comparison & ranking
  "GlobalFirepower 2024": "https://www.globalfirepower.com/",
  "GlobalFirepower 2026": "https://www.globalfirepower.com/",
  "GlobalFirepower": "https://www.globalfirepower.com/",

  // IISS — Military Balance annual assessment
  "IISS Military Balance 2024": "https://www.iiss.org/publications/the-military-balance",
  "IISS Military Balance": "https://www.iiss.org/publications/the-military-balance",
  "IISS": "https://www.iiss.org/publications/the-military-balance",

  // SIPRI — arms & military expenditure database
  "SIPRI": "https://www.sipri.org/databases/milex",

  // CSIS — Missile Defense Project & cost analysis
  "CSIS Missile Defense Project": "https://missilethreat.csis.org/",
  "CSIS satellite analysis": "https://beyondparallel.csis.org/",
  "CSIS": "https://www.csis.org/analysis/37-billion-estimated-cost-epic-furys-first-100-hours",

  // CENTCOM — official press releases on strikes
  "CENTCOM": "https://www.centcom.mil/MEDIA/PRESS-RELEASES/",

  // IDF — official spokesperson & casualty data
  "IDF Spokesperson": "https://www.idf.il/en/mini-sites/idf-spokesperson/",
  "IDF": "https://www.gov.il/en/pages/swords-of-iron-idf-casualties",

  // Defense contractors — specific program pages
  "Rafael": "https://www.rafael.co.il/worlds/air-missile-defense/",
  "IAI": "https://militarnyi.com/en/news/israel-to-increase-purchases-of-missiles-for-arrow-3-air-defense-systems/",
  "Raytheon": "https://www.rtx.com/raytheon/what-we-do/integrated-air-and-missile-defense",

  // MDA — Missile Defense Agency
  "MDA": "https://www.mda.mil/system/system.html",

  // IAEA — Iran safeguards reports
  "IAEA": "https://www.iaea.org/sites/default/files/25/06/gov2025-24.pdf",

  // FAS — Federation of American Scientists nuclear notebook
  "FAS": "https://fas.org/initiative/nuclear-notebooks/",

  // News agencies — specific articles & coverage
  "JPost": "https://www.jpost.com/defense-and-tech/article-889435",
  "Jerusalem Post": "https://www.jpost.com/defense-and-tech/article-889435",
  "Reuters": "https://www.reuters.com/world/middle-east/",
  "Al Jazeera": "https://www.aljazeera.com/news/2025/11/11/how-many-times-has-israel-violated-the-gaza-ceasefire-here-are-the-numbers",
  "Al-Jazeera": "https://www.aljazeera.com/news/2025/11/11/how-many-times-has-israel-violated-the-gaza-ceasefire-here-are-the-numbers",
  "Times of Israel": "https://www.timesofisrael.com/liveblog_entry/idf-assesses-iran-has-some-2500-ballistic-missiles-was-accelerating-production/",

  // ISW — Institute for the Study of War
  "ISW": "https://understandingwar.org/research/middle-east/iran-update-evening-special-report-march-7-2026/",

  // Iran Watch — missile arsenal database
  "Iran Watch": "https://www.iranwatch.org/our-publications/weapon-program-background-report/table-irans-missile-arsenal",

  // EPC — defense budget analysis
  "EPC": "https://epc.ae/en/details/scenario/the-israeli-american-war-on-iran-objectives-and-potential-scenarios",

  // Alma Center — daily intelligence reports
  "Alma": "https://israel-alma.org/daily-report-the-second-iran-war-march-9-2026-1800/",

  // Iran Ministry of Health — casualty data via Reuters
  "MoH": "https://www.reuters.com/world/middle-east/",

  // US military branches
  "US Navy": "https://www.navy.mil/Press-Office/News-Stories/",
  "USAF": "https://www.af.mil/News/",

  // Arms Control Association
  "Arms Control": "https://www.armscontrol.org/factsheets/iran-nuclear-brief",

  // Misc
  "AIO": "#",

  // Hebrew versions
  "צה\"ל": "https://www.gov.il/en/pages/swords-of-iron-idf-casualties",
  "דובר צה\"ל": "https://www.idf.il/",
  "משרדי ביטחון מפרצי": "#",
  "ניתוח AIO": "#",
  "תחזית AIO": "#",
  "מודל תחזית AIO": "#",
  "ניתוח לווייני CSIS": "https://beyondparallel.csis.org/",
  "דוחות סבא\"א": "https://www.iaea.org/sites/default/files/25/06/gov2025-24.pdf",
  "סבא\"א": "https://www.iaea.org/sites/default/files/25/06/gov2025-24.pdf",
  "רויטרס": "https://www.reuters.com/world/middle-east/",
  "אל-ג'זירה": "https://www.aljazeera.com/news/2025/11/11/how-many-times-has-israel-violated-the-gaza-ceasefire-here-are-the-numbers",
  "משרד הבריאות": "https://www.reuters.com/world/middle-east/",
  "חיל הים": "https://www.navy.mil/Press-Office/News-Stories/",
  "חיל האוויר האמריקאי": "https://www.af.mil/News/",
  "פרויקט הגנת טילים CSIS": "https://missilethreat.csis.org/",
  "רפאל": "https://www.rafael.co.il/worlds/air-missile-defense/",
  "ריית'און": "https://www.rtx.com/raytheon/what-we-do/integrated-air-and-missile-defense",
  "עלמא": "https://israel-alma.org/daily-report-the-second-iran-war-march-9-2026-1800/",
};

// Sort keys by length descending so longer matches take priority (e.g. "IDF Spokesperson" before "IDF")
const sortedKeys = Object.keys(SOURCE_URLS).sort((a, b) => b.length - a.length);

interface SourceLinkProps {
  text: string;
}

const SourceLink: React.FC<SourceLinkProps> = ({ text }) => {
  // Split text by known source names and wrap them with links
  const parts: (string | React.ReactElement)[] = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    let earliestIndex = Infinity;
    let matchedKey = "";

    for (const key of sortedKeys) {
      const idx = remaining.indexOf(key);
      if (idx !== -1 && idx < earliestIndex) {
        earliestIndex = idx;
        matchedKey = key;
      }
    }

    if (matchedKey && earliestIndex !== Infinity) {
      if (earliestIndex > 0) {
        parts.push(remaining.substring(0, earliestIndex));
      }
      const url = SOURCE_URLS[matchedKey];
      if (url && url !== "#") {
        parts.push(
          <a
            key={keyIndex++}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted underline-offset-2 hover:text-foreground transition-colors"
          >
            {matchedKey}
          </a>
        );
      } else {
        parts.push(matchedKey);
      }
      remaining = remaining.substring(earliestIndex + matchedKey.length);
    } else {
      parts.push(remaining);
      break;
    }
  }

  return <>{parts}</>;
};

export default SourceLink;
