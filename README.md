# Structura v3.12

**Structura** is a browser-native information restructuring and visualization tool built with vanilla HTML, CSS, and JavaScript. It does **not** use an AI API, backend, account, or model download.

> **Keep what matters. See how it connects.**

## What it does

Structura intentionally supports formats that deterministic parsing can handle well:

- **Process Flow** — SOPs, procedures, workflows, and explicit decision points
- **Business Brief** — notes with explicit goals, metrics, findings, risks, and next actions
- **Study Notes** — structured textbook sections, lecture/bullet notes, definitions, and labeled Math/STEM notes
- **Timeline** — dated milestones and event sequences
- **Decision Tree** — policies containing explicit `if`, `unless`, `otherwise`, or threshold logic
- **Recipe Flow** — recipes with a recognizable ingredient block and instructions

It is **not** intended to semantically understand arbitrary essays or completely unstructured prose.

## Highlights

- Runs entirely in the browser
- No API key or usage cost
- No external JavaScript libraries
- No network requests for pasted text
- Concise / Standard / Detailed controls
- Text / Visual / Both output controls
- Purpose-built visuals, including real process flowcharts and spreadsheet-style recipe summary tables
- Copy and plain-text download
- Light and dark themes

## Study input types

Study mode asks for the source format first so Structura can parse structure instead of guessing concepts:

- **Textbook / Reading** — section headings followed by explanatory paragraphs
- **Lecture / Bullets** — headings with bullets, numbered points, or `Topic: note`
- **Definitions** — `Term: definition`, `Term — definition`, or clear `X is...` statements
- **Math / STEM** — labeled definitions, theorems, rules, tests, methods, formulas, or examples

If the selected structure cannot be detected, Structura reports that instead of inventing topic labels.

## How it works

```text
RAW TEXT
   ↓
NORMALIZE + FILTER OBVIOUS NOISE
   ↓
MODE-SPECIFIC PARSER
   ↓
SCORE / DEDUPLICATE / COMPRESS
   ↓
STRUCTURED JAVASCRIPT OBJECT
   ↓
TEXT + PURPOSE-BUILT VISUAL
```

The project is primarily **extractive and rules-based**. It preserves explicit source information rather than generating new semantic claims.

## Privacy and security

Structura is a static client-side app:

- pasted text is processed in the current browser tab
- the application code makes no `fetch`, XHR, WebSocket, or analytics requests
- only the theme preference is stored in `localStorage`
- user-derived strings are HTML-escaped before being inserted into rendered output
- downloads are created as local `text/plain` blobs
- input is capped at 100,000 characters to reduce accidental browser lockups
- a Content Security Policy blocks network connections, embedded objects, forms, and `<base>` URL changes

See [`SECURITY.md`](SECURITY.md) for the security model and reporting guidance.

## Run locally

The simplest option is to open `index.html` directly.

Or serve the folder locally:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000
```

## Test suite

A lightweight Node smoke-test suite is included:

```bash
node final_test.js
```

It checks all six modes, all four Study parsers, safe failure behavior, renderer execution, HTML escaping, and the large-input guard.

## Publish with GitHub Pages

This repository is a static site, so no build step or environment variables are required.

1. Push the files to a GitHub repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the branch containing these files and the `/ (root)` folder.
5. Save.

The included `.nojekyll` file tells GitHub Pages to serve the static files directly.

## Project structure

```text
.
├── index.html
├── styles.css
├── app.js
├── favicon.svg
├── README.md
├── SECURITY.md
├── final_test.js
├── .gitignore
└── .nojekyll
```

## Technical features

- regex-based signal detection
- mode-specific parsing algorithms
- token-frequency scoring
- similarity-based deduplication
- date / unit / quantity / conditional-language detection
- domain-specific recipe parsing
- branch-aware workflow parsing
- custom HTML/CSS visual renderers
- no runtime dependencies

## Known limitations

Rules-based parsing works best when the input visibly matches the selected mode. Ambiguous language, implied relationships, badly copied webpage text, or highly unusual formatting can reduce accuracy. Always verify important quantities, deadlines, policies, or other high-stakes information against the source.
