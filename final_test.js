const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync(__dirname + '/app.js', 'utf8');

function element() {
  return {
    addEventListener(){},
    classList:{add(){},remove(){}},
    setAttribute(){},
    dataset:{},
    value:'', textContent:'', innerHTML:'', className:'', hidden:false,
    focus(){}, click(){}
  };
}
const elements = new Map();
const document = {
  querySelector(sel){ if(!elements.has(sel)) elements.set(sel, element()); return elements.get(sel); },
  querySelectorAll(){ return []; },
  documentElement:{dataset:{}}, body:{appendChild(){}}, createElement(){ return element(); }
};
const context = {
  console, document,
  localStorage:{getItem(){return null},setItem(){}},
  matchMedia(){return {matches:false}},
  setTimeout(){}, clearTimeout(){},
  URL:{createObjectURL(){return 'blob:test'},revokeObjectURL(){}},
  Blob:function(){}, navigator:{clipboard:{writeText(){return Promise.resolve()}}}
};
vm.createContext(context);
vm.runInContext(code, context);
const run = expr => vm.runInContext(expr, context);
function assert(cond, msg){ if(!cond) throw new Error(msg); }
function plain(x){ return JSON.parse(JSON.stringify(x)); }

const tests=[];
function test(name, fn){ fn(); tests.push(name); }

// Built-in examples for every mode.
test('Process built-in example', () => {
  const r = plain(run('processFlow(MODES.process.example, "concise")'));
  assert(!r.warning, 'process warning');
  assert(r.steps.length >= 5, 'too few process steps');
  assert(r.steps.some(x=>x.kind==='decision'), 'missing process decision');
  assert(r.steps.some(x=>/Submit application/i.test(x.label)), 'missing submit action');
  assert(r.steps.some(x=>/Release funds/i.test(x.label)), 'missing release action');
  const html = run('renderProcess(processFlow(MODES.process.example, "concise"))');
  assert(html.includes('flow-diamond'), 'process visual is not a flowchart');
  assert(html.includes('branch-stop'), 'terminal branch not marked');
});

test('Business built-in example', () => {
  const r = plain(run('businessBrief(MODES.business.example, "concise")'));
  assert(r.objective, 'missing business goal');
  assert(r.metrics.length >= 2, 'missing business metrics');
  assert(r.risks.length >= 1, 'missing risk');
  assert(r.actions.length >= 2, 'missing actions');
});

test('Timeline built-in example', () => {
  const r = plain(run('timelineFlow(MODES.timeline.example, "concise")'));
  assert(r.events.length >= 4, 'timeline events missing');
});

test('Decision built-in example', () => {
  const r = plain(run('decisionTree(MODES.decision.example, "concise")'));
  assert(r.decisions.length >= 2, 'decision branches missing');
});

test('Recipe built-in example', () => {
  const r = plain(run('recipeFlow(MODES.recipe.example, "concise")'));
  assert(!r.warning, r.warning || 'recipe warning');
  assert(r.ingredients.length >= 8, 'recipe ingredients missing');
  assert(r.operations.some(x=>/bake/i.test(x.label)), 'recipe bake missing');
  const html = run('renderRecipe(recipeFlow(MODES.recipe.example, "concise"))');
  assert(html.includes('recipe-sheet'), 'recipe table missing');
});

for (const type of ['textbook','lecture','definitions','stem']) {
  test(`Study ${type} built-in example`, () => {
    const r = plain(run(`studyMap(STUDY_TYPES.${type}.example, "concise", "${type}")`));
    assert(!r.warning, r.warning || `study ${type} warning`);
    assert(r.concepts.length >= 2, `study ${type} concepts missing`);
    assert(r.concepts.every(x=>x.name && x.explanation), `study ${type} malformed concept`);
  });
}

// Friendly parser failures rather than runtime crashes.
test('Unsupported recipe fails safely', () => {
  const r = plain(run('recipeFlow("This is just an essay with no recipe structure.", "concise")'));
  assert(r.warning, 'unsupported recipe should return warning');
});

test('Unsupported study input fails safely', () => {
  const r = plain(run('studyMap("one long unrelated sentence without headings", "concise", "textbook")'));
  assert(r.warning, 'unsupported study should return warning');
});

// XSS / HTML injection defense in output renderers.
test('HTML escaping blocks injected markup', () => {
  const payload = '<img src=x onerror=alert(1)><script>alert(2)</script>';
  const escaped = run(`escapeHtml(${JSON.stringify(payload)})`);
  assert(!escaped.includes('<img'), 'escapeHtml left img tag');
  assert(!escaped.includes('<script'), 'escapeHtml left script tag');

  const processObj = JSON.stringify({steps:[{kind:'action',label:payload}]});
  const html = run(`renderProcess(${processObj})`);
  assert(!html.includes('<script>alert(2)</script>'), 'process renderer XSS');
  assert(!html.includes('<img src=x'), 'process renderer img injection');
});

// Large input guard should fail visibly, not freeze or silently do nothing.
test('Input length guard', () => {
  run(`sourceText.value = ${JSON.stringify('x'.repeat(100001))}; transformNow();`);
  const out = run('outputStage.innerHTML');
  assert(out.includes('too large to process safely'), 'large input guard did not render');
});

// Each renderer should accept its own parser output without throwing.
test('All visual renderers execute', () => {
  run('renderVisual(processFlow(MODES.process.example, "concise"))');
  run('renderVisual(businessBrief(MODES.business.example, "concise"))');
  run('renderVisual(timelineFlow(MODES.timeline.example, "concise"))');
  run('renderVisual(decisionTree(MODES.decision.example, "concise"))');
  run('renderVisual(recipeFlow(MODES.recipe.example, "concise"))');
  run('renderVisual(studyMap(STUDY_TYPES.stem.example, "concise", "stem"))');
});

console.log(`PASS ${tests.length} tests`);
for (const name of tests) console.log('✓', name);
