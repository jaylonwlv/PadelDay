// ─────────────────────────────────────────────────────────────
// Padel Day store settings. This is the only file you need to edit.
// ─────────────────────────────────────────────────────────────
window.PADEL_DAY = {
  // Price shown on the page. Must match the price in your Stripe Payment Links.
  price: 68,
  currency: "USD",

  // One Stripe Payment Link per color (Stripe Dashboard > Payment Links).
  // Leave empty until you have them; the buy button will say checkout isn't connected yet.
  stripeLinks: {
    white: "",
    black: "",
    // Bundle links: the bag plus the overgrip add-on, priced at price + addOn.price.
    whiteWithGrips: "",
    blackWithGrips: "",
  },

  // Optional add-on shown under the color picker. Set enabled to false to hide it.
  addOn: {
    enabled: true,
    name: "5 overgrips",
    price: 10,
    // Optional small note under the add-on. Leave empty to hide it.
    photoNote: "",
  },

  // Your Meta Pixel ID (Events Manager > Data sources). Leave empty to disable tracking.
  metaPixelId: "",

  // Shipping estimate shown on the page, e.g. "7–14 business days".
  shippingTime: "7–18 days",

  // Where customers can reach you.
  contactEmail: "jaylonw.lv@gmail.com",
};
