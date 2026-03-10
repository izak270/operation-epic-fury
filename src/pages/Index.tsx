import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { militaryData } from "@/data/militaryData";
import ForceModule from "@/components/ForceModule";

const Index = () => {
  const { t, toggle, lang } = useLanguage();

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
          <button
            onClick={toggle}
            className="px-3 py-1.5 text-sm font-heebo font-bold border border-border rounded-md hover:bg-muted transition-colors"
          >
            {t("lang.toggle")}
          </button>
        </div>
      </header>

      {/* Modules */}
      <main className="max-w-3xl mx-auto">
        {militaryData.map((cat, i) => (
          <ForceModule key={cat.id} category={cat} index={i} />
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
