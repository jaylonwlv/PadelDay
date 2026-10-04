(function () {
  var cfg = window.PADEL_DAY || {};
  var links = cfg.stripeLinks || {};
  var addOn = cfg.addOn || {};
  var price = Number(cfg.price || 0);
  var addOnPrice = Number(addOn.price || 0);
  var fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: cfg.currency || "USD" });
  function money(n) { return fmt.format(n).replace(/\.00$/, ""); }

  // Fill shared values from config.js
  document.querySelectorAll("[data-shipping]").forEach(function (el) { el.textContent = cfg.shippingTime; });
  document.querySelectorAll("[data-email]").forEach(function (el) { el.href = "mailto:" + cfg.contactEmail; });
  document.querySelectorAll("[data-addon-name]").forEach(function (el) { el.textContent = addOn.name; });
  document.querySelectorAll("[data-addon-price]").forEach(function (el) { el.textContent = money(addOnPrice); });
  document.querySelectorAll("[data-addon-note]").forEach(function (el) { el.textContent = addOn.photoNote || ""; });

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
  var state = { color: "white", grips: false };
  var buyButton = document.getElementById("buy-button");
  var msg = document.getElementById("checkout-msg");
  var addOnBox = document.getElementById("addon");
  var addOnInput = document.getElementById("addon-input");
  if (addOn.enabled) addOnBox.hidden = false;

  function total() { return price + (state.grips ? addOnPrice : 0); }
  function currentLink() {
    return state.grips ? links[state.color + "WithGrips"] : links[state.color];
  }
  function render() {
    var c = colors[state.color];
    document.getElementById("color-name").textContent = c.name;
    var gripImg = document.getElementById("addon-img");
    gripImg.src = "/images/grips-" + state.color + ".jpg";
    gripImg.alt = (state.color === "white" ? "White" : "Black") + " overgrip rolls";
    document.getElementById("sticky-color").textContent = c.short + (state.grips ? " + grips" : "");
    buyButton.textContent = (state.grips ? "Buy bag + grips" : c.button) + " – " + money(total());
    document.querySelectorAll("[data-price]").forEach(function (el) { el.textContent = money(total()); });
    buyButton.href = currentLink() || "#";
    msg.hidden = true;
  }

  document.querySelectorAll('input[name="color"]').forEach(function (input) {
    input.addEventListener("change", function () {
      state.color = input.value;
      var t = thumbs[colors[state.color].thumb]; showPhoto(t.dataset.src, t.dataset.alt);
      render();
    });
  });
  addOnInput.addEventListener("change", function () {
    state.grips = addOnInput.checked;
    if (state.grips) window.pdTrack("AddToCart", { value: addOnPrice, currency: cfg.currency, content_ids: ["overgrips-5"], content_type: "product" });
    render();
  });
  render();

  // Checkout
  buyButton.addEventListener("click", function (e) {
    var link = currentLink();
    if (!link) {
      e.preventDefault();
      msg.textContent = state.grips
        ? "Checkout for the bag with grips isn't connected yet. Add the " + state.color + "WithGrips link in config.js."
        : "Checkout isn't connected yet. Add your Stripe Payment Links in config.js.";
      msg.hidden = false;
      return;
    }
    var ids = ["racket-backpack-" + state.color].concat(state.grips ? ["overgrips-5"] : []);
    try {
      sessionStorage.setItem("pd_order", JSON.stringify({ value: total(), ids: ids }));
    } catch (err) {}
    window.pdTrack("InitiateCheckout", { value: total(), currency: cfg.currency, content_ids: ids, content_type: "product", num_items: ids.length });
  });

  window.pdTrack("ViewContent", { value: price, currency: cfg.currency, content_ids: ["racket-backpack"], content_type: "product" });

  // Sticky buy bar appears once the main buy button scrolls out of view
  var sticky = document.getElementById("sticky-buy");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      sticky.classList.toggle("is-visible", !entries[0].isIntersecting);
    }).observe(buyButton);
  }
})();
