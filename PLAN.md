# Static Website — Body Transformation Plans (Firebase Hosted)

Convert the `/Body` markdown content repository into a static website hosted on Google Firebase. The site dynamically loads `.md` files at runtime using JavaScript, so content updates only require editing the source `.md` files — no rebuild needed.

---

## Architecture Overview

```
Body/
├── index.html                          ← Home page (loads README.md)
├── firebase.json                       ← Firebase Hosting config
├── .firebaserc                         ← Firebase project alias
├── PLAN.md                             ← This file
├── assets/
│   ├── css/
│   │   └── style.css                   ← Shared design system
│   └── js/
│       ├── md-loader.js                ← Fetches & renders .md → HTML (marked.js)
│       └── nav.js                      ← Injects shared sidebar/header/breadcrumb
├── nutrition/
│   ├── index.html                      ← Nutrition hub listing all phases
│   ├── phase1-bulking1-nutrition.html
│   ├── phase2-mini-cut-nutrition.html
│   ├── phase3-bulking2-nutrition.html
│   ├── phase4-shredding-nutrition.html
│   └── phase5-maintain-nutrition.html
├── workouts/
│   ├── index.html                      ← Workouts hub
│   ├── phase1-bulking1-workout.html
│   ├── phase2-mini-cut-workout.html
│   ├── phase3-bulking2-workout.html
│   ├── phase4-shredding-workout.html
│   └── phase5-maintain-workout.html
├── hormones-and-supplements/
│   ├── index.html                      ← Hub page
│   ├── hormones.html
│   └── supplements.html
├── progress-tracking.html
├── research.html
└── tools/
    └── one-rep-max.html               ← Fully offline 1RM calculator (all JS inline)
```

> Each content `.html` page is a **shell** — it contains only layout structure and a `<div id="content">`. The `md-loader.js` script fetches the corresponding `.md` file from the same directory and renders it on page load using **marked.js** (CDN).
>
> **Exception:** `tools/one-rep-max.html` is a **fully self-contained interactive page** — no `fetch()` calls, no CDN dependencies beyond shared `nav.js`/`style.css`. All 1RM formula logic lives in inline `<script>` tags.

---

## Content File Map

| HTML Page | Loads from MD File |
|---|---|
| `index.html` | `README.md` |
| `nutrition/index.html` | `nutrition/nutritons.md` |
| `nutrition/phase1-bulking1-nutrition.html` | `nutrition/phase1-bulking1-nutrition.md` |
| `nutrition/phase2-mini-cut-nutrition.html` | `nutrition/phase2-mini-cut-nutrition.md` |
| `nutrition/phase3-bulking2-nutrition.html` | `nutrition/phase3-bulking2-nutrition.md` |
| `nutrition/phase4-shredding-nutrition.html` | `nutrition/phase4-shredding-nutrition.md` |
| `nutrition/phase5-maintain-nutrition.html` | `nutrition/phase5-maintain-nutrition.md` |
| `workouts/phase1-bulking1-workout.html` | `workouts/phase1-bulking1-workout.md` |
| `workouts/phase2-mini-cut-workout.html` | `workouts/phase2-mini-cut-workout.md` |
| `workouts/phase3-bulking2-workout.html` | `workouts/phase3-bulking2-workout.md` |
| `workouts/phase4-shredding-workout.html` | `workouts/phase4-shredding-workout.md` |
| `workouts/phase5-maintain-workout.html` | `workouts/phase5-maintain-workout.md` |
| `hormones-and-supplements/hormones.html` | `hormones-and-supplements/hormones.md` |
| `hormones-and-supplements/supplements.html` | `hormones-and-supplements/supplements.md` |
| `progress-tracking.html` | `progress-tracking.md` |
| `research.html` | `research.md` |
| `tools/one-rep-max.html` | *(no MD file — fully self-contained)* |

---

## Key Technical Decisions

### 1. Markdown Rendering — `marked.js` via CDN
- Use `marked.js` (latest v12 CDN) for zero-build Markdown → HTML conversion.
- Optionally add **highlight.js** for code block syntax highlighting.
- `md-loader.js` will: `fetch(mdPath)` → `marked.parse(text)` → inject into `#content`.

### 2. Shared Layout — `nav.js`
- A single `nav.js` script injected into every page renders:
  - **Sidebar navigation** with section links (Workouts, Nutrition, Hormones, Progress, Research, **Tools**)
  - **Breadcrumb** (Home → Section → Page)
  - **Header** with the site title
- This avoids duplicating HTML across 17+ pages.

### 3. Content Update Workflow
```
Edit .md file  →  firebase deploy  →  Site auto-reflects changes
```
No HTML files need to change when content is updated.

### 4. Firebase Hosting Config (`firebase.json`)
- Serve all files from the `/Body` root.
- Add `cleanUrls: true` so `/nutrition/phase1-bulking1-nutrition` works without `.html`.
- No SPA rewrite needed — this is a multi-page static site.

---

## Files to Create

### Root Level

#### `index.html`
- Home page shell; loads `README.md` via `md-loader.js`.
- Contains sidebar, header, and `<div id="content">`.

#### `firebase.json`
```json
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", ".firebaserc", "PLAN.md", "**/.*", "node_modules/**"],
    "cleanUrls": true,
    "headers": [
      {
        "source": "**/*.md",
        "headers": [{ "key": "Access-Control-Allow-Origin", "value": "*" }]
      }
    ]
  }
}
```

#### `.firebaserc`
```json
{
  "projects": {
    "default": "<YOUR_FIREBASE_PROJECT_ID>"
  }
}
```

---

### Assets

#### `assets/css/style.css`
- Dark-mode design system with CSS variables.
- Typography using **Inter** (Google Fonts).
- Sidebar layout, card grid for hub pages, rendered Markdown prose styles.
- Responsive mobile layout.

#### `assets/js/md-loader.js`
```javascript
// Reads data-md attribute from <body>,
// fetches the .md file, parses with marked.js,
// injects rendered HTML into #content
```

#### `assets/js/nav.js`
```javascript
// Dynamically injects sidebar HTML with active-link highlighting
// Injects breadcrumb based on current URL path
```

---

### HTML Shell Template

Every content page follows this pattern:

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>Page Title — Body Plan</title>
  <meta name="description" content="...">
  <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body data-md="relative/path/to/file.md">
  <div id="app">
    <aside id="sidebar"><!-- injected by nav.js --></aside>
    <main>
      <nav id="breadcrumb"><!-- injected by nav.js --></nav>
      <article id="content"><!-- injected by md-loader.js --></article>
    </main>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="/assets/js/nav.js"></script>
  <script src="/assets/js/md-loader.js"></script>
</body>
</html>
```

---

### Pages to Create

**Root:**
- [ ] `index.html` → `README.md`
- [ ] `progress-tracking.html` → `progress-tracking.md`
- [ ] `research.html` → `research.md`

**Nutrition (`nutrition/`):**
- [ ] `index.html` (hub with phase cards)
- [ ] `phase1-bulking1-nutrition.html`
- [ ] `phase2-mini-cut-nutrition.html`
- [ ] `phase3-bulking2-nutrition.html`
- [ ] `phase4-shredding-nutrition.html`
- [ ] `phase5-maintain-nutrition.html`

**Workouts (`workouts/`):**
- [ ] `index.html` (hub with phase cards)
- [ ] `phase1-bulking1-workout.html`
- [ ] `phase2-mini-cut-workout.html`
- [ ] `phase3-bulking2-workout.html`
- [ ] `phase4-shredding-workout.html`
- [ ] `phase5-maintain-workout.html`

**Hormones & Supplements (`hormones-and-supplements/`):**
- [ ] `index.html` (hub)
- [ ] `hormones.html`
- [ ] `supplements.html`

**Tools (`tools/`):**
- [ ] `one-rep-max.html` — Fully offline 1RM calculator

---

### Tools — One Rep Max Calculator (`tools/one-rep-max.html`)

This page is **100% offline** — no `fetch()` calls, no external API. The calculation is pure JavaScript embedded directly in the page.

#### Formula Support
All 7 standard 1RM estimation formulas will be calculated simultaneously:

| Formula | Equation |
|---|---|
| **Epley** (primary) | `w × (1 + r/30)` |
| **Brzycki** | `w × 36 / (37 − r)` |
| **Lander** | `(100 × w) / (101.3 − 2.67123 × r)` |
| **Lombardi** | `w × r^0.10` |
| **Mayhew et al.** | `(100 × w) / (52.2 + 41.9 × e^(−0.055 × r))` |
| **O'Conner et al.** | `w × (1 + 0.025 × r)` |
| **Wathan** | `(100 × w) / (48.8 + 53.8 × e^(−0.075 × r))` |

> Valid rep range: **1–12 reps**. Show a warning if reps > 10.

#### UI Components
- **Weight input** — `kg` / `lb` toggle (converts internally)
- **Reps input** — number, 1–12
- **Calculate button** — triggers all formulas instantly (no network)
- **Results table** — all 7 formula results, Epley highlighted as primary
- **Percentage table** — 50%–100% of Epley 1RM for programming working sets

#### Implementation Notes
- All logic in a self-contained `<script>` block inside the HTML file
- Uses shared `style.css` and `nav.js` for visual consistency
- **No** `data-md` attribute — `md-loader.js` is NOT included on this page

---

## Firebase Deployment Steps

1. **Install Firebase CLI** (one-time):
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize project** (run once inside `/Body`):
   ```bash
   firebase init hosting
   # Public directory: . (current directory)
   # Single page app: No
   # Auto builds: No
   ```

3. **Deploy**:
   ```bash
   firebase deploy
   ```

4. **Update content** (ongoing):
   ```bash
   # Edit any .md file, then:
   firebase deploy
   ```

> **Note:** Firebase Hosting serves `.md` files as static assets. The browser's `fetch()` call to a same-origin `.md` file works without CORS issues on Firebase — unlike local `file://` access.
