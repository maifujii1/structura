const MODES = {
  process: {
    title: "Process Flow",
    description: "Best for SOPs, procedures, workflows, and numbered instructions.",
    rule: "Looks for explicit actions, ordering, thresholds, and decision language.",
    example: `A customer submits a loan application through the online portal. The operations team checks whether the application is complete. If information is missing, the application is returned to the customer for correction. Once complete, the risk team reviews the applicant's credit profile and debt-to-income ratio. Applications above the risk threshold are declined. Eligible applications are approved and sent to funding. Funding issues the agreement, confirms acceptance, and releases the funds.`
  },
  business: {
    title: "Business Brief",
    description: "Best for business notes that explicitly contain goals, metrics, risks, and next steps.",
    rule: "Extracts only explicit business signals; it does not invent hidden insights.",
    example: `Objective: improve mobile checkout conversion before the holiday season. Mobile abandonment rose to 41% in July from 34% in May. Customer interviews suggest unexpected shipping costs and mandatory account creation are the main friction points. Guest checkout increased completion by 9% in a prototype test. The redesign is estimated to cost $18,000 and take six weeks. A payment-provider migration may delay launch by up to two weeks. Product should run a larger guest-checkout test, analytics should validate the abandonment funnel, and finance should confirm the implementation budget by September 5.`
  },
  study: {
    title: "Study Notes",
    description: "Choose the note format first so Structura can parse the structure instead of guessing concepts.",
    rule: "Study mode never invents topic names; it only uses headings, bullets, definitions, or STEM labels it can detect.",
    example: `Market structures describe how firms compete. Perfect competition has many firms, identical products, free entry, and firms are price takers. Monopolistic competition also has many firms, but products are differentiated and firms have some pricing power. Oligopoly has a small number of interdependent firms, so strategic behavior matters. Monopoly has one dominant seller and high barriers to entry. Barriers can include patents, economies of scale, control of scarce resources, and regulation.`
  },
  timeline: {
    title: "Timeline",
    description: "Best for dated project notes, histories, milestones, and event logs.",
    rule: "Uses explicit dates or sequence markers and ignores undated commentary.",
    example: `In January 2026, the team completed initial customer interviews. On February 12, the first prototype was approved for development. By March 2026, engineering completed the MVP. User testing began on April 8, 2026. In May, the team identified onboarding friction and redesigned the first-run experience. The public beta launched on June 20. In July 2026, the team completed the post-launch review and prioritized retention improvements.`
  },
  decision: {
    title: "Decision Tree",
    description: "Best for policies and rules that already use if / else / unless / threshold logic.",
    rule: "Only explicit conditional language is converted into branches.",
    example: `A purchase request starts with the team lead. If the purchase is under $500, the team lead can approve it directly. If it is $500 or more, check whether the item is already included in the approved project budget. If it is budgeted, finance approval is required. If it is not budgeted, the project director must review it. If the director declines the request, do not purchase the item. Otherwise, send it to finance for final approval.`
  },
  recipe: {
    title: "Recipe Flow",
    description: "Best for recipes with an ingredient list plus instructions or method section.",
    rule: "Parses quantities, ingredients, cooking verbs, time, temperature, and sequence; site filler is ignored.",
    example: `Brownies

Ingredients
4 oz (115 g) unsalted butter
1 cup (200 g) sugar
1/4 tsp vanilla extract
1 shot (60 mL) strong coffee
2 large eggs
1/2 cup (80 g) all-purpose flour
1/3 cup (80 g) cocoa powder
1/4 tsp baking soda
1/4 tsp table salt

Instructions
Butter and flour an 8x8-inch pan. Preheat the oven to 350°F (170°C). Melt the butter. Mix the melted butter with sugar, vanilla, and coffee. Add the eggs and mix until combined. Fold in the flour, cocoa, baking soda, and salt. Transfer to the pan and bake at 350°F for 30 to 40 minutes. Cool before slicing.`
  }
};


const STUDY_TYPES = {
  textbook: {
    title: "Textbook / Reading",
    help: "Expects section headings followed by explanatory paragraphs, or inline headings followed by an em dash.",
    example: `Improper Integrals

Improper integrals appear when an ordinary definite integral no longer has a finite interval of integration or when the function being integrated becomes unbounded somewhere in the interval. These situations cannot be treated exactly like ordinary proper integrals. Instead, limits are used to define the integral, and the resulting limit tells us whether the improper integral converges to a finite value or diverges.

Comparison Test for Improper Integrals — Direct evaluation is not always practical. The Comparison Test lets us compare a difficult improper integral with another integral whose convergence behavior is already known. If the comparison conditions are satisfied, the behavior of the simpler integral tells us whether the original integral converges or diverges.

Approximating Definite Integrals — Some definite integrals cannot be evaluated using elementary antiderivatives. In those cases, numerical methods estimate the value of the integral. Rectangles, trapezoids, or other simple geometric approximations can provide a useful answer even when an exact symbolic result is unavailable.

Integrals Involving Trig Functions — Trigonometric integrals often contain products or powers of sine, cosine, tangent, or secant. Different identities and substitutions are useful depending on which functions appear and whether their powers are odd or even.

Integrals Involving Quadratics — Integrals containing quadratic expressions may require completing the square or choosing a substitution that matches the form of the quadratic. The purpose is to rewrite the integrand into a form whose antiderivative is easier to recognize.`
  },

  lecture: {
    title: "Lecture / Bullet Notes",
    help: "Expects headings, bullets, numbered points, or short note fragments with obvious topic labels.",
    example: `Functions

Why use functions?
- Decomposition: A large program can be difficult to reason about all at once. Functions allow us to break the overall problem into smaller sub-problems that can be designed and solved separately.
- Collaboration: In a team project, different programmers can work on different functions at the same time and later integrate those pieces into one larger program.
- Reusability: If the same behavior is needed in several places, a function lets us reuse the implementation instead of writing the same logic again and again.
- Reliability: Reusing code reduces duplicated logic. Fewer repeated lines can also mean fewer opportunities to introduce inconsistent behavior or bugs.
- Testing: Smaller functions are easier to isolate and test individually. When a bug appears, debugging is usually easier because the problem can be narrowed to a smaller unit.`
  },

  definitions: {
    title: "Definitions",
    help: "Expects Term: definition, Term — definition, or clear 'X is...' / 'X refers to...' statements.",
    example: `Recursion: A programming technique in which a function calls itself. Recursion is useful when a problem can naturally be expressed as a smaller version of the same problem.

Base case: The condition that stops the recursive process. Without a valid base case, the function may continue calling itself until the program runs out of stack space.

Recursive case: The part of a recursive function that reduces the problem and calls the function again. Each recursive call should make progress toward the base case.

Stack frame: The block of memory associated with one function call. It stores local variables, parameters, and the information required to return to the previous call after the current call finishes.`
  },

  stem: {
    title: "Math / STEM",
    help: "Expects labeled definitions, theorems, rules, tests, methods, formulas, or examples.",
    example: `Definition: Improper Integral
An integral is improper when the interval of integration is infinite or when the integrand becomes unbounded. The integral is defined using a limit, and the value of that limit determines whether the improper integral converges or diverges.

Comparison Test
Suppose 0 ≤ f(x) ≤ g(x) for sufficiently large x. If the improper integral of g converges, then the improper integral of f also converges. This test is helpful when evaluating f directly is difficult but a simpler comparison function is available.

Method: Trig Substitution
Trig substitution is useful for integrals containing square roots of quadratic expressions such as a² − x², a² + x², or x² − a². A trigonometric identity is chosen so that the square root simplifies after the substitution.

Formula
∫ sec²(x) dx = tan(x) + C

Example
For an expression containing √(a² − x²), the substitution x = a sin(θ) simplifies the radical because 1 − sin²(θ) = cos²(θ).`
  }
};

const LIMITS = {
  concise:  { process: 6, business: 4, study: 4, timeline: 6, decision: 5, recipe: 7 },
  standard: { process: 9, business: 6, study: 6, timeline: 9, decision: 8, recipe: 10 },
  detailed: { process: 13, business: 8, study: 9, timeline: 13, decision: 11, recipe: 14 }
};

const MAX_INPUT_CHARS = 100000;

const STOPWORDS = new Set(`a an the and or but if then else when while of to in on at for from by with without into onto over under is are was were be been being this that these those it its as about than so such can could should would may might must will just very also only more most some any all each other another do does did done have has had having we you they he she i our your their his her them us not no yes via per within across after before between during through up down out off again further once here there why how what which who whom where`.split(/\s+/));

const NOISE_PATTERNS = [
  /^(jump to|skip to|print|pin|rate|reviews?|comments?|share|save|subscribe|newsletter|advertisement|sponsored)$/i,
  /^(us customary|metric|1x|2x|3x|servings?|yield|course|cuisine|author|nutrition|calories)$/i,
  /^(table of contents|related recipes?|recommended|you may also like|more recipes?)$/i,
  /^(instagram|facebook|pinterest|youtube|tiktok|email)$/i,
  /^(before you start|nami'?s tip|tips?|notes?|storage|how to store|to store)$/i
];

const ACTION_VERBS = [
  "submit","review","check","verify","approve","decline","reject","send","return","process","issue","release",
  "confirm","create","collect","analyze","assess","validate","test","design","build","launch","complete","notify",
  "assign","record","update","calculate","compare","select","request","escalate","route","prepare","schedule","deliver",
  "monitor","measure","identify","develop","implement","transfer","fund","sign","open","close","start","finish","pay"
];

const COOKING_VERBS = [
  "preheat","prepare","place","press","heat","microwave","melt","mix","stir","whisk","beat","blend","combine","fold","add",
  "pour","transfer","bake","cook","boil","simmer","fry","sear","roast","grill","chop","slice","dice","mince","knead",
  "roll","shape","chill","cool","rest","freeze","refrigerate","serve","line","grease","sprinkle","drizzle","strain",
  "drain","proof","marinate","season","toss","coat","spread","arrange","divide","incorporate","sift"
];

const RISK_WORDS = /\b(risk|issue|problem|concern|delay|friction|barrier|threat|challenge|uncertain|constraint|blocker|decline|drop|shortfall|failure)\b/i;
const ACTION_WORDS = /\b(should|must|need to|next step|action|owner|confirm|test|validate|review|follow up|follow-up|implement|launch|complete|deliver|decide|approve)\b/i;
const OBJECTIVE_WORDS = /\b(objective|goal|aim|purpose|target|priority|we need to|we want to|problem to solve)\b/i;
const DECISION_WORDS = /\b(if|unless|otherwise|else|whether|depending on|provided that|in case|threshold|more than|less than|at least|at most)\b/i;

let mode = "process";
let detail = "concise";
let outputMode = "both";
let studyType = "textbook";
let result = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const sourceText = $("#sourceText");
const outputStage = $("#outputStage");
const toast = $("#toast");

/* ---------- UI ---------- */

$("#modeBar").addEventListener("click", (event) => {
  const button = event.target.closest(".mode");
  if (!button) return;
  $$(".mode").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  mode = button.dataset.mode;
  $("#modeTitle").textContent = MODES[mode].title;
  $("#modeDescription").textContent = MODES[mode].description;

  const studyGroup = $("#studyTypeGroup");
  studyGroup.hidden = mode !== "study";

  if (mode === "study") {
    $("#ruleTitle").textContent = STUDY_TYPES[studyType].title;
    $("#ruleDescription").textContent = STUDY_TYPES[studyType].help;
  } else {
    $("#ruleTitle").textContent = `${detail[0].toUpperCase() + detail.slice(1)} extraction`;
    $("#ruleDescription").textContent = MODES[mode].rule;
  }

  result = null;
  renderEmpty();
});

$("#detailControl").addEventListener("click", (event) => {
  const button = event.target.closest(".segment");
  if (!button) return;
  $$("#detailControl .segment").forEach(x => x.classList.remove("active"));
  button.classList.add("active");
  detail = button.dataset.detail;
  const prefix = detail[0].toUpperCase() + detail.slice(1);

  if (mode === "study") {
    $("#ruleTitle").textContent = STUDY_TYPES[studyType].title;
    $("#ruleDescription").textContent = STUDY_TYPES[studyType].help;
  } else {
    $("#ruleTitle").textContent = `${prefix} extraction`;
  }
});

$("#studyTypeControl").addEventListener("click", (event) => {
  const button = event.target.closest(".segment");
  if (!button) return;

  $$("#studyTypeControl .segment").forEach(x => x.classList.remove("active"));
  button.classList.add("active");
  studyType = button.dataset.studyType;

  $("#ruleTitle").textContent = STUDY_TYPES[studyType].title;
  $("#ruleDescription").textContent = STUDY_TYPES[studyType].help;

  result = null;
  renderEmpty();
});

$("#outputControl").addEventListener("click", (event) => {
  const button = event.target.closest(".segment");
  if (!button) return;
  $$("#outputControl .segment").forEach(x => x.classList.remove("active"));
  button.classList.add("active");
  outputMode = button.dataset.output;
  if (result) renderResult(result);
});

sourceText.addEventListener("input", () => {
  const count = sourceText.value.length;
  $("#charCount").textContent = `${count.toLocaleString()} character${count === 1 ? "" : "s"}`;
});

sourceText.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    transformNow();
  }
});

$("#loadExample").addEventListener("click", () => {
  sourceText.value = mode === "study" ? STUDY_TYPES[studyType].example : MODES[mode].example;
  sourceText.dispatchEvent(new Event("input"));
  sourceText.focus();
});

$("#clearInput").addEventListener("click", () => {
  sourceText.value = "";
  sourceText.dispatchEvent(new Event("input"));
  result = null;
  renderEmpty();
  sourceText.focus();
});

$("#transformButton").addEventListener("click", transformNow);

$("#copyOutput").addEventListener("click", async () => {
  if (!result) return say("Nothing to copy yet.");
  try {
    await navigator.clipboard.writeText(resultToText(result));
    say("Concise output copied.");
  } catch {
    say("Copy failed — use the Text view.");
  }
});

$("#downloadOutput").addEventListener("click", () => {
  if (!result) return say("Nothing to download yet.");
  const blob = new Blob([resultToText(result)], {type: "text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `structura-${mode}-${detail}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  say("Output downloaded.");
});

$("#themeToggle").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("structura-theme", next);
});

(() => {
  const saved = localStorage.getItem("structura-theme");
  if (saved) document.documentElement.dataset.theme = saved;
  else if (matchMedia?.("(prefers-color-scheme: dark)").matches) document.documentElement.dataset.theme = "dark";
})();

function transformNow() {
  const text = sourceText.value.trim();

  if (!text) {
    say("Paste some text first.");
    sourceText.focus();
    return;
  }

  if (text.length > MAX_INPUT_CHARS) {
    renderFailure(`This input is too large to process safely in the browser. Keep it under ${MAX_INPUT_CHARS.toLocaleString()} characters.`);
    say("Input is too large.");
    return;
  }

  const handlers = {
    process: processFlow,
    business: businessBrief,
    study: studyMap,
    timeline: timelineFlow,
    decision: decisionTree,
    recipe: recipeFlow
  };

  try {
    result = mode === "study"
      ? studyMap(text, detail, studyType)
      : handlers[mode](text, detail);

    if (!result || typeof result !== "object") {
      throw new Error("Parser returned no structured result.");
    }

    result.stats = buildStats(text, result);
    renderResult(result);
  } catch (error) {
    console.error("Structura parser error:", error);
    result = null;
    renderFailure("Structura could not reliably parse this input. Check that it matches the selected format, then try again.");
    say("Could not restructure this input.");
  }
}
function say(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(say.timer);
  say.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function renderEmpty() {
  outputStage.className = "output-stage empty-state";
  outputStage.innerHTML = `
    <div class="empty-diagram"><span></span><i></i><span></span><i></i><span></span></div>
    <h4>Less text. More structure.</h4>
    <p>Paste something on the left and Structura will filter it using deterministic parsing rules.</p>`;
}

function renderFailure(message) {
  outputStage.className = "output-stage";
  outputStage.innerHTML = `
    <div class="parser-warning">
      <strong>Unable to restructure this input</strong>
      <p>${escapeHtml(message)}</p>
    </div>`;
}

/* ---------- Core text utilities ---------- */

function uniqueArray(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function normalizeWhitespace(text) {
  return text.replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

function cleanLine(line) {
  return line
    .replace(/^[•●▪◦]\s*/, "")
    .replace(/^\s*[-–—]\s+/, "")
    .replace(/^\s*\d+[.)]\s*/, "")
    .trim();
}

function isNoiseLine(line) {
  const cleaned = cleanLine(line);
  if (!cleaned) return false;
  if (NOISE_PATTERNS.some(pattern => pattern.test(cleaned))) return true;
  if (/^(https?:\/\/|www\.)/i.test(cleaned)) return true;
  if (/^(©|copyright|privacy policy|terms of use|all rights reserved)/i.test(cleaned)) return true;
  return false;
}

function splitSentences(text) {
  const normalized = normalizeWhitespace(text)
    .split("\n")
    .map(cleanLine)
    .filter(line => line && !isNoiseLine(line))
    .join("\n");

  const parts = normalized
    .split(/\n|(?<=[.!?])\s+(?=[A-Z0-9“"'(])/)
    .map(s => s.trim())
    .filter(s => s.length > 2);

  return dedupeSentences(parts);
}

function words(text) {
  return (text.toLowerCase().match(/[a-z][a-z'-]*/g) || [])
    .filter(word => word.length > 2 && !STOPWORDS.has(word));
}

function tokens(text) {
  return new Set(words(text));
}

function jaccard(a, b) {
  const A = tokens(a), B = tokens(b);
  if (!A.size || !B.size) return 0;
  let intersection = 0;
  A.forEach(x => { if (B.has(x)) intersection++; });
  return intersection / (A.size + B.size - intersection);
}

function dedupeSentences(sentences) {
  const output = [];
  for (const sentence of sentences) {
    if (!output.some(existing => jaccard(existing, sentence) > 0.78)) output.push(sentence);
  }
  return output;
}

function frequencyMap(text) {
  const freq = new Map();
  words(text).forEach(word => freq.set(word, (freq.get(word) || 0) + 1));
  return freq;
}

function sentenceFrequencyScore(sentence, freq) {
  const ws = words(sentence);
  if (!ws.length) return 0;
  return ws.reduce((sum, word) => sum + Math.min(freq.get(word) || 0, 4), 0) / Math.sqrt(ws.length);
}

function containsNumber(sentence) {
  return /(?:[$€£]\s?\d|\b\d+(?:[.,]\d+)?%|\b\d{1,4}\b)/.test(sentence);
}

function sourceOrderedTop(sentences, scorer, limit) {
  return sentences
    .map((text, index) => ({text, index, score: scorer(text, index)}))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .sort((a, b) => a.index - b.index);
}

function compact(text, max = 150) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : clean;
}

function stripLeadIn(text) {
  return text
    .replace(/^(please note that|please note,?|note that|in order to|it is important to|you will need to|you can|you should|we should)\s+/i, "")
    .trim();
}

function titleCase(text) {
  return text.replace(/\b\w/g, char => char.toUpperCase());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildStats(source, result) {
  const sourceWords = source.trim().split(/\s+/).filter(Boolean).length;
  const out = resultToText(result);
  const outputWords = out.trim().split(/\s+/).filter(Boolean).length;
  const reduction = sourceWords ? Math.max(0, Math.round((1 - outputWords / sourceWords) * 100)) : 0;
  return {sourceWords, outputWords, reduction};
}

function makeSummary(points, fallback) {
  if (!points?.length) return fallback;
  return compact(points[0], 135);
}

/* ---------- Process Flow ---------- */

function processVerb(sentence) {
  const lower = sentence.toLowerCase();
  let best = "";
  let bestIndex = Infinity;

  for (const verb of ACTION_VERBS) {
    // "Funding" is often a team/department noun ("Funding issues the agreement"),
    // not the verb "fund". Treat it as a role so the real action verb can win.
    if (verb === "fund") continue;

    const regex = new RegExp(`\\b${verb}(?:s|es|ed|ing)?\\b`, "i");
    const match = regex.exec(lower);
    if (match && match.index < bestIndex) {
      best = verb;
      bestIndex = match.index;
    }
  }
  return best;
}

function imperativeVerb(verb) {
  const map = {
    submit:"Submit", review:"Review", check:"Check", verify:"Verify",
    approve:"Approve", decline:"Decline", reject:"Reject", send:"Send",
    return:"Return", process:"Process", issue:"Issue", release:"Release",
    confirm:"Confirm", create:"Create", collect:"Collect", analyze:"Analyze",
    assess:"Assess", validate:"Validate", test:"Test", design:"Design",
    build:"Build", launch:"Launch", complete:"Complete", notify:"Notify",
    assign:"Assign", record:"Record", update:"Update", calculate:"Calculate",
    compare:"Compare", select:"Select", request:"Request", escalate:"Escalate",
    route:"Route", prepare:"Prepare", schedule:"Schedule", deliver:"Deliver",
    monitor:"Monitor", measure:"Measure", identify:"Identify", develop:"Develop",
    implement:"Implement", transfer:"Transfer", fund:"Fund", sign:"Sign",
    open:"Open", close:"Close", start:"Start", finish:"Finish"
  };
  return map[verb] || titleCase(verb);
}

function processObjectHint(sentence) {
  const hints = [
    [/\bloan application\b/i, "application"],
    [/\bapplication\b/i, "application"],
    [/\bcredit profile\b/i, "credit profile"],
    [/\bdebt-to-income ratio\b/i, "DTI"],
    [/\bagreement\b/i, "agreement"],
    [/\bacceptance\b/i, "acceptance"],
    [/\bfunds?\b/i, "funds"],
    [/\binformation\b/i, "information"],
    [/\bbudget\b/i, "budget"],
    [/\bdocuments?\b/i, "documents"],
    [/\brequest\b/i, "request"]
  ];

  for (const [pattern, label] of hints) {
    if (pattern.test(sentence)) return label;
  }
  return "";
}

function conciseProcessAction(sentence) {
  const clean = stripLeadIn(sentence)
    .replace(/^(once complete|once approved|then|next|finally|after that|afterwards),?\s+/i, "")
    .replace(/[.!?]+$/, "")
    .trim();

  if (/\breturned\b/i.test(clean) && /\bcorrection\b/i.test(clean)) return "Return for correction";
  if (/\bsent\b/i.test(clean) && /\bfunding\b/i.test(clean)) return "Send to funding";

  const passive = clean.match(/\b(?:is|are|was|were)\s+(approved|declined|rejected|returned|sent|released|reviewed|confirmed|assigned|processed)\b/i);
  if (passive) {
    const map = {
      approved:"Approve", declined:"Decline", rejected:"Reject", returned:"Return",
      sent:"Send", released:"Release", reviewed:"Review", confirmed:"Confirm",
      assigned:"Assign", processed:"Process"
    };
    const object = processObjectHint(clean) || "item";
    return `${map[passive[1].toLowerCase()]} ${object}`;
  }

  const verb = processVerb(clean);
  if (!verb) return titleCase(compact(clean, 34));

  if (verb === "submit" && /\bapplication\b/i.test(clean)) return "Submit application";
  if (verb === "review" && /\bcredit profile\b/i.test(clean)) {
    return /\bdebt-to-income\b/i.test(clean) ? "Review credit profile & DTI" : "Review credit profile";
  }
  if (verb === "issue" && /\bagreement\b/i.test(clean)) return "Issue agreement";
  if (verb === "confirm" && /\bacceptance\b/i.test(clean)) return "Confirm acceptance";
  if (verb === "release" && /\bfunds?\b/i.test(clean)) return "Release funds";
  if (verb === "approve" && /\bapplication\b/i.test(clean)) return "Approve application";
  if (verb === "decline" && /\bapplication\b/i.test(clean)) return "Decline application";
  if (verb === "return" && /\bcorrection\b/i.test(clean)) return "Return for correction";
  if (verb === "send" && /\bfunding\b/i.test(clean)) return "Send to funding";

  const object = processObjectHint(clean);
  return `${imperativeVerb(verb)}${object ? ` ${object}` : ""}`.trim();
}

function splitProcessActions(sentence) {
  let clean = String(sentence || "").replace(/[.!?]+$/, "").trim();
  const verbPattern = ACTION_VERBS.join("|");

  // Split active compound verbs: "issues agreement, confirms acceptance, and releases funds".
  const parts = clean.split(
    new RegExp(`,\\s*(?:and\\s+)?(?=(?:${verbPattern})(?:s|es|ed|ing)?\\b)|\\s+and\\s+(?=(?:${verbPattern})(?:s|es|ed|ing)?\\b)|;\\s*`, "i")
  );

  // Split passive compound: "approved and sent to funding".
  const expanded = [];
  for (const part of parts) {
    const passivePair = part.match(/^(.*?\\b(?:is|are|was|were)\\s+approved)\\s+and\\s+(sent\\b.*)$/i);
    if (passivePair) {
      expanded.push(passivePair[1], passivePair[2]);
    } else {
      expanded.push(part);
    }
  }

  return expanded
    .map(part => part.trim())
    .filter(Boolean)
    .filter(part =>
      processVerb(part) ||
      /\b(?:is|are|was|were)\s+(?:approved|declined|rejected|returned|sent|released|reviewed|confirmed|assigned|processed)\b/i.test(part)
    );
}

function processConditionLabel(text) {
  const condition = String(text || "")
    .replace(/^(?:if|whether|when)\s+/i, "")
    .replace(/[,:;.!?]+$/, "")
    .replace(/\bthe\b/ig, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (/\bapplication\b.*\bcomplete\b/i.test(condition)) return "Application complete?";
  if (/\binformation\b.*\bmissing\b/i.test(condition)) return "Information missing?";
  if (/\b(?:above|over|exceeds?|exceeding|greater than)\b.*\brisk threshold\b/i.test(condition) ||
      /\brisk threshold\b.*\b(?:above|over|exceeds?)\b/i.test(condition)) {
    return "Risk threshold exceeded?";
  }

  return `${condition.charAt(0).toUpperCase()}${condition.slice(1)}?`;
}

function explicitProcessDecision(sentence) {
  const s = String(sentence || "").replace(/[.!?]+$/, "").trim();

  const whether = s.match(/(?:check|checks|verify|verifies|determine|determines|decide|decides)\s+whether\s+(.+)$/i);
  if (whether) {
    return {condition: processConditionLabel(whether[1]), yes:"", no:"", continueBranch:"yes", type:"whether"};
  }

  const ifMatch = s.match(/^if\s+(.+?)[,:]\s*(.+)$/i);
  if (ifMatch) {
    return {
      condition: processConditionLabel(ifMatch[1]),
      yes: conciseProcessAction(ifMatch[2]),
      no:"",
      continueBranch:"no",
      type:"if"
    };
  }

  if (/\bapplications?\b.*\b(?:above|over)\b.*\brisk threshold\b.*\bdeclined\b/i.test(s)) {
    return {
      condition:"Risk threshold exceeded?",
      yes:"Decline application",
      no:"",
      continueBranch:"no",
      type:"threshold"
    };
  }

  return null;
}

function processFlow(text, detailLevel) {
  const sentences = splitSentences(text);
  const steps = [];
  const limit = detailLevel === "concise" ? 9 : detailLevel === "standard" ? 12 : 16;

  for (const sentence of sentences) {
    const decision = explicitProcessDecision(sentence);

    if (decision?.type === "whether") {
      steps.push({
        kind:"decision",
        label:decision.condition,
        yes:"",
        no:"",
        continueBranch:"yes"
      });
      continue;
    }

    if (decision?.type === "if") {
      const previous = [...steps].reverse().find(step => step.kind === "decision");

      if (
        previous &&
        /application complete/i.test(previous.label) &&
        /information missing/i.test(decision.condition)
      ) {
        previous.no = decision.yes || "Return for correction";
        previous.yes = "Continue";
        previous.continueBranch = "yes";
        continue;
      }

      steps.push({
        kind:"decision",
        label:decision.condition,
        yes:decision.yes || "Continue",
        no:"Continue",
        continueBranch:"no"
      });
      continue;
    }

    if (decision?.type === "threshold") {
      steps.push({
        kind:"decision",
        label:decision.condition,
        yes:decision.yes,
        no:"",
        continueBranch:"no"
      });
      continue;
    }

    const previousDecision = [...steps].reverse().find(step => step.kind === "decision");
    if (
      previousDecision &&
      /risk threshold/i.test(previousDecision.label) &&
      /eligible applications?.*(?:approved|sent to funding)/i.test(sentence)
    ) {
      previousDecision.no = "Approve application";
      previousDecision.continueBranch = "no";
      if (/sent to funding/i.test(sentence)) {
        steps.push({kind:"action", label:"Send to funding"});
      }
      continue;
    }

    const clauses = splitProcessActions(sentence);
    for (const clause of clauses) {
      const label = conciseProcessAction(clause);
      if (!label) continue;

      if (!steps.some((step, index) =>
        index >= Math.max(0, steps.length - 2) &&
        step.kind === "action" &&
        step.label.toLowerCase() === label.toLowerCase()
      )) {
        steps.push({kind:"action", label});
      }
    }

    if (steps.length >= limit) break;
  }

  for (const step of steps) {
    if (step.kind !== "decision") continue;
    if (step.continueBranch === "yes" && !step.yes) step.yes = "Continue";
    if (step.continueBranch === "no" && !step.no) step.no = "Continue";
  }

  const trimmed = steps.slice(0, limit);
  const actionCount = trimmed.filter(step => step.kind === "action").length;
  const decisionCount = trimmed.filter(step => step.kind === "decision").length;

  return {
    mode:"process",
    title:"Process Flow",
    summary:`${actionCount} actions · ${decisionCount} decision${decisionCount === 1 ? "" : "s"}`,
    keyPoints:[],
    steps:trimmed
  };
}
/* ---------- Business Brief ---------- */

function extractMetricSnippets(sentence) {
  const regex = /(?:[$€£]\s?\d[\d,.]*(?:\s?(?:million|billion|k|m))?|\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?\s?(?:weeks?|months?|days?|users?|customers?|units?|hours?)\b)/gi;
  const matches = sentence.match(regex) || [];
  return [...new Set(matches.map(x => x.trim()))];
}

function bestSentence(sentences, predicate, freq) {
  const matches = sentences.filter(predicate);
  if (!matches.length) return "";
  return matches
    .map(s => ({s, score: sentenceFrequencyScore(s, freq) + (containsNumber(s) ? 1 : 0)}))
    .sort((a, b) => b.score - a.score)[0].s;
}

function businessPhrase(text, maxWords = 18) {
  let clean = String(text || "")
    .replace(/^objective\s*:\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return "";

  const firstSentence = splitSentences(clean)[0] || clean;
  const clause = firstSentence
    .split(/;\s+|,\s+(?=(?:but|while|whereas|although|however)\b)/i)[0]
    .replace(/[.!?]+$/, "")
    .trim();

  const wordsList = clause.split(/\s+/).filter(Boolean);

  if (wordsList.length <= maxWords) {
    return clause + ".";
  }

  // Keep a complete clause rather than adding an ellipsis.
  const natural = clause.match(/^(.{20,130}?\b(?:before|because|by|from|to|with)\b[^,.;]{2,45})/i);
  if (natural && natural[1].split(/\s+/).length <= maxWords + 5) {
    return natural[1].replace(/[,:;]+$/, "") + ".";
  }

  return firstSentence.replace(/[.!?]+$/, "") + ".";
}

function splitBusinessActions(sentence) {
  const clean = String(sentence || "").replace(/[.!?]+$/, "").trim();

  // "Product should X, analytics should Y, and finance should Z"
  const parts = clean.split(/,\s+(?=(?:and\s+)?[A-Za-z][^,]{0,35}\b(?:should|must|needs? to|will)\b)|;\s+/i);

  return parts
    .map(part => part.replace(/^and\s+/i, "").trim())
    .filter(part => part.length >= 8);
}

function conciseMetric(sentence) {
  const snippets = extractMetricSnippets(sentence);
  if (!snippets.length) return "";

  if (/\babandon/i.test(sentence)) {
    const percentages = sentence.match(/\b\d+(?:\.\d+)?%/g) || [];
    const months = sentence.match(/\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\b/gi) || [];

    if (percentages.length >= 2 && months.length >= 2) {
      return `Abandonment ${percentages[0]} (${months[0]}) vs ${percentages[1]} (${months[1]})`;
    }

    return `Abandonment ${percentages.join(" vs ") || snippets.join(" · ")}`;
  }

  if (/\bguest checkout\b/i.test(sentence)) {
    const pct = sentence.match(/\b\d+(?:\.\d+)?%/i)?.[0];
    if (pct && /\bincreased?\b/i.test(sentence)) return `Guest checkout +${pct} completion`;
    return `Guest checkout ${snippets.join(" · ")}`;
  }

  if (/\b(redesign|implementation|cost|budget)\b/i.test(sentence)) {
    const duration = sentence.match(/\b(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:days?|weeks?|months?)\b/i)?.[0];
    return `Redesign ${snippets.join(" · ")}${duration ? ` · ${duration}` : ""}`;
  }

  if (/\bdelay|migration\b/i.test(sentence)) {
    return `Potential delay ${snippets.join(" · ")}`;
  }

  return `${snippets.join(" · ")} — ${businessPhrase(sentence, 12).replace(/\.$/, "")}`;
}
function businessBrief(text, detailLevel) {
  const ss = splitSentences(text);
  const freq = frequencyMap(text);

  const cleanObjective = businessPhrase(
    bestSentence(ss, sentence => OBJECTIVE_WORDS.test(sentence), freq) || ss[0] || "",
    detailLevel === "concise" ? 16 : 24
  );

  const metricLimit = detailLevel === "concise" ? 4 : detailLevel === "standard" ? 6 : 8;
  const findingLimit = detailLevel === "concise" ? 2 : detailLevel === "standard" ? 3 : 5;
  const riskLimit = detailLevel === "concise" ? 1 : detailLevel === "standard" ? 2 : 4;
  const actionLimit = detailLevel === "concise" ? 3 : detailLevel === "standard" ? 5 : 7;

  const metrics = uniqueArray(
    ss
      .filter(containsNumber)
      .map(conciseMetric)
      .filter(Boolean)
  ).slice(0, metricLimit);

  const isExplicitAction = sentence =>
    /\b(should|must|need to|needs to|next step|action item|owner|follow up|follow-up)\b/i.test(sentence) ||
    /^(confirm|validate|review|implement|deliver|decide|approve|run|test)\b/i.test(sentence.trim());

  const isMaterialRisk = sentence =>
    /\b(risk|delay|delayed|may delay|could delay|threat|blocker|failure|shortfall|uncertain|constraint)\b/i.test(sentence);

  const risks = sourceOrderedTop(
    ss.filter(isMaterialRisk),
    sentence =>
      7 +
      sentenceFrequencyScore(sentence, freq) +
      (/\bmay|could|risk|delay\b/i.test(sentence) ? 3 : 0),
    riskLimit
  ).map(item => businessPhrase(item.text, detailLevel === "concise" ? 18 : 26));

  const actions = [];
  for (const sentence of ss.filter(isExplicitAction)) {
    for (const action of splitBusinessActions(sentence)) {
      const cleaned = businessPhrase(action, detailLevel === "concise" ? 15 : 24);
      if (cleaned && !actions.includes(cleaned)) actions.push(cleaned);
      if (actions.length >= actionLimit) break;
    }
    if (actions.length >= actionLimit) break;
  }

  const excluded = new Set([
    ...ss.filter(sentence => OBJECTIVE_WORDS.test(sentence)),
    ...ss.filter(isMaterialRisk),
    ...ss.filter(isExplicitAction)
  ]);

  const findings = sourceOrderedTop(
    ss.filter(sentence => !excluded.has(sentence)),
    sentence =>
      sentenceFrequencyScore(sentence, freq) +
      (/\b(suggest|show|increase|decrease|because|main|friction|result|prototype|customer|interview)\b/i.test(sentence) ? 5 : 0) +
      (/\b(cost|budget|estimated to cost)\b/i.test(sentence) ? -2 : 0),
    findingLimit
  ).map(item => businessPhrase(item.text, detailLevel === "concise" ? 18 : 28));

  return {
    mode: "business",
    title: "Business Brief",
    summary: cleanObjective || "Explicit business signals extracted from the source.",
    keyPoints: [],
    objective: cleanObjective,
    findings,
    metrics,
    risks,
    actions
  };
}
/* ---------- Study Notes ---------- */

function studySourceLines(text) {
  return normalizeWhitespace(text)
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);
}

function isShortHeading(line) {
  const clean = cleanLine(line);
  if (!clean || clean.length > 82) return false;
  if (/^[•*-]\s/.test(line)) return false;
  if (/[.!?]$/.test(clean)) return false;
  if (/^\d+[.)]\s/.test(line)) return false;

  const wordsInLine = clean.split(/\s+/).length;
  if (wordsInLine > 10) return false;

  // Headings usually do not read like complete sentences.
  if (/\b(?:is|are|was|were|has|have|can|could|should|would|will)\b/i.test(clean) && wordsInLine > 5) {
    return false;
  }

  return true;
}

function conciseStudySentence(text, maxWords = 24) {
  let clean = String(text || "")
    .replace(/\s+/g, " ")
    .replace(/^\s*[-–—:]\s*/, "")
    .trim();

  if (!clean) return "";

  const first = splitSentences(clean)[0] || clean;
  const wordsList = first.replace(/[.!?]+$/, "").split(/\s+/).filter(Boolean);

  if (wordsList.length <= maxWords) {
    return wordsList.join(" ") + ".";
  }

  // Only shorten at a natural clause boundary. Otherwise keep the full sentence.
  const clause = first.split(/;\s+|,\s+(?=(?:but|while|whereas|although|however|so)\b)/i)[0].trim();
  if (
    clause.split(/\s+/).length >= 9 &&
    !/\b(?:because|to|and|or|which|that|for|with|of|into|from|by|as)$/i.test(clause)
  ) {
    return clause.replace(/[.!?]+$/, "") + ".";
  }

  return first.replace(/[.!?]+$/, "") + ".";
}

function noStudyStructure(type, message) {
  return {
    mode: "study",
    title: "Study Notes",
    summary: "No reliable structure detected",
    keyPoints: [],
    concepts: [],
    studyType: type,
    warning: message
  };
}

function parseTextbookSections(text, detailLevel) {
  const lines = studySourceLines(text);
  const sections = [];
  let current = null;

  for (const line of lines) {
    // Inline heading format: "Comparison Test — explanation..."
    const inline = line.match(/^(.{3,75}?)\s+[–—-]\s+(.{20,})$/);
    if (inline && isShortHeading(inline[1])) {
      if (current) sections.push(current);
      current = {heading: inline[1].trim(), body: [inline[2].trim()]};
      continue;
    }

    if (isShortHeading(line)) {
      if (current) sections.push(current);
      current = {heading: cleanLine(line), body: []};
      continue;
    }

    if (current) {
      current.body.push(line);
    }
  }

  if (current) sections.push(current);

  const usable = sections.filter(section =>
    section.heading &&
    section.body.join(" ").trim().length >= 20
  );

  if (usable.length < 2) {
    return noStudyStructure(
      "textbook",
      "Textbook mode needs clear section headings followed by explanatory text. Try preserving the headings when you copy the reading."
    );
  }

  const limit = LIMITS[detailLevel].study;
  const concepts = usable.slice(0, limit).map(section => ({
    name: section.heading,
    explanation: conciseStudySentence(section.body.join(" "), detailLevel === "concise" ? 22 : 32),
    related: []
  }));

  return {
    mode: "study",
    title: "Study Notes",
    summary: `${concepts.length} textbook sections`,
    keyPoints: concepts.map(x => x.name),
    concepts,
    studyType: "textbook"
  };
}

function parseLectureNotes(text, detailLevel) {
  const lines = normalizeWhitespace(text).split("\n");
  const groups = [];
  let currentHeading = "";
  let currentItems = [];

  const flush = () => {
    if (currentHeading && currentItems.length) {
      groups.push({heading: currentHeading, items: [...currentItems]});
    }
    currentItems = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const bullet = line.match(/^(?:[-*•▪◦]|\d+[.)])\s+(.+)$/);
    if (bullet) {
      currentItems.push(bullet[1].trim());
      continue;
    }

    const colon = line.match(/^(.{2,55}?):\s+(.{8,})$/);
    if (colon) {
      flush();
      currentHeading = colon[1].trim();
      currentItems.push(colon[2].trim());
      continue;
    }

    if (isShortHeading(line)) {
      flush();
      currentHeading = cleanLine(line);
      continue;
    }

    if (currentHeading && line.length <= 180) {
      currentItems.push(line);
    }
  }
  flush();

  if (!groups.length) {
    return noStudyStructure(
      "lecture",
      "Lecture / Bullets mode needs bullet points, numbered points, short headings, or 'Topic: note' formatting."
    );
  }

  const limit = LIMITS[detailLevel].study;
  const concepts = [];

  for (const group of groups) {
    const perGroup = detailLevel === "concise" ? 2 : 3;
    const items = group.items.slice(0, perGroup);

    for (let i = 0; i < items.length; i++) {
      let name = group.heading;
      if (items.length > 1) {
        const firstWords = words(items[i]).slice(0, 3);
        name = firstWords.length
          ? `${group.heading}: ${titleCase(firstWords.join(" "))}`
          : group.heading;
      }

      concepts.push({
        name,
        explanation: conciseStudySentence(items[i], detailLevel === "concise" ? 20 : 28),
        related: []
      });

      if (concepts.length >= limit) break;
    }

    if (concepts.length >= limit) break;
  }

  return {
    mode: "study",
    title: "Study Notes",
    summary: `${concepts.length} lecture points`,
    keyPoints: concepts.map(x => x.name),
    concepts,
    studyType: "lecture"
  };
}

function parseDefinitions(text, detailLevel) {
  const lines = studySourceLines(text);
  const definitions = [];

  for (const line of lines) {
    let match = line.match(/^(.{2,55}?):\s+(.{8,})$/);

    if (!match) {
      match = line.match(/^(.{2,55}?)\s+[–—-]\s+(.{8,})$/);
    }

    if (!match) {
      match = line.match(/^(.{2,55}?)\s+(?:is|are|means|refers to|describes?)\s+(.{8,})$/i);
    }

    if (!match) continue;

    let term = match[1]
      .replace(/^(a|an|the)\s+/i, "")
      .trim();

    if (term.split(/\s+/).length > 7) continue;

    definitions.push({
      name: titleCase(term),
      explanation: conciseStudySentence(match[2], detailLevel === "concise" ? 22 : 32),
      related: []
    });
  }

  const unique = definitions.filter((item, index, arr) =>
    arr.findIndex(x => x.name.toLowerCase() === item.name.toLowerCase()) === index
  );

  if (unique.length < 2) {
    return noStudyStructure(
      "definitions",
      "Definitions mode expects formats such as 'Term: definition', 'Term — definition', or clear 'X is...' statements."
    );
  }

  const concepts = unique.slice(0, LIMITS[detailLevel].study);

  return {
    mode: "study",
    title: "Study Notes",
    summary: `${concepts.length} definitions`,
    keyPoints: concepts.map(x => x.name),
    concepts,
    studyType: "definitions"
  };
}

function isStemHeading(line) {
  const clean = cleanLine(line);

  if (/^(definition|theorem|lemma|corollary|rule|test|formula|method|example|identity|law|principle|procedure)\b/i.test(clean)) {
    return true;
  }

  if (/\b(test|theorem|rule|method|formula|identity|substitution|integrals?|derivatives?|limits?|series|vectors?|matrices)\b/i.test(clean) && isShortHeading(clean)) {
    return true;
  }

  return false;
}

function parseStemNotes(text, detailLevel) {
  const lines = studySourceLines(text);
  const sections = [];
  let current = null;

  for (const line of lines) {
    const inline = line.match(/^(.{3,75}?)\s+[–—-]\s+(.{15,})$/);

    if (inline && (isStemHeading(inline[1]) || isShortHeading(inline[1]))) {
      if (current) sections.push(current);
      current = {heading: inline[1].trim(), body: [inline[2].trim()]};
      continue;
    }

    if (isStemHeading(line)) {
      if (current) sections.push(current);
      current = {heading: cleanLine(line), body: []};
      continue;
    }

    if (current) current.body.push(line);
  }

  if (current) sections.push(current);

  const usable = sections.filter(section =>
    section.heading &&
    section.body.join(" ").trim().length >= 5
  );

  if (!usable.length) {
    return noStudyStructure(
      "stem",
      "Math / STEM mode expects labeled items such as Definition, Theorem, Rule, Test, Formula, Method, or named techniques."
    );
  }

  const limit = LIMITS[detailLevel].study;
  const concepts = usable.slice(0, limit).map(section => {
    const body = section.body.join(" ");
    const formulaLine = section.body.find(line =>
      /[=∫Σ∑√∞±≤≥→]|(?:sin|cos|tan|lim)\s*\(/i.test(line)
    );

    let explanation = conciseStudySentence(body, detailLevel === "concise" ? 22 : 32);
    if (formulaLine && formulaLine.length <= 120 && !explanation.includes(formulaLine)) {
      explanation = `${explanation.replace(/[.!?]+$/, "")} Formula: ${formulaLine}`;
    }

    return {
      name: section.heading,
      explanation,
      related: []
    };
  });

  return {
    mode: "study",
    title: "Study Notes",
    summary: `${concepts.length} STEM items`,
    keyPoints: concepts.map(x => x.name),
    concepts,
    studyType: "stem"
  };
}

function studyMap(text, detailLevel, type = "textbook") {
  if (type === "textbook") return parseTextbookSections(text, detailLevel);
  if (type === "lecture") return parseLectureNotes(text, detailLevel);
  if (type === "definitions") return parseDefinitions(text, detailLevel);
  if (type === "stem") return parseStemNotes(text, detailLevel);

  return noStudyStructure(type, "Choose a supported Study input type.");
}
/* ---------- Timeline ---------- */

function extractDateLabel(sentence) {
  const month = "(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)";
  const patterns = [
    new RegExp(`\\b${month}\\s+\\d{1,2}(?:,\\s*\\d{4})?\\b`, "i"),
    new RegExp(`\\b(?:in|by|during|on)\\s+${month}(?:\\s+\\d{4})?\\b`, "i"),
    new RegExp(`\\b${month}\\s+\\d{4}\\b`, "i"),
    /\bQ[1-4]\s+\d{4}\b/i,
    /\b\d{4}-\d{1,2}-\d{1,2}\b/,
    /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/,
    /\b(?:early|mid|late)[ -](?:January|February|March|April|May|June|July|August|September|October|November|December|\d{4})\b/i
  ];
  for (const pattern of patterns) {
    const match = sentence.match(pattern);
    if (match) return match[0].replace(/^(in|by|during|on)\s+/i, "");
  }
  return "";
}

function timelineFlow(text, detailLevel) {
  const ss = splitSentences(text);
  const freq = frequencyMap(text);
  const limit = LIMITS[detailLevel].timeline;

  let dated = ss
    .map((sentence, index) => ({sentence, index, date: extractDateLabel(sentence)}))
    .filter(x => x.date);

  if (!dated.length) {
    const sequenceWords = /\b(first|then|next|after|afterwards|later|finally|subsequently|before|once)\b/i;
    dated = sourceOrderedTop(ss, s => (sequenceWords.test(s) ? 4 : 0) + sentenceFrequencyScore(s, freq), limit)
      .map((x, i) => ({sentence: x.text, index: x.index, date: `Step ${i + 1}`}));
  }

  const events = dated
    .slice(0, limit)
    .map(x => ({
      when: x.date,
      event: compact(
        x.sentence
          .replace(new RegExp(`^(?:in|by|during|on)?\\s*${escapeRegExp(x.date)}[,\\s]*`, "i"), "")
          .trim(),
        145
      )
    }));

  return {
    mode: "timeline",
    title: "Timeline",
    summary: `${events.length} meaningful milestone${events.length === 1 ? "" : "s"} extracted in source order.`,
    keyPoints: events.slice(0, 5).map(x => `${x.when}: ${compact(x.event, 78)}`),
    events
  };
}

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* ---------- Decision Tree ---------- */

function parseDecision(sentence) {
  const s = sentence.replace(/[.!?]+$/, "").trim();

  const ifMatch = s.match(/^if\s+(.+?)[,:]\s*(.+)$/i);
  if (ifMatch) {
    return {
      condition: compact(ifMatch[1], 80),
      yes: compact(ifMatch[2], 90),
      no: ""
    };
  }

  const unlessMatch = s.match(/^unless\s+(.+?)[,:]\s*(.+)$/i);
  if (unlessMatch) {
    return {
      condition: `Not: ${compact(unlessMatch[1], 72)}`,
      yes: compact(unlessMatch[2], 90),
      no: ""
    };
  }

  const whetherMatch = s.match(/(?:check|determine|decide)\s+whether\s+(.+)$/i);
  if (whetherMatch) {
    return {
      condition: compact(whetherMatch[1], 82),
      yes: "Continue on the positive path",
      no: "Take the alternative path"
    };
  }

  return {
    condition: compact(s.replace(/^(if|whether)\s+/i, ""), 85),
    yes: "",
    no: ""
  };
}

function decisionTree(text, detailLevel) {
  const ss = splitSentences(text);
  const limit = LIMITS[detailLevel].decision;
  const conditionalIndices = ss.map((s, i) => DECISION_WORDS.test(s) ? i : -1).filter(i => i >= 0);
  const firstConditional = conditionalIndices.length ? conditionalIndices[0] : 0;
  const start = compact(ss.slice(0, firstConditional).join(" ") || ss[0] || "Start", 150);

  const conditional = ss.filter(s => DECISION_WORDS.test(s)).slice(0, limit);
  const decisions = [];

  for (let i = 0; i < conditional.length; i++) {
    const sentence = conditional[i];
    let parsed = parseDecision(sentence);

    // Pair an immediately following "otherwise/else" sentence as the no path.
    if (!parsed.no && i + 1 < conditional.length && /^(otherwise|else)\b/i.test(conditional[i + 1])) {
      parsed.no = compact(conditional[i + 1].replace(/^(otherwise|else)[,:]?\s*/i, ""), 100);
      i++;
    }

    decisions.push({
      condition: compact(parsed.condition, 88),
      yes: parsed.yes || "Proceed / condition met",
      no: parsed.no || "Continue to the alternative condition"
    });
  }

  const terminalSignals = ss.filter(s => /\b(approve|approved|decline|declined|reject|rejected|do not|stop|complete|final|release|purchase|eligible|ineligible)\b/i.test(s));
  const outcomes = dedupeSentences(terminalSignals.map(s => compact(s, 105))).slice(0, 5);

  return {
    mode: "decision",
    title: "Decision Tree",
    summary: decisions.length ? `${decisions.length} material condition${decisions.length === 1 ? "" : "s"} converted into explicit branches.` : "No strong conditional structure was detected.",
    keyPoints: decisions.slice(0, 5).map(x => x.condition),
    start,
    decisions,
    outcomes
  };
}

/* ---------- Recipe Flow ---------- */

const UNIT_PATTERN = "(?:cups?|c\\.|tablespoons?|tbsp\\.?|tbsps?\\.?|teaspoons?|tsp\\.?|tsps?\\.?|grams?|g|kilograms?|kg|milligrams?|mg|millilit(?:er|re)s?|ml|lit(?:er|re)s?|l|ounces?|oz|pounds?|lbs?|lb|sticks?|cloves?|cans?|packages?|packets?|slices?|shots?)";
const FRACTION_PATTERN = "(?:\\d+(?:\\.\\d+)?(?:\\s+\\d+\\/\\d+|\\/\\d+)?|\\d+\\/\\d+|[¼½¾⅓⅔⅛⅜⅝⅞])";

const RECIPE_PAGE_HEADINGS = new Set([
  "equipment","ingredients","instructions","instruction","directions","direction",
  "method","steps","before you start","notes","nutrition","servings","metric",
  "us customary","cook mode"
]);

function baseRecipeHeading(line) {
  return cleanLine(line)
    .replace(/\s+\d{1,2}$/, "")
    .replace(/[|•]+.*$/, "")
    .trim();
}

function isRecipeHeading(line) {
  const clean = cleanLine(line);
  if (!clean) return false;

  if (RECIPE_PAGE_HEADINGS.has(clean.toLowerCase())) return true;

  if (/^to\s+(?:prepare|preheat|blend|incorporate|finish|bake|mix|make|cook|assemble|serve|cool)\b/i.test(clean)) {
    return true;
  }

  // Recipe sites often repeat "Recipe Name 1", "Recipe Name 2", etc. between step photos.
  if (/^.{3,80}\s+\d{1,2}$/i.test(clean) && !/[.!?]$/.test(clean)) return true;

  return false;
}

function likelyRecipeTitle(rawLines, ingredientHeadingIndex, firstIngredientIndex = -1) {
  const repeatedBases = new Map();

  for (const raw of rawLines) {
    const clean = cleanLine(raw);
    const match = clean.match(/^(.{4,80}?)\s+(\d{1,2})$/);
    if (!match) continue;

    const base = match[1].trim();
    const lower = base.toLowerCase();

    if (RECIPE_PAGE_HEADINGS.has(lower) || /^to\s+/i.test(base)) continue;
    repeatedBases.set(base, (repeatedBases.get(base) || 0) + 1);
  }

  const repeated = [...repeatedBases.entries()]
    .sort((a, b) => b[1] - a[1])
    .find(([, count]) => count >= 2);

  if (repeated) return repeated[0];

  const anchorIndex =
    ingredientHeadingIndex >= 0
      ? ingredientHeadingIndex
      : firstIngredientIndex >= 0
        ? firstIngredientIndex
        : Math.min(rawLines.length, 12);

  if (anchorIndex > 0) {
    for (let i = anchorIndex - 1; i >= Math.max(0, anchorIndex - 12); i--) {
      const candidate = baseRecipeHeading(rawLines[i]);
      const lower = candidate.toLowerCase();

      if (
        candidate.length >= 3 &&
        candidate.length <= 80 &&
        !RECIPE_PAGE_HEADINGS.has(lower) &&
        !isNoiseLine(candidate) &&
        !looksIngredient(candidate) &&
        !/^to\s+/i.test(candidate) &&
        !/[.!?]$/.test(candidate)
      ) {
        return candidate;
      }
    }
  }

  return "Recipe Flow";
}
function looksIngredient(line) {
  const l = cleanLine(line);

  if (!l || isNoiseLine(l) || isRecipeHeading(l)) return false;
  if (l.length > 155) return false;
  if (/[.!?]\s/.test(l)) return false;

  if (new RegExp(`^${FRACTION_PATTERN}\\s*(?:${UNIT_PATTERN}\\b|(?:large|medium|small)\\b)`, "i").test(l)) {
    return true;
  }

  if (new RegExp(`^${FRACTION_PATTERN}\\s+[^.!?]{2,110}$`, "i").test(l)) {
    return true;
  }

  return false;
}

function extractAlternateMeasure(text) {
  const patterns = [
    /\b\d+(?:\s+\d+\/\d+|\/\d+)?\s*(?:cups?|tbsp|tablespoons?|tsp|teaspoons?|oz|ounces?|lb|pounds?|ml|mL|g|kg)\s+minus\s+\d+(?:\s+\d+\/\d+|\/\d+)?\s*(?:tbsp|tablespoons?|tsp|teaspoons?|ml|mL|g)\b/i,
    /\b\d+(?:\s+\d+\/\d+|\/\d+)?\s*(?:cups?|tbsp|tablespoons?|tsp|teaspoons?|oz|ounces?|lb|pounds?|ml|mL|g|kg)\b/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0].trim();
  }

  return "";
}

function simplifyIngredientName(item) {
  return item
    .replace(/\([^)]*\)/g, " ")
    .replace(/\bDiamond Crystal\b/ig, "")
    .replace(/\b(?:ceremonial|culinary)\s+grade\b/ig, "")
    .replace(/\bfull-fat\b/ig, "")
    .replace(/\s+/g, " ")
    .replace(/^[,;:\s]+|[,;:\s]+$/g, "")
    .trim();
}

function parseIngredientLine(line) {
  let clean = cleanLine(line)
    .replace(/\s+/g, " ")
    .replace(/\s*;\s*/g, "; ")
    .trim();

  const amountRegex = new RegExp(
    `^(${FRACTION_PATTERN}\\s*(?:(?:${UNIT_PATTERN})|(?:large|medium|small))?)\\s+(.+)$`,
    "i"
  );

  const match = clean.match(amountRegex);
  let amount = "";
  let item = clean;

  if (match) {
    amount = match[1].trim();
    item = match[2].trim();
  }

  const alternate = extractAlternateMeasure(item);
  if (alternate && !amount.toLowerCase().includes(alternate.toLowerCase())) {
    amount = `${amount} (${alternate})`.trim();
  }

  item = simplifyIngredientName(item)
    .replace(/[;,]\s*(?:room temperature|softened|divided|optional|for serving|for garnish).*$/i, "")
    .replace(/\b(?:room temperature|at room temperature)\b.*$/i, "")
    .trim();

  return {amount, item};
}

function ingredientKey(item) {
  return item
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(?:diamond|crystal|brand|unsalted|salted|fresh|freshly|large|medium|small|all-purpose|all purpose|full-fat|full fat|granulated|packed|finely|roughly|chopped|sifted|ceremonial|culinary|grade|table|kosher)\b/g, " ")
    .replace(/\b(?:cup|cups|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons|ml|g|kg|oz|lb|minus)\b/g, " ")
    .replace(/[^a-z\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function ingredientAliases(item) {
  const key = ingredientKey(item);
  const aliases = new Set();

  if (key) aliases.add(key);

  if (/\bcream cheese\b/i.test(item)) {
    aliases.add("cream cheese");
  } else if (/\b(?:heavy|whipping)\s+cream\b/i.test(item)) {
    aliases.add("heavy cream");
    aliases.add("whipping cream");
  }

  if (/\begg yolk\b/i.test(item)) {
    aliases.add("egg yolk");
    aliases.add("yolk");
  }

  if (/^eggs?$/i.test(key) || /\blarge eggs?\b/i.test(item)) {
    aliases.add("eggs");
    aliases.add("egg");
  }

  if (/\bvanilla\b/i.test(item)) aliases.add("vanilla");
  if (/\bcoffee\b/i.test(item)) aliases.add("coffee");
  if (/\bcocoa\b/i.test(item)) aliases.add("cocoa");
  if (/\bbaking soda\b/i.test(item)) aliases.add("baking soda");
  if (/\bcornstarch\b/i.test(item)) aliases.add("cornstarch");
  if (/\bmatcha\b/i.test(item)) aliases.add("matcha");
  if (/\bsugar\b/i.test(item)) aliases.add("sugar");
  if (/\bbutter\b/i.test(item)) aliases.add("butter");
  if (/\bsalt\b/i.test(item)) aliases.add("salt");

  if (/\bcake flour\b/i.test(item)) aliases.add("cake flour");
  if (/\ball-purpose flour\b/i.test(item)) aliases.add("all-purpose flour");

  return [...aliases]
    .map(value => value.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
}
function phraseOccurs(phrase, sentence) {
  const escaped = escapeRegExp(phrase).replace(/\s+/g, "\\s+");
  return new RegExp(`\\b${escaped}\\b`, "i").test(sentence);
}

function ingredientMatchesSentence(item, sentence, allIngredients = []) {
  const aliases = ingredientAliases(item);

  // Protect compound ingredients from generic one-word collisions.
  if (/\bcream cheese\b/i.test(item)) {
    return /\bcream cheese\b/i.test(sentence);
  }

  if (/\b(?:heavy|whipping)\s+cream\b/i.test(item)) {
    return /\b(?:heavy|whipping)\s+cream\b/i.test(sentence) ||
      (
        /\bcream\b/i.test(sentence) &&
        !/\bcream cheese\b/i.test(sentence)
      );
  }

  if (/\begg yolk\b/i.test(item)) {
    return /\b(?:egg\s+)?yolk\b/i.test(sentence);
  }

  if (/^eggs?$/i.test(ingredientKey(item)) || /\blarge eggs?\b/i.test(item)) {
    return /\beggs?\b/i.test(sentence) && !/\b(?:egg\s+)?yolk\b/i.test(sentence);
  }

  for (const alias of aliases) {
    if (alias.length <= 2) continue;
    if (phraseOccurs(alias, sentence)) return true;
  }

  // Recipes often shorten a listed ingredient in prose:
  // "vanilla extract" -> "vanilla", "cocoa powder" -> "cocoa".
  // Only use a one-word fallback if that word uniquely identifies one ingredient.
  const blocked = new Set([
    "all","purpose","heavy","whipping","large","small","medium",
    "powder","extract","fresh","unsalted","salted"
  ]);

  const candidateWords = ingredientKey(item)
    .split(/\s+/)
    .filter(word => word.length >= 4 && !blocked.has(word));

  for (const word of candidateWords) {
    if (!phraseOccurs(word, sentence)) continue;

    const competing = allIngredients.filter(other =>
      other.item !== item &&
      ingredientKey(other.item).split(/\s+/).includes(word)
    );

    if (!competing.length) return true;
  }

  return false;
}
function recipeNoiseSentence(sentence) {
  return /\b(nami'?s tip|did you know|i recommend|my favorite|for more|click here|subscribe|rating|review|nutrition|calories|affiliate|sponsored|recipe card|jump to|watch the video|mine never did|every oven is different|option:|if you love a)\b/i.test(sentence);
}

function allCookingVerbs(sentence) {
  const found = [];
  const lower = sentence.toLowerCase();

  for (const verb of COOKING_VERBS) {
    const match = lower.match(new RegExp(`\\b${verb}(?:ed|ing|s)?\\b`, "i"));
    if (match) found.push(verb);
  }

  return uniqueArray(found);
}

function stageVerb(sentence) {
  const verbs = allCookingVerbs(sentence);

  const priority = [
    "bake","roast","cook","fry","sear","boil","simmer",
    "fold","blend","whisk","beat","mix","stir","combine",
    "sift","melt","knead","proof","chill","cool","freeze",
    "pour","transfer","add","place","press"
  ];

  return priority.find(verb => verbs.includes(verb)) || "";
}

function stageLabel(verb) {
  const map = {
    combine:"mix",
    fold:"fold in",
    refrigerate:"chill",
    place:"add",
    press:"mix",
    transfer:"transfer",
    pour:"pour"
  };

  return map[verb] || verb || "mix";
}

function extractRecipeCues(sentence) {
  const cues = [];

  const temps = sentence.match(/\b\d{2,3}\s*°\s*[FC]\b(?:\s*\([^)]*\))?/gi) || [];
  const times = sentence.match(/\b(?:about\s+)?\d+(?:\s*(?:[–-]|to)\s*\d+)?\s*(?:seconds?|minutes?|mins?|hours?|hrs?)\b/gi) || [];

  const texturePatterns = [
    /\b(?:until\s+)?smooth\b/i,
    /\b(?:until\s+)?combined\b/i,
    /\b(?:until\s+)?dark amber\/brown\b/i,
    /\b(?:until\s+)?dark brown\b/i,
    /\b(?:until\s+)?golden(?: brown)?\b/i,
    /\b(?:until\s+)?browned\b/i,
    /\b(?:until\s+)?jiggly\b/i,
    /\b(?:until\s+)?thick\b/i,
    /\b(?:until\s+)?no lumps?\b/i,
    /\b(?:until\s+)?fully incorporated\b/i
  ];

  temps.forEach(value => cues.push(value));
  times.forEach(value => cues.push(value));

  for (const pattern of texturePatterns) {
    const match = sentence.match(pattern);
    if (match) cues.push(match[0]);
  }

  return uniqueArray(cues).slice(0, 4);
}

function prepStep(sentence) {
  if (/\bpreheat\b/i.test(sentence)) {
    const temps = sentence.match(/\b\d{2,3}\s*°\s*[FC]\b(?:\s*\([^)]*\))?/gi) || [];

    return temps.length
      ? `Preheat oven — ${uniqueArray(temps).join(" / ")}`
      : "Preheat oven";
  }

  if (/\b(line|parchment)\b/i.test(sentence)) {
    const size = sentence.match(/\b\d+(?:\s*[–-]\s*\d+)?-inch\b/i)?.[0] || "";
    return `Line ${size ? `${size} ` : ""}pan with parchment`.replace(/\s+/g, " ").trim();
  }

  if (/\b(grease|butter and flour)\b/i.test(sentence)) {
    return "Grease and prepare pan";
  }

  return "";
}

function finishSummary(sentences) {
  const pieces = [];

  for (const sentence of sentences) {
    const cues = extractRecipeCues(sentence);

    if (/\bcool\b/i.test(sentence)) {
      const time = cues.find(cue => /hours?|minutes?/i.test(cue));
      pieces.push(`Cool${time ? ` ${time}` : ""}`);
    } else if (/\b(chill|refrigerate)\b/i.test(sentence)) {
      const time = cues.find(cue => /hours?|minutes?/i.test(cue));
      pieces.push(`Chill${time ? ` ${time}` : ""}`);
    } else if (/\brest\b/i.test(sentence)) {
      const time = cues.find(cue => /hours?|minutes?/i.test(cue));
      pieces.push(`Rest${time ? ` ${time}` : ""}`);
    }
  }

  return uniqueArray(pieces).slice(0, 2).join("; ");
}

function ingredientDisplayName(item) {
  const key = ingredientKey(item);
  if (!key) return simplifyIngredientName(item);

  if (/\bcream cheese\b/i.test(item)) return "cream cheese";
  if (/\b(?:heavy|whipping)\s+cream\b/i.test(item)) return "heavy cream";
  if (/\begg yolk\b/i.test(item)) return "egg yolk";
  if (/\beggs?\b/i.test(item)) return "eggs";

  return key.split(/\s+/).slice(-2).join(" ");
}

function makeStageLabel(verb, newItems) {
  let label = stageLabel(verb);
  const names = newItems.map(ingredientDisplayName).filter(Boolean);

  if (names.length && ["add","mix","stir","blend","whisk","beat","sift","fold in"].includes(label)) {
    label = `${label} ${names.slice(0, 3).join(" + ")}`;
    if (names.length > 3) label += " + more";
  }

  if (label === "add" && !names.length) label = "mix";

  return label
    .replace(/\s+/g, " ")
    .trim();
}

function buildRecipeStages(sentences, ingredients, detailLevel) {
  const stages = [];
  const introduced = new Set();
  const pending = new Set();
  const stageLimit = detailLevel === "concise" ? 6 : detailLevel === "standard" ? 8 : 10;

  const transformationVerbs = new Set([
    "melt","mix","stir","whisk","beat","blend","combine","fold","sift",
    "knead","proof"
  ]);

  const finalVerbs = new Set([
    "bake","roast","cook","fry","sear","boil","simmer","chill","freeze"
  ]);

  const addPendingFromSentence = sentence => {
    const mentioned = ingredients
      .filter(ingredient => ingredientMatchesSentence(ingredient.item, sentence, ingredients))
      .map(ingredient => ingredient.item);

    for (const item of mentioned) {
      if (!introduced.has(item)) pending.add(item);
    }

    return mentioned;
  };

  for (const sentence of sentences) {
    if (recipeNoiseSentence(sentence)) continue;

    const mentioned = addPendingFromSentence(sentence);
    const verb = stageVerb(sentence);
    const cues = extractRecipeCues(sentence);

    if (!verb) continue;

    // Transfer-to-pan is useful operationally but is not part of the ingredient staircase
    // in concise mode. The reference format jumps from the final mixture to baking.
    if (
      ["pour","transfer"].includes(verb) &&
      /\b(pan|tin|mold|mould|baking dish)\b/i.test(sentence)
    ) {
      if (detailLevel !== "concise") {
        stages.push({
          verb,
          label: stageLabel(verb),
          newItems: [],
          cues,
          introducedAfter: [...introduced]
        });
      }
      continue;
    }

    if (transformationVerbs.has(verb)) {
      const newItems = [...pending];

      // Repeated technique on the same mixture: merge its useful cue into the prior stage.
      if (!newItems.length) {
        const previous = stages[stages.length - 1];

        if (previous && !finalVerbs.has(previous.verb)) {
          previous.cues = uniqueArray([...(previous.cues || []), ...cues]).slice(0, 4);
        }
        continue;
      }

      newItems.forEach(item => {
        introduced.add(item);
        pending.delete(item);
      });

      stages.push({
        verb,
        label: makeStageLabel(verb, newItems),
        newItems,
        cues,
        introducedAfter: [...introduced]
      });

      continue;
    }

    if (finalVerbs.has(verb)) {
      // Any still-unmatched ingredients belong to the completed mixture before baking.
      if (pending.size) {
        const newItems = [...pending];
        newItems.forEach(item => {
          introduced.add(item);
          pending.delete(item);
        });

        const previous = stages[stages.length - 1];

        if (previous && !finalVerbs.has(previous.verb)) {
          previous.newItems = uniqueArray([...(previous.newItems || []), ...newItems]);
          previous.label = makeStageLabel(previous.verb, previous.newItems);
          previous.introducedAfter = [...introduced];
        } else if (newItems.length) {
          stages.push({
            verb: "mix",
            label: makeStageLabel("mix", newItems),
            newItems,
            cues: [],
            introducedAfter: [...introduced]
          });
        }
      }

      const previous = stages[stages.length - 1];

      // Merge duplicate final cooking instructions into one strong final stage.
      if (previous && previous.verb === verb) {
        previous.cues = uniqueArray([...(previous.cues || []), ...cues]).slice(0, 4);
      } else {
        stages.push({
          verb,
          label: stageLabel(verb),
          newItems: [],
          cues,
          introducedAfter: [...introduced]
        });
      }
    }
  }

  // Attach ingredients that were never named in the instructions to the final mixing stage,
  // not to the bake cell.
  const unmatched = ingredients
    .map(ingredient => ingredient.item)
    .filter(item => !introduced.has(item));

  if (unmatched.length) {
    const target = [...stages].reverse().find(stage => !finalVerbs.has(stage.verb));

    if (target) {
      target.newItems = uniqueArray([...(target.newItems || []), ...unmatched]);
      unmatched.forEach(item => introduced.add(item));
      target.label = makeStageLabel(target.verb, target.newItems);
      target.introducedAfter = [...introduced];
    }
  }

  // Keep the true cooking endpoint, and if necessary merge low-information middle stages.
  while (stages.length > stageLimit) {
    let mergeIndex = stages.findIndex((stage, index) =>
      index > 0 &&
      index < stages.length - 1 &&
      ["mix","stir","sift","add"].includes(stageVerb(stage.label) || stage.verb) &&
      !(stage.cues || []).length
    );

    if (mergeIndex < 0) {
      mergeIndex = stages.findIndex((stage, index) =>
        index > 0 &&
        index < stages.length - 1 &&
        !finalVerbs.has(stage.verb)
      );
    }

    if (mergeIndex < 0) break;

    const previous = stages[mergeIndex - 1];
    const current = stages[mergeIndex];

    previous.newItems = uniqueArray([...(previous.newItems || []), ...(current.newItems || [])]);
    previous.cues = uniqueArray([...(previous.cues || []), ...(current.cues || [])]).slice(0, 4);
    previous.label = makeStageLabel(previous.verb, previous.newItems);
    previous.introducedAfter = current.introducedAfter?.length
      ? [...current.introducedAfter]
      : [...previous.introducedAfter];

    stages.splice(mergeIndex, 1);
  }

  return stages;
}

function recipeFlow(text, detailLevel) {
  const rawLines = normalizeWhitespace(text)
    .split("\n")
    .map(cleanLine)
    .filter(Boolean);

  const ingredientHeadingIndex = rawLines.findIndex(line => /^ingredients?$/i.test(line));
  const instructionHeadingIndex = rawLines.findIndex(line =>
    /^(instructions?|directions?|method|steps?|before you start)$/i.test(line)
  );

  let ingredientLines = [];
  let firstIngredientIndex = -1;
  let lastIngredientIndex = -1;

  if (ingredientHeadingIndex >= 0) {
    const ingredientEnd =
      instructionHeadingIndex > ingredientHeadingIndex
        ? instructionHeadingIndex
        : rawLines.length;

    const section = rawLines.slice(ingredientHeadingIndex + 1, ingredientEnd);
    ingredientLines = section.filter(looksIngredient);

    if (ingredientLines.length) {
      firstIngredientIndex = rawLines.indexOf(ingredientLines[0], ingredientHeadingIndex + 1);
      lastIngredientIndex = rawLines.lastIndexOf(ingredientLines[ingredientLines.length - 1]);
    }
  } else {
    const searchEnd = instructionHeadingIndex >= 0 ? instructionHeadingIndex : rawLines.length;
    const candidateIndexes = [];

    for (let i = 0; i < searchEnd; i++) {
      if (looksIngredient(rawLines[i])) candidateIndexes.push(i);
    }

    const runs = [];
    let current = [];

    for (const index of candidateIndexes) {
      if (!current.length || index - current[current.length - 1] <= 2) {
        current.push(index);
      } else {
        runs.push(current);
        current = [index];
      }
    }
    if (current.length) runs.push(current);

    const bestRun = runs.sort((a, b) => b.length - a.length)[0] || [];

    if (bestRun.length >= 3) {
      firstIngredientIndex = bestRun[0];
      lastIngredientIndex = bestRun[bestRun.length - 1];
      ingredientLines = bestRun.map(index => rawLines[index]);
    }
  }

  if (ingredientLines.length < 3) {
    return {
      mode: "recipe",
      title: "Recipe Flow",
      summary: "No reliable ingredient list detected",
      keyPoints: [],
      prep: [],
      ingredients: [],
      operations: [],
      finish: "",
      warning: "Recipe Flow needs either an Ingredients section, or a clear block of at least three quantity-first ingredient lines before the Instructions / Method section."
    };
  }

  const title = likelyRecipeTitle(
    rawLines,
    ingredientHeadingIndex,
    firstIngredientIndex
  );

  let ingredients = ingredientLines
    .map(parseIngredientLine)
    .filter(item => item.item);

  ingredients = ingredients.filter((ingredient, index, arr) =>
    arr.findIndex(other => ingredientKey(other.item) === ingredientKey(ingredient.item)) === index
  );

  let instructionLines = [];

  if (instructionHeadingIndex >= 0) {
    instructionLines = rawLines.slice(instructionHeadingIndex + 1);
  } else if (lastIngredientIndex >= 0) {
    instructionLines = rawLines.slice(lastIngredientIndex + 1);
  }

  instructionLines = instructionLines.filter(line =>
    !isNoiseLine(line) &&
    !isRecipeHeading(line) &&
    !recipeNoiseSentence(line) &&
    baseRecipeHeading(line).toLowerCase() !== title.toLowerCase()
  );

  const sentences = splitSentences(instructionLines.join("\n"))
    .filter(sentence =>
      sentence &&
      !recipeNoiseSentence(sentence) &&
      !isRecipeHeading(sentence)
    );

  if (!sentences.length) {
    return {
      mode: "recipe",
      title,
      summary: `${ingredients.length} ingredients detected`,
      keyPoints: [],
      prep: [],
      ingredients,
      operations: [],
      finish: "",
      warning: "The ingredient list was detected, but no instruction block could be parsed. Add an Instructions / Directions / Method heading, or place the instructions after the ingredient list."
    };
  }

  const prep = [];
  const finishSentences = [];
  const processSentences = [];

  for (const sentence of sentences) {
    if (/\b(preheat|line|grease|butter and flour|prepare (?:the )?pan)\b/i.test(sentence)) {
      const concisePrep = prepStep(sentence);
      if (concisePrep) prep.push(concisePrep);
      continue;
    }

    if (
      /\b(cool|rest|serve)\b/i.test(sentence) &&
      !/\b(add|mix|fold|bake|cook|blend|whisk|beat)\b/i.test(sentence)
    ) {
      finishSentences.push(sentence);
      continue;
    }

    processSentences.push(sentence);
  }

  const rawStages = buildRecipeStages(processSentences, ingredients, detailLevel);

  if (!rawStages.length) {
    return {
      mode: "recipe",
      title,
      summary: `${ingredients.length} ingredients detected`,
      keyPoints: [],
      prep: uniqueArray(prep),
      ingredients,
      operations: [],
      finish: finishSummary(finishSentences),
      warning: "The ingredients were detected, but the instruction text did not contain enough recognizable cooking actions to build a reliable process map."
    };
  }

  const firstStageByIngredient = new Map();

  ingredients.forEach((ingredient, originalIndex) => {
    const stageIndex = rawStages.findIndex(stage =>
      (stage.newItems || []).includes(ingredient.item)
    );

    firstStageByIngredient.set(originalIndex, stageIndex >= 0 ? stageIndex : 999);
  });

  ingredients = ingredients
    .map((ingredient, originalIndex) => ({
      ingredient,
      originalIndex,
      firstStage: firstStageByIngredient.get(originalIndex)
    }))
    .sort((a, b) => a.firstStage - b.firstStage || a.originalIndex - b.originalIndex)
    .map(entry => entry.ingredient);

  const cumulative = new Set();
  const operations = rawStages.map(stage => {
    (stage.newItems || []).forEach(item => cumulative.add(item));

    return {
      label: stage.label,
      cue: (stage.cues || []).join(" · "),
      inputItems: [...cumulative]
    };
  });

  if (operations.length) {
    const finalOperation = operations[operations.length - 1];
    const finalStage = rawStages[rawStages.length - 1];

    if (finalStage && ["bake","cook","roast","fry","sear","boil","simmer"].includes(finalStage.verb)) {
      finalOperation.inputItems = ingredients.map(ingredient => ingredient.item);
    }
  }

  const cleanPrep = uniqueArray(prep).slice(0, detailLevel === "concise" ? 2 : 4);
  const finish = finishSummary(finishSentences);

  const keyPoints = operations.slice(0, 6).map(operation =>
    `${titleCase(operation.label)}${operation.cue ? ` — ${operation.cue}` : ""}`
  );

  return {
    mode: "recipe",
    title,
    summary: `${ingredients.length} ingredients · ${operations.length} process stages`,
    keyPoints,
    prep: cleanPrep,
    ingredients,
    operations,
    finish,
    detailLevel
  };
}

/* ---------- Rendering ---------- */

function renderResult(data) {
  outputStage.className = "output-stage";

  const stats = data.stats || {};
  const head = `
    <div class="output-head">
      <div class="output-head-row">
        <div>
          <h4>${escapeHtml(data.title)}</h4>
          <p class="output-summary">${escapeHtml(data.summary || "")}</p>
        </div>
        <div class="stats">
          <span class="stat"><strong>${stats.sourceWords || 0}</strong> source words</span>
          <span class="stat"><strong>${stats.reduction || 0}%</strong> shorter</span>
        </div>
      </div>
    </div>`;

  const warning = data.warning ? `
    <div class="parser-warning">
      <strong>Input structure not detected</strong>
      <p>${escapeHtml(data.warning)}</p>
    </div>` : "";

  const visual = `
    <section class="view-section">
      <h5 class="view-section-title">Visual</h5>
      <div class="visual-surface">${renderVisual(data)}</div>
    </section>`;

  const text = `
    <section class="view-section">
      <h5 class="view-section-title">Concise text</h5>
      ${renderText(data)}
    </section>`;

  outputStage.innerHTML = head + warning + (
    data.warning ? "" :
    outputMode === "visual" ? visual :
    outputMode === "text" ? text :
    visual + text
  );
}

function renderVisual(data) {
  if (data.mode === "process") return renderProcess(data);
  if (data.mode === "business") return renderBusiness(data);
  if (data.mode === "study") return renderStudy(data);
  if (data.mode === "timeline") return renderTimeline(data);
  if (data.mode === "decision") return renderDecision(data);
  if (data.mode === "recipe") return renderRecipe(data);
  return "";
}

function renderProcess(data) {
  const steps = data.steps || [];

  return `<div class="flowchart">
    <div class="flow-start">Start</div>
    <div class="flow-arrow">↓</div>

    ${steps.map((step, index) => {
      const isLast = index === steps.length - 1;

      if (step.kind === "decision") {
        const noContinues = step.continueBranch === "no";
        const yesContinues = step.continueBranch === "yes";

        return `
          <div class="flow-decision-stage">
            <div class="flow-diamond-wrap">
              <div class="flow-diamond">
                <span>${escapeHtml(step.label.replace(/\?$/, ""))}</span>
              </div>
            </div>

            <div class="flow-branches">
              <div class="flow-branch left ${noContinues ? "continuing" : "ending"}">
                <span class="branch-caption no">No</span>
                <div class="branch-line"></div>
                <div class="branch-box ${noContinues ? "continue" : "terminal"}">
                  ${escapeHtml(step.no || "End / alternate path")}
                </div>
                ${noContinues ? `<span class="branch-next">continues ↓</span>` : `<span class="branch-stop">ends</span>`}
              </div>

              <div class="flow-branch right ${yesContinues ? "continuing" : "ending"}">
                <span class="branch-caption yes">Yes</span>
                <div class="branch-line"></div>
                <div class="branch-box ${yesContinues ? "continue" : "terminal"}">
                  ${escapeHtml(step.yes || "End / alternate path")}
                </div>
                ${yesContinues ? `<span class="branch-next">continues ↓</span>` : `<span class="branch-stop">ends</span>`}
              </div>
            </div>

            ${!isLast ? `<div class="flow-next-arrow">↓</div>` : ""}
          </div>`;
      }

      return `
        <div class="flow-action">${escapeHtml(step.label)}</div>
        ${!isLast ? `<div class="flow-arrow">↓</div>` : ""}`;
    }).join("")}

    <div class="flow-arrow">↓</div>
    <div class="flow-end">End</div>
  </div>`;
}
function renderBusiness(data) {
  const list = (items, empty = "None identified") =>
    items?.length
      ? `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
      : `<p>${empty}</p>`;

  return `<div class="business-board executive-board">
    <article class="business-card objective">
      <h5>Goal</h5>
      <p>${escapeHtml(data.objective || "")}</p>
    </article>

    <article class="business-card">
      <h5>Key numbers</h5>
      <div class="metric-cloud">
        ${data.metrics?.length
          ? data.metrics.map(item => `<span class="metric-pill">${escapeHtml(item)}</span>`).join("")
          : `<span class="metric-pill">No explicit metrics</span>`}
      </div>
    </article>

    <article class="business-card">
      <h5>Main findings</h5>
      ${list(data.findings, "No explicit findings")}
    </article>

    <article class="business-card">
      <h5>Risk</h5>
      ${list(data.risks, "No explicit risk")}
    </article>

    <article class="business-card">
      <h5>Next actions</h5>
      ${list(data.actions, "No explicit next actions")}
    </article>
  </div>`;
}
function renderStudy(data) {
  return `<div class="study-map">
    ${(data.concepts || []).map(concept => `
      <article class="concept">
        <h5>${escapeHtml(concept.name)}</h5>
        <p>${escapeHtml(concept.explanation)}</p>
        ${concept.related?.length ? `<div class="relations">${concept.related.map(x => `<span class="relation">↔ ${escapeHtml(x)}</span>`).join("")}</div>` : ""}
      </article>
    `).join("")}
  </div>`;
}

function renderTimeline(data) {
  return `<div class="timeline">
    ${(data.events || []).map(event => `
      <article class="timeline-item"><div class="timeline-when">${escapeHtml(event.when)}</div><div class="timeline-event">${escapeHtml(event.event)}</div></article>
    `).join("")}
  </div>`;
}

function renderDecision(data) {
  return `<div class="decision-tree">
    <div class="decision-start"><strong>Start:</strong> ${escapeHtml(data.start || "")}</div>
    ${(data.decisions || []).map(decision => `
      <div class="decision-row">
        <div class="condition">${escapeHtml(decision.condition)}</div>
        <div class="branch-grid">
          <div class="branch-card yes"><strong>Yes</strong>${escapeHtml(decision.yes)}</div>
          <div class="branch-card no"><strong>No</strong>${escapeHtml(decision.no)}</div>
        </div>
      </div>
    `).join("")}
    ${data.outcomes?.length ? `<div class="outcomes">${data.outcomes.map(x => `<span class="outcome">${escapeHtml(x)}</span>`).join("")}</div>` : ""}
  </div>`;
}

function normalizeIngredient(value) {
  return String(value || "").trim().toLowerCase();
}

function renderRecipe(data) {
  const ingredients = data.ingredients || [];
  const operations = data.operations || [];
  const rowHeight = 54;

  const indexByItem = new Map(
    ingredients.map((ingredient, index) => [normalizeIngredient(ingredient.item), index])
  );

  const cells = operations.map((operation, columnIndex) => {
    const rows = (operation.inputItems || [])
      .map(name => indexByItem.get(normalizeIngredient(name)))
      .filter(Number.isInteger);

    // Recipe-summary-table rule:
    // stage boxes begin at the top of the ingredient matrix and grow downward
    // as more ingredients join the main mixture.
    const lastRow = rows.length ? Math.max(...rows) : Math.max(ingredients.length - 1, 0);
    const rowEnd = Math.max(lastRow + 2, 2);

    return `
      <div class="operation-cell"
           style="grid-column:${columnIndex + 1};grid-row:1/${rowEnd}">
        <div>
          <strong>${escapeHtml(operation.label)}</strong>
          ${operation.cue ? `<small>${escapeHtml(operation.cue)}</small>` : ""}
        </div>
      </div>`;
  }).join("");

  return `
    <div class="recipe-visual">
      <div class="recipe-sheet">
        ${data.prep?.length
          ? `<div class="recipe-prep">${data.prep.map(item => `<div class="prep-row">${escapeHtml(item)}</div>`).join("")}</div>`
          : ""}

        <div class="recipe-matrix">
          <div class="ingredient-column">
            ${ingredients.map(ingredient => `
              <div class="ingredient-row" style="height:${rowHeight}px">
                <span class="ingredient-amount">${escapeHtml(ingredient.amount)}</span>
                <strong>${escapeHtml(ingredient.item)}</strong>
              </div>`).join("")}
          </div>

          <div class="operation-grid"
               style="grid-template-columns:repeat(${Math.max(operations.length, 1)},124px);grid-template-rows:repeat(${Math.max(ingredients.length, 1)},${rowHeight}px)">
            ${cells || `<div class="operation-cell" style="grid-column:1;grid-row:1/-1"><strong>process</strong></div>`}
          </div>
        </div>

        ${data.finish ? `<div class="recipe-finish">${escapeHtml(data.finish)}</div>` : ""}
      </div>
    </div>`;
}
function renderKeyPoints(data) {
  if (!data.keyPoints?.length) return "";
  return `<div class="text-block"><h5>Key points</h5><ul class="key-points">${
    data.keyPoints.map((x, i) => `<li><b>${i + 1}</b><span>${escapeHtml(x)}</span></li>`).join("")
  }</ul></div>`;
}

function listBlock(title, items, ordered = false) {
  if (!items?.length) return "";
  const tag = ordered ? "ol" : "ul";
  return `<div class="text-block"><h5>${escapeHtml(title)}</h5><${tag}>${items.map(x => `<li>${escapeHtml(x)}</li>`).join("")}</${tag}></div>`;
}

function renderText(data) {
  const blocks = (data.mode === "study" || data.mode === "recipe" || data.mode === "business" || data.mode === "process") ? [] : [renderKeyPoints(data)];

  if (data.mode === "process") {
    const items = data.steps.map(step =>
      step.kind === "action"
        ? step.label
        : `${step.label} Yes → ${step.yes || "alternate path"} · No → ${step.no || "alternate path"}`
    );
    blocks.push(listBlock("Essential flow", items, true));
  }

  if (data.mode === "business") {
    blocks.push(`<div class="text-block"><h5>Goal</h5><p>${escapeHtml(data.objective || "")}</p></div>`);
    blocks.push(listBlock("Key numbers", data.metrics));
    blocks.push(listBlock("Main findings", data.findings));
    blocks.push(listBlock("Risk", data.risks));
    blocks.push(listBlock("Next actions", data.actions, true));
  }

  if (data.mode === "study") {
    blocks.push(listBlock(
      "Core concepts",
      data.concepts.map(x => `${x.name} — ${x.explanation}`)
    ));
  }

  if (data.mode === "timeline") blocks.push(listBlock("Milestones", data.events.map(x => `${x.when} — ${x.event}`)));

  if (data.mode === "decision") {
    blocks.push(`<div class="text-block"><h5>Start</h5><p>${escapeHtml(data.start || "")}</p></div>`);
    blocks.push(listBlock("Decision logic", data.decisions.map(x => `${x.condition} → Yes: ${x.yes} / No: ${x.no}`), true));
    blocks.push(listBlock("Outcomes", data.outcomes));
  }

  if (data.mode === "recipe") {
    blocks.push(listBlock("Prep", data.prep));
    blocks.push(listBlock("Ingredients", data.ingredients.map(x => `${x.amount} ${x.item}`.trim())));
    blocks.push(listBlock("Process", data.operations.map(x => `${titleCase(x.label)}${x.cue ? ` — ${x.cue}` : ""}`), true));
    if (data.finish) blocks.push(`<div class="text-block"><h5>Finish</h5><p>${escapeHtml(data.finish)}</p></div>`);
  }

  return `<div class="text-sections">${blocks.filter(Boolean).join("")}</div>`;
}

function resultToText(data) {
  const lines = [data.title, data.summary ? `\n${data.summary}` : ""];

  if (data.keyPoints?.length && data.mode !== "study") {
    lines.push("\nKEY POINTS");
    data.keyPoints.forEach((x, i) => lines.push(`${i + 1}. ${x}`));
  }

  if (data.mode === "process") {
    lines.push("\nFLOW");
    data.steps.forEach((step, i) => {
      lines.push(`${i + 1}. ${step.label}`);
      if (step.kind === "decision") {
        lines.push(`   Yes → ${step.yes || "alternate path"}`);
        lines.push(`   No → ${step.no || "alternate path"}`);
      }
    });
  }

  if (data.mode === "business") {
    lines.push(`\nGOAL\n${data.objective || ""}`);
    appendList(lines, "KEY NUMBERS", data.metrics);
    appendList(lines, "MAIN FINDINGS", data.findings);
    appendList(lines, "RISK", data.risks);
    appendList(lines, "NEXT ACTIONS", data.actions);
  }

  if (data.mode === "study") {
    lines.push("\nCORE CONCEPTS");
    data.concepts.forEach(x => lines.push(`- ${x.name} — ${x.explanation}`));
  }

  if (data.mode === "timeline") {
    lines.push("\nTIMELINE");
    data.events.forEach(x => lines.push(`- ${x.when}: ${x.event}`));
  }

  if (data.mode === "decision") {
    lines.push(`\nSTART\n${data.start || ""}`);
    lines.push("\nDECISIONS");
    data.decisions.forEach((x, i) => {
      lines.push(`${i + 1}. ${x.condition}`);
      lines.push(`   Yes: ${x.yes}`);
      lines.push(`   No: ${x.no}`);
    });
    appendList(lines, "OUTCOMES", data.outcomes);
  }

  if (data.mode === "recipe") {
    appendList(lines, "PREP", data.prep);
    lines.push("\nINGREDIENTS");
    data.ingredients.forEach(x => lines.push(`- ${x.amount} ${x.item}`.trim()));
    lines.push("\nPROCESS");
    data.operations.forEach((x, i) => lines.push(`${i + 1}. ${titleCase(x.label)}${x.cue ? ` — ${x.cue}` : ""}`));
    if (data.finish) lines.push(`\nFINISH\n${data.finish}`);
  }

  return lines.filter(x => x !== "").join("\n").trim();
}

function appendList(lines, title, items) {
  if (!items?.length) return;
  lines.push(`\n${title}`);
  items.forEach(x => lines.push(`- ${x}`));
}
