// ─────────────────────────────────────────────────────────────
// Padel Day store settings. This is the only file you need to edit.
// ─────────────────────────────────────────────────────────────
window.PADEL_DAY = {
  // Price shown on the page. Must match the price in your Stripe Payment Links.
  price: 78,
  currency: "USD",

  // One Stripe Payment Link per color (Stripe Dashboard > Payment Links).
  // Leave empty until you have them; the buy button will say checkout isn't connected yet.
  stripeLinks: {
    white: "https://buy.stripe.com/7sYaEX8020Pp2rH3eO8k800",
    black: "https://buy.stripe.com/cNi3cva8a55F0jz5mW8k801",
    // Both bags in one order, priced at bothPrice. The "Both" option only shows once this is set.
    both: "https://buy.stripe.com/3cIcN53JMdCbgix7v48k803",
  },

  // Price for both bags together (white + black). Must match the "both" Payment Link.
  bothPrice: 148,

  // Grip Club subscription: fresh overgrips on a schedule. The section stays hidden until link is set.
  // name is what the site calls it everywhere; keep it the same as the Stripe product name.
  gripClub: {
    name: "Grip Club",
    link: "https://buy.stripe.com/bJecN56VYgOn2rHbLk8k804",
    price: 18,
    grips: 10,
    every: "2 months",
    perYear: 6, // boxes per year, used to tell Meta what a subscriber is worth
  },

  // Stripe customer portal login link (Settings > Billing > Customer portal), so subscribers can skip or cancel.
  manageSubscriptionLink: "",

  // Free gift included with every bag, shown under the color picker.
  // Set enabled to false to hide it. value is what it's worth on its own.
  freeGift: {
    enabled: true,
    name: "5 overgrips",
    value: 10,
  },

  // Your Meta Pixel ID (Events Manager > Data sources). Leave empty to disable tracking.
  metaPixelId: "1815248366151803",

  // Shipping estimate shown on the page, e.g. "7–14 business days".
  shippingTime: "7–18 days",

  // Where customers can reach you.
  contactEmail: "jaylonw.lv@gmail.com",
};
