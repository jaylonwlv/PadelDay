(function () {
  var cfg = window.PADEL_DAY || {};
  var links = cfg.stripeLinks || {};
  var gift = cfg.freeGift || {};
  var price = Number(cfg.price || 0);
  var fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: cfg.currency || "USD" });
  function money(n) { return fmt.format(n).replace(/\.00$/, ""); }

  // Fill shared values from config.js
  document.querySelectorAll("[data-shipping]").forEach(function (el) { el.textContent = cfg.shippingTime; });
  document.querySelectorAll("[data-email]").forEach(function (el) { el.href = "mailto:" + cfg.contactEmail; });
  document.querySelectorAll("[data-price]").forEach(function (el) { el.textContent = money(price); });
  document.querySelectorAll("[data-gift-name]").forEach(function (el) { el.textContent = gift.name; });
  document.querySelectorAll("[data-gift-value]").forEach(function (el) { el.textContent = money(Number(gift.value || 0)); });
  if (gift.enabled) {
    document.getElementById("gift").hidden = false;
    document.getElementById("gift-pill").hidden = false;
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

  // Order state
  var colors = {
    white: { name: "Clean white", short: "White", button: "Buy the white bag", thumb: 1 },
    black: { name: "Moody black", short: "Black", button: "Buy the black bag", thumb: 2 },
  };
  var state = { color: "white" };
  var buyButton = document.getElementById("buy-button");
  var msg = document.getElementById("checkout-msg");

  function render() {
    var c = colors[state.color];
    document.getElementById("color-name").textContent = c.name;
    var giftImg = document.getElementById("gift-img");
    giftImg.src = "/images/grips-" + state.color + ".jpg";
    giftImg.alt = c.short + " overgrip rolls";
    document.getElementById("sticky-color").textContent = c.short;
    buyButton.textContent = c.button + " – " + money(price);
    buyButton.href = links[state.color] || "#";
    msg.hidden = true;
  }

  document.querySelectorAll('input[name="color"]').forEach(function (input) {
    input.addEventListener("change", function () {
      state.color = input.value;
      var t = thumbs[colors[state.color].thumb]; showPhoto(t.dataset.src, t.dataset.alt);
      render();
    });
  });
  render();

  // Checkout
  buyButton.addEventListener("click", function (e) {
    if (!links[state.color]) {
      e.preventDefault();
      msg.textContent = "Checkout isn't connected yet. Add your Stripe Payment Links in config.js.";
      msg.hidden = false;
      return;
    }
    var ids = ["racket-backpack-" + state.color];
    try {
      sessionStorage.setItem("pd_order", JSON.stringify({ value: price, ids: ids }));
    } catch (err) {}
    // Clicking Buy both adds the bag to the cart and starts checkout, so send both events.
    var event = { value: price, currency: cfg.currency, content_ids: ids, content_type: "product", num_items: 1 };
    window.pdTrack("AddToCart", event);
    window.pdTrack("InitiateCheckout", event);
    // Give the Pixel a moment to send before leaving for Stripe, or the browser can cancel it.
    // Ctrl/Cmd-click still opens Stripe in a new tab, so leave those alone.
    if (window.pdTrackingOn && !(e.metaKey || e.ctrlKey || e.shiftKey)) {
      e.preventDefault();
      var url = links[state.color];
      setTimeout(function () { window.location.href = url; }, 300);
    }
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
