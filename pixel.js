// Loads the Meta Pixel only when an ID is set in config.js.
// Add ?pd_debug=1 to any page URL to show a panel listing what the Pixel sends (stays on for this tab).
(function () {
  var cfg = window.PADEL_DAY || {};
  window.pdTrack = function () {};
  var debug = false;
  try {
    if (/[?&]pd_debug=1/.test(location.search)) sessionStorage.setItem("pd_debug", "1");
    if (/[?&]pd_debug=0/.test(location.search)) sessionStorage.removeItem("pd_debug");
    debug = sessionStorage.getItem("pd_debug") === "1";
  } catch (e) {}
  var log = debug ? debugPanel() : function () {};
  if (!cfg.metaPixelId) { log("No metaPixelId in config.js, so tracking is off."); return; }

  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    t.onload = function () { log("Meta Pixel script loaded. Events are being sent to Meta."); };
    t.onerror = function () { log("BLOCKED: this browser stopped the Meta Pixel script (ad blocker, VPN or privacy setting). Nothing from this browser reaches Meta.", true); };
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  window.fbq("init", cfg.metaPixelId);
  window.fbq("track", "PageView");
  log("Pixel " + cfg.metaPixelId + ": PageView");
  // opts.eventID lets Meta drop duplicate events (e.g. a Purchase sent twice).
  window.pdTrack = function (event, data, opts) {
    window.fbq("track", event, data || {}, opts || {});
    log(event + (data && data.value ? " $" + data.value : "") + (opts && opts.eventID ? " (" + opts.eventID + ")" : ""));
  };
  window.pdTrackingOn = true;

  function debugPanel() {
    var box, lines = [];
    function draw() {
      if (!document.body) return setTimeout(draw, 50);
      if (!box) {
        box = document.createElement("div");
        box.setAttribute("style", "position:fixed;left:12px;bottom:12px;z-index:9999;max-width:340px;padding:12px 14px;border-radius:14px;background:#17181A;color:#F7F7F2;font:13px/1.4 system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.3)");
        document.body.appendChild(box);
      }
      box.innerHTML = "<strong style='color:#D4F04A'>Pixel debug</strong> <small>(add ?pd_debug=0 to hide)</small>";
      lines.forEach(function (l) {
        var row = document.createElement("div");
        row.textContent = (l.bad ? "✗ " : "✓ ") + l.text;
        if (l.bad) row.style.color = "#FF8A8A";
        box.appendChild(row);
      });
    }
    return function (text, bad) { lines.push({ text: text, bad: !!bad }); draw(); };
  }
})();
