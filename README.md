# Padel Day store

A one-product static site for Vercel. Checkout runs on Stripe Payment Links, and ad tracking on the Meta Pixel. No build step and no dependencies.

## 1. Fill in config.js

Everything you need to change is in `config.js`:

- `stripeLinks.white` and `stripeLinks.black`: one Stripe Payment Link per color (step 2)
- `freeGift`: the free 5 overgrips shown with every bag. Set `enabled` to `false` to hide it.
- `metaPixelId`: your Pixel ID from Meta Events Manager
- `shippingTime`: for example `"7–18 days"`
- `contactEmail`: where customers reach you
- `price`: must match the price in Stripe

## 2. Create the Stripe Payment Links

In the Stripe Dashboard, create a product called "Padel Day racket backpack – White (with 5 free overgrips)" priced at $78, then a Payment Link for it. Repeat for Black.

On each Payment Link:

- Turn on **Collect customers' addresses** (shipping address, United States only) so you know where to send the bag.
- Under **After payment**, choose **Don't show confirmation page** and redirect to:
  `https://padelday.shop/thank-you?session_id={CHECKOUT_SESSION_ID}`
  The `{CHECKOUT_SESSION_ID}` part is filled in by Stripe and lets the page count each purchase once.

Paste both links into `config.js`.


## 3. Deploy to Vercel

Either:

- **Dashboard:** push this folder to a GitHub repo, then import it at vercel.com/new. Framework preset: **Other**. No build command, output directory is the root.
- **CLI:** run `npx vercel` in this folder, then `npx vercel --prod`.

The live domain is `padelday.shop` (Project > Settings > Domains). Point ads and the Stripe redirect URLs at it, not the `vercel.app` address, so the thank-you page can read the order.

## 4. Before running ads

- Use Meta's Pixel Helper browser extension to confirm `PageView`, `ViewContent`, `InitiateCheckout`, and (after a test purchase) `Purchase` fire.
- Make a real test purchase with a live link and refund it, so you know the redirect and the Purchase event work end to end.

## Fulfilling orders

Each Stripe payment shows the customer's shipping address and which color they bought. Place the matching AliExpress order for the bag plus 5 overgrips in the same color to that address, then email the customer the tracking link.

## Notes

- The `Purchase` event fires from the browser on the thank-you page. That's fine for a test; if you scale, add Meta's Conversions API so purchases are tracked even when browsers block the Pixel.
- To swap photos, replace the files in `/images` and keep the same names.
