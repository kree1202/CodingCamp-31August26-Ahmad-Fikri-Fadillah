# Design Document — Syaflower Shop

## Overview

Syaflower Shop is a premium single-page web application (SPA) for a flower boutique in Solo, Indonesia. The application delivers the complete brand experience — browsing, filtering, and initiating orders — entirely within one `index.html` file, with no build tooling, no framework, and no backend dependency.

The visual language is moody, romantic, and cinematic, referencing 35mm analog film photography. This is expressed through a defined four-color palette, a film-grain texture layer, subtle motion-blur on the hero image, and a pairing of an elegant serif typeface (Playfair Display) with a clean sans-serif (DM Sans).

All interactivity (gallery filtering, navbar scroll behavior, hamburger menu, smooth-scroll CTAs) is implemented in vanilla JavaScript. Product data lives in a static JS array inside the HTML file. The application requires no server and no persistent storage.

---

## Architecture

### High-Level Structure

The entire application ships as a single `index.html` file. Internal organization follows a strict separation of concerns within that file:

```
index.html
├── <head>
│   ├── Google Fonts preconnect + stylesheet links
│   ├── <style> — all CSS custom properties, component styles, animations, media queries
│   └── SVG filter definition for film-grain (inside <defs>)
│
└── <body>
    ├── <header> — Navbar component
    ├── <main>
    │   ├── <section id="hero">    — Hero section
    │   ├── <section id="about">   — About section
    │   ├── <section id="gallery"> — FilterBar + ProductCard grid
    │   ├── <section id="cta">     — CTA Banner
    │   ├── <section id="testimonials"> — Testimonials section
    │   └── <section id="contact"> — Contact / Footer bridge
    └── <footer> — Footer component
    └── <script> — all JS: product data array, gallery filter, navbar scroll, hamburger menu
```

### Rendering Model

This is a purely static, no-hydration rendering model. On load, the browser parses the single HTML file, applies all CSS, and executes the inline `<script>` block which:

1. Reads the static `PRODUCTS` array and renders `<article>` cards into the gallery grid.
2. Binds gallery filter button click handlers.
3. Sets up an `IntersectionObserver` on the Hero section sentinel to drive the navbar background transition.
4. Binds hamburger toggle click handler.
5. Binds all smooth-scroll CTA and nav-link click handlers.

There is no virtual DOM, no component lifecycle, and no state management library. All state is represented directly in the DOM (CSS class presence) and in two lightweight JS variables (active filter category, mobile menu open/closed).

### Dependency Map

```
External (CDN / no-install)
  └── fonts.googleapis.com
        ├── Playfair Display (400, 700)
        └── DM Sans (400, 500)

Static Assets (bundled with project)
  └── /images/
        ├── hero.jpg          (≥1280×720px)
        ├── about.jpg         (≥400×400px)
        └── product-*.jpg     (one per product entry in PRODUCTS array)

No npm packages. No CDN JS libraries.
```

---

## Components and Interfaces

### 1. Navbar

**Markup:** `<header class="navbar" role="banner">`

**Behavior:**
- Fixed position at top of viewport (`position: fixed; top: 0; z-index: 100`).
- Background starts fully transparent (`background: transparent`).
- An `IntersectionObserver` watches a zero-height sentinel `<div id="hero-sentinel">` placed at the bottom of the Hero section. When the sentinel exits the viewport (user has scrolled past the hero), the class `navbar--scrolled` is added to `<header>`; when it re-enters, the class is removed.
- `.navbar--scrolled` applies `background: rgba(27, 58, 75, 0.92)` (semi-opaque deep teal) with a `transition: background 300ms ease`.
- On viewports ≤ 768px, nav links and CTA button are hidden; a hamburger icon `<button class="navbar__hamburger" aria-label="Open menu" aria-expanded="false">` is shown.
- Hamburger click handler toggles class `navbar--menu-open` on `<header>`, which triggers the mobile dropdown via CSS, and flips `aria-expanded` on the button.
- Clicking a nav link inside the open mobile menu, or clicking an overlay behind it, removes `navbar--menu-open`.

**CSS custom property dependencies:** `--color-bg-primary`, `--color-text-primary`, `--color-accent`, `--font-sans`

**Public interface (JS):**
```js
initNavbar()   // sets up IntersectionObserver + hamburger handler
```

---

### 2. Hero Section

**Markup:** `<section id="hero" aria-label="Hero">`

**Structure:**
```html
<section id="hero">
  <div class="hero__bg-image" aria-hidden="true"></div>   <!-- background image element -->
  <div class="hero__grain" aria-hidden="true"></div>       <!-- grain overlay pseudo or div -->
  <div class="hero__content">
    <h1 class="hero__title">Syaflower</h1>
    <p  class="hero__tagline">…</p>
    <a  class="cta-button hero__cta" href="#gallery">Shop Now</a>
  </div>
  <div id="hero-sentinel" aria-hidden="true"></div>        <!-- IntersectionObserver target -->
</section>
```

**Sizing:** `height: 100vh; width: 100vw; overflow: hidden`

**Background image:** Applied as `background-image: url(images/hero.jpg)` on `.hero__bg-image`, which is `position: absolute; inset: 0; background-size: cover; background-position: center`. A CSS `filter: blur(2px)` is applied directly to `.hero__bg-image` (not the parent section), so the motion-blur effect does not affect the text layer. The element extends slightly beyond bounds (`margin: -4px`) so blur edges don't show.

**Fallback:** `.hero__bg-image { background-color: var(--color-bg-primary) }` ensures the section is legible if the image 404s.

**Film-grain overlay:** `.hero__grain` is `position: absolute; inset: 0; pointer-events: none`. It applies an SVG `feTurbulence` filter defined once in the document's `<defs>` block:
```xml
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  <defs>
    <filter id="grain-filter" x="0%" y="0%" width="100%" height="100%"
            color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3"
                    stitchTiles="stitch" result="noise"/>
      <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
      <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" result="blended"/>
      <feComposite in="blended" in2="SourceGraphic" operator="in"/>
    </filter>
  </defs>
</svg>
```
The `.hero__grain` element uses `filter: url(#grain-filter); opacity: 0.12` (within the 0.08–0.20 range defined in the requirements).

**Typography:**
- `.hero__title` — Playfair Display; `font-size: clamp(36px, 5vw, 64px)` (meets ≥56px at ≥1280px, ≥44px at 769–1279px, ≥36px at ≤768px)
- `.hero__tagline` — DM Sans; max 80 characters; `color: var(--color-text-primary)`, min 12px gap below title

**CTA Button:** `.hero__cta` — minimum 44×44px tap target; smooth-scroll to `#gallery` via JS click handler.

---

### 3. About Section

**Markup:** `<section id="about" aria-labelledby="about-heading">`

**Structure:**
- Two-column layout on desktop (image left, text right); single column on mobile (image stacked above text).
- Image wrapped in `.about__image-wrapper` which applies the same `#grain-filter` SVG filter at `opacity: 0.12`.
- Text block contains: `<h2>` heading, brand narrative paragraph (1–200 words), location string "Solo, Indonesia", and contact method (WhatsApp link or Instagram handle).
- If image fails to load, the wrapper shows a colored placeholder via CSS `background-color: var(--color-bg-secondary)`.

---

### 4. Gallery Section

**Markup:** `<section id="gallery" aria-labelledby="gallery-heading">`

#### 4a. FilterBar

```html
<div class="filter-bar" role="group" aria-label="Filter by category">
  <button class="filter-btn filter-btn--active" data-filter="all">All</button>
  <button class="filter-btn" data-filter="roses">Roses</button>
  <button class="filter-btn" data-filter="tulips">Tulips</button>
  <button class="filter-btn" data-filter="bouquets">Bouquets</button>
  <button class="filter-btn" data-filter="wedding">Wedding</button>
  <button class="filter-btn" data-filter="seasonal">Seasonal</button>
</div>
```

- Active button: `background-color: var(--color-accent)` + `color: var(--color-bg-primary)`.
- Click handler calls `applyFilter(category)`.

#### 4b. ProductCard Grid

```html
<div class="gallery__grid" id="gallery-grid">
  <!-- cards injected by JS renderGallery() -->
</div>
```

Grid layout:
```css
.gallery__grid {
  display: grid;
  grid-template-columns: 1fr;                  /* mobile */
  gap: 1.5rem;
}
@media (min-width: 768px)  { grid-template-columns: repeat(2, 1fr); }
@media (min-width: 1280px) { grid-template-columns: repeat(3, 1fr); }
```

Each `<article class="product-card" data-category="roses">` rendered by JS:
```html
<article class="product-card" data-category="{category}">
  <div class="product-card__image-wrapper">
    <img src="images/{slug}.jpg" alt="{alt}" loading="lazy" class="product-card__img" />
  </div>
  <div class="product-card__body">
    <h3 class="product-card__name">{name}</h3>
    <p  class="product-card__desc">{description}</p>
    <p  class="product-card__price">{price}</p>
    <a  class="cta-button product-card__cta"
        href="{waUrl}" target="_blank" rel="noopener noreferrer">Order</a>
  </div>
</article>
```

**Hover lift effect:**
```css
.product-card {
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
}
```

**Filter animation:**
```css
.product-card {
  transition: opacity 300ms ease, transform 300ms ease;
}
.product-card--hidden {
  opacity: 0;
  transform: scale(0.96);
  pointer-events: none;
  position: absolute;   /* removed from flow without layout jump */
}
```

Cards that remain visible after a filter change are not re-animated because the CSS transition only triggers when the class is added or removed.

**Empty state:** When `applyFilter` finds zero matching cards, it renders a `<p class="gallery__empty">No products available in this category.</p>` inside the grid and keeps the FilterBar visible.

**JS interface:**
```js
renderGallery()          // called once on DOMContentLoaded
applyFilter(category)    // called on filter button click
```

---

### 5. CTA Banner Section

**Markup:** `<section id="cta" aria-labelledby="cta-heading">`

Full-width accent band with a short headline and a centered CTA button linking to WhatsApp (`https://wa.me/{phone}?text={encoded}`), opening in a new tab.

---

### 6. Testimonials Section

**Markup:** `<section id="testimonials" aria-labelledby="testimonials-heading">`

Static cards with quote text, customer name, and a decorative quotation mark. No dynamic behavior.

---

### 7. Footer

**Markup:** `<footer role="contentinfo">`

Contains:
- Shop name
- Physical address (Solo, Indonesia)
- Operating hours — format: "Day(s) HH:MM–HH:MM"
- Social media link(s) with visible label
- Copyright notice: `© {currentYear} Syaflower. All rights reserved.`

The year is injected by JS on load:
```js
document.getElementById('footer-year').textContent = new Date().getFullYear();
```

---

## Data Models

### Product

The complete product catalog is a static array declared at the top of the `<script>` block:

```js
/** @type {Product[]} */
const PRODUCTS = [
  {
    id: 'roses-classic',
    name: 'Classic Red Roses',
    category: 'roses',           // must match a data-filter value on a FilterBar button
    description: 'Timeless red roses, hand-selected for freshness.',  // ≤80 chars
    priceIDR: 150000,            // stored as integer (IDR, no decimals)
    imageSrc: 'images/roses-classic.jpg',
    imageAlt: 'A bouquet of classic red roses wrapped in kraft paper',
    waMessage: 'Hi, I want to order Classic Red Roses (Rp 150.000)'
  },
  // … additional entries
];
```

**Type definition (JSDoc):**
```js
/**
 * @typedef {Object} Product
 * @property {string}  id          - URL-safe unique slug
 * @property {string}  name        - Display name
 * @property {string}  category    - Matches a Filter_Bar data-filter value
 * @property {string}  description - ≤80 characters
 * @property {number}  priceIDR    - Price in IDR as integer
 * @property {string}  imageSrc    - Relative path to product image
 * @property {string}  imageAlt    - Non-empty alt text, 1–125 chars
 * @property {string}  waMessage   - Pre-filled WhatsApp message text
 */
```

### Price Formatting

Price is stored as a plain integer (e.g., `150000`). A utility function converts to display format:

```js
/**
 * Formats an IDR integer to "Rp X.XXX" with thousand-separator dots.
 * @param {number} amount
 * @returns {string}  e.g. formatIDR(150000) → "Rp 150.000"
 */
function formatIDR(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}
```

### WhatsApp URL Construction

```js
/**
 * Builds a wa.me deep-link URL.
 * @param {string} phone   - E.164 digits only, e.g. "6281234567890"
 * @param {string} message - Pre-filled message text
 * @returns {string}
 */
function buildWaUrl(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
```

`SHOP_PHONE` is declared as a module-level constant at the top of the script block.

### CSS Custom Properties (Design Tokens)

```css
:root {
  /* Color palette */
  --color-bg-primary:    #1B3A4B;  /* deep teal — primary backgrounds */
  --color-bg-secondary:  #FDF8F0;  /* warm ivory — card/surface backgrounds */
  --color-text-primary:  #F5EFE6;  /* cream — primary text */
  --color-accent:        #7B8FA1;  /* soft blue-berry — accents, active states */

  /* Typography */
  --font-serif:  'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-sans:   'DM Sans', system-ui, -apple-system, sans-serif;

  /* Spacing */
  --section-padding-v: clamp(3rem, 8vw, 6rem);
  --section-padding-h: clamp(1rem, 5vw, 4rem);

  /* Transitions */
  --transition-fast:   150ms ease;
  --transition-normal: 300ms ease;
}
```

### Application State

All runtime state is minimal and kept in JS variables:

```js
let activeFilter = 'all';   // currently active gallery filter category
// Mobile menu open/closed state is represented solely by the presence of
// class `navbar--menu-open` on <header> — no separate JS variable needed.
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Gallery filter shows only matching cards

*For any* product catalog and any selected category (other than "all"), every product card visible after `applyFilter` is called SHALL have a `data-category` attribute that exactly matches the selected category string, and every product card with a non-matching category SHALL be hidden (i.e., carry the `product-card--hidden` class).

**Validates: Requirements 5.3**

---

### Property 2: "All" filter reveals every card

*For any* product catalog, after `applyFilter('all')` is called, every product card in the gallery grid SHALL be visible (i.e., NOT carry the `product-card--hidden` class), regardless of its `data-category` value.

**Validates: Requirements 5.4**

---

### Property 3: Active filter button is exclusively highlighted

*For any* category selection, exactly one filter button — the one whose `data-filter` attribute matches `activeFilter` — SHALL carry the `filter-btn--active` class, and no other filter button SHALL carry that class.

**Validates: Requirements 5.5**

---

### Property 4: Price formatting round-trip

*For any* non-negative integer IDR amount, `formatIDR(amount)` SHALL produce a string that begins with "Rp " followed by the amount expressed with thousand-separator dots and no decimal places, such that parsing the numeric portion back recovers the original integer.

**Validates: Requirements 5.7**

---

### Property 5: WhatsApp URL encodes all characters

*For any* WhatsApp message string (including strings with special characters, spaces, ampersands, and non-ASCII characters), `buildWaUrl(phone, message)` SHALL produce a URL in which the query parameter `text` is percent-encoded such that `decodeURIComponent` applied to the parameter value recovers the original message string exactly.

**Validates: Requirements 7.7**

---

### Property 6: Alt text length invariant

*For any* product in the `PRODUCTS` array, the `imageAlt` property SHALL be a non-empty string of length between 1 and 125 characters inclusive, and the `description` property SHALL be a non-empty string of no more than 80 characters.

**Validates: Requirements 5.7, 9.2**

---

## Error Handling

### Font Loading Failure

**Scenario:** Google Fonts CDN is unreachable or the font file fails to load within 3 seconds.

**Handling:** CSS font stacks include explicit fallbacks for both families:
```css
--font-serif: 'Playfair Display', Georgia, 'Times New Roman', serif;
--font-sans:  'DM Sans', system-ui, -apple-system, sans-serif;
```
`font-display: swap` is specified in the Google Fonts URL query parameter (`&display=swap`). Text renders immediately in the fallback font and swaps in the web font once loaded, ensuring no invisible or unstyled text.

### Hero Image Load Failure

**Scenario:** `images/hero.jpg` returns a 404 or fails to load.

**Handling:** `.hero__bg-image` has `background-color: var(--color-bg-primary)`. Because the color is defined independently of the image, the section retains its deep-teal background, keeping all text and the CTA button legible.

### About Image Load Failure

**Scenario:** `images/about.jpg` fails to load.

**Handling:** The image element is wrapped in `.about__image-wrapper` with `background-color: var(--color-bg-secondary)`, providing a visible cream-colored placeholder. The grain overlay, brand narrative, and contact info continue to render normally around it.

### Gallery Image Load Failure

**Scenario:** A product image fails to load.

**Handling:** `<img>` elements include `alt` text that is displayed by the browser's native broken-image fallback. The `.product-card__image-wrapper` also has a `background-color: var(--color-bg-secondary)` so the card remains structurally sound. The Order CTA button remains functional.

### Empty Filter Results

**Scenario:** A category filter is applied but no products match.

**Handling:** `applyFilter` detects zero visible cards after hiding non-matches. It injects a `<p class="gallery__empty">` message: "No products available in this category." The FilterBar stays visible with the active filter highlighted, satisfying Requirement 5.9.

### JS Execution Failure

**Scenario:** The `<script>` block throws an uncaught error (e.g., malformed `PRODUCTS` entry).

**Handling:** All HTML sections are authored directly in `<body>` (no server-side rendering step). The Navbar, Hero, About, and Footer render from static HTML regardless of JS status. Gallery cards that fail to render from the JS loop will leave an empty grid, but the rest of the page remains intact and scrollable. A `try/catch` wrapper around `renderGallery()` prevents a single bad product entry from stopping the entire render loop.

### Section Load Failure

**Scenario:** Per Requirement 1.5 — one or more sections fail to render.

**Handling:** Because all sections are static HTML parsed by the browser from a single file, partial section failure is limited to JS-injected content (gallery cards). The static-HTML sections (Hero, About, Footer, etc.) either render fully or not at all. An `onerror` handler on the `<script>` tag can surface a banner message if the script itself fails to parse.

---

## Testing Strategy

This feature is a static HTML/CSS/JS SPA with no server-side logic, no database, and no build pipeline. The testing strategy reflects this: tests are lightweight and run directly in the browser or a headless browser environment.

### Unit Tests (Example-Based)

Implemented using a minimal test harness (or Vitest if the developer opts to add it locally as a dev-only tool, without impacting the production deliverable):

| Function | Test cases |
|---|---|
| `formatIDR(amount)` | `0 → "Rp 0"`, `1000 → "Rp 1.000"`, `150000 → "Rp 150.000"`, `1500000 → "Rp 1.500.000"` |
| `buildWaUrl(phone, msg)` | Correct base URL, `text` param is percent-encoded, non-ASCII chars encoded |
| `applyFilter(category)` | Known catalog → cards shown/hidden match expected set; "all" shows all; unknown category shows zero cards + empty message |
| `renderGallery()` | DOM contains correct number of `<article>` elements; each has `data-category`; images have `loading="lazy"` and non-empty `alt` |

### Property-Based Tests

Implemented using [fast-check](https://fast-check.dev/) (JavaScript) targeting the pure utility functions and gallery filter logic, which have well-defined input/output behavior independent of the DOM.

**Tag format: `Feature: syaflower-shop, Property {N}: {property_text}`**

| Property | Generator strategy | Framework |
|---|---|---|
| Property 4: Price formatting round-trip | `fc.integer({ min: 0, max: 999_999_999 })` | fast-check, 100 runs |
| Property 5: WhatsApp URL encoding | `fc.string()` (any Unicode string) as message | fast-check, 100 runs |
| Property 6: Alt text length invariant | Iterate over static `PRODUCTS` array (all entries, not random) | deterministic check |

DOM-bound properties (1, 2, 3) are verified via integration tests rather than property tests, because their correctness depends on DOM state, not a pure function.

### Integration Tests (Browser-Based)

Using [Playwright](https://playwright.dev/) for headless browser tests covering the interactive behaviors:

| Behavior | Test approach |
|---|---|
| Gallery filter shows only matching cards (Property 1) | Click each filter button; assert `querySelectorAll('.product-card:not(.product-card--hidden)')` only contains cards with matching `data-category` |
| "All" filter reveals every card (Property 2) | Apply a non-"all" filter, then click "All"; assert no cards have `product-card--hidden` |
| Active filter button exclusively highlighted (Property 3) | After each click, assert exactly one `.filter-btn--active` exists and it matches the clicked button |
| Navbar scrolls to scrolled state | Scroll past hero sentinel; assert `navbar--scrolled` class is present on header |
| Hamburger menu opens/closes | Click hamburger; assert `navbar--menu-open` is present; click again; assert absent |
| Smooth scroll CTA | Click Hero CTA; assert page scroll position ≥ gallery section offsetTop |
| WhatsApp link opens new tab | Assert `target="_blank"` and `rel="noopener noreferrer"` on all CTA anchors linking to `wa.me` |
| Lazy loading attribute | Assert all non-hero `<img>` elements have `loading="lazy"` |
| Responsive layout | Test at 320px, 768px, 1280px viewport widths; assert no horizontal overflow |

### Accessibility Spot-Checks

Run against the final rendered page:

- **axe-core** (via Playwright `@axe-core/playwright`) for WCAG 2.1 AA automated checks — contrast ratios, ARIA roles, landmark structure, focus management.
- **Keyboard navigation** manual check: Tab through all interactive elements; assert visible focus indicators on all buttons and links.
- **Lighthouse** CI run in headless Chrome: Performance ≥ 75 on simulated mobile 4G.

### Visual Regression (Optional / Recommended)

Take baseline screenshots at 320px, 768px, and 1280px after initial implementation. Use Playwright's `toHaveScreenshot` for regression detection on subsequent changes.
