/* =========================================================
   Design Ink Co. · The Studio Business Diagnostic
   Vanilla JS, no dependencies. Sits beside diagnostic.js
   (The 10-Point Diagnostic) and reuses styles.css.

   13 questions: 9 scored (3 per pillar, 10 / 5 / 0 each)
   and 4 unscored that only decide the result.

   Email is optional and comes AFTER the result. To switch it
   on, set WEBHOOK_URL to an n8n webhook that adds the person
   to Flodesk and tags them with payload.flodesk_tag.
   ========================================================= */

const WEBHOOK_URL = "";

const LINKS = {
  clarity: "https://www.designinkco.com/clarity-call",
  dfs: "https://www.designinkco.com/design-for-success",
  aiSetup: "https://www.designinkco.com/ai-studio-setup",
  websiteDiagnostic: "https://www.designinkco.com/diagnostic",
  youtube: "https://www.youtube.com/channel/UCIKzZXat9XARLeQNxBbF-RA",
  shop: "https://designinkco.myshopify.com/",
};

const PILLAR_LABEL = {
  strategy: "Strategy",
  systems: "Systems",
  skills: "Skills",
};
// Tie-break order for the biggest gap.
const PILLAR_ORDER = ["strategy", "systems", "skills"];

/* Questions in the order they are asked.
   Scored questions: options carry value 10 / 5 / 0.
   Unscored questions: options carry a string value. */
const QUESTIONS = [
  {
    id: "years",
    section: "About your studio",
    text: "How long have you been running your own studio?",
    help: "Count from your first paying project under your own name.",
    options: [
      { key: "A", label: "Under 2 years", value: "under2" },
      { key: "B", label: "2 to 5 years", value: "2to5" },
      { key: "C", label: "More than 5 years", value: "over5" },
    ],
  },
  {
    id: "ai",
    section: "About your studio",
    text: "How do you use AI in the studio today?",
    help: "There is no wrong answer here. It only helps me point you to the right next step.",
    options: [
      { key: "A", label: "Not at all, or only to try it", value: "none" },
      { key: "B", label: "For the odd email or caption", value: "some" },
      { key: "C", label: "Most weeks, on real project work", value: "regular" },
    ],
  },
  {
    id: "floor",
    pillar: "strategy",
    title: "Knowing your minimum fee",
    text: "Do you know the lowest fee you can take a project for and still pay yourself properly?",
    help: "Not what you usually charge. The number below which a project costs you money.",
    options: [
      { key: "Yes", label: "I have worked it out", value: 10 },
      { key: "Partly", label: "I have a rough idea", value: 5 },
      { key: "No", label: "I have never worked it out", value: 0 },
    ],
  },
  {
    id: "busy",
    pillar: "strategy",
    title: "Busy turning into profit",
    text: "When you are busy, does your bank balance show it?",
    help: "Think about your last full year, not your best month.",
    options: [
      { key: "Yes", label: "Busy months are good months", value: 10 },
      { key: "Partly", label: "Some months", value: 5 },
      { key: "No", label: "I am busy and the money does not show it", value: 0 },
    ],
  },
  {
    id: "enquiries",
    pillar: "strategy",
    title: "Enquiries that match the work you want",
    text: "Do the enquiries you get match the clients and projects you want?",
    help: "The right size of project, the right kind of client, the right budget.",
    options: [
      { key: "Yes", label: "Most of them do", value: 10 },
      { key: "Partly", label: "About half", value: 5 },
      { key: "No", label: "Mostly not, I take what comes", value: 0 },
    ],
  },
  {
    id: "process",
    pillar: "systems",
    title: "A written process from enquiry to signed",
    text: "Is your process from first enquiry to signed contract written down?",
    help: "Written down means someone else could follow it without asking you.",
    options: [
      { key: "Yes", label: "Written down and used every time", value: 10 },
      { key: "Partly", label: "In my head, with a few templates", value: 5 },
      { key: "No", label: "It is different every time", value: 0 },
    ],
  },
  {
    id: "tracking",
    pillar: "systems",
    title: "Tracking orders, variations and payments",
    text: "During a project, where do orders, variations and payments get tracked?",
    help: "If a client asked today what is still outstanding, where would you look?",
    options: [
      { key: "Yes", label: "One place, kept up to date", value: 10 },
      { key: "Partly", label: "A few places, and I catch up later", value: 5 },
      { key: "No", label: "Emails, WhatsApp and memory", value: 0 },
    ],
  },
  {
    id: "proposal",
    pillar: "systems",
    title: "Getting a proposal out",
    text: "How long does it take you to send a proposal after meeting a client?",
    help: "From the end of the meeting to the proposal landing in their inbox.",
    options: [
      { key: "Fast", label: "The same or next day", value: 10 },
      { key: "Days", label: "A few days", value: 5 },
      { key: "Slow", label: "A week or more, usually in the evenings", value: 0 },
    ],
  },
  {
    id: "referrals",
    pillar: "skills",
    title: "Finding clients without referrals",
    text: "If referrals stopped tomorrow, could you find your next client?",
    help: "Word of mouth is good. This asks what happens if it goes quiet.",
    options: [
      { key: "Yes", label: "I have another reliable source", value: 10 },
      { key: "Partly", label: "I have some ideas", value: 5 },
      { key: "No", label: "Nearly everything is word of mouth", value: 0 },
    ],
  },
  {
    id: "fee",
    pillar: "skills",
    title: "Holding your fee",
    text: "When a client pushes back on your fee, what usually happens?",
    help: "Be honest about the last two or three times it happened.",
    options: [
      { key: "Hold", label: "I explain the value and hold it", value: 10 },
      { key: "Mixed", label: "Sometimes I hold, sometimes I discount", value: 5 },
      { key: "Give", label: "I discount, or add extras for free", value: 0 },
    ],
  },
  {
    id: "delegate",
    pillar: "skills",
    title: "Handing work over",
    text: "Could you hand a task to someone else with written instructions and trust the result?",
    help: "An assistant, a junior, a contractor or a VA. It counts even if you work alone today.",
    options: [
      { key: "Yes", label: "Yes, and I do", value: 10 },
      { key: "Partly", label: "I could, but I end up checking or redoing it", value: 5 },
      { key: "No", label: "It is quicker to do it myself", value: 0 },
    ],
  },
  {
    id: "year",
    section: "Looking ahead",
    text: "Could you keep running the studio the way it runs now for another year?",
    help: "Same hours, same income, same way of working.",
    options: [
      { key: "A", label: "Yes, comfortably", value: "yes" },
      { key: "B", label: "Yes, but it would cost me", value: "cost" },
      { key: "C", label: "No", value: "no" },
    ],
  },
  {
    id: "help",
    section: "Looking ahead",
    text: "If you could have one of these, which would it be?",
    help: "Pick the one that sounds most like what you want right now.",
    options: [
      { key: "A", label: "Someone beside me while I rebuild the business side", value: "rebuild" },
      { key: "B", label: "One clear plan for what to fix first", value: "plan" },
      { key: "C", label: "The admin and documents taken off my desk", value: "admin" },
      { key: "D", label: "I would rather work it out myself", value: "self" },
    ],
  },
];

const WEAK_MAX = 15; // a pillar is weak at 15 or under (out of 30)
const STRONG_MIN = 25; // and strong at 25 or over

/* =========== Scoring and routing (pure functions) =========== */

// answers: { questionId: value }
function computeScore(answers) {
  const pillars = { strategy: 0, systems: 0, skills: 0 };
  QUESTIONS.forEach((q) => {
    if (!q.pillar) return;
    pillars[q.pillar] += Number(answers[q.id]) || 0;
  });
  const raw = pillars.strategy + pillars.systems + pillars.skills; // out of 90
  const total = Math.round((raw / 90) * 100);

  let gap = PILLAR_ORDER[0];
  PILLAR_ORDER.forEach((p) => {
    if (pillars[p] < pillars[gap]) gap = p;
  });

  const weak = PILLAR_ORDER.filter((p) => pillars[p] <= WEAK_MAX);
  const allStrong = PILLAR_ORDER.every((p) => pillars[p] >= STRONG_MIN);

  return { total, raw, pillars, gap, weak, allStrong };
}

// Returns { result, version }.
// result: "dfs" | "sss" | "ai" | "notyet"
function routeResult(answers, score) {
  const p = score.pillars;

  // 1. Under two years: too early for any paid offer.
  if (answers.years === "under2") return { result: "notyet", version: "early" };

  // 2. Strong everywhere: no real gaps.
  if (score.allStrong) return { result: "notyet", version: "strong" };

  // 3. Sound business, slow documentation.
  if (p.strategy >= 20 && p.skills >= 20 && p.systems <= WEAK_MAX) {
    return { result: "ai", version: "main" };
  }

  // 4. Two or more weak pillars: depends on the help they want.
  if (score.weak.length >= 2) {
    if (answers.help === "rebuild") return { result: "dfs", version: "main" };
    if (answers.help === "self") return { result: "notyet", version: "diy" };
    return { result: "sss", version: "several" };
  }

  // 5. One weak pillar.
  if (score.weak.length === 1) return { result: "sss", version: "one" };

  // 6. No weak pillar, but not strong everywhere.
  if (answers.year === "no" || answers.year === "cost") {
    return { result: "sss", version: "one" };
  }
  return { result: "notyet", version: "strong" };
}

/* =========== Result copy =========== */

const GAP_LINE = {
  strategy:
    "Your biggest gap is Strategy. You are doing the work, but your pricing and positioning are not turning it into profit.",
  systems:
    "Your biggest gap is Systems. Too much of how a project runs lives in your head, your inbox and your phone.",
  skills:
    "Your biggest gap is Skills, the business kind. Your design is not the problem. Finding clients, holding your fee and handing work over are.",
};

const RESULTS = {
  dfs: {
    tag: "SBD: Design for Success",
    label: "Your next step",
    name: "Design for Success",
    headline: "It is more than one thing. <em>That is what Design for Success is for.</em>",
    body: () => [
      "Your answers show gaps in more than one part of the business, and you told me you want someone beside you while you rebuild it.",
      "This is the most common result I see in established designers. The work is good, the clients are happy, the diary is full, and the bank balance does not match. Beautiful work doesn't automatically mean a profitable business. The success of an interior design business comes down to two things: your systems and how you market yourself.",
      "Fixing one gap on its own rarely holds, because they feed each other. Unclear pricing brings the wrong enquiries. The wrong enquiries stretch a process that was never written down.",
    ],
    extra: (a) =>
      a.year === "no"
        ? "You said you could not keep going like this for another year. I would not wait for a quiet month to start."
        : "",
    whatTitle: "What Design for Success is",
    what: [
      "A 12-week, 1:1 business coaching program for established interior designers",
      "10 private sessions with me, of up to 90 minutes",
      "We fix your pricing, your client process and your systems, using your real numbers and your real projects",
      "Everything is built with you during the program, in your own workspace, and it is yours to keep",
      "USD 10,000, or 3 monthly payments of USD 3,800",
    ],
    button: { text: "Book a free Clarity Call", href: LINKS.clarity },
    under:
      "Thirty minutes. Bring your score, and I will tell you plainly whether Design for Success is the right place to start.",
    second: { text: "Read about Design for Success", href: LINKS.dfs },
  },

  sss: {
    tag: "SBD: Strategy Session",
    label: "Your next step",
    name: "Studio Strategy Session",
    headline: "You need a clear plan <em>before anything else.</em>",
    body: (version) =>
      version === "several"
        ? [
            "Your answers show gaps in more than one part of the business. You told me you want to know what to fix first, and that is the right instinct. Taking the admin off your desk will not help much while the pricing and the process underneath it are not working.",
            "Start with one session. Some designers take the plan and run with it. Others go on to Design for Success and we rebuild it together. Both are fine.",
          ]
        : [
            "Most of your business is working. One part is dragging the rest down, and it is hard to see how to fix it from the inside.",
            "You do not need 12 weeks of coaching for that. You need someone to look at the whole business with you once, and tell you what to fix first.",
          ],
    extra: () => "",
    whatTitle: "What the Studio Strategy Session is",
    what: [
      "One 1:1 session with me, two hours",
      "You fill in a short questionnaire first, so we use the time on your business and not on background",
      "We go through the whole business in one sitting: your pricing, your clients, your process",
      "You get a written report afterwards, with what to fix first and in what order",
      "USD 490",
    ],
    button: { text: "Start with a Clarity Call", href: LINKS.clarity },
    under:
      "Thirty minutes, free. Bring your score. If the Strategy Session is not the right step, I will say so.",
    second: null,
  },

  ai: {
    tag: "SBD: AI Studio Setup",
    label: "Your next step",
    name: "AI Studio Setup",
    headline: "Your business is sound. <em>The admin is what is costing you.</em>",
    body: () => [
      "Your pricing and the way you win clients are in good shape. What is slowing you down is the documentation: the proposal that takes an evening, the order you chase from three places, the client update you meant to send on Friday.",
      "You do not need coaching for that. You need the admin set up properly once, so the first draft of each of those is done for you.",
    ],
    extra: (a) =>
      a.ai === "none"
        ? "You do not need to know AI first. If you can use email and a shared folder, you can use this."
        : "",
    whatTitle: "What the AI Studio Setup is",
    what: [
      "A done-for-you AI setup for your studio, in two weeks",
      "Built around your real projects, your voice and your brand",
      "Two jobs taken off your plate, such as a proposal draft from your consultation notes or a weekly client update",
      "About four hours of your time: a short questionnaire and two 90-minute sessions",
      "USD 1,500 for a solo designer, fixed. Teams are quoted by size",
    ],
    button: { text: "See the AI Studio Setup", href: LINKS.aiSetup },
    under: "",
    second: null,
  },

  notyet: {
    tag: "SBD: Not yet",
    label: "Your result",
    name: "Not yet",
    versions: {
      early: {
        headline: "Not yet. <em>And that is the right answer.</em>",
        body: [
          "My coaching is built for designers who have been running a studio for a few years and have real projects and real numbers to work with. You are not there yet, and paying for coaching now would be the wrong use of your money.",
          "In the early days, do a broad range of projects. After a few years, niche down. Right now your job is to get projects finished, find out which work you like, and build a portfolio you are proud of.",
          "Your score still tells you something. Look at your lowest pillar and start there.",
        ],
        whatTitle: "What to do instead",
        what: [
          "Watch the YouTube channel, where I show the systems and AI workflows step by step",
          "Browse the shop for templates you can set up yourself",
          "Take this again after your second year",
        ],
        button: { text: "Go to the YouTube channel", href: LINKS.youtube },
        second: { text: "Browse the shop", href: LINKS.shop },
      },
      strong: {
        headline: "Your studio is in good shape. <em>You do not need me right now.</em>",
        body: [
          "You know your numbers, your process holds up, and you are not relying on luck for the next client. That is rarer than you might think.",
          "I am not going to sell you coaching you do not need. You should always be building systems, so keep going with what you have.",
        ],
        whatTitle: "What to do instead",
        what: [
          "Score your website with the free 10-Point Diagnostic",
          "Watch the YouTube channel for AI workflows you can add to what already works",
        ],
        button: { text: "Score your website", href: LINKS.websiteDiagnostic },
        second: { text: "Go to the YouTube channel", href: LINKS.youtube },
      },
      diy: {
        headline: "You have real gaps, <em>and you want to fix them yourself.</em>",
        body: [
          "That is a fair choice, and plenty of designers do it. I will be honest about the score though: more than one part of the business needs work, and they affect each other.",
          "Start with your lowest pillar. Give it three months. If it has not moved, a Studio Strategy Session is the quickest way to get a plan.",
        ],
        whatTitle: "What to do now",
        what: [
          "Browse the shop for templates you can set up yourself",
          "Watch the YouTube channel, where I show the systems step by step",
        ],
        button: { text: "Browse the shop", href: LINKS.shop },
        second: { text: "Go to the YouTube channel", href: LINKS.youtube },
      },
    },
  },
};

// Flatten a route into the content the page renders.
function resultContent(route, answers, score) {
  const r = RESULTS[route.result];
  const gapLine =
    route.result === "notyet" && route.version === "strong"
      ? "Your lowest pillar is " + PILLAR_LABEL[score.gap] + ", and it is still in good shape."
      : GAP_LINE[score.gap];

  if (route.result === "notyet") {
    const v = r.versions[route.version];
    return {
      tag: r.tag, label: r.label, name: r.name, gapLine,
      headline: v.headline, body: v.body, extra: "",
      whatTitle: v.whatTitle, what: v.what,
      button: v.button, under: "", second: v.second,
    };
  }
  return {
    tag: r.tag, label: r.label, name: r.name, gapLine,
    headline: r.headline, body: r.body(route.version), extra: r.extra(answers),
    whatTitle: r.whatTitle, what: r.what,
    button: r.button, under: r.under, second: r.second,
  };
}

/* Exported for the routing tests (node). The browser ignores this. */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { QUESTIONS, computeScore, routeResult, resultContent, RESULTS, LINKS };
}

/* =========== Page behaviour (browser only) =========== */
if (typeof document !== "undefined") {
  const state = { current: 0, answers: {}, score: null, route: null };

  const $ = (id) => document.getElementById(id);
  const states = document.querySelectorAll(".dx-state");

  function showState(name) {
    states.forEach((el) => {
      el.hidden = el.dataset.state !== name;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function start() {
    state.current = 0;
    state.answers = {};
    renderQuestion();
    showState("question");
  }
  document.querySelectorAll("[data-action='start']").forEach((btn) => {
    btn.addEventListener("click", start);
  });

  /* ----- Questions ----- */
  function renderQuestion() {
    const q = QUESTIONS[state.current];
    $("dx-current").textContent = state.current + 1;
    $("dx-total-q").textContent = QUESTIONS.length;
    $("dx-q-no").textContent = String(state.current + 1).padStart(2, "0");
    $("dx-q-text").textContent = q.text;
    $("dx-q-help").textContent = q.help;
    $("dx-pillar").textContent = q.pillar ? PILLAR_LABEL[q.pillar] : q.section;
    $("dx-bar").style.width = (state.current / QUESTIONS.length) * 100 + "%";
    $("dx-back").disabled = state.current === 0;

    const wrap = $("dx-options");
    wrap.innerHTML = "";
    q.options.forEach((opt) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "dx-option";
      if (state.answers[q.id] === opt.value) b.classList.add("is-selected");
      const key = document.createElement("span");
      key.className = "dx-key";
      key.textContent = opt.key;
      const label = document.createElement("span");
      label.className = "dx-label";
      label.textContent = opt.label;
      b.appendChild(key);
      b.appendChild(label);
      b.addEventListener("click", () => {
        state.answers[q.id] = opt.value;
        wrap.querySelectorAll(".dx-option").forEach((x) => x.classList.remove("is-selected"));
        b.classList.add("is-selected");
        setTimeout(advance, 220);
      });
      wrap.appendChild(b);
    });
  }

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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      $("dx-bar").style.width = "100%";
      state.score = computeScore(state.answers);
      state.route = routeResult(state.answers, state.score);
      renderResults();
      showState("results");
    }
  }

  /* ----- Results ----- */
  function setBar(pillar, value) {
    $("sb-bar-" + pillar).style.width = Math.round((value / 30) * 100) + "%";
    $("sb-num-" + pillar).textContent = value;
  }

  function renderResults() {
    const { score, route, answers } = state;
    const c = resultContent(route, answers, score);

    $("sb-label").textContent = c.label;
    if (window.typewriter) window.typewriter.play($("sb-headline"), c.headline);
    else $("sb-headline").innerHTML = c.headline;

    $("sb-total").textContent = score.total;
    // Reset then set, so the bars animate when the diagnostic is retaken.
    PILLAR_ORDER.forEach((p) => ($("sb-bar-" + p).style.width = "0%"));
    requestAnimationFrame(() =>
      requestAnimationFrame(() => PILLAR_ORDER.forEach((p) => setBar(p, score.pillars[p])))
    );
    PILLAR_ORDER.forEach((p) => {
      $("sb-row-" + p).classList.toggle("is-gap", p === score.gap && !score.allStrong);
    });
    $("sb-gap").textContent = c.gapLine;

    const body = $("sb-body");
    body.innerHTML = "";
    c.body.forEach((para) => {
      const el = document.createElement("p");
      el.textContent = para;
      body.appendChild(el);
    });
    if (c.extra) {
      const el = document.createElement("p");
      el.className = "sb-extra";
      el.textContent = c.extra;
      body.appendChild(el);
    }

    $("sb-what-title").textContent = c.whatTitle;
    const what = $("sb-what");
    what.innerHTML = "";
    c.what.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      what.appendChild(li);
    });

    const btn = $("sb-button");
    btn.textContent = c.button.text;
    btn.href = c.button.href;
    const second = $("sb-second");
    second.hidden = !c.second;
    if (c.second) {
      second.textContent = c.second.text;
      second.href = c.second.href;
    }
    $("sb-under").textContent = c.under;
    $("sb-under").hidden = !c.under;

    // The nine scored answers.
    const bd = $("dx-breakdown");
    bd.innerHTML = "";
    let n = 0;
    QUESTIONS.forEach((q) => {
      if (!q.pillar) return;
      n++;
      const v = Number(answers[q.id]) || 0;
      const status = v === 10 ? "won" : v === 5 ? "partial" : "missed";
      const label = v === 10 ? "Strong" : v === 5 ? "Partly" : "Gap";
      const li = document.createElement("li");
      li.className = "dx-bd-item dx-bd-" + status;
      li.innerHTML =
        '<span class="dx-bd-num">' + String(n).padStart(2, "0") + "</span>" +
        '<div class="dx-bd-body"><div class="dx-bd-head"><h4></h4>' +
        '<span class="dx-bd-status">' + label + "</span></div>" +
        '<p class="dx-bd-pillar">' + PILLAR_LABEL[q.pillar] + "</p></div>";
      li.querySelector("h4").textContent = q.title;
      bd.appendChild(li);
    });

    // Reset the email block.
    $("sb-email-form").hidden = false;
    $("sb-email-done").hidden = true;
    $("sb-email-error").hidden = true;

    try {
      localStorage.setItem(
        "sbd_last_result",
        JSON.stringify({ at: new Date().toISOString(), score, route })
      );
    } catch (_) {}
  }

  /* ----- Optional email ----- */
  $("sb-email-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("sb-name").value.trim();
    const email = $("sb-email").value.trim();
    const err = $("sb-email-error");
    err.hidden = true;

    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      err.textContent = "Please add your first name and a valid email address.";
      err.hidden = false;
      return;
    }
    if (!WEBHOOK_URL) {
      // Never tell someone an email is on its way when it is not.
      err.textContent =
        "Email is not connected yet on this preview. Your result above is complete.";
      err.hidden = false;
      return;
    }

    const c = resultContent(state.route, state.answers, state.score);
    const payload = {
      source: "studio-business-diagnostic",
      submitted_at: new Date().toISOString(),
      name,
      email,
      consent: $("sb-consent").checked,
      result: c.name,
      result_version: state.route.version,
      flodesk_tag: c.tag,
      score: state.score.total,
      pillars: state.score.pillars,
      biggest_gap: PILLAR_LABEL[state.score.gap],
      answers: state.answers,
    };

    const submit = $("sb-email-submit");
    submit.disabled = true;
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Webhook returned " + res.status);
      $("sb-email-form").hidden = true;
      $("sb-email-done").hidden = false;
    } catch (_) {
      err.textContent =
        "That did not send. Please try again, or email hello@designinkco.com and I will send it to you.";
      err.hidden = false;
    } finally {
      submit.disabled = false;
    }
  });

  /* ----- Restart ----- */
  $("dx-restart").addEventListener("click", (e) => {
    e.preventDefault();
    state.current = 0;
    state.answers = {};
    $("sb-email-form").reset();
    showState("intro");
  });
}
