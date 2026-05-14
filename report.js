/* =========================================================
   Design Ink Co. — report.js
   Active-section tracking + scroll progress for the
   research report page. Only runs if a .report-toc exists.
   ========================================================= */

(() => {
  const toc = document.querySelector(".report-toc");
  if (!toc) return;

  /* ----- Build a map of section-id → TOC link ----- */
  const links = toc.querySelectorAll('a[href^="#"]');
  const linkById = new Map();
  links.forEach((a) => {
    const id = a.getAttribute("href").slice(1);
    if (id) linkById.set(id, a);
  });

  const sections = Array.from(document.querySelectorAll(".r-section[id]"));
  if (sections.length === 0) return;

  /* ----- Active-section observer ----- */
  // The rootMargin creates a thin "trigger band" near the top
  // of the viewport. Only the section whose top edge sits inside
  // that band is marked active, so there's only ever one.
  const setActive = (id) => {
    links.forEach((l) => l.classList.remove("is-active"));
    const link = linkById.get(id);
    if (link) link.classList.add("is-active");
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        // Among visible entries, pick the one closest to the top
        // (smallest boundingClientRect.top).
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      {
        rootMargin: "-25% 0px -70% 0px",
        threshold: 0,
      }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ----- Scroll progress bar ----- */
  const bar = document.createElement("div");
  bar.className = "report-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  let raf = null;
  function update() {
    raf = null;
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.transform = `scaleX(${pct})`;
  }
  function onScroll() {
    if (raf === null) raf = requestAnimationFrame(update);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
})();
