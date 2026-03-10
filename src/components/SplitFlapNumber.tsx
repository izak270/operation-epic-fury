import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SplitFlapNumberProps {
  value: number | string;
  format?: "currency" | "number";
  delay?: number;
  colorClass?: string;
}

const formatNumber = (val: number | string, format?: string): string => {
  if (typeof val === "string") return val;
  if (format === "currency") {
    if (val >= 1e12) return `$${(val / 1e12).toFixed(1)}T`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
    return `$${val.toLocaleString()}`;
  }
  return val.toLocaleString();
};

const SplitFlapNumber: React.FC<SplitFlapNumberProps> = ({ value, format, delay = 0, colorClass }) => {
  const [show, setShow] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const display = formatNumber(value, format);

  return (
    <span
      className={`inline-block font-heebo font-black text-2xl sm:text-3xl md:text-4xl tabular-nums tracking-tight transition-all ${
        show ? "animate-flap opacity-100" : "opacity-0"
      } ${colorClass || ""}`}
      style={{ animationDelay: `${delay}ms` }}
      dir="ltr"
    >
      {display}
    </span>
  );
};

export default SplitFlapNumber;
