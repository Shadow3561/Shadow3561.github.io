/*
 * Wählt das YouTube-Video passend zur Sprache der Seite:
 *   Deutsch  -> deutsches Video
 *   alle anderen Sprachen (en, es, fr, ...) -> englisches Video
 * Reagiert auch auf den Sprachwechsel über das Auswahlmenü.
 */
(function () {
  var GERMAN = "https://youtu.be/CmobZ1gxGhU";
  var ENGLISH = "https://youtu.be/rwkveaemvXw";

  function update() {
    var lang = (document.documentElement.lang || "de").slice(0, 2).toLowerCase();
    var url = lang === "de" ? GERMAN : ENGLISH;
    var links = document.querySelectorAll(".demo-video-link");
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("href") !== url) links[i].setAttribute("href", url);
    }
  }

  update();
  document.addEventListener("DOMContentLoaded", update);
  new MutationObserver(update).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });
})();
