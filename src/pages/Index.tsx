import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { dataVersions } from "@/data/militaryData";
import ForceModule from "@/components/ForceModule";
import ChartsSection from "@/components/ChartsSection";

const Index = () => {
  const { t, toggle, lang } = useLanguage();
  const [versionIdx, setVersionIdx] = useState(dataVersions.length - 1);
  const [activeTab, setActiveTab] = useState<"data" | "charts">("data");
  const currentVersion = dataVersions[versionIdx];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
        {/* Top bar */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-4 pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Logo mark */}
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-heebo font-black text-sm">FP</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heebo font-black text-xl sm:text-2xl tracking-tight">
                    {t("app.title")}
                  </h1>
                  <span className="hidden sm:inline-flex px-2 py-0.5 text-[9px] font-heebo font-bold uppercase tracking-widest bg-primary/15 text-primary rounded-full border border-primary/20">
                    {t("app.badge")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-frank">
                  {t("app.subtitle")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={toggle}
                className="px-3 py-1.5 text-sm font-heebo font-bold border border-border rounded-lg hover:bg-muted transition-colors"
              >
                {t("lang.toggle")}
              </button>
            </div>
          </div>
        </div>

        {/* Control bar */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {/* Version selector */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              {dataVersions.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setVersionIdx(i)}
                  className={`px-3 py-1.5 text-xs font-heebo font-bold transition-all ${
                    versionIdx === i
                      ? "bg-foreground text-background shadow-sm"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {v.id}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground font-frank hidden sm:inline">
              {t(currentVersion.labelKey)} — {currentVersion.date}
            </span>
          </div>

          {/* Tab nav */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setActiveTab("data")}
              className={`px-4 py-1.5 text-xs font-heebo font-bold transition-all ${
                activeTab === "data"
                  ? "bg-foreground text-background"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {t("nav.data")}
            </button>
            <button
              onClick={() => setActiveTab("charts")}
              className={`px-4 py-1.5 text-xs font-heebo font-bold transition-all ${
                activeTab === "charts"
                  ? "bg-foreground text-background"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {t("nav.charts")}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto">
        {activeTab === "data" ? (
          <>
            {currentVersion.categories.map((cat, i) => (
              <ForceModule key={`${currentVersion.id}-${cat.id}`} category={cat} index={i} />
            ))}
          </>
        ) : (
          <ChartsSection />
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-4">
        <div className="border-t border-border pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-heebo font-black text-[10px]">FP</span>
              </div>
              <span className="text-xs font-heebo font-bold text-muted-foreground">
                Force Posture
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground font-heebo">
                {t("label.free")}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-frank text-center sm:text-right max-w-md">
              {t("footer.disclaimer")}
            </p>
          </div>
          <div className="mt-4 text-center">
            <span className="text-[10px] text-muted-foreground font-frank">
              {t("label.lastUpdated")}: {currentVersion.date}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-heebo text-center mt-3">
            Powered by{" "}
            <a
              href="https://aiorchestration.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-foreground hover:underline"
            >
              AIORCHESTRATION.AI
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
