# Wave 1 Implementation Prompts

> Each section is a self-contained prompt. Run them in order.
> Total: 6 items. All 100% generalizable, zero TR references.
> All prompts are self-contained — no external source references needed.

---

## Prompt 0: Security Fix (.env Read Protection)

Do this first. 30 seconds.

```
Add .env file read protection to Citadel's protect-files hook.

Currently `.claude/settings.json` only blocks Edit|Write via protect-files.js.
Add a second PreToolUse entry that blocks Read operations on .env files.

### What to change

**In `.claude/settings.json`**, add this entry to the PreToolUse array:

{
  "matcher": "Read",
  "hooks": [
    {
      "type": "command",
      "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/protect-files.js\"",
      "timeout": 5
    }
  ]
}

**In `.claude/hooks/protect-files.js`**, update the logic to handle Read events:
- When the tool is Read: only block files matching `.env*` patterns (not all protected files —
  agents need to read most files, just not secrets)
- When the tool is Edit or Write: keep existing behavior unchanged
- The hook receives tool name and input via stdin as JSON:
  `{ tool: string, input: { file_path: string } }`

This prevents agents from reading secrets in .env files. Writes were already blocked.

Commit: "fix(security): block Read access to .env files in protect-files hook"
```

---

## Prompt 1: /research Skill

```
Create the /research skill for Citadel.

Write `.claude/skills/research/SKILL.md` with the following protocol.

---
name: research
description: >-
  Focused research investigations. Converts questions into structured findings
  with confidence levels and source citations. Does not make decisions — produces
  information that informs the next step.
user-invocable: true
auto-trigger: false
---

# /research — Focused Investigation

## Identity

/research is for focused research investigations. It converts questions into structured
findings with confidence levels. It does NOT make decisions or modify code — it produces
information that informs the next step.

## When to Use

- Evaluating whether a dependency has a newer version or has been superseded
- Finding community best practices for a specific technical problem
- Reading official documentation for an API or library
- Investigating how other projects solve a similar problem
- Checking if a pattern used in the codebase has known issues
- Any time you need external information before making a decision

## Protocol

### Step 1: FORMULATE

Convert the research question into 2-4 specific search queries:
- Official docs query (e.g., "express.js middleware error handling docs")
- Community/GitHub query (e.g., "express error middleware best practices site:github.com")
- Technical blog/comparison query (e.g., "express vs fastify error handling 2025")
- Release notes query if version-specific (e.g., "express 5.x changelog breaking changes")

State the question clearly in one sentence before searching.

### Step 2: SEARCH

Execute searches and read actual content (not just snippets):
- Use WebSearch for discovery, WebFetch for reading actual pages
- Evaluate source credibility: official docs > GitHub repos with stars > recent blog posts > forum answers
- Stop at 3-6 credible sources (not exhaustive — focused)
- If a source contradicts another, note the disagreement

### Step 3: EXTRACT

For each finding, record:
- **What**: The specific fact, recommendation, or pattern discovered
- **Source**: URL or reference
- **Relevance**: How this applies to the original question (one sentence)
- **Confidence**: high (official docs, verified), medium (community consensus), low (single source, opinion)
- **Action**: What the codebase should do with this information (or "informational only")

### Step 4: WRITE

Write findings to `.planning/research/{topic-slug}.md`:

```markdown
# Research: {Topic}

> Question: {The original question}
> Date: {ISO date}
> Confidence: {overall: high/medium/low}

## Findings

### 1. {Finding title}
**What:** {description}
**Source:** {URL}
**Confidence:** {high/medium/low}
**Action:** {recommendation or "informational"}

### 2. {Finding title}
...

## Summary
{2-3 sentences: what was learned, what the recommendation is}

## Open Questions
{Anything that couldn't be resolved — needs human judgment or deeper investigation}
```

### Step 5: RETURN

Return the summary and recommendation to the caller (user, Marshal, or Archon).
The research document persists for future reference.

## What /research Does NOT Do

- Make architectural decisions (that's the caller's job)
- Install packages or modify code
- Search exhaustively (2-4 queries, 3-6 sources, done)
- Evaluate subjective opinions as facts
- Recommend without evidence

## Quality Gates

- Every finding must have a source URL
- Confidence levels must be justified (not guessed)
- Summary must answer the original question or state why it can't be answered
- Research document must be written before returning findings

---

### Also Do

1. Create the directory `.planning/research/` with a `.gitkeep` file
2. Add routing keywords to `/do` skill's Tier 2 table:
   | "research", "investigate", "look into", "find out" | /research |
3. Add `research` to the INTENT enum in Tier 3's LLM classifier

Commit: "feat: add /research skill for structured investigation with findings synthesis"
```

---

## Prompt 2: /experiment Skill

```
Create the /experiment skill for Citadel.

Write `.claude/skills/experiment/SKILL.md` with the following protocol.

---
name: experiment
description: >-
  Automated optimization loop with scalar fitness function. Proposes changes in
  isolated worktrees, measures with a metric command, keeps improvements, discards
  failures. Supports convergence detection and diminishing returns.
user-invocable: true
auto-trigger: false
---

# /experiment — Metric-Driven Optimization Loop

## Identity

/experiment is an automated optimization loop with a scalar fitness function.
It takes a hypothesis, runs isolated experiments in git worktrees, measures results
with a metric command, and keeps improvements or discards failures. Think of it as
automated A/B testing for code changes.

## Inputs

The user provides three things:
1. **scope**: Files to modify (glob pattern, e.g., "src/api/**/*.ts")
2. **metric**: Shell command that outputs a single number (e.g., `npm run build 2>&1 | tail -1 | grep -oP '\d+'`)
3. **budget**: Iteration cap (default: 5) or time cap (e.g., "10 minutes")

If any input is missing, ask for it. The metric MUST output a single number to stdout.

## Protocol

### Step 1: BASELINE

1. Stash any uncommitted changes (restore on exit)
2. Run the metric command. Record the baseline value.
3. Determine direction: does lower = better (bundle size, error count) or higher = better (FPS, test count)?
   Ask the user if ambiguous.
4. Log: `Baseline: {value} ({metric command})`

### Step 2: ITERATE

For each iteration (up to budget):

1. **Create isolation**: Spawn a sub-agent in a worktree (`isolation: "worktree"`)
2. **Propose change**: The agent modifies files within scope to improve the metric.
   Provide context: baseline value, metric direction, scope, what previous iterations tried.
3. **Measure**: Run the metric command in the worktree
4. **Gate**: Run typecheck. If it fails, discard immediately.
5. **Evaluate**:
   - Improved? → KEEP. Merge the worktree branch. New baseline = new value.
   - Same or worse? → DISCARD. Delete the worktree.
6. **Log iteration**:
   ```
   Iteration {N}: {value} ({delta from baseline}) → {KEEP|DISCARD}
   Change: {one-line description of what was tried}
   ```

### Step 3: CONVERGENCE CHECK

After each iteration, check:
- **Local optimum**: Last 3 iterations all discarded → stop ("no more improvements found")
- **Diminishing returns**: Last kept improvement was < 0.5% → stop ("diminishing returns")
- **Budget exhausted**: Iteration count or time exceeded → stop

### Step 4: REPORT

Write results to `.planning/research/experiment-{slug}.md`:

```markdown
# Experiment: {Description}

> Metric: `{command}`
> Direction: {lower|higher} is better
> Scope: {glob pattern}
> Budget: {N iterations}
> Date: {ISO date}

## Results

| Iteration | Value | Delta | Verdict | Change |
|-----------|-------|-------|---------|--------|
| baseline  | {N}   | —     | —       | —      |
| 1         | {N}   | {+/-} | KEEP    | {desc} |
| 2         | {N}   | {+/-} | DISCARD | {desc} |

## Outcome
- **Start**: {baseline}
- **End**: {final value}
- **Improvement**: {percentage}
- **Iterations**: {kept}/{total}
- **Stop reason**: {convergence|diminishing|budget}

## Kept Changes
{List of changes that were kept, with commit hashes}
```

Also log to `.planning/telemetry/agent-runs.jsonl`:
```json
{"event":"experiment-complete","slug":"{slug}","baseline":{N},"final":{N},"improvement":"{pct}","kept":{N},"total":{N},"timestamp":"{ISO}"}
```

## Common Metrics

| Goal | Metric Command |
|------|---------------|
| Reduce bundle size | `npm run build 2>&1 \| grep -oP 'Total size: \K\d+'` |
| Reduce type errors | `npx tsc --noEmit 2>&1 \| grep -c 'error TS'` |
| Increase test pass rate | `npm test 2>&1 \| grep -oP '\d+ passing'` |
| Reduce file count | `find src -name '*.ts' \| wc -l` |
| Reduce line count | `wc -l src/**/*.ts \| tail -1 \| awk '{print $1}'` |

## Safety Rules

- NEVER modify files outside scope
- ALWAYS use worktree isolation for changes
- ALWAYS run typecheck before keeping a change
- Restore stashed changes on exit (even on error)
- If the metric command fails, treat as DISCARD (not crash)

---

### Also Do

Add routing keywords to `/do` skill's Tier 2 table:
| "experiment", "optimize", "try", "A/B", "measure" | /experiment |

Commit: "feat: add /experiment skill for metric-driven optimization loops"
```

---

## Prompt 3: /systematic-debugging Skill

```
Create the /systematic-debugging skill for Citadel.

Write `.claude/skills/systematic-debugging/SKILL.md` with the following protocol.

---
name: systematic-debugging
description: >-
  4-phase root cause analysis: observe, hypothesize, verify, fix. Enforces
  investigation before any code changes. Emergency stop after 2 failed fixes.
  Prevents shotgun debugging and fix cascades.
user-invocable: true
auto-trigger: false
---

# /systematic-debugging — Root Cause Before Fix

## Identity

/systematic-debugging enforces one rule: NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.

Most debugging failures come from guessing. This skill forces a structured approach:
observe → hypothesize → verify → fix. The fix is always the last step, never the first.

## Protocol

### Phase 1: OBSERVATION & REPRODUCTION

1. Read the error message, stack trace, or bug description thoroughly
2. Reproduce the issue:
   - If it's a type error: run typecheck and read the full error
   - If it's a runtime error: identify the triggering conditions
   - If it's a behavioral bug: document expected vs actual behavior
3. Isolate the failing component/function:
   - What file? What function? What line?
   - What are the inputs when it fails?
   - Does it fail consistently or intermittently?

**Output**: A clear problem statement:
"{Component} does {X} when it should do {Y}, triggered by {condition}"

### Phase 2: HYPOTHESIS & VERIFICATION

1. Formulate up to 3 hypotheses for WHY the bug exists:
   - H1: {most likely cause} — because {evidence}
   - H2: {second candidate} — because {evidence}
   - H3: {third candidate} — because {evidence}

2. For each hypothesis, define a verification step:
   - Add a console.log / diagnostic read / breakpoint
   - Check a specific value at a specific point
   - DO NOT change any logic yet — only observe

3. Run the verification:
   - Which hypothesis was confirmed?
   - Which were eliminated?
   - If none confirmed: formulate new hypotheses with the new information

**CRITICAL**: Do not skip this phase. Do not "just try" a fix. Verify first.

### Phase 3: ROOT CAUSE ANALYSIS

Once a hypothesis is confirmed:

1. Explain WHY the bug happens, not just WHERE:
   - Trace the data flow backward from the symptom to the source
   - Identify the specific incorrect assumption or logic error
   - Document the causal chain:
     "A calls B with X, B assumes X > 0, but A passes -1 when {condition}"

2. Check for related occurrences:
   - Is this pattern used elsewhere? Could the same bug exist in similar code?
   - Is there a systemic issue (e.g., missing validation at a boundary)?

**Output**: Root cause statement:
"The bug occurs because {cause}. This happens when {trigger}."

### Phase 4: IMPLEMENTATION

1. Write a failing test case that reproduces the bug (if test framework exists)
2. Apply the minimal fix — change only what's necessary to resolve the root cause
3. Verify the fix:
   - Test case now passes
   - Typecheck passes
   - No regressions in related functionality
4. If the root cause analysis revealed related occurrences, fix those too

## Emergency Stop Rule

**If a fix fails TWICE: STOP.**

Do not try a third guess. The root cause analysis was wrong. Either:
- Go back to Phase 2 with new hypotheses
- Ask the user for more context about the system's intended behavior
- Check if there's a higher-level architectural issue

Three failed fixes in a row means you're guessing, not debugging.

## What This Skill Prevents

- **Shotgun debugging** — changing random things until the error goes away
- **Symptom fixing** — patching the output without understanding the cause
- **Fix cascades** — one bad fix creating three new bugs
- **Silent regressions** — fixing one path while breaking another

---

### Also Do

Add routing keywords to `/do` skill's Tier 2 table:
| "debug", "root cause", "diagnose", "why is", "investigate bug" | /systematic-debugging |

Commit: "feat: add /systematic-debugging skill — root cause before fix"
```

---

## Prompt 4: Archon Self-Correction Protocol

This is the sleeper hit. Do this carefully.

```
Add a self-correction protocol to Citadel's Archon skill.

Edit `.claude/skills/archon/SKILL.md` to add self-correction mechanisms that prevent
campaign drift. This is the difference between an agent that follows a plan and an agent
that catches when the plan is drifting.

### What to Add

Insert a new section between Step 3 (EXECUTE PHASES) and Step 4 (VERIFY).
Renumber subsequent steps.

---

### Step 4: SELF-CORRECTION (Mandatory)

These checks run automatically during campaign execution. They are not optional.

#### Direction Alignment Check (every 2 phases)

After completing every 2nd phase:

1. Re-read the campaign's original Direction field
2. Compare it to the Feature Ledger (what was actually built)
3. Ask: "Is what I've built still serving the original direction?"
4. If YES: continue. Log "Direction check: aligned" in Active Context.
5. If NO: stop the current phase. Write a Decision Log entry:
   - What drifted and why
   - Whether to course-correct (adjust remaining phases) or park
     (direction fundamentally changed)
   - If course-correcting: rewrite remaining phases to re-align

This catches **Scope Truncation** — when an agent builds phases 1-3 correctly
but silently drops the hard parts in phases 4-6.

#### Quality Spot-Check (every phase)

After each phase completes:

1. Look at the most significant output of the phase (the largest file changed,
   the new component, the refactored module)
2. Read it. Does it meet the project's quality bar?
   - TypeScript strict mode? Types correct, not `any`-heavy?
   - Clean structure? Not a 500-line monolith?
   - Follows project conventions from CLAUDE.md?
3. If quality is acceptable: continue
4. If quality is below bar: add a remediation task to the current phase
   before marking complete

#### Regression Guard (every build phase)

After each build phase:

1. Run the project's typecheck command
2. Compare error count to the campaign's baseline (recorded at campaign creation)
3. Escalation ladder:
   - 1-2 new errors: fix them before continuing
   - 3-4 new errors: log a warning, attempt fixes, continue if resolved
   - 5+ new errors: PARK the campaign. Something went structurally wrong.
4. If test suite exists: run it. Any new failures trigger the same escalation.

#### Anti-Pattern Scan (every build phase)

After each build phase, scan modified files for:
- `transition-all` (should name specific properties)
- `confirm()`, `alert()`, `prompt()` (should use in-app components)
- Missing Escape key handlers in modals/overlays
- Hardcoded values that should be constants

If any found: fix before marking the phase complete.

---

### Also Update Step 3 (EXECUTE PHASES)

Add to the "For each phase" list, after step 6 (Record) and before step 7 (Continue):

7. **Self-correct**: Run applicable checks from Step 4:
   - Quality spot-check (every phase)
   - Direction alignment (every 2nd phase)
   - Regression guard (build phases only)
   - Anti-pattern scan (build phases only)

### Also Update Circuit Breakers

Add these conditions to the existing quality gates:

- Direction drift detected during alignment check (2 consecutive misalignments)
- Quality spot-check fails 3 times in a row (agent can't meet quality bar)
- Typecheck introduces 5+ new errors in a single phase

### Also Update Health Diagnostic (Undirected Mode)

Add after the existing checks:

5. Run typecheck and count errors — if type errors are climbing compared to
   last campaign, suggest a "fix type errors" campaign
6. Check `.planning/campaigns/completed/` count — if 3+ completed campaigns
   exist, suggest archival/cleanup

Commit: "feat(archon): add self-correction protocol — direction alignment, quality checks, regression guards"
```

---

## Prompt 5: Campaign Template Additions

```
Add Review Queue and Circuit Breakers sections to Citadel's campaign template.

Edit `.planning/_templates/campaign.md` to add two new sections after
Decision Log and before Active Context.

### Add These Sections

## Review Queue
<!-- Items that need human review. Archon adds items here; user reviews them. -->
<!-- Format: - [ ] {Type}: {Description} -->
<!-- Types: Visual, Architecture, UX, Security, Performance -->
<!-- Example:
- [ ] Visual: Check the new dashboard layout looks right on mobile
- [ ] Architecture: Verify the event bus pattern is correct for cross-domain comm
- [ ] UX: Confirm the onboarding flow feels natural
-->

## Circuit Breakers
<!-- Conditions that should trigger parking this campaign. Defined at creation. -->
<!-- Example:
- 3+ consecutive sub-agent failures on the same phase
- Typecheck introduces 5+ new errors
- Direction drift detected (built features don't serve the original goal)
- Fundamental architectural conflict discovered
-->

### Why These Matter

**Review Queue**: Archon works autonomously but some decisions need human eyes —
visual design, UX flow, architectural choices. Rather than blocking execution,
Archon logs review items and continues. The user reviews asynchronously.
This is how autonomous execution and human judgment coexist.

**Circuit Breakers**: Defined at campaign creation, these are the "stop conditions"
that prevent an agent from grinding on a failing approach. Without explicit circuit
breakers, agents either stop too early (conservative) or grind forever (wasteful).
Making them explicit forces thinking about failure modes upfront.

Commit: "feat: add Review Queue and Circuit Breakers to campaign template"
```

---

## Prompt 6: /do Router Final Pass

Run this last, after all skills are created.

```
Final pass on the /do router after Wave 1 skill additions.

Read `.claude/skills/do/SKILL.md` and verify/add these entries:

### Tier 2 Keyword Table Additions

| "research", "investigate", "look into", "find out" | /research |
| "experiment", "optimize", "try", "A/B", "measure" | /experiment |
| "debug", "root cause", "diagnose", "why is", "investigate bug" | /systematic-debugging |

### Tier 3 INTENT Enum

Add `research` to the INTENT values:
INTENT: fix | build | audit | redesign | research | improve | wire | prune

(research should already be there — verify)

### Routing Verification

Mentally trace these inputs through the tiers:

1. "/do research how does auth work in Express 5" → Tier 2 → /research ✓
2. "/do experiment reduce bundle size by 10%" → Tier 2 → /experiment ✓
3. "/do debug why is the login page crashing" → Tier 2 → /systematic-debugging ✓
4. "/do fix typo in README" → Tier 0 → direct edit ✓
5. "/do continue" → Tier 0 → resume campaign ✓
6. "/do build a new auth system" → Tier 3 → complexity 3-4 → /marshal or /archon ✓

If any misroute, adjust the keyword table or add disambiguation.

Commit: "feat(router): add Wave 1 skill keywords to /do routing table"
```

---

## Execution Notes

- **Order matters**: Prompt 0 first (security). Prompts 1-3 can run in parallel
  (independent skills). Prompt 4 reads current Archon skill. Prompt 5 is independent.
  Prompt 6 is last (verifies all skills are routable).
- **Each prompt is self-contained**: No external references. Everything needed is in the prompt.
- **Total new files**: 3 skills, 1 directory (`.planning/research/`)
- **Total modified files**: `settings.json`, `protect-files.js`, `archon/SKILL.md`,
  `campaign.md`, `do/SKILL.md`
- **Zero TR references**: All content is original and generalizable.

## After Wave 1

PR from `dev` → `master`. The PR description is the changelog:

```
## Wave 1: Research, Experimentation, and Self-Correction

### New Skills
- `/research` — Structured investigation with findings synthesis and confidence levels
- `/experiment` — Metric-driven optimization loops in isolated worktrees
- `/systematic-debugging` — 4-phase root cause analysis (no fix without investigation)

### Archon Upgrade
- Self-correction protocol: direction alignment (every 2 phases), quality spot-checks
  (every phase), regression guards (every build phase), anti-pattern scans
- New circuit breakers: drift detection, quality failures, type error escalation

### Infrastructure
- .env read protection (security fix)
- Campaign template: Review Queue + Circuit Breakers sections
- /do router: new skill keywords and routing verification

### What This Means
Citadel now has research as a first-class concern (not just code production),
agents that catch their own drift (not just follow plans), and a debugging
protocol that prevents shotgun fixes.
```
