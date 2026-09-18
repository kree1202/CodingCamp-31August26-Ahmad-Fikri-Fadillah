# Implementation Plan: Syaflower Shop

## Overview

Build the complete Syaflower Shop single-page web application as a single `index.html` file with embedded CSS and JavaScript. The implementation proceeds from scaffold → global styles → section by section (top to bottom of the page) → utility functions → integration → testing.

---

## Tasks

- [x] 1. Project scaffold — `index.html` skeleton, design tokens, Google Fonts, SVG grain filter
  - Create `index.html` with valid HTML5 doctype, `<head>`, and semantic `<body>` skeleton (`<header>`, `<main>`, `<footer>`, one `<main>` element only)
  - Add Google Fonts preconnect + stylesheet `<link>` tags for Playfair Display (400, 700) and DM Sans (400, 500) with `&display=swap`
  - Define all CSS custom properties inside `:root`: `--color-bg-primary`, `--color-bg-secondary`, `--color-text-primary`, `--color-accent`, `--font-serif`, `--font-sans`, `--section-padding-v`, `--section-padding-h`, `--transition-fast`, `--transition-normal`
  - Add the hidden `<svg>` block with `<defs>` containing the `#grain-filter` SVG filter (`feTurbulence`, `feColorMatrix`, `feBlend`, `feComposite`)
  - Set up global `box-sizing: border-box`, `margin: 0`, `padding: 0` reset, and `scroll-behavior: smooth` on `<html>`
  - Create `images/` directory placeholder (add a `README` note or `.gitkeep`)
  - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4, 2.6_

- [x] 2. Utility functions and product data
  - [x] 2.1 Implement `formatIDR(amount)` utility function
    - Declare function inside `<script>` block
    - Use `amount.toLocaleString('id-ID')` and prepend `'Rp '`
    - _Requirements: 5.7_

  - [x] 2.2 Write property test for `formatIDR` (Property 4)
    - Use fast-check: `fc.integer({ min: 0, max: 999_999_999 })`
    - Assert output starts with `"Rp "` and numeric portion round-trips back to original integer
    - **Property 4: Price formatting round-trip**
    - **Validates: Requirements 5.7**

  - [x] 2.3 Implement `buildWaUrl(phone, message)` utility function
    - Declare `SHOP_PHONE` constant at top of script block
    - Return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    - _Requirements: 7.7_

  - [x] 2.4 Write property test for `buildWaUrl` (Property 5)
    - Use fast-check: `fc.string()` as message
    - Assert `decodeURIComponent` of the `text` query param recovers the original message
    - **Property 5: WhatsApp URL encodes all characters**
    - **Validates: Requirements 7.7**

  - [x] 2.5 Declare the `PRODUCTS` static array with JSDoc `@typedef`
    - Define `Product` typedef with all required fields: `id`, `name`, `category`, `description` (≤80 chars), `priceIDR`, `imageSrc`, `imageAlt` (1–125 chars), `waMessage`
    - Seed the array with at least 6 representative product entries covering all 5 categories (Roses, Tulips, Bouquets, Wedding, Seasonal)
    - _Requirements: 5.1, 5.2, 5.7, 9.2_

  - [x] 2.6 Write deterministic check for alt text and description length invariant (Property 6)
    - Iterate all `PRODUCTS` entries
    - Assert `imageAlt.length >= 1 && imageAlt.length <= 125`
    - Assert `description.length >= 1 && description.length <= 80`
    - **Property 6: Alt text length invariant**
    - **Validates: Requirements 5.7, 9.2**

- [~] 3. Checkpoint — utility functions baseline
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Navbar component
  - [x] 4.1 Author Navbar HTML markup
    - Write `<header class="navbar" role="banner">` with logo/wordmark `<span>` or `<a>` on the left
    - Add `<nav>` with links to `#hero`, `#gallery`, `#about`, `#contact` sections
    - Add CTA `<a class="cta-button navbar__cta" href="#gallery">Order Now</a>`
    - Add `<button class="navbar__hamburger" aria-label="Open menu" aria-expanded="false">` with hamburger SVG icon
    - Add `<div id="hero-sentinel" aria-hidden="true">` as the last child of `<section id="hero">` (positioned at section bottom)
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 4.6_

  - [x] 4.2 Write Navbar CSS
    - Fixed position (`position: fixed; top: 0; z-index: 100; width: 100%`)
    - Default transparent background with `transition: background 300ms ease`
    - `.navbar--scrolled` rule: `background: rgba(27, 58, 75, 0.92)`
    - Desktop: show nav links + CTA, hide hamburger
    - Mobile (≤768px): hide nav links + CTA, show hamburger; `.navbar--menu-open` shows dropdown
    - _Requirements: 4.1, 4.4, 4.6, 4.7, 4.8, 4.9_

  - [x] 4.3 Implement `initNavbar()` JavaScript function
    - `IntersectionObserver` on `#hero-sentinel`: add/remove `navbar--scrolled` class on `<header>`
    - Hamburger click handler: toggle `navbar--menu-open` on `<header>`, flip `aria-expanded`
    - Mobile nav link click handler: remove `navbar--menu-open` + reset `aria-expanded`
    - Overlay/backdrop click handler to close mobile menu
    - Call `initNavbar()` inside `DOMContentLoaded`
    - _Requirements: 4.1, 4.4, 4.7, 4.8, 4.9_

- [x] 5. Hero section
  - [x] 5.1 Author Hero HTML markup
    - `<section id="hero" aria-label="Hero">` containing: `.hero__bg-image` (aria-hidden), `.hero__grain` (aria-hidden), `.hero__content` (h1 + tagline p + CTA anchor), `#hero-sentinel` (aria-hidden)
    - CTA anchor: `class="cta-button hero__cta"`, `href="#gallery"`, visible text 6–20 chars (e.g., "Shop Now")
    - _Requirements: 3.1, 3.5, 3.6, 3.7_

  - [x] 5.2 Write Hero CSS
    - Section: `height: 100vh; width: 100vw; overflow: hidden; position: relative`
    - `.hero__bg-image`: `position: absolute; inset: 0; background-image: url(images/hero.jpg); background-size: cover; background-position: center; filter: blur(2px); margin: -4px; background-color: var(--color-bg-primary)` (fallback)
    - `.hero__grain`: `position: absolute; inset: 0; filter: url(#grain-filter); opacity: 0.12; pointer-events: none`
    - `.hero__title`: `font-family: var(--font-serif); font-size: clamp(36px, 5vw, 64px)`
    - `.hero__tagline`: `font-family: var(--font-sans); margin-top: 12px` (min 12px gap)
    - `.hero__cta` / `.cta-button`: min `44px × 44px` tap target
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.9, 7.2_

  - [x] 5.3 Bind Hero CTA smooth-scroll handler
    - In `initNavbar()` or a dedicated `initHero()` call, attach click handler to `.hero__cta`
    - Handler calls `document.querySelector('#gallery').scrollIntoView({ behavior: 'smooth' })`
    - _Requirements: 3.8_

- [x] 6. About section
  - [x] 6.1 Author About HTML markup
    - `<section id="about" aria-labelledby="about-heading">`
    - Two-column inner wrapper: `.about__image-wrapper` (left) + `.about__text` (right)
    - Image: `<img src="images/about.jpg" alt="..." class="about__img" loading="lazy">` — non-empty alt, ≤125 chars
    - Text: `<h2 id="about-heading">`, brand narrative `<p>`, location string "Solo, Indonesia", contact method (`<a href="https://wa.me/...">` or `@instagram`)
    - _Requirements: 6.1, 6.3, 9.1, 9.2, 9.3_

  - [x] 6.2 Write About CSS
    - Desktop: two-column `display: grid; grid-template-columns: 1fr 1fr; gap: 2rem`
    - Mobile (≤768px): single column, image stacked above text
    - `.about__image-wrapper`: apply `filter: url(#grain-filter); opacity: 0.12` on wrapper or pseudo-element; `background-color: var(--color-bg-secondary)` as placeholder
    - _Requirements: 6.2, 6.4_

- [x] 7. Gallery section — Filter Bar
  - [x] 7.1 Author Filter Bar HTML markup
    - `<section id="gallery" aria-labelledby="gallery-heading">`
    - `<div class="filter-bar" role="group" aria-label="Filter by category">`
    - Six `<button>` elements with `data-filter` values: `all`, `roses`, `tulips`, `bouquets`, `wedding`, `seasonal`
    - First button (`all`) gets class `filter-btn--active` by default
    - Empty `<div class="gallery__grid" id="gallery-grid">` for JS-injected cards
    - _Requirements: 5.2, 5.5_

  - [x] 7.2 Write Gallery and Filter Bar CSS
    - `.gallery__grid`: `display: grid; grid-template-columns: 1fr; gap: 1.5rem` — mobile default
    - `@media (min-width: 768px)`: `grid-template-columns: repeat(2, 1fr)`
    - `@media (min-width: 1280px)`: `grid-template-columns: repeat(3, 1fr)`
    - `.filter-btn--active`: `background-color: var(--color-accent); color: var(--color-bg-primary)`
    - `.product-card`: hover lift — `transition: transform 150ms ease, box-shadow 150ms ease`; `:hover` — `transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.25)`
    - `.product-card--hidden`: `opacity: 0; transform: scale(0.96); pointer-events: none; position: absolute` with `transition: opacity 300ms ease, transform 300ms ease`
    - `.gallery__empty` empty-state message style
    - _Requirements: 5.1, 5.5, 5.6, 5.8, 5.9_

- [ ] 8. Gallery section — JS rendering and filtering
  - [x] 8.1 Implement `renderGallery()` function
    - Wrapped in `try/catch`; on catch, logs error and inserts fallback message in `#gallery-grid`
    - Iterates `PRODUCTS` array; for each entry builds `<article class="product-card" data-category="{category}">` with image (`loading="lazy"`, non-empty `alt`), h3 name, description `<p>`, formatted price using `formatIDR`, and Order CTA anchor using `buildWaUrl` (`target="_blank" rel="noopener noreferrer"`)
    - Call `renderGallery()` on `DOMContentLoaded`
    - _Requirements: 5.1, 5.7, 7.1, 7.7, 9.1, 9.2_

  - [x] 8.2 Implement `applyFilter(category)` function
    - Updates `activeFilter` variable
    - Toggles `filter-btn--active` class: removes from all buttons, adds to button whose `data-filter === category`
    - Toggles `product-card--hidden` class on each card based on whether `data-category` matches (or category is `'all'`)
    - If zero visible cards after filtering, injects `<p class="gallery__empty">No products available in this category.</p>` into grid; removes it otherwise
    - Binds click handlers to all `.filter-btn` buttons calling `applyFilter(this.dataset.filter)`
    - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.9_

  - [-] 8.3 Write integration test for gallery filter — matching cards only (Property 1)
    - Use Playwright; click each non-"all" filter button
    - Assert `querySelectorAll('.product-card:not(.product-card--hidden)')` contains only cards with matching `data-category`
    - **Property 1: Gallery filter shows only matching cards**
    - **Validates: Requirements 5.3**

  - [-] 8.4 Write integration test for "All" filter reveals every card (Property 2)
    - Apply a non-"all" filter, then click "All"
    - Assert zero cards carry `.product-card--hidden`
    - **Property 2: "All" filter reveals every card**
    - **Validates: Requirements 5.4**

  - [-] 8.5 Write integration test for active filter button exclusive highlight (Property 3)
    - After each filter click, assert exactly one `.filter-btn--active` exists and matches the clicked button
    - **Property 3: Active filter button is exclusively highlighted**
    - **Validates: Requirements 5.5**

- [~] 9. Checkpoint — gallery section fully operational
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. CTA Banner section
  - [x] 10.1 Author CTA Banner HTML markup
    - `<section id="cta" aria-labelledby="cta-heading">`
    - Short `<h2 id="cta-heading">` headline
    - `<a class="cta-button" href="{waUrl}" target="_blank" rel="noopener noreferrer">Order Now</a>` using `buildWaUrl`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.7_

  - [x] 10.2 Write CTA Banner CSS
    - Full-width accent band: `background-color: var(--color-accent)` (or deep teal); centered text and button
    - CTA button: min 44×44px tap target, hover state within 150ms
    - Focus outline: min 2px visible on keyboard focus
    - _Requirements: 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 11. Testimonials section
  - Author `<section id="testimonials" aria-labelledby="testimonials-heading">` with at least 3 static `<article>` quote cards
  - Each card: decorative quotation mark (`aria-hidden="true"`), quote `<blockquote>`, customer name `<cite>`
  - CSS: card grid (1-col mobile, 2–3 col desktop), deep teal background, cream text
  - _Requirements: 1.1, 2.1, 9.3_

- [x] 12. Footer component
  - [x] 12.1 Author Footer HTML markup
    - `<footer role="contentinfo">`
    - Shop name, physical address (Solo, Indonesia), operating hours (`Day(s) HH:MM–HH:MM` format)
    - Social media `<a>` link with visible label and external URL (`target="_blank" rel="noopener noreferrer"`)
    - Copyright: `© <span id="footer-year"></span> Syaflower. All rights reserved.`
    - _Requirements: 8.1, 8.2_

  - [x] 12.2 Write Footer CSS
    - `background-color: var(--color-bg-primary); color: var(--color-text-primary)` — no off-palette colors
    - Responsive multi-column layout collapses to single column on mobile
    - _Requirements: 8.3_

  - [x] 12.3 Inject dynamic copyright year
    - `document.getElementById('footer-year').textContent = new Date().getFullYear();`
    - Called on `DOMContentLoaded`
    - _Requirements: 8.2_

- [x] 13. Accessibility pass
  - [x] 13.1 Audit and fix semantic HTML5 structure
    - Verify exactly one `<main>` element; all `<section>` elements have a heading child; `<header>`, `<nav>`, `<footer>`, `<article>` used appropriately
    - _Requirements: 9.3_

  - [x] 13.2 Add ARIA labels and focus indicators to all interactive elements
    - All `<button>` and `<a>` elements have discernible text or `aria-label`
    - CSS `:focus-visible` rule: min 2px outline on all interactive elements, contrast ratio ≥3:1 against adjacent background
    - Hamburger button: `aria-expanded` toggled correctly by JS (already in 4.3, confirm here)
    - Filter Bar: `role="group"` + `aria-label` confirmed
    - All CTA anchors: `target="_blank"` anchors include `rel="noopener noreferrer"`
    - _Requirements: 7.6, 9.4_

  - [x] 13.3 Verify touch target sizes throughout
    - All interactive elements (buttons, links) have min `44×44px` hit area via CSS `min-height`/`min-width` or `padding`
    - _Requirements: 7.2, 9.7_

- [ ] 14. Performance and responsive polish
  - [x] 14.1 Confirm native lazy-loading on all non-hero `<img>` elements
    - All `<img>` outside Hero have `loading="lazy"` attribute
    - Hero `<img>` (if any) does NOT have `loading="lazy"` (or has `loading="eager"`)
    - _Requirements: 9.1_

  - [-] 14.2 Verify font-display swap and font fallback stacks
    - Google Fonts URL includes `&display=swap`
    - `--font-serif` CSS variable includes `Georgia, 'Times New Roman', serif` fallbacks
    - `--font-sans` CSS variable includes `system-ui, -apple-system, sans-serif` fallbacks
    - _Requirements: 2.4, 2.6_

  - [-] 14.3 Responsive QA — fix any horizontal overflow at 320px, 768px, 1280px
    - Add `overflow-x: hidden` on `<body>` and `<html>` as safety net
    - Test each section at all three breakpoints; adjust `clamp()` values or media queries as needed
    - _Requirements: 1.3_

- [ ] 15. Error handling integration
  - [~] 15.1 Add image fallback backgrounds via CSS
    - `.hero__bg-image`, `.about__image-wrapper`, `.product-card__image-wrapper` all have `background-color` fallback defined
    - Confirm `<img>` alt texts are non-empty so browsers show meaningful broken-image fallback
    - _Requirements: 3.9, 6.4_

  - [~] 15.2 Wrap `renderGallery()` in try/catch
    - On error, insert `<p class="gallery__empty">Unable to load products. Please refresh.</p>` in `#gallery-grid`
    - Confirm static sections (Hero, About, Footer) still render regardless of JS failure
    - _Requirements: 1.5_

- [~] 16. Final checkpoint — full page review
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- The `PRODUCTS` array in task 2.5 must be populated with real content before final delivery
- Property tests (tasks 2.2, 2.4, 2.6) target pure JS utility functions; integration tests (8.3–8.5) require Playwright
- No build tooling is introduced; fast-check and Playwright are dev-only test dependencies that do not affect the production `index.html`
- Checkpoints at tasks 3, 9, and 16 validate incremental correctness before moving to the next phase

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.3", "2.5"] },
    { "id": 2, "tasks": ["2.2", "2.4", "2.6", "4.1", "5.1", "6.1", "7.1", "10.1", "12.1"] },
    { "id": 3, "tasks": ["4.2", "4.3", "5.2", "5.3", "6.2", "7.2", "8.1", "10.2", "11", "12.2", "12.3"] },
    { "id": 4, "tasks": ["8.2", "13.1", "13.2", "13.3"] },
    { "id": 5, "tasks": ["8.3", "8.4", "8.5", "14.1", "14.2", "14.3"] },
    { "id": 6, "tasks": ["15.1", "15.2"] }
  ]
}
```
