import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ForceCategory } from "@/data/militaryData";
import SplitFlapNumber from "./SplitFlapNumber";

interface ForceModuleProps {
  category: ForceCategory;
  index: number;
}

const countries = ["usa", "israel", "iran"] as const;

const ForceModule: React.FC<ForceModuleProps> = ({ category, index }) => {
  const { t, lang } = useLanguage();
  const baseDelay = index * 300;

  return (
    <div className="border-b border-border py-6 px-4 sm:px-8">
      {/* Category title */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heebo font-bold text-base sm:text-lg text-foreground">
          {t(category.labelKey)}
        </h2>
        <span className="text-xs text-muted-foreground font-frank">
          {t("label.source")}: {category.source}
        </span>
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
        {countries.map((country, ci) => {
          const val = category.data[country];
          const change = category.change[country];
          const note = category.note?.[country];
          const changeNum = typeof change === "number" ? change : 0;
          const colorClass =
            country === "usa"
              ? "text-usa"
              : country === "israel"
              ? "text-israel"
              : "text-iran";

          return (
            <div key={country} className="flex flex-col items-center text-center gap-1">
              {/* Country label */}
              <span className={`text-xs sm:text-sm font-heebo font-bold uppercase tracking-widest ${colorClass}`}>
                {t(`country.${country}`)}
              </span>

              {/* Number */}
              <SplitFlapNumber
                value={val === "N/A" ? t("label.na") : val}
                format={category.format}
                delay={baseDelay + ci * 100}
                colorClass={colorClass}
              />

              {/* Note */}
              {note && (
                <span className="text-[10px] text-muted-foreground font-frank italic">
                  {note === "est." ? t("label.est") : note === "N/A" ? t("label.na") : note}
                </span>
              )}

              {/* Change indicator */}
              <span
                className={`text-xs font-heebo tabular-nums ${
                  changeNum < 0 ? "text-loss animate-loss-flash" : "text-muted-foreground"
                }`}
                dir="ltr"
              >
                {changeNum === 0 ? "−0" : changeNum > 0 ? `+${changeNum.toLocaleString()}` : changeNum.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForceModule;
