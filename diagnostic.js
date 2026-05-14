/* =========================================================
   Design Ink Co. — The 10-Point Diagnostic
   Vanilla JS, no dependencies.
   To wire submissions to n8n, set WEBHOOK_URL below.
   ========================================================= */

const WEBHOOK_URL = "https://designinkco.app.n8n.cloud/webhook/diagnostic-lead";

const QUESTIONS = [
  {
    id: 1,
    pillar: "seo",
    pillarLabel: "SEO & Discoverability",
    title: "SEO title tag",
    text: "Does your homepage browser tab title include a service term (like 'interior designer') and a location, not just your studio name?",
    help: "Check the tab when your site is open. 'Home | Studio Name' is the bottom-5 pattern. 'Interior Design Studio London | Studio Name' is the top-5 pattern.",
    yes: "Yes, service + location + name",
    partial: "Studio name with one extra word",
    no: "Just the studio name, or 'Home'",
    action: "Rewrite your homepage title tag as <em>Service + Location + Studio Name</em>. The single highest-impact, lowest-effort SEO move in the entire blueprint.",
  },
  {
    id: 2,
    pillar: "conv",
    pillarLabel: "Conversion",
    title: "Above-the-fold CTA, repeated",
    text: "Is there a clear, clickable call-to-action (like 'Book a Consult') visible without scrolling, and repeated at least three times on the homepage?",
    help: "The top-5 sites average 3 to 5 visible CTAs per homepage. The bottom-5 average less than one, and that one is usually 'Subscribe'.",
    yes: "Visible above the fold + repeated 3+ times",
    partial: "One CTA, but not repeated or not above the fold",
    no: "No clear CTA, or just 'Subscribe'",
    action: "Add a single, sharp CTA (<em>'Book a Consult'</em>, not 'Get in Touch') above the fold, and repeat it after every major section. Wire it to Calendly so there is zero friction.",
  },
  {
    id: 3,
    pillar: "conv",
    pillarLabel: "Conversion",
    title: "Tiered services with pricing",
    text: "Do you have a services page that articulates distinct packages or tiers, ideally with prices or 'starting from' figures?",
    help: "Oraanj Interiors uses £600 / £900 / £1,500 packages. Born & Bred uses tiered consults. Visitors who cannot tell what you sell will not inquire.",
    yes: "Tiered services with anchored prices",
    partial: "Services listed, but no tiers or pricing",
    no: "No services page, or one paragraph only",
    action: "Build a services page with two or three named tiers. Even a single <em>'from £X'</em> anchor changes the inquiry calculus completely.",
  },
  {
    id: 4,
    pillar: "trust",
    pillarLabel: "Trust & Authority",
    title: "Named testimonials with attribution",
    text: "Do you display at least three client testimonials on the homepage, each with a named person and either a photo or location?",
    help: "Anonymous praise reads as fabricated. A first name + city is the minimum that signals real. A photo and full name is the gold standard.",
    yes: "3+ named testimonials with photo or location",
    partial: "Some testimonials, but anonymous or unattributed",
    no: "No testimonials on the homepage",
    action: "Email your three best recent clients today. Ask for a one-paragraph testimonial, their first name, city, and a headshot. Surface all three on the homepage.",
  },
  {
    id: 5,
    pillar: "trust",
    pillarLabel: "Trust & Authority",
    title: "Press logo strip",
    text: "Is there a visible row of recognisable publications, podcasts, or shows where your work has been featured?",
    help: "House & Garden, AD, Vogue Living, The Local Project, Belle. Even a local broadsheet feature counts. The strip itself is what borrows the authority.",
    yes: "Press strip with 3+ recognisable mastheads",
    partial: "One press feature mentioned in text",
    no: "No press anywhere on the homepage",
    action: "If you have been featured anywhere, even once, build a press strip. If not, target one feature this quarter (local design blog counts). The strip is more valuable than the feature itself.",
  },
  {
    id: 6,
    pillar: "trust",
    pillarLabel: "Trust & Authority",
    title: "Awards or industry badges",
    text: "Do you display any industry-body badges (SBID, BIID, AD Pro Directory, Houzz) or awards on the homepage?",
    help: "Katharine Pooley stacks AD + House & Garden + RIBA + SBID + BIID. Six trust signals layered. Top-5 sites average five-plus, bottom-5 average one.",
    yes: "Industry-body badge + at least one award",
    partial: "One badge or one award shown",
    no: "Nothing on the homepage",
    action: "Join one industry body this quarter (SBID, BIID, or equivalent for your market). The badge is the cheapest authority signal you will ever buy.",
  },
  {
    id: 7,
    pillar: "trust",
    pillarLabel: "Trust & Authority",
    title: "Founder photo and story",
    text: "Is there a photo of you (the principal designer) on the homepage, with a one-line bio, signature, or personal hook?",
    help: "People hire people, not studios. Shea McGee front-and-centre. Lauren Li at Sisalla. The personal authority is the trust accelerator the winners use.",
    yes: "Founder photo + bio surfaced on homepage",
    partial: "Bio exists, but only on About page",
    no: "Studio hides behind the work",
    action: "Add a homepage section with your professional headshot, one paragraph of your story, and a signature CTA: <em>'Book a call with [your name]'</em>. Personal, signed, scary, effective.",
  },
  {
    id: 8,
    pillar: "design",
    pillarLabel: "Design & UX",
    title: "Branded point of view in words",
    text: "Is there a one-line positioning statement on the homepage that says, in words, what kind of interior design you do or who you do it for?",
    help: "Studio McGee: 'New Heritage'. Sisalla: 'Scandinavian soul with Australian ease'. Born & Bred: 'family spaces and kids' rooms'. Images alone do not communicate positioning.",
    yes: "One sharp positioning line, in your own voice",
    partial: "Generic tagline ('beautiful spaces, timeless design')",
    no: "No positioning line at all",
    action: "Write your one-line positioning. Fill in this blank: <em>'We design [aesthetic / approach] for [type of client / project] who want [outcome].'</em> Put it under the hero image.",
  },
  {
    id: 9,
    pillar: "seo",
    pillarLabel: "SEO & Discoverability",
    title: "Journal or blog with regular posts",
    text: "Do you have a journal, blog, or content section with at least one new post in the past 3 months?",
    help: "Content gravity drives organic traffic and return visits. No content equals total dependence on Instagram and referrals.",
    yes: "Active journal, posted in last 3 months",
    partial: "Journal exists, but stale (6+ months)",
    no: "No journal at all",
    action: "Commit to one journal post per month for the next six months. Even short pieces. SEO compounds slowly, then suddenly. Quarterly is the minimum that registers.",
  },
  {
    id: 10,
    pillar: "trust",
    pillarLabel: "Trust & Authority",
    title: "Trust-stacking footer",
    text: "Does your footer include accreditations, social proof, or press logos, in addition to the standard nav and copyright?",
    help: "The footer is your closing argument on every page. Most studios waste it on a sitemap. Winners load it with social proof.",
    yes: "Footer carries accreditations + social proof",
    partial: "Has socials, but no proof or accreditations",
    no: "Standard nav + copyright only",
    action: "Re-build the footer: industry-body badges row, three-line social proof, and registered company info. Closes the trust loop on every single page.",
  },
];

const PILLAR_MAX = { seo: 20, design: 10, conv: 20, trust: 50 };
const PILLAR_LABEL = {
  seo: "SEO & Discoverability",
  design: "Design & UX",
  conv: "Conversion",
  trust: "Trust & Authority",
};

const state = {
  current: 0,
  answers: new Array(QUESTIONS.length).fill(null),
  user: {},
};

/* =========== Element refs =========== */
const $ = (id) => document.getElementById(id);
const states = document.querySelectorAll(".dx-state");

function showState(name) {
  states.forEach((el) => {
    const match = el.dataset.state === name;
    el.hidden = !match;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========== Intro =========== */
// Two Start buttons live on the intro page: one in the hero, one at the
// end of the methodology explainer. Both fire the same handler.
document.querySelectorAll("[data-action='start']").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.current = 0;
    state.answers = new Array(QUESTIONS.length).fill(null);
    renderQuestion();
    showState("question");
  });
});

/* =========== Question rendering =========== */
function renderQuestion() {
  const q = QUESTIONS[state.current];
  $("dx-current").textContent = state.current + 1;
  $("dx-q-no").textContent = String(state.current + 1).padStart(2, "0");
  $("dx-q-text").textContent = q.text;
  $("dx-q-help").textContent = q.help;
  $("dx-pillar").textContent = q.pillarLabel;
  $("dx-opt-yes").textContent = q.yes;
  $("dx-opt-partial").textContent = q.partial;
  $("dx-opt-no").textContent = q.no;

  const pct = ((state.current) / QUESTIONS.length) * 100;
  $("dx-bar").style.width = pct + "%";

  $("dx-back").disabled = state.current === 0;

  // Reset option styling, but if returning to a question, show its prior pick
  document.querySelectorAll(".dx-option").forEach((b) => {
    b.classList.remove("is-selected");
    if (
      state.answers[state.current] !== null &&
      Number(b.dataset.value) === state.answers[state.current]
    ) {
      b.classList.add("is-selected");
    }
  });
}

document.querySelectorAll(".dx-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    const v = Number(btn.dataset.value);
    state.answers[state.current] = v;
    // small visual confirmation, then advance
    document
      .querySelectorAll(".dx-option")
      .forEach((b) => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
    setTimeout(advance, 220);
  });
});

$("dx-back").addEventListener("click", () => {
  if (state.current > 0) {
    state.current--;
    renderQuestion();
  }
});

function advance() {
  if (state.current < QUESTIONS.length - 1) {
    state.current++;
    renderQuestion();
  } else {
    // finish progress bar
    $("dx-bar").style.width = "100%";
    showState("gate");
  }
}

/* =========== Gate =========== */
$("dx-gate-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("dx-name").value.trim();
  const email = $("dx-email").value.trim();
  const studio = $("dx-studio").value.trim();
  const url = $("dx-url").value.trim();
  const consent = $("dx-consent").checked;

  if (!name || !email || !studio) return;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    $("dx-email").focus();
    return;
  }

  state.user = { name, email, studio, url, consent };

  const score = computeScore();
  const payload = {
    submitted_at: new Date().toISOString(),
    ...state.user,
    answers: state.answers,
    score,
  };

  // Fire-and-forget submission. Silently degrades if WEBHOOK_URL not set.
  if (WEBHOOK_URL) {
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch (_) {
      // intentional: do not block the user from seeing their score
    }
  }

  try {
    localStorage.setItem("dx_last_result", JSON.stringify(payload));
  } catch (_) {}

  renderResults(score);
  showState("results");
});

/* =========== Score computation =========== */
function computeScore() {
  let total = 0;
  const pillarRaw = { seo: 0, design: 0, conv: 0, trust: 0 };

  QUESTIONS.forEach((q, i) => {
    const v = state.answers[i] || 0;
    total += v;
    pillarRaw[q.pillar] += v;
  });

  // Normalise each pillar onto the /25 scorecard scale
  const pillars = {};
  Object.keys(pillarRaw).forEach((k) => {
    pillars[k] = Math.round((pillarRaw[k] / PILLAR_MAX[k]) * 25);
  });

  return { total, pillars, raw: pillarRaw };
}

/* =========== Radar rendering =========== */
/* Maps each pillar score (/25) to (x,y) on the radar SVG and
   writes the points onto the polygon + vertex circles + axis numbers.
   Coordinate system mirrors the research page so the visual language
   stays consistent across the site. */
function renderRadar(score) {
  const CX = 220, CY = 210, R = 160; // matches viewBox 0 0 440 420
  const p = score.pillars;

  const point = (axis, val) => {
    const k = Math.max(0, Math.min(25, val)) / 25;
    if (axis === "seo")    return [CX, CY - k * R];
    if (axis === "design") return [CX + k * R, CY];
    if (axis === "conv")   return [CX, CY + k * R];
    if (axis === "trust")  return [CX - k * R, CY];
    return [CX, CY];
  };

  const v = {
    seo: point("seo", p.seo),
    design: point("design", p.design),
    conv: point("conv", p.conv),
    trust: point("trust", p.trust),
  };

  const polyStr =
    `${v.seo[0]},${v.seo[1]} ` +
    `${v.design[0]},${v.design[1]} ` +
    `${v.conv[0]},${v.conv[1]} ` +
    `${v.trust[0]},${v.trust[1]}`;

  const poly = $("dx-user-poly");
  if (poly) poly.setAttribute("points", polyStr);

  const setVertex = (id, [x, y]) => {
    const el = $(id);
    if (el) {
      el.setAttribute("cx", x);
      el.setAttribute("cy", y);
    }
  };
  setVertex("dx-v-seo", v.seo);
  setVertex("dx-v-design", v.design);
  setVertex("dx-v-conv", v.conv);
  setVertex("dx-v-trust", v.trust);

  const setNum = (id, val) => {
    const el = $(id);
    if (el) el.textContent = String(val);
  };
  setNum("dx-radar-seo", p.seo);
  setNum("dx-radar-design", p.design);
  setNum("dx-radar-conv", p.conv);
  setNum("dx-radar-trust", p.trust);

  // Trigger the expand-from-center animation. Toggling off then on
  // forces the transition to replay if the user re-takes the diagnostic.
  const svg = document.querySelector(".dx-radar");
  if (svg) {
    svg.classList.remove("is-animated");
    // Force reflow so the browser observes the reset before re-adding.
    void svg.getBoundingClientRect();
    requestAnimationFrame(() => svg.classList.add("is-animated"));
  }
}

/* =========== Results rendering =========== */
function renderResults(score) {
  $("dx-total").textContent = score.total;
  renderRadar(score);

  // Diagnose shape
  const p = score.pillars;
  const max = Math.max(p.seo, p.design, p.conv, p.trust);
  const min = Math.min(p.seo, p.design, p.conv, p.trust);
  const spread = max - min;
  let shape = "";
  if (score.total >= 80) {
    shape = "Top-tier. Balanced across all four pillars. This is the shape that wins.";
  } else if (spread <= 5 && score.total >= 55) {
    shape = "Balanced, but the whole shape needs to expand. Lift every pillar a few points.";
  } else if (p.design === max && p.conv < 15) {
    shape = "Lopsided. Beautiful design, quiet inquiry path. The classic bottom-5 pattern.";
  } else if (p.trust < 12) {
    shape = "Weak on Trust. The cold visitor cannot tell if you are real.";
  } else if (p.seo < 12) {
    shape = "Invisible to search. Beautiful but undiscoverable.";
  } else {
    shape = "Mixed. Pillar-by-pillar fixes will move the score fastest.";
  }
  $("dx-shape").textContent = shape;

  // Headline + sub, by score band.
  // The bottom CTA section (book a discovery call) is static in HTML now;
  // only the headline + sub above the scorecard change with the score.
  // Headline uses the typewriter API so the verdict types in dramatically
  // when the results state appears.
  let headline = "";
  let sub = "";
  if (score.total >= 80) {
    headline = "You're already in the top tier.";
    sub = "Your site is built the way the winners build. The next move is the strategy behind it: pricing, positioning, converting enquiries into clients. That's the work inside Design for Success.";
  } else if (score.total >= 60) {
    headline = "You're in the middle. That's fixable.";
    sub = "Competent, but not yet differentiated. A few targeted changes would push you into the top tier. If you want to talk through your scorecard and what to prioritise first, book a call.";
  } else {
    headline = "Your site is leaving clients on the table.";
    sub = "The gaps are clear and they're fixable. But a website is one piece. The bigger question is whether your pricing, positioning, and enquiry process are doing their job. That's what a discovery call is for.";
  }
  $("dx-result-sub").textContent = sub;
  if (window.typewriter) {
    window.typewriter.play($("dx-result-headline"), headline);
  } else {
    $("dx-result-headline").textContent = headline;
  }

  // Priority action list — pick 3 lowest-scoring components
  const ranked = QUESTIONS
    .map((q, i) => ({ q, score: state.answers[i] || 0 }))
    .filter((x) => x.score < 10)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const actionList = $("dx-action-list");
  actionList.innerHTML = "";
  if (ranked.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = "<strong>You scored full marks on every component.</strong> The next move is to extend the lead with content (Journal) and conversion testing.";
    actionList.appendChild(li);
  } else {
    ranked.forEach(({ q }) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${q.title}.</strong> ${q.action}`;
      actionList.appendChild(li);
    });
  }

  // Full 10-point breakdown
  const bd = $("dx-breakdown");
  bd.innerHTML = "";
  QUESTIONS.forEach((q, i) => {
    const v = state.answers[i] || 0;
    const status = v === 10 ? "won" : v === 5 ? "partial" : "missed";
    const label = v === 10 ? "Yes" : v === 5 ? "Partial" : "Missing";
    const li = document.createElement("li");
    li.className = "dx-bd-item dx-bd-" + status;
    li.innerHTML = `
      <span class="dx-bd-num">${String(i + 1).padStart(2, "0")}</span>
      <div class="dx-bd-body">
        <div class="dx-bd-head">
          <h4>${q.title}</h4>
          <span class="dx-bd-status">${label}</span>
        </div>
        <p class="dx-bd-pillar">${q.pillarLabel}</p>
      </div>
    `;
    bd.appendChild(li);
  });
}

/* =========== Restart =========== */
$("dx-restart").addEventListener("click", (e) => {
  e.preventDefault();
  state.current = 0;
  state.answers = new Array(QUESTIONS.length).fill(null);
  state.user = {};
  $("dx-gate-form").reset();
  showState("intro");
});
