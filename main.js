(function () {
  var cfg = window.PADEL_DAY || {};
  var links = cfg.stripeLinks || {};
  var gift = cfg.freeGift || {};
  var price = Number(cfg.price || 0);
  var bothPrice = Number(cfg.bothPrice || price * 2);
  var giftValue = Number(gift.value || 0);
  var drop = cfg.gripDrop || {};
  var fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: cfg.currency || "USD" });
  function money(n) { return fmt.format(n).replace(/\.00$/, ""); }

  // Fill shared values from config.js
  document.querySelectorAll("[data-shipping]").forEach(function (el) { el.textContent = cfg.shippingTime; });
  document.querySelectorAll("[data-email]").forEach(function (el) { el.href = "mailto:" + cfg.contactEmail; });
  document.querySelectorAll("[data-gift-name]").forEach(function (el) { el.textContent = gift.name; });
  document.querySelectorAll("[data-gift-value]").forEach(function (el) { el.textContent = money(giftValue); });
  document.querySelectorAll("[data-both-price]").forEach(function (el) { el.textContent = money(bothPrice); });
  if (gift.enabled) {
    document.getElementById("gift").hidden = false;
    document.getElementById("gift-pill").hidden = false;
  }
  // Grip Drop subscription: only shown once its Stripe link is set.
  if (drop.link) {
    document.getElementById("grip-drop").hidden = false;
    document.querySelectorAll("[data-drop-faq]").forEach(function (el) { el.hidden = false; });
    document.querySelectorAll("[data-drop-price]").forEach(function (el) { el.textContent = money(drop.price); });
    document.querySelectorAll("[data-drop-every]").forEach(function (el) { el.textContent = drop.every; });
    document.querySelectorAll("[data-drop-grips]").forEach(function (el) { el.textContent = drop.grips; });
    document.querySelectorAll("[data-drop-each]").forEach(function (el) { el.textContent = fmt.format(drop.price / drop.grips); });
    var dropButton = document.getElementById("drop-button");
    dropButton.href = drop.link;
    dropButton.textContent = "Start the Grip Drop – " + money(drop.price);
    dropButton.addEventListener("click", function (e) {
      checkout(e, drop.link, { type: "subscription", value: Number(drop.price), ids: ["grip-drop"], n: 1 });
    });
  }
  if (cfg.manageSubscriptionLink) {
    document.querySelectorAll("[data-manage-sub]").forEach(function (el) { el.href = cfg.manageSubscriptionLink; el.hidden = false; });
  }

  // Sends the cart events, remembers the order for the thank-you page, then goes to Stripe.
  function checkout(e, url, order) {
    try { sessionStorage.setItem("pd_order", JSON.stringify(order)); } catch (err) {}
    var event = { value: order.value, currency: cfg.currency, content_ids: order.ids, content_type: "product", num_items: order.n };
    window.pdTrack("AddToCart", event);
    window.pdTrack("InitiateCheckout", event);
    // Give the Pixel a moment to send before leaving for Stripe, or the browser can cancel it.
    // Ctrl/Cmd-click still opens Stripe in a new tab, so leave those alone.
    if (window.pdTrackingOn && !(e.metaKey || e.ctrlKey || e.shiftKey)) {
      e.preventDefault();
      setTimeout(function () { window.location.href = url; }, 300);
    }
  }

  // The "Both" option only appears once its Stripe link is set.
  if (links.both) {
    document.getElementById("swatch-both").hidden = false;
    document.querySelectorAll("[data-both-faq]").forEach(function (el) { el.hidden = false; });
  }

  // Gallery
  var mainImage = document.getElementById("main-image");
  var thumbs = document.querySelectorAll(".thumb");
  function showPhoto(src, alt) {
    mainImage.src = src; mainImage.alt = alt;
    thumbs.forEach(function (t) { t.classList.toggle("is-active", t.dataset.src === src); });
  }
  thumbs.forEach(function (t) {
    t.addEventListener("click", function () { showPhoto(t.dataset.src, t.dataset.alt); });
  });

  // Order options. ids are what Meta sees for each option.
  var options = {
    white: { name: "Clean white", short: "White", button: "Buy the white bag", thumb: 1, price: price, ids: ["racket-backpack-white"], grips: "white" },
    black: { name: "Moody black", short: "Black", button: "Buy the black bag", thumb: 2, price: price, ids: ["racket-backpack-black"], grips: "black" },
    both: { name: "Both colors", short: "Both", button: "Buy both bags", thumb: 0, price: bothPrice, ids: ["racket-backpack-white", "racket-backpack-black"], grips: "white" },
  };
  var state = { color: "white" };
  var buyButton = document.getElementById("buy-button");
  var msg = document.getElementById("checkout-msg");

  function render() {
    var o = options[state.color];
    var bags = o.ids.length;
    document.getElementById("color-name").textContent = o.name;
    document.querySelectorAll("[data-price]").forEach(function (el) { el.textContent = money(o.price); });
    // Show the full price struck through when the bundle saves money.
    var was = document.getElementById("price-was");
    var full = price * bags;
    was.hidden = !(bags > 1 && full > o.price);
    was.textContent = money(full);
    // The free gift is per bag.
    var giftCount = gift.name.replace(/^\d+/, function (n) { return String(Number(n) * bags); });
    document.querySelectorAll("[data-gift-name]").forEach(function (el) { el.textContent = giftCount; });
    document.getElementById("gift-detail").textContent = bags > 1
      ? gift.name + " per bag, in each bag's color. A " + money(giftValue * bags) + " value."
      : "Fresh grip for your racket or paddle, in your bag's color. A " + money(giftValue) + " value.";
    var giftImg = document.getElementById("gift-img");
    giftImg.src = "/images/grips-" + o.grips + ".jpg";
    giftImg.alt = (o.grips === "white" ? "White" : "Black") + " overgrip rolls";
    document.getElementById("sticky-color").textContent = o.short;
    buyButton.textContent = o.button + " – " + money(o.price);
    buyButton.href = links[state.color] || "#";
    msg.hidden = true;
  }

  document.querySelectorAll('input[name="color"]').forEach(function (input) {
    input.addEventListener("change", function () {
      state.color = input.value;
      var t = thumbs[options[state.color].thumb]; showPhoto(t.dataset.src, t.dataset.alt);
      render();
    });
  });
  render();

  // Checkout
  buyButton.addEventListener("click", function (e) {
    var o = options[state.color];
    if (!links[state.color]) {
      e.preventDefault();
      msg.textContent = "Checkout isn't connected yet. Add your Stripe Payment Links in config.js.";
      msg.hidden = false;
      return;
    }
    // Clicking Buy both adds the bag to the cart and starts checkout, so checkout() sends both events.
    checkout(e, links[state.color], { type: "bag", value: o.price, ids: o.ids, n: o.ids.length });
  });

  // Use the same per-color IDs as the cart and purchase events so Meta can connect them.
  window.pdTrack("ViewContent", { value: price, currency: cfg.currency, content_ids: ["racket-backpack-white", "racket-backpack-black"], content_type: "product" });

  // Sticky buy bar appears once the main buy button scrolls out of view
  var sticky = document.getElementById("sticky-buy");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      sticky.classList.toggle("is-visible", !entries[0].isIntersecting);
    }).observe(buyButton);
  }
})();
