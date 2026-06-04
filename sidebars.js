// CAPilot demo / marketing docs — sidebar structure.

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tour: [
    'intro',
    'getting-started',
    {
      type: 'category',
      label: 'Compliance',
      collapsed: false,
      items: ['modules/compliance-tasks', 'modules/compliance-calendar', 'modules/compliance-alerts'],
    },
    {
      type: 'category',
      label: 'Time & billing',
      collapsed: false,
      items: ['modules/time-tracking', 'modules/invoicing', 'modules/payments-tds'],
    },
    {
      type: 'category',
      label: 'Clients & communication',
      collapsed: false,
      items: ['modules/client-onboarding', 'modules/communications', 'modules/client-portal'],
    },
    {
      type: 'category',
      label: 'Tax & GST tools',
      collapsed: false,
      items: ['tax/income-tax-calculator', 'tax/itr-1-generator', 'tax/gstr-1-generator'],
    },
    {
      type: 'category',
      label: 'Free public tools',
      collapsed: false,
      items: ['public-tools/gstin-search', 'public-tools/mca-lookup', 'public-tools/hsn-rate-finder'],
    },
    {
      type: 'category',
      label: 'Subscription',
      collapsed: true,
      items: ['subscription/pricing', 'subscription/billing'],
    },
  ],
  roadmap: ['roadmap'],
};

export default sidebars;
