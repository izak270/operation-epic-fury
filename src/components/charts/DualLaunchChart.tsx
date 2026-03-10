import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { launchTimeline } from "@/data/launchData";

const DualLaunchChart: React.FC = () => {
  const { lang } = useLanguage();
  const [showBallistic, setShowBallistic] = useState(true);
  const [showUAV, setShowUAV] = useState(true);

  const data = launchTimeline.map(d => ({
    day: `${lang === "he" ? "יום" : "Day"} ${d.day}`,
    ballistic: d.ballistic,
    uav: d.uav,
  }));

  const labelBallistic = lang === "he" ? "טילים בליסטיים" : "Ballistic Missiles";
  const labelUAV = lang === "he" ? "כטב\"מים" : "UAVs";

  return (
    <div className="w-full">
      <div className="flex gap-3 mb-3">
        <button
          onClick={() => setShowBallistic(!showBallistic)}
          className={`px-3 py-1 text-xs font-heebo font-bold rounded border transition-colors ${
            showBallistic ? "bg-loss/20 border-loss text-loss" : "border-border text-muted-foreground"
          }`}
        >
          {labelBallistic}
        </button>
        <button
          onClick={() => setShowUAV(!showUAV)}
          className={`px-3 py-1 text-xs font-heebo font-bold rounded border transition-colors ${
            showUAV ? "bg-primary/20 border-primary text-primary" : "border-border text-muted-foreground"
          }`}
        >
          {labelUAV}
        </button>
      </div>
      <div className="h-[300px]" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="ballisticGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 40%, 48%)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="hsl(0, 40%, 48%)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="uavGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(213, 100%, 32%)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="hsl(213, 100%, 32%)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,18%)" />
            <XAxis dataKey="day" stroke="hsl(0,0%,55%)" fontSize={11} />
            <YAxis stroke="hsl(0,0%,55%)" fontSize={11} />
            <Tooltip
              contentStyle={{ background: "hsl(0,0%,10%)", border: "1px solid hsl(0,0%,18%)", borderRadius: 6, fontSize: 12 }}
              labelStyle={{ color: "hsl(0,0%,91%)" }}
              formatter={(val: number, name: string) => [
                val.toLocaleString(),
                name === "ballistic" ? labelBallistic : labelUAV
              ]}
            />
            {showBallistic && (
              <Area type="monotone" dataKey="ballistic" stroke="hsl(0, 40%, 48%)" strokeWidth={2} fill="url(#ballisticGrad)" />
            )}
            {showUAV && (
              <Area type="monotone" dataKey="uav" stroke="hsl(213, 100%, 32%)" strokeWidth={2} fill="url(#uavGrad)" />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DualLaunchChart;
