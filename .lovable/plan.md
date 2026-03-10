

## Military Forces Comparison App — Studio Kintsugi

### Overview
A bilingual (Hebrew RTL / English LTR) mobile-first dashboard comparing military forces of the USA, Israel, and Iran. Data starts with researched static values; future API integration can be added later.

### Design System
- **Dark theme**: Off-Black `#121212` background, Chalk White `#E8E8E8` text
- **Country colors**: USA Signal Blue `#0052A5`, Israel Stone Grey `#A1A1A1`, Iran Cypress Green `#3A5311`
- **Loss indicator**: Faded Red `#B44343` for destroyed/casualties
- **Fonts**: Heebo (headlines, numbers — Bold 700), Frank Ruhl Libre (labels, sources, body)
- **No charts/graphs** — raw numbers in columnar layout

### Data Categories (8 modules)
Each module shows USA | Israel | Iran side by side with raw numbers:
1. **Active Military Personnel** — total active duty
2. **Reserve Personnel** — reserve forces
3. **Fighter/Attack Aircraft** — combat aircraft fleet
4. **Tanks (MBTs)** — main battle tanks
5. **Naval Vessels** — total fleet (submarines, destroyers, frigates, corvettes)
6. **Missile Systems** — ballistic & cruise missile inventory
7. **Defense Budget** — annual military spending (USD)
8. **Nuclear Capability** — estimated warheads (N/A where applicable)

Each module will also show a **change indicator** in Faded Red for losses/changes (initially static placeholder, e.g. "−0" until live data is connected).

### Pages & Navigation
- **Home / Dashboard**: Vertical scrolling feed of all 8 data modules, rigid equal-height blocks separated by thin lines
- **Language toggle**: Hebrew ↔ English button in top corner; RTL/LTR layout switches accordingly
- **Source footer**: Each data block shows source attribution (e.g. "GlobalFirepower 2024", "SIPRI", "IISS")

### Signature Moment
On first load, numbers appear with a mechanical split-flap "clack" animation — each block transitions sequentially top-to-bottom. Numbers representing losses briefly flash Faded Red.

### Data (Researched Approximate Values)
Pre-populated with publicly available estimates from GlobalFirepower, IISS, SIPRI:
- USA: 1.3M active, 800K reserve, 1,854 fighters, 5,500 tanks, 484 naval, ~5,500 warheads, $886B budget
- Israel: 170K active, 465K reserve, 241 fighters, 1,370 tanks, 67 naval, ~90 warheads (est.), $23.4B budget
- Iran: 610K active, 350K reserve, 186 fighters, 1,996 tanks, 101 naval, 0 warheads, $10B budget

### Technical Approach
- React + TypeScript + Tailwind
- Google Fonts: Heebo + Frank Ruhl Libre
- i18n context for Hebrew/English toggle with RTL support
- CSS animations for the split-flap number transition effect
- localStorage to remember language preference
- Static data in a TypeScript constants file for easy future replacement with API

### Anti-Patterns (Per Design Brief)
- No gamification, no leaderboards, no "power rankings"
- No figurative animations (no tiny tanks/planes)
- No photographs or videos
- No push notifications

