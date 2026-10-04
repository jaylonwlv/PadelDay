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
    white: "",
    black: "",
  },

  // Free gift included with every bag, shown under the color picker.
  // Set enabled to false to hide it. value is what it's worth on its own.
  freeGift: {
    enabled: true,
    name: "5 overgrips",
    value: 10,
  },

  // Your Meta Pixel ID (Events Manager > Data sources). Leave empty to disable tracking.
  metaPixelId: "",

  // Shipping estimate shown on the page, e.g. "7–14 business days".
  shippingTime: "7–18 days",

  // Where customers can reach you.
  contactEmail: "jaylonw.lv@gmail.com",
};
