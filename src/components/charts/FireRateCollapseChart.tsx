import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { launchTimeline } from "@/data/launchData";

const FireRateCollapseChart: React.FC = () => {
  const { lang } = useLanguage();

  const data = launchTimeline.map(d => ({
    day: `${lang === "he" ? "יום" : "Day"} ${d.day}`,
    ballistic: d.ballistic,
    date: d.date,
    event: lang === "he" ? d.eventHe : d.eventEn,
  }));

  return (
    <div className="w-full h-[300px]" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="fireGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0, 40%, 48%)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(0, 40%, 48%)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
          <XAxis dataKey="day" stroke="hsl(0,0%,55%)" fontSize={11} />
          <YAxis stroke="hsl(0,0%,55%)" fontSize={11} />
          <Tooltip
            contentStyle={{ background: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 6, fontSize: 12 }}
            labelStyle={{ color: "hsl(0,0%,91%)" }}
            formatter={(val: number) => [val.toLocaleString(), lang === "he" ? "טילים בליסטיים" : "Ballistic Missiles"]}
          />
          <Area
            type="monotone"
            dataKey="ballistic"
            stroke="hsl(0, 40%, 48%)"
            strokeWidth={2}
            fill="url(#fireGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FireRateCollapseChart;
