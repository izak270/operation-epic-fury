import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ForceCategory } from "@/data/militaryData";
import SplitFlapNumber from "./SplitFlapNumber";
import SourceLink from "./SourceLink";

interface ForceModuleProps {
  category: ForceCategory;
  index: number;
}

const countries = ["usa", "israel", "iran"] as const;

const bannerIds = ["gaza_killed", "lebanon_killed", "civ_killed_other"];

const ForceModule: React.FC<ForceModuleProps> = ({ category, index }) => {
  const { t, lang } = useLanguage();
  const baseDelay = index * 300;
  const [expanded, setExpanded] = useState(false);

  const isBanner = bannerIds.includes(category.id);

  // Banner-style row
  if (isBanner) {
    return (
      <div className="border-b border-border py-4 px-4 sm:px-8 bg-loss/5">
        <div className="flex items-center justify-between">
          <h2 className="font-heebo font-bold text-sm sm:text-base text-loss">
            {t(category.labelKey)}
          </h2>
          <span className="text-xs text-muted-foreground font-frank">
            {t("label.source")}: <SourceLink text={category.source} />
          </span>
        </div>
      </div>
    );
  }

  const isCasualty = category.id === "mil_kia" || category.id === "civ_killed";
  const isNewCategory = ["ammunition", "interceptors", "air_defense", "uav_fleet", "tel_launchers", "munitions_cost"].includes(category.id);
  const descKey = `desc.${category.id}`;
  const hasDesc = t(descKey) !== descKey;

  // Calculate "before" values
  const getBeforeValue = (country: typeof countries[number]) => {
    const val = category.data[country];
    const change = category.change[country];
    if (typeof val === "number" && typeof change === "number" && change !== 0) {
      return val - change;
    }
    return null;
  };

  const formatVal = (val: number, format?: string) => {
    if (format === "currency") {
      if (Math.abs(val) >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`;
      if (Math.abs(val) >= 1_000_000) return `$${(val / 1_000_000).toFixed(0)}M`;
      if (Math.abs(val) >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
      return `$${val}`;
    }
    return val.toLocaleString();
  };

  return (
    <div className={`border-b border-border py-6 px-4 sm:px-8 transition-colors ${
      isCasualty ? "bg-loss/5" : isNewCategory ? "bg-primary/[0.03]" : ""
    }`}>
      {/* Category title */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isNewCategory && (
            <span className="text-[8px] font-heebo font-bold uppercase tracking-widest text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              v2
            </span>
          )}
          <h2 className={`font-heebo font-bold text-base sm:text-lg ${isCasualty ? "text-loss" : "text-foreground"}`}>
            {t(category.labelKey)}
          </h2>
          {hasDesc && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[10px] font-heebo text-muted-foreground hover:text-foreground border border-border rounded px-1.5 py-0.5 transition-colors"
            >
              {expanded ? "−" : "?"}
            </button>
          )}
        </div>
        <span className="text-xs text-muted-foreground font-frank text-right flex-shrink-0 max-w-[45%]">
          <span className="font-bold text-foreground/70">{t("label.source")}:</span> {category.source}
        </span>
      </div>

      {/* Description */}
      {hasDesc && expanded && (
        <p className="text-xs text-muted-foreground font-frank mb-4 leading-relaxed bg-muted/30 rounded-lg px-3 py-2 border border-border/50">
          {t(descKey)}
        </p>
      )}

      {/* Three columns */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
        {countries.map((country, ci) => {
          const val = category.data[country];
          const change = category.change[country];
          const note = category.note?.[country];
          const changeNum = typeof change === "number" ? change : 0;
          const beforeVal = getBeforeValue(country);
          const colorClass =
            isCasualty
              ? "text-loss"
              : country === "usa"
              ? "text-usa"
              : country === "israel"
              ? "text-israel"
              : "text-iran";

          return (
            <div key={country} className="flex flex-col items-center text-center gap-1">
              {/* Country label */}
              <span className={`text-xs sm:text-sm font-heebo font-bold uppercase tracking-widest ${
                country === "usa" ? "text-usa" : country === "israel" ? "text-israel" : "text-iran"
              }`}>
                {t(`country.${country}`)}
              </span>

              {/* Number */}
              <SplitFlapNumber
                value={val === "N/A" ? t("label.na") : val === "—" ? "—" : val}
                format={category.format}
                delay={baseDelay + ci * 100}
                colorClass={colorClass}
              />

              {/* Note */}
              {note && (
                <span className="text-[10px] text-muted-foreground font-frank italic leading-tight">
                  {note === "est." ? t("label.est")
                    : note === "N/A" ? t("label.na")
                    : note === "since Oct 2023" ? t("note.since_oct_2023")
                    : note === "inc. Oct 7" ? t("note.inc_oct7")
                    : note === "Iran claim" ? t("note.iran_claim")
                    : note}
                </span>
              )}

              {/* Change indicator with "before" value */}
              {val !== "—" && val !== "N/A" && changeNum !== 0 && (
                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className={`text-xs font-heebo tabular-nums ${
                      changeNum < 0 ? "text-loss animate-loss-flash" : "text-primary"
                    }`}
                    dir="ltr"
                  >
                    {changeNum > 0 ? `+${formatVal(changeNum, category.format)}` : formatVal(changeNum, category.format)}
                  </span>
                  {beforeVal !== null && (
                    <span className="text-[11px] text-foreground/60 font-heebo font-semibold tabular-nums" dir="ltr">
                      {t("label.was")} {formatVal(beforeVal, category.format)}
                    </span>
                  )}
                </div>
              )}
              {val !== "—" && val !== "N/A" && changeNum === 0 && (
                <span className="text-xs font-heebo tabular-nums text-muted-foreground" dir="ltr">
                  −0
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForceModule;
