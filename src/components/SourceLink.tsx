import React from "react";

const SOURCE_URLS: Record<string, string> = {
  "GlobalFirepower": "https://www.globalfirepower.com/countries-listing.php",
  "IISS": "https://www.iiss.org/publications/the-military-balance",
  "SIPRI": "https://www.sipri.org/databases",
  "CSIS": "https://www.csis.org/programs/missile-defense-project",
  "CENTCOM": "https://www.centcom.mil/MEDIA/PRESS-RELEASES/",
  "IDF": "https://www.idf.il",
  "Rafael": "https://www.rafael.co.il",
  "MDA": "https://www.mda.mil",
  "Raytheon": "https://www.rtx.com/raytheon",
  "IAEA": "https://www.iaea.org/newscenter/focus/iran",
  "FAS": "https://fas.org/issues/nuclear-weapons/",
  "JPost": "https://www.jpost.com",
  "Reuters": "https://www.reuters.com",
  "Al Jazeera": "https://www.aljazeera.com",
  "MoH": "https://www.reuters.com",
  "US Navy": "https://www.navy.mil",
  "USAF": "https://www.af.mil",
  "IAI": "https://www.iai.co.il",
  "AIO": "#",
  "IDF Spokesperson": "https://www.idf.il/en/mini-sites/idf-spokesperson/",
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
