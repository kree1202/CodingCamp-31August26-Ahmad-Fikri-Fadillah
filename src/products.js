/**
 * Static product catalog for Syaflower Shop.
 *
 * This module exports the PRODUCTS array so it can be consumed by both the
 * inline <script> in index.html (via a copy) and by unit/property tests without
 * any DOM dependency.
 *
 * @typedef {Object} Product
 * @property {string} id          - URL-safe unique slug
 * @property {string} name        - Display name
 * @property {string} category    - Matches a FilterBar data-filter value
 * @property {string} description - ≤80 characters
 * @property {number} priceIDR    - Price in IDR as integer
 * @property {string} imageSrc    - Relative path to product image
 * @property {string} imageAlt    - Non-empty alt text, 1–125 chars
 * @property {string} waMessage   - Pre-filled WhatsApp message text
 */

/** @type {Product[]} */
export const PRODUCTS = [
  {
    id: 'roses-classic',
    name: 'Classic Red Roses',
    category: 'roses',
    description: 'Mawar merah pilihan, segar dan harum — cocok untuk hadiah spesial.',
    priceIDR: 150000,
    imageSrc: 'images/roses-classic.jpg',
    imageAlt: 'Seikat mawar merah klasik dibungkus kertas kraft cokelat',
    waMessage: 'Halo, saya ingin memesan Classic Red Roses (Rp 150.000)'
  },
  {
    id: 'roses-pink-garden',
    name: 'Pink Garden Roses',
    category: 'roses',
    description: 'Mawar garden pink lembut dengan aroma khas, elegan dan romantis.',
    priceIDR: 175000,
    imageSrc: 'images/1789762651296.png',
    imageAlt: 'Seikat mawar garden berwarna merah muda dalam vas kaca bening',
    waMessage: 'Halo, saya ingin memesan Pink Garden Roses (Rp 175.000)'
  },
  {
    id: 'tulips-spring',
    name: 'Spring Tulips',
    category: 'tulips',
    description: 'Tulip segar aneka warna, simbol musim semi yang ceria.',
    priceIDR: 200000,
    imageSrc: 'images/tulips-spring.jpg',
    imageAlt: 'Seikat tulip warna-warni merah, kuning, dan ungu diikat pita putih',
    waMessage: 'Halo, saya ingin memesan Spring Tulips (Rp 200.000)'
  },
  {
    id: 'bouquet-mixed-pastel',
    name: 'Mixed Pastel Bouquet',
    category: 'bouquets',
    description: 'Rangkaian bunga pastel campuran — mawar, lisiantus, dan baby breath.',
    priceIDR: 250000,
    imageSrc: 'images/bouquet-mixed-pastel.jpg',
    imageAlt: 'Buket campuran bunga pastel dengan hiasan baby breath dan dedaunan hijau',
    waMessage: 'Halo, saya ingin memesan Mixed Pastel Bouquet (Rp 250.000)'
  },
  {
    id: 'bouquet-sunflower',
    name: 'Sunflower Bouquet',
    category: 'bouquets',
    description: 'Buket bunga matahari cerah — hadiah sempurna untuk hari ulang tahun.',
    priceIDR: 220000,
    imageSrc: 'images/bouquet-sunflower.jpg',
    imageAlt: 'Buket bunga matahari besar dibungkus kertas kraft dengan pita kuning',
    waMessage: 'Halo, saya ingin memesan Sunflower Bouquet (Rp 220.000)'
  },
  {
    id: 'wedding-bridal-white',
    name: 'Bridal White Bouquet',
    category: 'wedding',
    description: 'Buket pengantin putih elegan — mawar putih, peony, dan stephanotis.',
    priceIDR: 450000,
    imageSrc: 'images/wedding-bridal-white.jpg',
    imageAlt: 'Buket pengantin mewah dari mawar putih dan peony dengan aksen dedaunan silver',
    waMessage: 'Halo, saya ingin memesan Bridal White Bouquet (Rp 450.000)'
  },
  {
    id: 'wedding-table-centerpiece',
    name: 'Wedding Table Centerpiece',
    category: 'wedding',
    description: 'Dekorasi meja pernikahan mewah — cocok untuk resepsi di Solo.',
    priceIDR: 350000,
    imageSrc: 'images/wedding-table-centerpiece.jpg',
    imageAlt: 'Dekorasi tengah meja pernikahan dari bunga mawar putih dan merah muda dalam vas tinggi',
    waMessage: 'Halo, saya ingin memesan Wedding Table Centerpiece (Rp 350.000)'
  },
  {
    id: 'seasonal-javanese-jasmine',
    name: 'Javanese Jasmine Garland',
    category: 'seasonal',
    description: 'Untaian melati khas Jawa, harum alami — ideal untuk acara adat.',
    priceIDR: 120000,
    imageSrc: 'images/seasonal-javanese-jasmine.jpg',
    imageAlt: 'Untaian bunga melati putih khas Jawa dirangkai menjadi kalung dekoratif',
    waMessage: 'Halo, saya ingin memesan Javanese Jasmine Garland (Rp 120.000)'
  }
];
