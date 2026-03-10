import React, { useState, useCallback, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

import FireRateCollapseChart from "@/components/charts/FireRateCollapseChart";
import DualLaunchChart from "@/components/charts/DualLaunchChart";
import CostComparisonChart from "@/components/charts/CostComparisonChart";
import TargetDistributionChart from "@/components/charts/TargetDistributionChart";
import CapabilityErosionChart from "@/components/charts/CapabilityErosionChart";
import USMunitionsTreemap from "@/components/charts/USMunitionsTreemap";
import UraniumStatusChart from "@/components/charts/UraniumStatusChart";
import MissileRangeRadar from "@/components/charts/MissileRangeRadar";
import MissileRangeMap from "@/components/charts/MissileRangeMap";
import CasualtyBreakdownChart from "@/components/charts/CasualtyBreakdownChart";

interface ChartCard {
  titleKey: string;
  subtitleKey: string;
  sourceKey: string;
  component: React.ReactNode;
}

const ChartsSection: React.FC = () => {
  const { t } = useLanguage();

  const charts: ChartCard[] = [
    {
      titleKey: "chart.fireRate.title",
      subtitleKey: "chart.fireRate.subtitle",
      sourceKey: "chart.fireRate.source",
      component: <FireRateCollapseChart />,
    },
    {
      titleKey: "chart.dualLaunch.title",
      subtitleKey: "chart.dualLaunch.subtitle",
      sourceKey: "chart.dualLaunch.source",
      component: <DualLaunchChart />,
    },
    {
      titleKey: "chart.cost.title",
      subtitleKey: "chart.cost.subtitle",
      sourceKey: "chart.cost.source",
      component: <CostComparisonChart />,
    },
    {
      titleKey: "chart.target.title",
      subtitleKey: "chart.target.subtitle",
      sourceKey: "chart.target.source",
      component: <TargetDistributionChart />,
    },
    {
      titleKey: "chart.erosion.title",
      subtitleKey: "chart.erosion.subtitle",
      sourceKey: "chart.erosion.source",
      component: <CapabilityErosionChart />,
    },
    {
      titleKey: "chart.usMunitions.title",
      subtitleKey: "chart.usMunitions.subtitle",
      sourceKey: "chart.usMunitions.source",
      component: <USMunitionsTreemap />,
    },
    {
      titleKey: "chart.uranium.title",
      subtitleKey: "chart.uranium.subtitle",
      sourceKey: "chart.uranium.source",
      component: <UraniumStatusChart />,
    },
    {
      titleKey: "chart.missileMap.title",
      subtitleKey: "chart.missileMap.subtitle",
      sourceKey: "chart.missileMap.source",
      component: <MissileRangeMap />,
    },
    {
      titleKey: "chart.missileRadar.title",
      subtitleKey: "chart.missileRadar.subtitle",
      sourceKey: "chart.missileRadar.source",
      component: <MissileRangeRadar />,
    },
    {
      titleKey: "chart.casualty.title",
      subtitleKey: "chart.casualty.subtitle",
      sourceKey: "chart.casualty.source",
      component: <CasualtyBreakdownChart />,
    },
  ];

  return (
    <section id="charts-section" className="px-4 sm:px-8 py-8 space-y-5">
      <div className="pb-3 mb-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-primary" />
          <h2 className="font-heebo font-black text-lg sm:text-xl">
            {t("charts.section.title")}
          </h2>
        </div>
        <p className="text-xs text-muted-foreground font-frank mt-1 ltr:ml-3 rtl:mr-3">
          {t("charts.section.subtitle")}
        </p>
      </div>

      {charts.map((chart, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-xl p-4 sm:p-6 transition-colors hover:border-primary/20"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="font-heebo font-bold text-sm sm:text-base text-foreground">
                {t(chart.titleKey)}
              </h3>
              <p className="text-[11px] text-muted-foreground font-frank mt-0.5">
                {t(chart.subtitleKey)}
              </p>
            </div>
            <span className="text-[9px] font-heebo font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex-shrink-0">
              #{String(i + 1).padStart(2, "0")}
            </span>
          </div>
          {chart.component}
          <p className="text-[10px] text-muted-foreground font-frank mt-3 pt-2 border-t border-border">
            {t("label.source")}: {t(chart.sourceKey)}
          </p>
        </div>
      ))}
    </section>
  );
};

export default ChartsSection;
