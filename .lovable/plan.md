

## 10 Interactive Charts — Implementation Plan

### New Data Files

**`src/data/launchData.ts`** — Daily Iranian launch timeline (Feb 28 – Mar 9, 2026) with ballistic missiles and UAVs per day, events, and intercept rates.

**`src/data/arsenalData.ts`** — Detailed missile inventory for Iran/Israel/USA: type, range, propulsion, warhead weight, pre-war quantity, unit cost estimates, source classification (official vs foreign estimate).

**`src/data/uraniumData.ts`** — Enrichment milestones: date, enrichment level, quantity (kg), IAEA status.

**`src/data/costData.ts`** — Attack vs defense cost comparison: Iranian missile cost vs interceptor cost (Arrow 3, SM-3, etc.), plus US munitions spending breakdown for first 100 hours.

**`src/data/targetDistribution.ts`** — Geographic distribution of Iranian fire (UAE 48%, Israel 12.8%, Kuwait, etc.).

### New Components (all use `recharts`)

Each chart is a standalone component in `src/components/charts/`:

| # | Component | Chart Type | Data Source | Dimensions |
|---|-----------|-----------|-------------|------------|
| 1 | `PersonnelChart` | Horizontal Stacked Bar | `militaryData.ts` (active + reserve) | 2D |
| 2 | `FireRateCollapseChart` | Area/Line | `launchData.ts` (ballistic only) | 2D |
| 3 | `DualLaunchChart` | Dual-line Area | `launchData.ts` (ballistic + UAV) | 3D |
| 4 | `CostComparisonChart` | Grouped Bar (log scale) | `costData.ts` | 3D |
| 5 | `TargetDistributionChart` | Donut/Pie | `targetDistribution.ts` | 2D |
| 6 | `CapabilityErosionChart` | Bubble Scatter | `launchData.ts` + TEL estimates | 4D |
| 7 | `USMunitionsTreemap` | Treemap | `costData.ts` (US breakdown) | 3D |
| 8 | `UraniumStatusChart` | Stacked Bar (waffle-like) | `uraniumData.ts` | 3D |
| 9 | `MissileRangeRadar` | Radar | `arsenalData.ts` (Iran missiles) | 3D |
| 10 | `CasualtyBreakdownChart` | Pie (exploded) | `militaryData.ts` v1 casualty data | 2D |

### New Page Section

Add a `src/components/ChartsSection.tsx` that renders all 10 charts in a vertical scroll below the existing force modules, separated by a section header. Each chart gets:
- Bilingual title + subtitle
- Source attribution
- Dark card wrapper with consistent spacing
- Tooltip on hover showing exact values

### Navigation Update

Add a sticky tab bar or anchor link in the header: "Data | Charts" to scroll between the force table and charts section.

### Translations

Add ~30 new keys to `LanguageContext.tsx` for chart titles, labels, tooltips, and section headers.

### Design Constraints (preserved)

- Dark theme throughout, matching existing palette
- Country colors: USA blue, Israel grey, Iran green, Loss red
- Heebo for titles, Frank Ruhl Libre for labels
- No figurative icons, no gamification
- All charts use `recharts` (already installed)

