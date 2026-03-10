import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { MessageSquare, Send, X, Sparkles, RotateCcw, MessageSquarePlus } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const SESSION_KEY = "force-chat-session";
const CONV_KEY = "force-chat-conv";

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

const SUGGESTIONS_HE = [
  "מה מצב ארסנל הטילים של איראן?",
  "השווה את התקציבים הביטחוניים",
  "מה המשמעות של שחיקת ה-TEL?",
  "אני רוצה לשלוח משוב",
];

const SUGGESTIONS_EN = [
  "What's Iran's current missile arsenal?",
  "Compare defense budgets",
  "Explain TEL erosion impact",
  "I want to submit feedback",
];

const AiChat: React.FC = () => {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState<string | null>(() => localStorage.getItem(CONV_KEY));
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load conversation history on open
  useEffect(() => {
    if (open && convId) {
      supabase
        .from("chat_messages")
        .select("role, content")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true })
        .then(({ data }) => {
          if (data && data.length > 0) {
            setMessages(data.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })));
          }
        });
    }
  }, [open, convId]);

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Msg = { role: "user", content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: allMessages,
          conversation_id: convId,
          session_id: getSessionId(),
        },
      });

      if (error) throw error;

      if (data.conversation_id && data.conversation_id !== convId) {
        setConvId(data.conversation_id);
        localStorage.setItem(CONV_KEY, data.conversation_id);
      }

      const assistantMsg: Msg = { role: "assistant", content: data.content || "..." };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error("Chat error:", e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: lang === "he" ? "שגיאה, נסה שוב" : "Error, please try again" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages, convId, loading, lang]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setConvId(null);
    localStorage.removeItem(CONV_KEY);
  };

  const suggestions = lang === "he" ? SUGGESTIONS_HE : SUGGESTIONS_EN;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 end-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground font-heebo font-bold text-sm shadow-lg hover:scale-105 transition-transform group"
        aria-label={t("chat.title")}
      >
        <Sparkles size={18} className="group-hover:animate-pulse" />
        <span className="hidden sm:inline">{t("chat.button")}</span>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 end-6 z-50 w-[calc(100vw-2rem)] max-w-md"
      dir={lang === "he" ? "rtl" : "ltr"}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ height: "min(75vh, 560px)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <h3 className="font-heebo font-bold text-sm">{t("chat.title")}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={startNewChat}
              className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
              title={t("chat.new")}
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.length === 0 && !loading && (
            <div className="space-y-3">
              <div className="text-center py-4">
                <MessageSquare size={32} className="text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground font-frank">{t("chat.welcome")}</p>
              </div>
              <div className="space-y-1.5">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="w-full text-start px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-xs font-frank text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none font-frank [&_p]:m-0 [&_ul]:my-1 [&_li]:my-0 [&_h1]:text-sm [&_h2]:text-sm [&_h3]:text-xs">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="font-frank">{msg.content}</span>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted px-4 py-2 rounded-xl rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-3 shrink-0">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("chat.placeholder")}
              rows={1}
              className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm font-frank text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none max-h-20"
              disabled={loading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 transition-all hover:brightness-110 shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 font-frank opacity-60">
            {t("chat.disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
