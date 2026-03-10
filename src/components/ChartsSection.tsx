import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PersonnelChart from "@/components/charts/PersonnelChart";
import FireRateCollapseChart from "@/components/charts/FireRateCollapseChart";
import DualLaunchChart from "@/components/charts/DualLaunchChart";
import CostComparisonChart from "@/components/charts/CostComparisonChart";
import TargetDistributionChart from "@/components/charts/TargetDistributionChart";
import CapabilityErosionChart from "@/components/charts/CapabilityErosionChart";
import USMunitionsTreemap from "@/components/charts/USMunitionsTreemap";
import UraniumStatusChart from "@/components/charts/UraniumStatusChart";
import MissileRangeRadar from "@/components/charts/MissileRangeRadar";
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
      titleKey: "chart.personnel.title",
      subtitleKey: "chart.personnel.subtitle",
      sourceKey: "chart.personnel.source",
      component: <PersonnelChart />,
    },
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
    <section id="charts-section" className="px-4 sm:px-8 py-8 space-y-6">
      <div className="border-b border-border pb-3 mb-4">
        <h2 className="font-heebo font-black text-lg sm:text-xl">
          {t("charts.section.title")}
        </h2>
        <p className="text-xs text-muted-foreground font-frank mt-1">
          {t("charts.section.subtitle")}
        </p>
      </div>

      {charts.map((chart, i) => (
        <div key={i} className="bg-card border border-border rounded-lg p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="font-heebo font-bold text-sm sm:text-base text-foreground">
              {t(chart.titleKey)}
            </h3>
            <p className="text-[11px] text-muted-foreground font-frank mt-0.5">
              {t(chart.subtitleKey)}
            </p>
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
