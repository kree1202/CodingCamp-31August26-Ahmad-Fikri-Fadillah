# Requirements Document

## Introduction

Syaflower Shop is a premium flower boutique based in Solo, Indonesia. This feature delivers a high-engagement, single-page web application (SPA) that showcases the shop's offerings through a moody, romantic, and cinematic visual identity inspired by 35mm analog film photography. The application pairs a soft blue-berry and cream color palette with deep teal backgrounds, elegant serif and clean sans-serif typography, and a filterable floral gallery — all designed to elevate the brand and drive customer conversions through clear Calls-to-Action.

---

## Glossary

- **Application**: The single-page web application for Syaflower Shop.
- **Hero_Section**: The full-viewport introductory section at the top of the Application featuring a background floral image.
- **Gallery**: The filterable grid of flower product cards displayed in the Application.
- **Filter_Bar**: The UI component containing category filter buttons above the Gallery.
- **CTA_Button**: A Call-to-Action button that prompts the user to take a desired action (e.g., order, contact, or shop now).
- **Color_Palette**: The defined set of brand colors — soft blue-berry (`#7B8FA1`), cream (`#F5EFE6`), deep teal (`#1B3A4B`), and warm ivory (`#FDF8F0`).
- **Cinematic_Grain**: A subtle film-grain visual texture applied over images to emulate 35mm analog photography.
- **Motion_Blur_Effect**: A gentle directional blur applied to the Hero_Section background image to suggest movement and depth.
- **Serif_Font**: An elegant serif typeface (e.g., Playfair Display) used for headings and display text.
- **Sans_Serif_Font**: A clean sans-serif typeface (e.g., Inter or DM Sans) used for body text, labels, and navigation.
- **Category**: A named grouping of flower products (e.g., Roses, Tulips, Bouquets, Wedding, Seasonal).
- **Product_Card**: A visual tile in the Gallery displaying a flower image, name, price, and a CTA_Button.
- **Navbar**: The top navigation bar containing the shop logo, navigation links, and a contact/order CTA_Button.
- **Footer**: The bottom section of the Application containing shop address, social media links, and copyright information.

---

## Requirements

### Requirement 1: Single-Page Application Structure

**User Story:** As a visitor, I want the entire Syaflower Shop experience on a single, scrollable page, so that I can explore the shop without navigating away or waiting for additional page loads.

#### Acceptance Criteria

1. THE Application SHALL render all primary sections — Navbar, Hero_Section, About, Gallery, Testimonials, and Footer — within a single HTML document.
2. WHEN a user clicks a Navbar link, THE Application SHALL smoothly scroll to the corresponding section without a full page reload, completing the scroll animation within 800 milliseconds.
3. THE Application SHALL adapt its layout for viewport widths of 320px (mobile), 768px (tablet), and 1280px or wider (desktop), such that no content is clipped, horizontally overflowed, or requires horizontal scrolling at any of those three widths.
4. WHEN the Application finishes loading, THE Application SHALL display the Hero_Section as the first visible content within the viewport, with all other sections positioned below the visible area.
5. IF the Application fails to load one or more sections, THEN THE Application SHALL display the successfully loaded sections and show an error message indicating which section failed to load, without preventing the user from scrolling to the available sections.

---

### Requirement 2: Cinematic Visual Identity & Color Palette

**User Story:** As a visitor, I want the shop's website to feel moody, romantic, and cinematic, so that I immediately understand the premium, artistic nature of the brand.

#### Acceptance Criteria

1. THE Application SHALL apply the Color_Palette consistently across all sections, using deep teal (`#1B3A4B`) as the primary background, cream (`#F5EFE6`) as the primary text color, soft blue-berry (`#7B8FA1`) as the accent color, and warm ivory (`#FDF8F0`) for card and secondary surface backgrounds, with no section deviating to an unlisted background or text color.
2. THE Application SHALL render all heading elements (h1 through h6) using the Serif_Font at a minimum font-weight of 400, with no heading rendered in a sans-serif or system fallback font when the Serif_Font has loaded successfully.
3. THE Application SHALL render all body text, navigation links, labels, and button text using the Sans_Serif_Font, with no such element rendered using the Serif_Font or a system fallback font when the Sans_Serif_Font has loaded successfully.
4. THE Application SHALL load both the Serif_Font and Sans_Serif_Font from a reliable font service and SHALL define at least one system-font fallback per font family in the CSS font stack, such that text remains readable if the remote font fails to load within 3 seconds.
5. WHERE a section requires visual separation, THE Application SHALL use either a color-block background change or a divider line no thicker than 1px colored with the accent color (`#7B8FA1`), with no hard borders (solid lines thicker than 1px or using colors outside the Color_Palette) used for section separation.
6. IF the Serif_Font or Sans_Serif_Font fails to load within 3 seconds, THEN THE Application SHALL display all text using the defined system-font fallback from the CSS font stack without any text becoming invisible or unstyled.

---

### Requirement 3: Hero Section with Analog Film Aesthetic

**User Story:** As a visitor, I want an immersive, full-screen hero section that feels like a cinematic film still, so that I am emotionally drawn in from the first moment.

#### Acceptance Criteria

1. THE Hero_Section SHALL occupy 100% of the viewport height (100vh) and 100% of the viewport width (100vw) on initial page load, with no visible overflow or scrollbar caused by the section itself.
2. THE Hero_Section SHALL display a background image of a floral arrangement that covers the entire section without distortion (CSS `object-fit: cover` behavior), centered on the image focal point, and the image SHALL have a minimum resolution of 1280×720 pixels.
3. THE Hero_Section background image SHALL have a Cinematic_Grain overlay rendered as a semi-transparent CSS or SVG texture layer with an opacity between 0.08 and 0.20, placed above the background image and below all text and interactive elements.
4. THE Hero_Section background image SHALL have a Motion_Blur_Effect applied using a CSS filter or animation that simulates a horizontal or radial blur with a blur radius between 1px and 4px, and this effect SHALL NOT be applied to text or interactive elements within the Hero_Section.
5. THE Hero_Section SHALL display the shop name "Syaflower" in the Serif_Font at a font size of at least 56px on viewports with width ≥1280px and at least 36px on viewports with width ≤768px, and at least 44px on viewports with width between 769px and 1279px.
6. THE Hero_Section SHALL display a tagline in the Sans_Serif_Font with a maximum length of 80 characters in the cream color, positioned below the shop name with a minimum vertical spacing of 12px between the two text elements.
7. THE Hero_Section SHALL include at least one CTA_Button labeled with a visible text between 6 and 20 characters (e.g., "Shop Now" or "Order Now") that is positioned within the Hero_Section and links to the Gallery section, with a minimum tap/click target size of 44×44px.
8. WHEN a user activates the CTA_Button in the Hero_Section, THE Application SHALL scroll the viewport to the Gallery section with a smooth scroll animation completing within 800 milliseconds.
9. IF the background image of the Hero_Section fails to load, THEN THE Hero_Section SHALL display a solid fallback background color from the defined color palette so that text and the CTA_Button remain legible.

---

### Requirement 4: Navigation Bar

**User Story:** As a visitor, I want a clear and elegant navigation bar, so that I can quickly jump to any section of the page.

#### Acceptance Criteria

1. THE Navbar SHALL be fixed at the top of the viewport and SHALL remain visible during vertical page scrolling.
2. THE Navbar SHALL display the Syaflower Shop logo or wordmark on the left side and navigation links on the right side.
3. THE Navbar SHALL contain navigation links to at least the following sections: Home, Gallery, About, and Contact, where each link scrolls the viewport to the corresponding section when activated.
4. WHEN the user scrolls past the Hero_Section, THE Navbar SHALL transition from a fully transparent background to a semi-opaque deep teal background within 300 milliseconds to maintain readability.
5. THE Navbar SHALL include a CTA_Button labeled "Order Now" styled with the soft blue-berry accent color, positioned to the right of the navigation links.
6. WHEN the viewport width is 768px or narrower, THE Navbar SHALL hide the navigation links and CTA_Button and display a hamburger menu icon in their place.
7. WHEN a user taps the hamburger menu icon, THE Navbar SHALL expand a full-width dropdown or overlay displaying the navigation links and CTA_Button within 300 milliseconds.
8. WHEN the expanded mobile menu is open and the user taps a navigation link or taps outside the menu area, THE Navbar SHALL collapse the menu within 300 milliseconds.
9. IF the page is at the top of the viewport (scroll position 0), THEN THE Navbar SHALL revert to a fully transparent background within 300 milliseconds.

---

### Requirement 5: Filterable Flower Gallery

**User Story:** As a visitor, I want to browse and filter flowers by category, so that I can quickly find the arrangement type I'm interested in.

#### Acceptance Criteria

1. THE Gallery SHALL display Product_Cards in a CSS grid layout with a minimum of 3 columns on desktop (≥1280px), 2 columns on tablet (768px–1279px), and 1 column on mobile (≤767px).
2. THE Filter_Bar SHALL appear directly above the Gallery and SHALL contain at least the following category filter buttons: All, Roses, Tulips, Bouquets, Wedding, and Seasonal.
3. WHEN a user clicks a category filter button, THE Gallery SHALL display only the Product_Cards whose Category attribute exactly matches the selected category label, hiding all non-matching Product_Cards, without a page reload.
4. WHEN a user clicks the "All" filter button, THE Gallery SHALL display all available Product_Cards regardless of their Category attribute.
5. WHEN a filter is applied, THE Filter_Bar SHALL visually distinguish the active filter button from inactive buttons by applying the soft blue-berry accent color as its background or border, such that the active button is visually distinct from all other buttons.
6. WHEN the Gallery transitions between filtered states, THE Application SHALL animate each Product_Card entering or leaving the visible set using a fade or scale effect with a duration between 200ms and 400ms, and Product_Cards that remain visible SHALL not re-animate.
7. THE Product_Card SHALL display a flower image, flower name, a short description of no more than 80 characters, a price formatted as "Rp X.XXX" in Indonesian Rupiah (IDR) with thousand-separator dots and no decimal places, and a CTA_Button labeled either "Order" or "View Details".
8. WHEN a user hovers over a Product_Card on a pointer device, THE Product_Card SHALL apply a lift effect consisting of an increased box-shadow and a vertical translation of exactly -4px, completing the transition within 150ms.
9. IF the Gallery contains no Product_Cards matching the selected category filter, THEN THE Gallery SHALL display a message indicating that no products are available for that category, and THE Filter_Bar SHALL remain visible with the selected filter still highlighted.

---

### Requirement 6: About Section

**User Story:** As a visitor, I want to learn about Syaflower Shop's story and values, so that I can trust the brand and feel a connection to it.

#### Acceptance Criteria

1. THE Application SHALL include an About section containing the shop's name displayed as a visible heading, a brand narrative of 1 to 200 words, and at least one image with a minimum resolution of 400×400 pixels.
2. WHEN the About section is rendered, THE Application SHALL apply a Cinematic_Grain overlay to the About section image using the same grain texture, opacity level, and blending mode as used in the Hero_Section.
3. THE About section SHALL display the shop's physical location as a text string identifying Solo, Indonesia, and at least one contact method, where the contact method is either a phone number in a valid Indonesian format (e.g., starting with +62 or 0, 8–13 digits) or an Instagram handle beginning with the "@" character.
4. IF the About section image fails to load, THEN THE Application SHALL display a visible placeholder in place of the image while still rendering the Cinematic_Grain overlay, brand narrative, and contact information without interruption.

---

### Requirement 7: Call-to-Action Placement

**User Story:** As a visitor, I want clear and accessible calls-to-action throughout the page, so that I can easily initiate an order or inquiry at any point.

#### Acceptance Criteria

1. THE Application SHALL contain at least one CTA_Button in each of the following sections: Hero_Section, Gallery section, and either a dedicated CTA banner section or the Footer, for a minimum total of three CTA_Buttons.
2. THE CTA_Button SHALL have a minimum touch target size of 44px × 44px to meet accessibility guidelines.
3. THE CTA_Button SHALL use a background color from the Color_Palette.
4. THE CTA_Button SHALL have a contrast ratio of at least 4.5:1 between its label text color and its background color, as defined by WCAG 2.1 AA.
5. WHEN a user hovers over a CTA_Button on a pointer device, THE CTA_Button SHALL apply a perceptible visual change within 150ms, consisting of either a background color shift that changes the contrast ratio by at least 1.5:1 relative to the default state, or a solid border of at least 2px applied to the button boundary.
6. WHEN a keyboard user focuses a CTA_Button using the Tab key, THE CTA_Button SHALL display a visible focus outline of at least 2px within 150ms.
7. WHERE the shop uses WhatsApp or a direct messaging platform for orders, THE CTA_Button SHALL open a pre-filled message URL that includes at minimum the shop's contact identifier (e.g., phone number or username) in a new browser tab.

---

### Requirement 8: Footer

**User Story:** As a visitor, I want a well-structured footer with essential shop information, so that I can find contact details and social links without scrolling back up.

#### Acceptance Criteria

1. THE Footer SHALL display the shop name, a physical address located in Solo, Indonesia, operating hours in the format "Day(s) HH:MM–HH:MM" (e.g., "Mon–Sat 09:00–18:00"), and at least one social media link with a visible label and a URL that navigates to the shop's external profile page.
2. THE Footer SHALL display a copyright notice in the format "© [Year] Syaflower. All rights reserved.", where [Year] reflects the current calendar year.
3. THE Footer SHALL apply the deep teal background color and cream text color as defined in the Color_Palette to all footer content, such that no footer text is rendered in any color outside the Color_Palette's defined cream value.

---

### Requirement 9: Performance & Accessibility

**User Story:** As a visitor on a mobile device with a mid-range internet connection, I want the page to load quickly and be usable, so that I can browse without frustration.

#### Acceptance Criteria

1. THE Application SHALL lazy-load all Gallery images and non-Hero_Section images so that images outside the initial viewport are not fetched until they are within 200 pixels of the visible area.
2. THE Application SHALL include descriptive `alt` text of 1 to 125 characters on all `<img>` elements, where decorative images use an empty `alt=""` attribute and all other images use a non-empty string that describes the image content.
3. THE Application SHALL use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`) to convey document structure, with no more than one `<main>` element per page and each `<section>` containing a heading element.
4. WHEN a keyboard user navigates the Application using the Tab key, THE Application SHALL display a visible focus indicator on all interactive elements (links, buttons, inputs) with a minimum contrast ratio of 3:1 between the focus indicator color and the adjacent background color.
5. THE Application SHALL achieve a Google Lighthouse Performance score of 75 or higher when tested on a simulated mobile device with a 4G network throttle applied in Lighthouse's default mobile configuration.
6. IF the Google Lighthouse Performance score falls below 75 during testing, THEN THE Application SHALL be considered non-compliant and the score along with the failing audit items SHALL be reported to the developer.
7. WHEN the Application is loaded on a mobile device viewport of 320px to 768px width, THE Application SHALL render all interactive elements with a minimum touch target size of 44 by 44 CSS pixels.
