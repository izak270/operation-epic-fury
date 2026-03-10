import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getIranMissiles } from "@/data/arsenalData";

// Geographic data — approximate lon/lat positions projected to flat map
// Map covers roughly 34°E (Israel) to 60°E (Eastern Iran), ~25°N to ~40°N
// Horizontal: 26° of longitude ≈ 2,200 km at this latitude
// We'll use a simple equirectangular projection

const MAP_CONFIG = {
  lonMin: 33,
  lonMax: 61,
  latMin: 24,
  latMax: 41,
  width: 900,
  height: 520,
};

const project = (lon: number, lat: number): [number, number] => {
  const x = ((lon - MAP_CONFIG.lonMin) / (MAP_CONFIG.lonMax - MAP_CONFIG.lonMin)) * MAP_CONFIG.width;
  const y = ((MAP_CONFIG.latMax - lat) / (MAP_CONFIG.latMax - MAP_CONFIG.latMin)) * MAP_CONFIG.height;
  return [x, y];
};

// Simplified country outlines (key border points)
const countries: { id: string; nameEn: string; nameHe: string; color: string; labelPos: [number, number]; outline: [number, number][] }[] = [
  {
    id: "israel",
    nameEn: "Israel", nameHe: "ישראל",
    color: "hsl(var(--israel))",
    labelPos: [35.0, 31.5],
    outline: [
      [34.27, 31.95], [34.56, 32.95], [35.1, 33.27], [35.63, 33.25],
      [35.57, 32.39], [35.55, 31.5], [35.47, 31.5], [34.95, 29.5], [34.27, 31.25], [34.27, 31.95]
    ],
  },
  {
    id: "iran",
    nameEn: "Iran", nameHe: "איראן",
    color: "hsl(var(--iran))",
    labelPos: [53, 33],
    outline: [
      [44.0, 39.4], [44.8, 39.7], [46.0, 39.0], [48.0, 38.8], [48.9, 38.4],
      [49.1, 37.6], [50.1, 37.4], [51.8, 36.7], [53.9, 36.8], [55.4, 37.2],
      [57.3, 37.3], [59.6, 37.5], [60.5, 36.7], [61.0, 35.3], [60.6, 34.3],
      [60.9, 33.5], [60.5, 32.0], [60.8, 30.5], [60.0, 29.5], [58.5, 27.7],
      [57.8, 26.5], [56.3, 25.8], [54.5, 25.5], [52.5, 27.0], [51.2, 27.5],
      [50.5, 28.0], [49.5, 29.2], [48.5, 29.9], [48.0, 30.5], [48.0, 31.0],
      [47.5, 32.0], [46.1, 33.0], [45.4, 33.9], [44.7, 35.8], [44.3, 37.0],
      [44.0, 38.4], [44.0, 39.4]
    ],
  },
  {
    id: "iraq",
    nameEn: "Iraq", nameHe: "עירק",
    color: "hsl(0,0%,25%)",
    labelPos: [43.5, 33.5],
    outline: [
      [38.8, 36.9], [40.0, 37.0], [42.4, 37.1], [44.0, 37.0], [44.3, 37.0],
      [44.7, 35.8], [45.4, 33.9], [46.1, 33.0], [47.5, 32.0], [48.0, 31.0],
      [48.0, 30.5], [48.5, 29.9], [47.7, 29.5], [46.5, 29.1],
      [44.7, 29.1], [43.8, 29.4], [42.0, 31.2], [40.4, 31.9],
      [39.2, 32.1], [38.8, 33.4], [38.8, 36.9]
    ],
  },
  {
    id: "syria",
    nameEn: "Syria", nameHe: "סוריה",
    color: "hsl(0,0%,22%)",
    labelPos: [38.5, 35.3],
    outline: [
      [35.63, 33.25], [35.9, 33.65], [36.4, 34.5], [36.0, 35.4],
      [36.6, 36.8], [38.0, 36.9], [38.8, 36.9], [38.8, 33.4],
      [39.2, 32.1], [38.0, 32.3], [37.0, 32.5], [36.0, 32.3],
      [35.8, 32.6], [35.63, 33.25]
    ],
  },
  {
    id: "jordan",
    nameEn: "Jordan", nameHe: "ירדן",
    color: "hsl(0,0%,20%)",
    labelPos: [37, 31],
    outline: [
      [35.55, 31.5], [35.57, 32.39], [35.63, 33.25], [35.8, 32.6],
      [36.0, 32.3], [37.0, 32.5], [38.0, 32.3], [39.2, 32.1],
      [40.4, 31.9], [39.0, 32.0], [39.0, 29.3], [37.0, 29.1],
      [36.5, 29.2], [35.5, 29.5], [34.95, 29.5], [35.47, 31.5], [35.55, 31.5]
    ],
  },
  {
    id: "saudi",
    nameEn: "Saudi Arabia", nameHe: "סעודיה",
    color: "hsl(0,0%,18%)",
    labelPos: [44, 26.5],
    outline: [
      [34.95, 29.5], [36.5, 29.2], [37.0, 29.1], [39.0, 29.3],
      [39.0, 32.0], [40.4, 31.9], [42.0, 31.2], [43.8, 29.4],
      [44.7, 29.1], [46.5, 29.1], [47.7, 29.5], [48.5, 29.9],
      [49.5, 29.2], [50.5, 28.0], [51.2, 27.5], [50.8, 25.5],
      [50.0, 25.0], [48.5, 24.5], [46.0, 24.0], [44.5, 24.5],
      [42.0, 24.5], [39.5, 24.0], [38.0, 24.2], [37.0, 25.0],
      [36.5, 26.0], [35.5, 27.5], [34.95, 29.5]
    ],
  },
];

// Launch point — western Iran (e.g., near Isfahan/Kermanshah)
const LAUNCH_LON = 51.7;
const LAUNCH_LAT = 32.7;

// Target — Tel Aviv
const TARGET_LON = 34.78;
const TARGET_LAT = 32.07;

const missileColors: Record<string, string> = {
  "SRBM": "#ef4444",
  "MRBM": "#f97316",
  "IRBM": "#eab308",
};

const MissileRangeMap: React.FC = () => {
  const { lang } = useLanguage();
  const iranMissiles = getIranMissiles();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const [launchX, launchY] = project(LAUNCH_LON, LAUNCH_LAT);
  const [targetX, targetY] = project(TARGET_LON, TARGET_LAT);

  // Distance Tehran-TelAviv ~1600km, scale: 1 deg lon ≈ 85km at this lat
  const kmPerPixel = (MAP_CONFIG.lonMax - MAP_CONFIG.lonMin) * 85 / MAP_CONFIG.width;

  const sorted = [...iranMissiles].sort((a, b) => a.rangeKm - b.rangeKm);

  const distToIsrael = 1600; // km approx

  return (
    <div className="w-full space-y-3" dir="ltr">
      <div className="overflow-x-auto rounded-lg border border-border bg-background/50">
        <svg
          viewBox={`0 0 ${MAP_CONFIG.width} ${MAP_CONFIG.height}`}
          className="w-full h-auto"
          style={{ minHeight: 350 }}
        >
          <defs>
            {/* Gradient for range circles */}
            {sorted.map((m, i) => (
              <radialGradient key={m.id} id={`grad-${m.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={missileColors[m.category] || "#f97316"} stopOpacity="0.15" />
                <stop offset="85%" stopColor={missileColors[m.category] || "#f97316"} stopOpacity="0.06" />
                <stop offset="100%" stopColor={missileColors[m.category] || "#f97316"} stopOpacity="0" />
              </radialGradient>
            ))}
            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Animated dash */}
            <style>{`
              @keyframes dash-move {
                to { stroke-dashoffset: -20; }
              }
              @keyframes range-pulse {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
              }
              @keyframes expand-circle {
                from { r: 0; opacity: 0.8; }
                to { r: var(--target-r); opacity: 0.5; }
              }
            `}</style>
          </defs>

          {/* Background water */}
          <rect width={MAP_CONFIG.width} height={MAP_CONFIG.height} fill="hsl(213, 30%, 8%)" />

          {/* Grid lines */}
          {[35, 40, 45, 50, 55, 60].map(lon => {
            const [x] = project(lon, 30);
            return (
              <g key={`lon-${lon}`}>
                <line x1={x} y1={0} x2={x} y2={MAP_CONFIG.height} stroke="hsl(0,0%,15%)" strokeWidth={0.5} />
                <text x={x} y={MAP_CONFIG.height - 5} fill="hsl(0,0%,30%)" fontSize={9} textAnchor="middle">{lon}°E</text>
              </g>
            );
          })}
          {[26, 28, 30, 32, 34, 36, 38, 40].map(lat => {
            const [, y] = project(40, lat);
            return (
              <g key={`lat-${lat}`}>
                <line x1={0} y1={y} x2={MAP_CONFIG.width} y2={y} stroke="hsl(0,0%,15%)" strokeWidth={0.5} />
                <text x={5} y={y - 3} fill="hsl(0,0%,30%)" fontSize={9}>{lat}°N</text>
              </g>
            );
          })}

          {/* Country fills */}
          {countries.map(c => {
            const points = c.outline.map(([lon, lat]) => project(lon, lat).join(",")).join(" ");
            return (
              <polygon
                key={c.id}
                points={points}
                fill={c.color}
                stroke="hsl(0,0%,30%)"
                strokeWidth={0.8}
                opacity={0.9}
              />
            );
          })}

          {/* Country labels */}
          {countries.map(c => {
            const [lx, ly] = project(c.labelPos[0], c.labelPos[1]);
            return (
              <text
                key={`label-${c.id}`}
                x={lx} y={ly}
                fill={c.id === "israel" || c.id === "iran" ? c.color : "hsl(0,0%,50%)"}
                fontSize={c.id === "israel" || c.id === "iran" ? 14 : 10}
                fontWeight={c.id === "israel" || c.id === "iran" ? 800 : 400}
                fontFamily="Heebo, sans-serif"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {lang === "he" ? c.nameHe : c.nameEn}
              </text>
            );
          })}

          {/* Missile range circles from launch point */}
          {animated && sorted.map((m, i) => {
            const radiusPx = m.rangeKm / kmPerPixel;
            const isActive = activeId === m.id || activeId === null;
            const reachesIsrael = m.rangeKm >= distToIsrael;
            const color = missileColors[m.category] || "#f97316";

            return (
              <g key={m.id} opacity={isActive ? 1 : 0.15} className="transition-opacity duration-300">
                <circle
                  cx={launchX}
                  cy={launchY}
                  r={radiusPx}
                  fill="none"
                  stroke={color}
                  strokeWidth={activeId === m.id ? 2.5 : 1.2}
                  strokeDasharray={reachesIsrael ? "none" : "6 4"}
                  opacity={0.7}
                  style={{
                    animation: `range-pulse 3s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
                {/* Range label on the circle */}
                {(() => {
                  // Place label at ~45° angle toward top-right
                  const angle = -35 - i * 8;
                  const rad = (angle * Math.PI) / 180;
                  const lx = launchX + radiusPx * Math.cos(rad);
                  const ly = launchY + radiusPx * Math.sin(rad);
                  if (lx < 0 || lx > MAP_CONFIG.width || ly < 0 || ly > MAP_CONFIG.height) return null;
                  return (
                    <g>
                      <rect
                        x={lx - 38} y={ly - 8}
                        width={76} height={16}
                        rx={3}
                        fill="hsl(0,0%,6%)"
                        stroke={color}
                        strokeWidth={0.5}
                        opacity={0.9}
                      />
                      <text
                        x={lx} y={ly + 4}
                        fill={color}
                        fontSize={9}
                        fontWeight={700}
                        fontFamily="Heebo, sans-serif"
                        textAnchor="middle"
                      >
                        {lang === "he" ? m.nameHe : m.nameEn}
                      </text>
                    </g>
                  );
                })()}
              </g>
            );
          })}

          {/* Launch point */}
          <circle cx={launchX} cy={launchY} r={5} fill="#ef4444" filter="url(#glow)" />
          <circle cx={launchX} cy={launchY} r={2} fill="white" />
          <text
            x={launchX} y={launchY - 12}
            fill="#ef4444" fontSize={10} fontWeight={700} fontFamily="Heebo, sans-serif" textAnchor="middle"
          >
            {lang === "he" ? "נקודת שיגור" : "Launch Point"}
          </text>

          {/* Target point — Tel Aviv */}
          <circle cx={targetX} cy={targetY} r={4} fill="hsl(var(--israel))" filter="url(#glow)" />
          <circle cx={targetX} cy={targetY} r={1.5} fill="white" />
          <text
            x={targetX} y={targetY + 16}
            fill="hsl(var(--israel))" fontSize={9} fontWeight={700} fontFamily="Heebo, sans-serif" textAnchor="middle"
          >
            {lang === "he" ? "תל אביב" : "Tel Aviv"}
          </text>

          {/* Dashed line from launch to target */}
          <line
            x1={launchX} y1={launchY} x2={targetX} y2={targetY}
            stroke="hsl(0,0%,40%)"
            strokeWidth={1}
            strokeDasharray="4 3"
            style={{ animation: "dash-move 1s linear infinite" }}
          />
          {/* Distance label */}
          {(() => {
            const mx = (launchX + targetX) / 2;
            const my = (launchY + targetY) / 2 - 12;
            return (
              <g>
                <rect x={mx - 35} y={my - 9} width={70} height={18} rx={4} fill="hsl(0,0%,8%)" stroke="hsl(0,0%,30%)" strokeWidth={0.5} />
                <text x={mx} y={my + 4} fill="hsl(0,0%,80%)" fontSize={10} fontWeight={700} fontFamily="monospace" textAnchor="middle">
                  ~1,600 km
                </text>
              </g>
            );
          })()}

          {/* Distance scale bar */}
          {(() => {
            const scaleKm = 500;
            const scalePx = scaleKm / kmPerPixel;
            const sx = MAP_CONFIG.width - 20 - scalePx;
            const sy = MAP_CONFIG.height - 25;
            return (
              <g>
                <line x1={sx} y1={sy} x2={sx + scalePx} y2={sy} stroke="hsl(0,0%,60%)" strokeWidth={2} />
                <line x1={sx} y1={sy - 4} x2={sx} y2={sy + 4} stroke="hsl(0,0%,60%)" strokeWidth={1.5} />
                <line x1={sx + scalePx} y1={sy - 4} x2={sx + scalePx} y2={sy + 4} stroke="hsl(0,0%,60%)" strokeWidth={1.5} />
                <text x={sx + scalePx / 2} y={sy - 8} fill="hsl(0,0%,60%)" fontSize={10} fontWeight={600} textAnchor="middle">
                  500 km
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Missile legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {sorted.map(m => {
          const reachesIsrael = m.rangeKm >= distToIsrael;
          const color = missileColors[m.category] || "#f97316";
          return (
            <button
              key={m.id}
              className={`px-3 py-2 rounded-lg border transition-all text-start ${
                activeId === m.id
                  ? "border-foreground/40 bg-muted/40"
                  : "border-border/50 bg-muted/10 hover:bg-muted/20"
              }`}
              onMouseEnter={() => setActiveId(m.id)}
              onMouseLeave={() => setActiveId(null)}
              onClick={() => setActiveId(activeId === m.id ? null : m.id)}
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
                  {reachesIsrael
                    ? (lang === "he" ? "מגיע לישראל ✓" : "Reaches Israel ✓")
                    : (lang === "he" ? "לא מגיע" : "Short")}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Source */}
      <p className="text-[9px] text-muted-foreground font-frank px-1">
        {lang === "he"
          ? "* טווחים מבוססים על הערכות CSIS Missile Defense Project. נקודת שיגור: מרכז-מערב איראן. מרחקים מוערכים."
          : "* Ranges based on CSIS Missile Defense Project estimates. Launch point: central-western Iran. Distances approximate."}
      </p>
    </div>
  );
};

export default MissileRangeMap;
