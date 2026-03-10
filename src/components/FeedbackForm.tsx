import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquarePlus, Send, CheckCircle, AlertCircle } from "lucide-react";

type FeedbackType = "correction" | "suggestion" | "feature" | "other";

const FeedbackForm: React.FC = () => {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("suggestion");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const typeOptions: { value: FeedbackType; label: string }[] = [
    { value: "correction", label: t("feedback.type.correction") },
    { value: "suggestion", label: t("feedback.type.suggestion") },
    { value: "feature", label: t("feedback.type.feature") },
    { value: "other", label: t("feedback.type.other") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.length > 2000) return;

    setStatus("sending");
    try {
      const { error } = await supabase.from("feedback").insert({
        type,
        category: category.trim() || null,
        message: message.trim().slice(0, 2000),
        contact: contact.trim().slice(0, 255) || null,
      });
      if (error) throw error;
      setStatus("success");
      setMessage("");
      setCategory("");
      setContact("");
      setTimeout(() => {
        setStatus("idle");
        setOpen(false);
      }, 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 end-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground font-heebo font-bold text-sm shadow-lg hover:scale-105 transition-transform"
        aria-label={t("feedback.title")}
      >
        <MessageSquarePlus size={18} />
        <span className="hidden sm:inline">{t("feedback.button")}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 end-6 z-50 w-[calc(100vw-2rem)] max-w-sm" dir={lang === "he" ? "rtl" : "ltr"}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
          <div className="flex items-center gap-2">
            <MessageSquarePlus size={16} className="text-primary" />
            <h3 className="font-heebo font-bold text-sm">{t("feedback.title")}</h3>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-foreground text-lg leading-none px-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Type selector */}
          <div className="flex flex-wrap gap-1.5">
            {typeOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setType(opt.value)}
                className={`px-3 py-1 rounded-full text-xs font-heebo font-bold transition-colors ${
                  type === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Category (optional) */}
          <input
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            placeholder={t("feedback.category.placeholder")}
            maxLength={100}
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm font-frank text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />

          {/* Message */}
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={t("feedback.message.placeholder")}
            required
            maxLength={2000}
            rows={4}
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm font-frank text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />

          {/* Contact (optional) */}
          <input
            type="text"
            value={contact}
            onChange={e => setContact(e.target.value)}
            placeholder={t("feedback.contact.placeholder")}
            maxLength={255}
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm font-frank text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={!message.trim() || status === "sending"}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-heebo font-bold text-sm disabled:opacity-50 transition-all hover:brightness-110"
          >
            {status === "sending" ? (
              <span className="animate-pulse">{t("feedback.sending")}</span>
            ) : status === "success" ? (
              <>
                <CheckCircle size={16} />
                {t("feedback.success")}
              </>
            ) : status === "error" ? (
              <>
                <AlertCircle size={16} />
                {t("feedback.error")}
              </>
            ) : (
              <>
                <Send size={16} />
                {t("feedback.submit")}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
