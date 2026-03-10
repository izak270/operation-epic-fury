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
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heebo font-black text-xl sm:text-2xl tracking-tight">
              {t("app.title")}
            </h1>
            <p className="text-xs text-muted-foreground font-frank">
              {t("app.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Version selector */}
            <div className="flex rounded-md border border-border overflow-hidden">
              {dataVersions.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setVersionIdx(i)}
                  className={`px-2.5 py-1 text-xs font-heebo font-bold transition-colors ${
                    versionIdx === i
                      ? "bg-foreground text-background"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {v.id}
                </button>
              ))}
            </div>
            <button
              onClick={toggle}
              className="px-3 py-1.5 text-sm font-heebo font-bold border border-border rounded-md hover:bg-muted transition-colors"
            >
              {t("lang.toggle")}
            </button>
          </div>
        </div>
        {/* Tab nav + version info */}
        <div className="max-w-3xl mx-auto px-4 sm:px-8 pb-2 flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground font-frank">
            {t(currentVersion.labelKey)} — {currentVersion.date}
          </p>
          <div className="flex rounded-md border border-border overflow-hidden">
            <button
              onClick={() => setActiveTab("data")}
              className={`px-3 py-1 text-xs font-heebo font-bold transition-colors ${
                activeTab === "data"
                  ? "bg-foreground text-background"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {t("nav.data")}
            </button>
            <button
              onClick={() => setActiveTab("charts")}
              className={`px-3 py-1 text-xs font-heebo font-bold transition-colors ${
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
      <main className="max-w-3xl mx-auto">
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
      <footer className="max-w-3xl mx-auto px-4 sm:px-8 py-8 space-y-3">
        <p className="text-xs text-muted-foreground font-frank text-center">
          {t("footer.disclaimer")}
        </p>
        <p className="text-xs text-muted-foreground font-heebo text-center">
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
      </footer>
    </div>
  );
};

export default Index;
