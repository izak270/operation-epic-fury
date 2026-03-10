import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getIranMissiles } from "@/data/arsenalData";
import { targetDistribution } from "@/data/targetDistribution";

// Equirectangular projection config
const MAP = {
  lonMin: 32, lonMax: 62,
  latMin: 22, latMax: 42,
  width: 960, height: 600,
};

const project = (lon: number, lat: number): [number, number] => {
  const x = ((lon - MAP.lonMin) / (MAP.lonMax - MAP.lonMin)) * MAP.width;
  const y = ((MAP.latMax - lat) / (MAP.latMax - MAP.latMin)) * MAP.height;
  return [x, y];
};

// Refined country outlines
const countries: {
  id: string; nameEn: string; nameHe: string;
  outline: [number, number][];
  labelPos: [number, number];
  fill: string;
}[] = [
  {
    id: "iran", nameEn: "Iran", nameHe: "איראן",
    labelPos: [54, 33],
    fill: "hsl(var(--iran))",
    outline: [
      [44.0,39.4],[44.8,39.7],[45.5,39.0],[46.5,38.9],[47.5,39.2],[48.0,38.7],
      [48.9,38.4],[49.1,37.6],[50.1,37.4],[51.4,36.9],[52.5,36.7],[53.9,36.8],
      [55.4,37.2],[57.3,37.3],[58.5,37.5],[59.6,37.5],[60.5,36.7],[61.0,35.8],
      [61.2,35.0],[60.6,34.3],[60.9,33.5],[60.5,32.6],[60.7,31.5],[60.8,30.5],
      [61.0,29.8],[60.0,29.5],[59.0,28.5],[58.5,27.7],[57.8,26.5],[57.0,25.9],
      [56.3,25.8],[55.5,25.5],[54.8,25.5],[54.0,26.0],[52.8,27.0],[51.6,27.5],
      [51.0,27.8],[50.5,28.5],[50.2,29.0],[49.5,29.5],[48.8,30.0],[48.0,30.5],
      [48.0,31.0],[47.7,31.5],[47.2,32.0],[46.1,33.0],[45.4,34.0],[44.8,35.5],
      [44.4,36.5],[44.0,37.5],[44.0,38.4],[44.0,39.4],
    ],
  },
  {
    id: "iraq", nameEn: "Iraq", nameHe: "עירק",
    labelPos: [43.5, 33.5],
    fill: "hsl(0,0%,20%)",
    outline: [
      [38.8,36.9],[40.0,37.1],[42.0,37.3],[43.5,37.1],[44.0,37.5],
      [44.4,36.5],[44.8,35.5],[45.4,34.0],[46.1,33.0],[47.2,32.0],
      [47.7,31.5],[48.0,31.0],[48.0,30.5],[48.8,30.0],[47.7,29.5],
      [46.5,29.1],[44.7,29.1],[43.8,29.4],[42.0,31.2],[40.4,31.9],
      [39.2,32.1],[38.8,33.4],[38.8,36.9],
    ],
  },
  {
    id: "syria", nameEn: "Syria", nameHe: "סוריה",
    labelPos: [38.2, 35.3],
    fill: "hsl(0,0%,18%)",
    outline: [
      [35.7,33.3],[36.0,34.0],[36.4,34.6],[36.0,35.4],[35.9,35.9],
      [36.3,36.5],[36.8,36.8],[38.0,36.9],[38.8,36.9],[38.8,33.4],
      [39.2,32.1],[38.0,32.3],[37.0,32.5],[36.0,32.3],[35.8,32.7],[35.7,33.3],
    ],
  },
  {
    id: "jordan", nameEn: "Jordan", nameHe: "ירדן",
    labelPos: [37.0, 31.2],
    fill: "hsl(0,0%,16%)",
    outline: [
      [35.5,31.5],[35.6,32.4],[35.7,33.3],[35.8,32.7],[36.0,32.3],
      [37.0,32.5],[38.0,32.3],[39.2,32.1],[39.0,29.3],[37.0,29.1],
      [36.5,29.2],[35.5,29.5],[35.0,29.5],[35.5,31.0],[35.5,31.5],
    ],
  },
  {
    id: "israel", nameEn: "Israel", nameHe: "ישראל",
    labelPos: [34.8, 31.5],
    fill: "hsl(var(--israel))",
    outline: [
      [34.3,31.9],[34.3,31.3],[34.6,32.5],[34.9,33.0],[35.1,33.3],
      [35.7,33.3],[35.6,32.4],[35.5,31.5],[35.5,31.0],[35.0,29.5],
      [34.3,31.3],[34.3,31.9],
    ],
  },
  {
    id: "saudi", nameEn: "Saudi Arabia", nameHe: "סעודיה",
    labelPos: [43, 26],
    fill: "hsl(0,0%,14%)",
    outline: [
      [35.0,29.5],[36.5,29.2],[37.0,29.1],[39.0,29.3],[39.0,32.0],
      [40.4,31.9],[42.0,31.2],[43.8,29.4],[44.7,29.1],[46.5,29.1],
      [47.7,29.5],[48.8,30.0],[49.5,29.5],[50.2,29.0],[50.5,28.5],
      [51.0,27.8],[51.6,27.5],[51.5,26.5],[51.2,25.5],[51.0,24.5],
      [50.5,24.5],[50.0,24.8],[49.0,24.5],[48.5,24.5],[48.0,24.0],
      [46.5,23.5],[45.5,23.0],[44.0,23.5],[42.5,23.5],[41.0,23.8],
      [39.5,24.0],[38.5,24.0],[37.0,25.0],[36.2,26.5],[35.5,27.5],
      [35.2,28.5],[35.0,29.5],
    ],
  },
  {
    id: "kuwait", nameEn: "Kuwait", nameHe: "כווית",
    labelPos: [47.8, 29.5],
    fill: "hsl(0,0%,22%)",
    outline: [
      [46.5,29.1],[47.7,29.5],[48.8,30.0],[48.5,29.5],[48.0,29.0],
      [47.5,28.7],[47.0,29.0],[46.5,29.1],
    ],
  },
  {
    id: "bahrain", nameEn: "Bahrain", nameHe: "בחריין",
    labelPos: [50.5, 26.1],
    fill: "hsl(0,0%,24%)",
    outline: [
      [50.4,26.3],[50.7,26.3],[50.7,26.0],[50.4,26.0],[50.4,26.3],
    ],
  },
  {
    id: "qatar", nameEn: "Qatar", nameHe: "קטאר",
    labelPos: [51.2, 25.3],
    fill: "hsl(0,0%,22%)",
    outline: [
      [50.8,26.1],[51.3,26.2],[51.6,25.8],[51.6,25.2],[51.3,24.7],
      [50.8,24.7],[50.8,25.5],[50.8,26.1],
    ],
  },
  {
    id: "uae", nameEn: "UAE", nameHe: "איחוד האמירויות",
    labelPos: [54.5, 24.3],
    fill: "hsl(0,0%,20%)",
    outline: [
      [51.6,25.2],[51.6,25.8],[52.0,26.2],[52.8,26.5],[54.0,26.5],
      [55.0,26.0],[55.5,25.5],[56.0,25.3],[56.3,25.3],[56.3,24.5],
      [56.0,24.0],[55.5,24.2],[55.0,24.5],[54.0,24.2],[53.0,24.0],
      [52.0,24.2],[51.6,24.8],[51.6,25.2],
    ],
  },
  {
    id: "lebanon", nameEn: "Lebanon", nameHe: "לבנון",
    labelPos: [35.8, 34.0],
    fill: "hsl(0,0%,22%)",
    outline: [
      [35.1,33.3],[35.5,33.9],[36.0,34.6],[36.4,34.6],[36.0,34.0],
      [35.7,33.3],[35.1,33.3],
    ],
  },
  {
    id: "turkey", nameEn: "Turkey", nameHe: "טורקיה",
    labelPos: [38, 38.5],
    fill: "hsl(0,0%,15%)",
    outline: [
      [35.9,35.9],[36.3,36.5],[36.8,36.8],[38.0,36.9],[38.8,36.9],
      [40.0,37.1],[42.0,37.3],[43.5,37.1],[44.0,37.5],[44.0,38.4],
      [44.0,39.4],[44.8,39.7],[43.5,40.0],[42.0,41.0],[40.0,41.5],
      [38.0,41.5],[36.5,41.0],[36.0,40.5],[35.5,39.0],[35.5,37.0],
      [35.9,35.9],
    ],
  },
  {
    id: "oman", nameEn: "Oman", nameHe: "עומאן",
    labelPos: [57, 22.8],
    fill: "hsl(0,0%,14%)",
    outline: [
      [56.3,25.8],[57.0,25.9],[57.8,26.5],[58.5,27.7],[59.0,28.5],
      [60.0,29.5],[60.0,28.0],[59.5,26.5],[59.0,25.0],[58.5,23.5],
      [58.0,22.5],[57.5,22.0],[56.5,22.5],[55.5,23.0],[55.0,23.5],
      [54.0,24.0],[53.0,24.0],[54.0,24.2],[55.0,24.5],[55.5,24.2],
      [56.0,24.0],[56.3,24.5],[56.3,25.3],[56.0,25.3],[55.5,25.5],
      [55.0,26.0],[56.0,26.0],[56.3,25.8],
    ],
  },
];

// US bases that were attacked
const usBases: {
  id: string; nameEn: string; nameHe: string;
  lon: number; lat: number;
  country: string;
}[] = [
  { id: "al-dhafra", nameEn: "Al Dhafra AB", nameHe: "בסיס אל-דפרה", lon: 54.55, lat: 24.25, country: "uae" },
  { id: "al-udeid", nameEn: "Al Udeid AB", nameHe: "בסיס אל-עודייד", lon: 51.32, lat: 25.12, country: "qatar" },
  { id: "ain-al-asad", nameEn: "Ain al-Asad AB", nameHe: "עין אל-אסד", lon: 42.45, lat: 33.78, country: "iraq" },
  { id: "erbil", nameEn: "Erbil AB", nameHe: "בסיס ארביל", lon: 44.01, lat: 36.24, country: "iraq" },
  { id: "ali-al-salem", nameEn: "Ali Al Salem AB", nameHe: "עלי אל-סאלם", lon: 47.52, lat: 29.35, country: "kuwait" },
  { id: "bahrain-nsa", nameEn: "NSA Bahrain (5th Fleet)", nameHe: "בסיס חיל הים בחריין", lon: 50.6, lat: 26.23, country: "bahrain" },
  { id: "prince-sultan", nameEn: "Prince Sultan AB", nameHe: "בסיס הנסיך סולטאן", lon: 45.62, lat: 24.06, country: "saudi" },
];

const LAUNCH_LON = 51.7;
const LAUNCH_LAT = 32.7;
const TARGET_LON = 34.78;
const TARGET_LAT = 32.07;

const missileColors: Record<string, string> = {
  SRBM: "#ef4444",
  MRBM: "#f97316",
  IRBM: "#eab308",
};

// Hit count by country for heatmap intensity
const hitMap: Record<string, number> = {};
targetDistribution.forEach(t => { hitMap[t.id] = t.estimatedProjectiles; });
const maxHits = Math.max(...Object.values(hitMap));

const getHeatColor = (countryId: string): string | null => {
  const hits = hitMap[countryId];
  if (!hits) return null;
  const intensity = Math.max(0.12, (hits / maxHits) * 0.6);
  return `hsla(0, 70%, 50%, ${intensity})`;
};

interface MissileRangeMapProps {
  onMissileClick?: (id: string) => void;
}

const MissileRangeMap: React.FC<MissileRangeMapProps> = ({ onMissileClick }) => {
  const { lang } = useLanguage();
  const iranMissiles = getIranMissiles();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [animated, setAnimated] = useState(false);
  const [showBases, setShowBases] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredBase, setHoveredBase] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const svgRef = React.useRef<SVGSVGElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const [launchX, launchY] = project(LAUNCH_LON, LAUNCH_LAT);
  const [targetX, targetY] = project(TARGET_LON, TARGET_LAT);
  const kmPerPixel = (MAP.lonMax - MAP.lonMin) * 85 / MAP.width;
  const sorted = [...iranMissiles].sort((a, b) => a.rangeKm - b.rangeKm);
  const distToIsrael = 1600;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const countryHitData = (id: string) => targetDistribution.find(t => t.id === id);
  const baseData = (id: string) => usBases.find(b => b.id === id);

  return (
    <div className="w-full space-y-4" dir="ltr">
      {/* Controls */}
      <div className="flex items-center justify-between gap-3 px-2 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
            <span className="text-[10px] font-heebo text-muted-foreground">SRBM</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f97316]" />
            <span className="text-[10px] font-heebo text-muted-foreground">MRBM</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-usa" />
            <span className="text-[10px] font-heebo text-muted-foreground">{lang === "he" ? "בסיס אמריקאי" : "US Base"}</span>
          </div>
        </div>
        <button
          onClick={() => setShowBases(!showBases)}
          className={`px-2.5 py-1 text-[10px] font-heebo font-bold rounded border transition-colors ${
            showBases ? "bg-usa/20 border-usa/40 text-usa" : "border-border text-muted-foreground"
          }`}
        >
          {lang === "he" ? "בסיסים אמריקאיים" : "US Bases"}
        </button>
      </div>

      {/* Map container with tooltip */}
      <div className="relative overflow-x-auto rounded-xl border border-border bg-[hsl(213,30%,6%)]" onMouseMove={handleMouseMove}>
        <svg ref={svgRef} viewBox={`0 0 ${MAP.width} ${MAP.height}`} className="w-full h-auto" style={{ minHeight: 380 }}>
          <defs>
            <filter id="glow-map">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-sm">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <style>{`
              @keyframes pulse-ring { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
              @keyframes dash-anim { to { stroke-dashoffset: -20; } }
              @keyframes base-pulse { 0%,100% { r: 3; opacity:0.9; } 50% { r: 5; opacity:0.5; } }
            `}</style>
          </defs>

          {/* Ocean */}
          <rect width={MAP.width} height={MAP.height} fill="hsl(213,30%,6%)" />

          {/* Grid */}
          {[34,36,38,40,42,44,46,48,50,52,54,56,58,60].map(lon => {
            const [x] = project(lon, 30);
            return <line key={`glon-${lon}`} x1={x} y1={0} x2={x} y2={MAP.height} stroke="hsl(213,20%,12%)" strokeWidth={0.5} />;
          })}
          {[24,26,28,30,32,34,36,38,40].map(lat => {
            const [, y] = project(40, lat);
            return <line key={`glat-${lat}`} x1={0} y1={y} x2={MAP.width} y2={y} stroke="hsl(213,20%,12%)" strokeWidth={0.5} />;
          })}

          {/* Country fills */}
          {countries.map(c => {
            const pts = c.outline.map(([lo, la]) => project(lo, la).join(",")).join(" ");
            const isIran = c.id === "iran";
            const isIsrael = c.id === "israel";
            const baseFill = isIran ? "hsl(0,0%,18%)" : isIsrael ? "hsl(213,40%,20%)" : c.fill;
            return (
              <polygon key={c.id} points={pts} fill={baseFill}
                stroke="hsl(0,0%,28%)" strokeWidth={0.8} strokeLinejoin="round" />
            );
          })}

          {/* Heatmap overlay */}
          {countries.map(c => {
            const heat = getHeatColor(c.id);
            if (!heat) return null;
            const pts = c.outline.map(([lo, la]) => project(lo, la).join(",")).join(" ");
            const isHovered = hoveredCountry === c.id;
            return (
              <polygon key={`heat-${c.id}`} points={pts} fill={heat}
                stroke={isHovered ? "hsl(0,70%,60%)" : "none"}
                strokeWidth={isHovered ? 2 : 0}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredCountry(c.id)}
                onMouseLeave={() => setHoveredCountry(null)}
              />
            );
          })}

          {/* Country borders */}
          {countries.map(c => {
            const pts = c.outline.map(([lo, la]) => project(lo, la).join(",")).join(" ");
            const isMain = c.id === "iran" || c.id === "israel";
            return (
              <polygon key={`border-${c.id}`} points={pts} fill="none"
                stroke={isMain ? "hsl(0,0%,45%)" : "hsl(0,0%,25%)"}
                strokeWidth={isMain ? 1.5 : 0.7} strokeLinejoin="round"
                pointerEvents="none" />
            );
          })}

          {/* Country labels — clean, just name */}
          {countries.map(c => {
            const [lx, ly] = project(c.labelPos[0], c.labelPos[1]);
            const isMain = c.id === "iran" || c.id === "israel";
            const hasHits = !!hitMap[c.id];
            return (
              <g key={`lbl-${c.id}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredCountry(c.id)}
                onMouseLeave={() => setHoveredCountry(null)}
              >
                <text x={lx} y={ly} fill={isMain ? "hsl(0,0%,90%)" : "hsl(0,0%,55%)"}
                  fontSize={isMain ? 13 : 9} fontWeight={isMain ? 800 : 500}
                  fontFamily="Heebo, sans-serif" textAnchor="middle" dominantBaseline="middle">
                  {lang === "he" ? c.nameHe : c.nameEn}
                </text>
                {hasHits && (
                  <circle cx={lx + (isMain ? -35 : -20)} cy={ly - 1} r={3}
                    fill="hsl(0,70%,55%)" opacity={0.8} />
                )}
              </g>
            );
          })}

          {/* Missile range arcs */}
          {animated && sorted.map((m, i) => {
            const radiusPx = m.rangeKm / kmPerPixel;
            const isActive = activeId === m.id || activeId === null;
            const color = missileColors[m.category] || "#f97316";
            const reachesIsrael = m.rangeKm >= distToIsrael;

            return (
              <g key={m.id} opacity={isActive ? 1 : 0.1} className="transition-opacity duration-300">
                <circle cx={launchX} cy={launchY} r={radiusPx}
                  fill="none" stroke={color}
                  strokeWidth={activeId === m.id ? 2.5 : 1}
                  strokeDasharray={reachesIsrael ? "none" : "5 4"}
                  opacity={0.65}
                  style={{ animation: "pulse-ring 3s ease-in-out infinite", animationDelay: `${i * 0.15}s` }}
                />
                {/* Label on arc — only when hovered or single active */}
                {(activeId === m.id || activeId === null) && (() => {
                  const angle = -20 - i * 10;
                  const rad = (angle * Math.PI) / 180;
                  const lx = launchX + radiusPx * Math.cos(rad);
                  const ly = launchY + radiusPx * Math.sin(rad);
                  if (lx < 5 || lx > MAP.width - 5 || ly < 5 || ly > MAP.height - 5) return null;
                  const isHighlighted = activeId === m.id;
                  return (
                    <g opacity={isHighlighted ? 1 : 0.7}>
                      <rect x={lx - 30} y={ly - 8} width={60} height={16} rx={3}
                        fill="hsl(0,0%,5%)" fillOpacity={0.9} stroke={color} strokeWidth={isHighlighted ? 1 : 0.4} />
                      <text x={lx} y={ly + 4} fill={color} fontSize={8} fontWeight={700}
                        fontFamily="monospace" textAnchor="middle">
                        {m.rangeKm.toLocaleString()} km
                      </text>
                    </g>
                  );
                })()}
              </g>
            );
          })}

          {/* US Bases — just dots, details on hover */}
          {showBases && usBases.map(base => {
            const [bx, by] = project(base.lon, base.lat);
            return (
              <g key={base.id} className="cursor-pointer"
                onMouseEnter={() => setHoveredBase(base.id)}
                onMouseLeave={() => setHoveredBase(null)}
              >
                <circle cx={bx} cy={by} r={3.5} fill="hsl(var(--usa))" opacity={0.9}
                  style={{ animation: "base-pulse 2s ease-in-out infinite" }} />
                <circle cx={bx} cy={by} r={7} fill="none" stroke="hsl(var(--usa))" strokeWidth={0.6} opacity={0.3} />
              </g>
            );
          })}

          {/* Launch point */}
          <circle cx={launchX} cy={launchY} r={7} fill="#ef4444" opacity={0.3} filter="url(#glow-map)" />
          <circle cx={launchX} cy={launchY} r={4} fill="#ef4444" />
          <circle cx={launchX} cy={launchY} r={1.5} fill="white" />
          <text x={launchX} y={launchY - 14} fill="#ef4444" fontSize={10} fontWeight={800}
            fontFamily="Heebo, sans-serif" textAnchor="middle">
            {lang === "he" ? "שיגור" : "Launch"}
          </text>

          {/* Target — Tel Aviv */}
          <circle cx={targetX} cy={targetY} r={5} fill="hsl(213,80%,55%)" opacity={0.3} filter="url(#glow-sm)" />
          <circle cx={targetX} cy={targetY} r={3} fill="hsl(213,80%,55%)" />
          <circle cx={targetX} cy={targetY} r={1} fill="white" />
          <text x={targetX - 2} y={targetY + 14} fill="hsl(213,80%,70%)" fontSize={8} fontWeight={700}
            fontFamily="Heebo, sans-serif" textAnchor="end">
            {lang === "he" ? "תל אביב" : "Tel Aviv"}
          </text>

          {/* Distance line */}
          <line x1={launchX} y1={launchY} x2={targetX} y2={targetY}
            stroke="hsl(0,0%,45%)" strokeWidth={1} strokeDasharray="4 3"
            style={{ animation: "dash-anim 1s linear infinite" }} />
          {(() => {
            const mx = (launchX + targetX) / 2;
            const my = (launchY + targetY) / 2 - 14;
            return (
              <g>
                <rect x={mx - 38} y={my - 9} width={76} height={18} rx={4}
                  fill="hsl(0,0%,5%)" fillOpacity={0.9} stroke="hsl(0,0%,35%)" strokeWidth={0.5} />
                <text x={mx} y={my + 4} fill="hsl(0,0%,85%)" fontSize={10} fontWeight={700}
                  fontFamily="monospace" textAnchor="middle">~1,600 km</text>
              </g>
            );
          })()}

          {/* Scale bar */}
          {(() => {
            const scaleKm = 500;
            const scalePx = scaleKm / kmPerPixel;
            const sx = MAP.width - 25 - scalePx;
            const sy = MAP.height - 30;
            return (
              <g>
                <line x1={sx} y1={sy} x2={sx + scalePx} y2={sy} stroke="hsl(0,0%,55%)" strokeWidth={2} />
                <line x1={sx} y1={sy - 5} x2={sx} y2={sy + 5} stroke="hsl(0,0%,55%)" strokeWidth={1.5} />
                <line x1={sx + scalePx} y1={sy - 5} x2={sx + scalePx} y2={sy + 5} stroke="hsl(0,0%,55%)" strokeWidth={1.5} />
                <text x={sx + scalePx / 2} y={sy - 10} fill="hsl(0,0%,55%)" fontSize={10}
                  fontWeight={600} textAnchor="middle" fontFamily="monospace">500 km</text>
              </g>
            );
          })()}
        </svg>

        {/* HTML Tooltip — Country hover */}
        {hoveredCountry && (() => {
          const hit = countryHitData(hoveredCountry);
          const c = countries.find(c => c.id === hoveredCountry);
          if (!c) return null;
          return (
            <div
              className="absolute z-50 pointer-events-none"
              style={{ left: mousePos.x + 16, top: mousePos.y - 10 }}
            >
              <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-xl min-w-[180px]">
                <div className="font-heebo font-bold text-foreground text-sm mb-1">
                  {lang === "he" ? c.nameHe : c.nameEn}
                </div>
                {hit ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-frank">{lang === "he" ? "קליעים" : "Projectiles"}</span>
                      <span className="font-heebo font-bold text-loss">{hit.estimatedProjectiles.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-frank">{lang === "he" ? "אחוז מסה\"כ" : "% of total"}</span>
                      <span className="font-heebo font-bold text-foreground">{hit.percent}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-frank">{lang === "he" ? "שיעור יירוט" : "Intercept rate"}</span>
                      <span className="font-heebo font-bold text-primary">{hit.interceptRatePercent}%</span>
                    </div>
                    <div className="text-[9px] text-muted-foreground font-frank pt-1 border-t border-border/50">
                      {hit.source}
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-muted-foreground font-frank">
                    {lang === "he" ? "לא הותקפה" : "Not targeted"}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* HTML Tooltip — Base hover */}
        {hoveredBase && (() => {
          const base = baseData(hoveredBase);
          if (!base) return null;
          const hit = countryHitData(base.country);
          return (
            <div
              className="absolute z-50 pointer-events-none"
              style={{ left: mousePos.x + 16, top: mousePos.y - 10 }}
            >
              <div className="bg-background/95 backdrop-blur-sm border border-usa/30 rounded-lg px-3 py-2 shadow-xl min-w-[180px]">
                <div className="font-heebo font-bold text-usa text-sm mb-1">
                  🇺🇸 {lang === "he" ? base.nameHe : base.nameEn}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-frank">{lang === "he" ? "מדינה" : "Country"}</span>
                    <span className="font-heebo font-bold text-foreground">
                      {countries.find(c => c.id === base.country)?.[lang === "he" ? "nameHe" : "nameEn"] || base.country}
                    </span>
                  </div>
                  {hit && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-frank">{lang === "he" ? "קליעים לאזור" : "Area projectiles"}</span>
                      <span className="font-heebo font-bold text-loss">{hit.estimatedProjectiles.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="text-[9px] text-muted-foreground font-frank pt-1 border-t border-border/50">
                    {lang === "he" ? "בסיס צבאי אמריקאי שהותקף" : "US military base — targeted"}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Missile legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {sorted.map(m => {
          const reachesIsrael = m.rangeKm >= distToIsrael;
          const color = missileColors[m.category] || "#f97316";
          return (
            <button key={m.id}
              className={`px-3 py-2 rounded-lg border transition-all text-start ${
                activeId === m.id ? "border-foreground/40 bg-muted/40" : "border-border/50 bg-muted/10 hover:bg-muted/20"
              }`}
              onMouseEnter={() => setActiveId(m.id)}
              onMouseLeave={() => setActiveId(null)}
              onClick={() => {
                setActiveId(activeId === m.id ? null : m.id);
                onMissileClick?.(m.id);
              }}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="font-heebo font-bold text-foreground text-xs truncate">
                  {lang === "he" ? m.nameHe : m.nameEn}
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground font-frank flex items-center gap-2">
                <span>{m.rangeKm.toLocaleString()} km</span>
                <span className={`font-heebo font-bold ${reachesIsrael ? "text-loss" : "text-muted-foreground"}`}>
                  {reachesIsrael ? (lang === "he" ? "מגיע ✓" : "Reaches ✓") : (lang === "he" ? "לא מגיע" : "Short")}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Source */}
      <p className="text-[9px] text-muted-foreground font-frank px-1">
        {lang === "he"
          ? "* טווחים: CSIS Missile Defense Project. נתוני פגיעות: CENTCOM, משרדי ביטחון מפרציים, דובר צה\"ל. מיקומי בסיסים: פרסומים גלויים."
          : "* Ranges: CSIS Missile Defense Project. Hit data: CENTCOM, Gulf MoDs, IDF. Base locations: open-source publications."}
      </p>
    </div>
  );
};

export default MissileRangeMap;
