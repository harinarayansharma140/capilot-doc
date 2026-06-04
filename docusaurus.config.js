// @ts-check
// CAPilot demo / marketing docs — what's shipped, with screenshots.
// Run: `cd marketing-docs && npm start` → http://localhost:3001
//
// Built on Docusaurus 3 (Classic preset). The CAPilot product itself
// lives at /backend + /frontend; this site is its public-facing
// documentation + sales asset.

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'CAPilot',
  tagline: 'The compliance + billing workspace for India\'s practising CAs',
  favicon: 'img/favicon.ico',

  future: { v4: true },

  url: 'https://capilot.tulsix.com',
  baseUrl: '/',

  organizationName: 'tulsix',
  projectName: 'capilot',

  // Keep the build forgiving — these will be tightened once the site is on a real CI.
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',                 // serve docs at the site root
        },
        blog: false,                          // no blog for now — focus on the product tour
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/capilot-social-card.jpg',
      navbar: {
        title: 'CAPilot',
        logo: { alt: 'CAPilot', src: 'img/logo.svg' },
        items: [
          { type: 'docSidebar', sidebarId: 'tour', position: 'left', label: 'Product tour' },
          { type: 'docSidebar', sidebarId: 'roadmap', position: 'left', label: 'Roadmap' },
          { href: 'http://localhost:5173', label: 'Open app ↗', position: 'right' },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Product',
            items: [
              { label: 'Product tour', to: '/' },
              { label: 'Roadmap',     to: '/roadmap' },
            ],
          },
          {
            title: 'Free tools',
            items: [
              { label: 'Income-tax calculator', href: 'http://localhost:5173/tools/tax-calculator' },
              { label: 'GSTIN search',          href: 'http://localhost:5173/tools/gstin-lookup' },
              { label: 'MCA lookup',            href: 'http://localhost:5173/tools/mca-lookup' },
              { label: 'HSN/SAC rate finder',   href: 'http://localhost:5173/tools/hsn-rate-finder' },
            ],
          },
          {
            title: 'Get in touch',
            items: [
              { label: 'sales@tulsix.com', href: 'mailto:sales@tulsix.com' },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} CAPilot · A Tulsix product`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
    }),
};

export default config;
