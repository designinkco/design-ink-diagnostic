/* =========================================================
   Design Ink Co. — motion.js
   Typewriter character-stagger effect, vanilla port.

   Static usage: add data-typewriter to an element.
     <h1 data-typewriter>Headline</h1>
   Optional: data-tw-stagger="50" (ms between chars, default 50)
            data-tw-cursor="false" to hide the trailing cursor

   Dynamic usage: when text changes after init (e.g. JS sets a
   new headline based on user input), call:
     window.typewriter.play(element, "new <em>html</em>");
   This unwraps any prior wrap, sets the new content, re-wraps,
   and replays the reveal animation.
   ========================================================= */

(() => {
  const STAGGER_DEFAULT = 50; // ms

  function wrapTextNode(node) {
    const text = node.textContent;
    if (!text) return;
    const parts = text.split(/(\s+)/);
    const frag = document.createDocumentFragment();
    parts.forEach((part) => {
      if (part === "") return;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
        return;
      }
      const word = document.createElement("span");
      word.className = "tw-word";
      Array.from(part).forEach((ch) => {
        const span = document.createElement("span");
        span.className = "tw-char";
        span.textContent = ch;
        word.appendChild(span);
      });
      frag.appendChild(word);
    });
    node.parentNode.replaceChild(frag, node);
  }

  function wrapNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.length > 0) wrapTextNode(node);
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.classList && node.classList.contains("tw-cursor")) return;
      Array.from(node.childNodes).forEach(wrapNode);
    }
  }

  function wrapAndCursor(el) {
    Array.from(el.childNodes).forEach(wrapNode);
    if (el.dataset.twCursor !== "false") {
      const cursor = document.createElement("span");
      cursor.className = "tw-cursor";
      cursor.setAttribute("aria-hidden", "true");
      el.appendChild(cursor);
    }
  }

  function reveal(el) {
    const stagger = Number(el.dataset.twStagger) || STAGGER_DEFAULT;
    const chars = el.querySelectorAll(".tw-char");
    chars.forEach((c, i) => {
      setTimeout(() => c.classList.add("is-visible"), i * stagger);
    });
    const cursor = el.querySelector(".tw-cursor");
    if (cursor) {
      const tailDelay = chars.length * stagger;
      setTimeout(() => cursor.classList.add("is-visible"), tailDelay);
    }
  }

  /* Reset an element back to its plain (unwrapped) HTML so we can
     re-wrap and replay the animation. Original HTML is cached on
     dataset.twOriginal at first wrap. */
  function unwrap(el) {
    const cursor = el.querySelector(".tw-cursor");
    if (cursor) cursor.remove();
    if (el.querySelector(".tw-char, .tw-word")) {
      if (el.dataset.twOriginal !== undefined) {
        el.innerHTML = el.dataset.twOriginal;
      } else {
        el.innerHTML = el.textContent;
      }
    }
  }

  /* Public API: play the typewriter on an element. If html is given,
     replace the element's content first. Always replays from scratch. */
  function play(el, html) {
    if (!el) return;
    unwrap(el);
    if (html !== undefined) el.innerHTML = html;
    el.dataset.twOriginal = el.innerHTML;
    wrapAndCursor(el);
    void el.offsetWidth; // force reflow so the animation replays cleanly
    reveal(el);
  }

  window.typewriter = { play };

  function init() {
    const targets = document.querySelectorAll("[data-typewriter]");
    targets.forEach((el) => {
      el.dataset.twOriginal = el.innerHTML;
      wrapAndCursor(el);
    });

    if (!("IntersectionObserver" in window)) {
      targets.forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => io.observe(el));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
