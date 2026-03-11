import React from "react";

const SOURCE_URLS: Record<string, string> = {
  // GlobalFirepower — country comparison pages
  "GlobalFirepower 2024": "https://www.globalfirepower.com/countries-listing.php",
  "GlobalFirepower 2026": "https://www.globalfirepower.com/countries-listing.php",
  "GlobalFirepower": "https://www.globalfirepower.com/countries-listing.php",

  // IISS — Military Balance annual assessment
  "IISS Military Balance 2024": "https://www.iiss.org/publications/the-military-balance",
  "IISS Military Balance": "https://www.iiss.org/publications/the-military-balance",
  "IISS": "https://www.iiss.org/publications/the-military-balance",

  // SIPRI — arms transfers & nuclear forces database
  "SIPRI": "https://www.sipri.org/databases/milex",

  // CSIS — Missile Defense Project threat assessments
  "CSIS Missile Defense Project": "https://missilethreat.csis.org/",
  "CSIS satellite analysis": "https://beyondparallel.csis.org/",
  "CSIS": "https://missilethreat.csis.org/",

  // CENTCOM — official press releases on strikes
  "CENTCOM": "https://www.centcom.mil/MEDIA/PRESS-RELEASES/",

  // IDF — official spokesperson updates
  "IDF Spokesperson": "https://www.idf.il/en/mini-sites/idf-spokesperson/",
  "IDF": "https://www.idf.il/en/mini-sites/idf-spokesperson/",
  "צה\"ל": "https://www.idf.il/",

  // Defense contractors
  "Rafael": "https://www.rafael.co.il/worlds/air-missile-defense/",
  "IAI": "https://www.iai.co.il/drupal/node/36651",
  "Raytheon": "https://www.rtx.com/raytheon/what-we-do/integrated-air-and-missile-defense",

  // MDA — Missile Defense Agency program pages
  "MDA": "https://www.mda.mil/system/system.html",

  // IAEA — Iran safeguards reports
  "IAEA": "https://www.iaea.org/newscenter/focus/iran",

  // FAS — Federation of American Scientists nuclear notebook
  "FAS": "https://fas.org/initiative/nuclear-notebooks/",

  // News agencies — Iran/Middle East coverage
  "JPost": "https://www.jpost.com/middle-east",
  "Reuters": "https://www.reuters.com/world/middle-east/",
  "Al Jazeera": "https://www.aljazeera.com/tag/iran/",
  "Al-Jazeera": "https://www.aljazeera.com/tag/iran/",

  // Iran Ministry of Health — casualty data via Reuters
  "MoH": "https://www.reuters.com/world/middle-east/",

  // US military branches
  "US Navy": "https://www.navy.mil/Press-Office/News-Stories/",
  "USAF": "https://www.af.mil/News/",

  // Misc
  "AIO": "#",
  "דובר צה\"ל": "https://www.idf.il/",
  "משרדי ביטחון מפרצי": "#",
  "ניתוח AIO": "#",
  "תחזית AIO": "#",
  "מודל תחזית AIO": "#",
  "ניתוח לווייני CSIS": "https://beyondparallel.csis.org/",
  "דוחות סבא\"א": "https://www.iaea.org/newscenter/focus/iran",
  "רויטרס": "https://www.reuters.com/world/middle-east/",
  "אל-ג'זירה": "https://www.aljazeera.com/tag/iran/",
  "משרד הבריאות": "https://www.reuters.com/world/middle-east/",
  "חיל הים": "https://www.navy.mil/Press-Office/News-Stories/",
  "חיל האוויר האמריקאי": "https://www.af.mil/News/",
  "פרויקט הגנת טילים CSIS": "https://missilethreat.csis.org/",
  "רפאל": "https://www.rafael.co.il/worlds/air-missile-defense/",
  "ריית'און": "https://www.rtx.com/raytheon/what-we-do/integrated-air-and-missile-defense",
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
