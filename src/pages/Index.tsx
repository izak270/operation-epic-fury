import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { dataVersions } from "@/data/militaryData";
import ForceModule from "@/components/ForceModule";

const Index = () => {
  const { t, toggle, lang } = useLanguage();
  const [versionIdx, setVersionIdx] = useState(dataVersions.length - 1); // default to latest
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
        {/* Version info bar */}
        <div className="max-w-3xl mx-auto px-4 sm:px-8 pb-2">
          <p className="text-[11px] text-muted-foreground font-frank">
            {t(currentVersion.labelKey)} — {currentVersion.date}
          </p>
        </div>
      </header>

      {/* Modules */}
      <main className="max-w-3xl mx-auto">
        {currentVersion.categories.map((cat, i) => (
          <ForceModule key={`${currentVersion.id}-${cat.id}`} category={cat} index={i} />
        ))}
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
        <p className="text-xs text-muted-foreground font-frank text-center">
          {t("footer.disclaimer")}
        </p>
      </footer>
    </div>
  );
};

export default Index;
