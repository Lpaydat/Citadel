# Citadel Upgrade Report: Tailored Realms Harness Comparison

> Generated: 2026-03-21
> Source: D:\Tailored-Realms-Latest\.claude vs C:\Users\gammo\Desktop\Citadel\.claude

---

## 1. Skills Gap Analysis

### Summary

| Category | Tailored Realms | Citadel | Gap |
|----------|----------------|---------|-----|
| Orchestration | 4 (do, marshal, archon, fleet) | 4 (same) | Parity |
| Development & Process | 7 | 5 (review, test-gen, doc-gen, refactor, scaffold) | Missing 2 |
| Research & Ideas | 8 | 0 | **Full gap** |
| Architecture & Quality | 6 | 0 (rules exist, but no skills) | **Full gap** |
| Experience & Design | 7 | 0 | Mostly TR-specific |
| Platform/Domain-Specific | 10+ | 0 | Not applicable (TR-only) |

### Skill-by-Skill Analysis

#### HIGH PRIORITY — People will ask for these

| TR Skill | What It Does | Citadel Equivalent? | Generalizable? | Notes |
|----------|-------------|---------------------|----------------|-------|
| **research** | Focused research investigations — structured question, multi-source exploration, findings synthesis | None | **100% generalizable** | No TR references. Universal need. Should be first port. |
| **experiment** | Optimization loops with scalar metrics. Isolated worktree, minimal implementation, KEEP/PARTIAL/DISCARD verdict | None | **100% generalizable** | Uses worktree isolation. Critical for "try this approach" workflows. |
| **live-preview** | Mid-build render-check-fix loop. Screenshots components during construction, not just after | None | **95% generalizable** | References Playwright MCP for screenshots. Core pattern is universal. Remove TR route registry references. |
| **systematic-debugging** | 4-step root cause analysis (reproduce → isolate → hypothesize → verify) | None | **100% generalizable** | No TR references. Universal debugging protocol. |
| **simplify** | Post-write code review for reuse, quality, efficiency — then fixes issues found | Citadel has this registered but verify it's complete | **100% generalizable** | Already listed in Citadel's skill triggers. Confirm it exists as a full SKILL.md. |

#### MEDIUM PRIORITY — Strengthens the harness

| TR Skill | What It Does | Citadel Equivalent? | Generalizable? | Notes |
|----------|-------------|---------------------|----------------|-------|
| **design-critique** | 3-perspective visual quality gate (Spec Auditor, User Advocate, Art Director). Mandatory for UI work. | None | **80% generalizable** | The 3-perspective pattern is universal. Remove "Three Words" (Inhabited/Responsive/Intentional) and glass morphism references. Replace with generic "project design principles" placeholder. |
| **doc-health** | Documentation staleness tracking. Detects docs drifting from source changes. | None | **100% generalizable** | Pairs with post-edit.js drift tracking (which TR has but Citadel doesn't). |
| **system-map** | System and dependency mapping. Produces visual/textual maps of how components connect. | None | **100% generalizable** | No TR references. |
| **research-fleet** | Parallel research with multiple scout agents. Each scout takes a different angle. | None | **100% generalizable** | Uses Fleet's wave mechanics for research instead of build. |
| **research-sweep** | External sources, competitive analysis, market scans via web search | None | **100% generalizable** | Uses WebSearch/WebFetch. No TR references. |
| **initiative-loop** | Maintenance and creative sweeps — "what's broken?" and "what's possible?" | None | **95% generalizable** | References capability manifests (which Citadel doesn't have yet). Pattern is universal. |
| **structure-first** | AI budget gate — "Can this be solved with rules/patterns/state machines/deterministic algorithms?" | None | **100% generalizable** | Decision framework, no TR references. Prevents over-engineering with AI. |
| **idea-development** | Idea pipeline expansion and candidate generation from rough concepts | None | **100% generalizable** | No TR references. |

#### LOW PRIORITY — Nice to have

| TR Skill | What It Does | Citadel Equivalent? | Generalizable? | Notes |
|----------|-------------|---------------------|----------------|-------|
| **idea** | Quick idea capture to intake pipeline | None | **100% generalizable** | Trivial skill — captures a thought and writes it to `.planning/intake/`. |
| **vault-crawler** | Obsidian vault exploration and knowledge extraction | None | **100% generalizable** | Niche but useful for users with Obsidian. No TR references. |
| **scenario-testing** | Structured scenario-based testing beyond unit tests | None | **90% generalizable** | May have TR-specific scenario templates. Pattern is universal. |
| **slot-manifest** | Block boundary composition and wiring maps | None | **70% generalizable** | Concept is generic (component slot definitions) but implementation is tied to TR's OmniCanvas block system. |
| **corpus-driven-dev** | Corpus, classifier, parser, accuracy metrics for data-driven features | None | **100% generalizable** | Specialized but no TR references. For NLP/classification work. |

#### NOT PORTABLE — TR-Specific

| TR Skill | Why Not Portable |
|----------|-----------------|
| battlemap-combat-system | D&D 5e VTT combat — entirely game-domain |
| sandbox | Canvas2D play surface with behavior systems |
| omni-canvas | Infinite spatial canvas rendering |
| sim-director | Simulation/narrative systems |
| lab-playground | TR-specific proof-of-concept environment |
| lyra-agent-assembler | Voice agent contracts |
| canon-validation | 3-layer validation for TR's kernel state mutations |
| design-engine | TR's variant tokens, zone architecture, CSS variable pipeline |
| navigation-system | TR's navigation model and interrupt handling |
| choreography | Animation choreography tied to TR's Framer Motion patterns |
| mounted-renderer-performance | TR's mounted render FPS optimization |
| implication-engine | TR's rule conflict resolution |
| experience-auditor | 90% TR-specific (scene templates, WFC presets, taste packets). The 10% generalizable pattern: "capture state → analyze → route findings to intake → track trends" could inform a generic audit skill. |
| experience-decision-model | The pattern (explicit decision variables before implementation) is universal, but the specific variables (emotional contract, composition, color, typography, motion) are design-focused. Could be generalized to "decision-model" for any major feature. |
| design-reference | Visual reference establishment. Pattern is generic but implementation assumes UI/design work. |
| visual-reference | Reference images for specs. Same as above. |
| visual-quality | Pixel probe, visual test, canvas QA. Too tied to TR's rendering pipeline. |
| domain-scaffold | TR's domain cartridge creation. Citadel's `scaffold` skill covers generic scaffolding. |

---

## 2. Routing and Commands

### Commands TR Has That Citadel Doesn't

| Command | What It Does | Should Citadel Add It? |
|---------|-------------|----------------------|
| `/research [question]` | Structured research investigation | **Yes** — high priority, universal need |
| `/experiment [hypothesis]` | Isolated optimization loop with metrics | **Yes** — high priority, "try this" workflow |
| `/research-fleet [topic]` | Parallel multi-scout research | **Yes** — medium priority, leverages Fleet |
| `/research-sweep [topic]` | External source scanning | **Yes** — medium priority, web research |
| `/idea [thought]` | Quick idea capture to intake | **Yes** — low priority, trivial to add |
| `/idea-development [concept]` | Expand rough idea into candidates | **Yes** — medium priority |
| `/initiative-loop` | "What needs attention?" sweep | **Yes** — medium priority |
| `/design-critique` | 3-perspective visual review | **Yes** — medium priority, needs generalization |
| `/systematic-debugging [bug]` | 4-step root cause analysis | **Yes** — high priority |
| `/live-preview` | Mid-build screenshot loop | **Yes** — high priority for UI projects |
| `/doc-health` | Documentation staleness check | **Yes** — medium priority |
| `/system-map` | Dependency/architecture mapping | **Yes** — medium priority |
| `/structure-first` | AI budget decision gate | **Yes** — medium priority |

### /do Router Comparison

**Tier 0-1:** Identical between TR and Citadel. Same pattern matching and active state checks.

**Tier 2 — Skill Keyword Table:** TR's table is significantly larger due to more installed skills. Citadel's table covers the 13 skills it ships. When new skills are ported, their keywords should be added to Citadel's `/do` router.

The following keyword entries exist in TR's `/do` but not Citadel's:

```
| "research", "investigate", "explore" | /research |
| "experiment", "try", "optimize", "A/B" | /experiment |
| "debug", "root cause", "diagnose" | /systematic-debugging |
| "preview", "screenshot", "render check" | /live-preview |
| "idea", "brainstorm" | /idea |
| "initiative", "sweep", "what needs" | /initiative-loop |
| "design review", "visual review" | /design-critique |
| "doc health", "stale docs" | /doc-health |
| "map", "dependencies", "system map" | /system-map |
```

**Tier 3 — LLM Classifier:** Identical dimensions (SCOPE, COMPLEXITY, INTENT, REQUIRES_PERSISTENCE, REQUIRES_PARALLEL, REQUIRES_TASTE). Same routing rules. No differences to port.

**Routing Patterns in TR Not in Citadel:**
- TR's `/do` has an `INTENT: research` classification that routes to `/research` or `/research-fleet`. Citadel's INTENT enum should add `research` when those skills ship.
- TR's `/do` recognizes "repeated pattern complaint" and routes to `/create-skill`. Citadel's `/do` already has this.

**Verdict:** The routers are structurally identical. The only difference is the skill keyword table, which grows naturally as skills are added. No structural changes needed.

---

## 3. Infrastructure Differences

### 3.1 Hooks

#### TR Has, Citadel Doesn't

| Hook Feature | What It Does | Priority |
|-------------|-------------|----------|
| **Read protection for .env** | TR's `protect-files.js` blocks `Read` on `.env*` files. Citadel's only blocks `Edit\|Write`. | **HIGH** — security gap. Add `Read` matcher for protect-files. |
| **Drift tracking in post-edit.js** | TR's post-edit hook maintains an append-only drift log (`.claude/doc-drift.log`) tracking which source files changed, with scoring (NEW=3, EDIT=1, NEW_DIR=5), decay (1 point/hour), alert threshold (30), and log rotation (512KB max). | **MEDIUM** — useful for doc-health skill. Only needed if shipping doc-health. |
| **Capability freshness tracking** | TR's post-edit marks capability manifests stale when source files in their scope change. `.planning/capabilities/.freshness.json`. | **LOW** — only needed if shipping capability manifests system. |
| **Env var `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`** | Set in TR's settings.json. Enables experimental agent team features. | **CHECK** — verify if Citadel should enable this. May already be standard. |

#### Citadel Has, TR Doesn't

Citadel's hooks use `$CLAUDE_PROJECT_DIR` environment variable for paths, making them portable. TR's hooks use hardcoded relative paths. **Citadel's approach is better** for a public repo.

#### Parity

Both have identical hook event coverage: PreToolUse, PostToolUse, PreCompact, WorktreeCreate, Stop, PostToolUseFailure, SessionStart. Both have circuit-breaker, protect-files, post-edit, pre-compact, restore-compact, quality-gate, intake-scanner, worktree-setup.

### 3.2 Campaign Templates

| Feature | TR Template | Citadel Template | Difference |
|---------|------------|-----------------|------------|
| Status/Direction/Dates | Yes | Yes | Parity |
| Claimed Scope | Yes | Yes | Parity |
| Phases table | Yes (with dependency tracking) | Yes | Parity |
| Feature Ledger | Yes | Yes | Parity |
| Decision Log | Yes | Yes | Parity |
| Active Context | Yes | Yes | Parity |
| Continuation State | Yes | Yes | Parity |
| **Review Queue** | Yes | **No** | TR has a review queue for human feedback items |
| **Circuit Breakers** | Yes (explicit section) | **No** | TR documents parking conditions in campaign file |

**Recommendation:** Add `Review Queue` and `Circuit Breakers` sections to Citadel's campaign template. Both are generalizable and improve campaign management.

### 3.3 Archon Profile

TR's Archon has several capabilities Citadel's doesn't:

| Feature | Description | Generalizable? | Priority |
|---------|------------|----------------|----------|
| **Health Diagnostics** | Signals-based undirected work selection: type error trends, stale manifests, dead code markers, campaign diversity. Produces ranked work queue. | **90%** — remove "unwired systems" (TR-specific). Pattern of reading project signals to select work is universal. | MEDIUM |
| **Mandatory Completion Checklist** | After each phase: typecheck, visual verification (if .tsx), screenshot gate (if view files), design critique (if UI), snapshot collection, manifest update. | **80%** — remove design critique and manifest update (TR-specific). Typecheck + visual verification is universal. | MEDIUM |
| **Self-Correction Protocol** | Direction alignment check every 2 phases, quality spot-check every phase, regression guard every build phase, anti-pattern scan every build phase. | **100%** — fully generalizable. | **HIGH** |
| **Archon Profile File** | `.planning/archon-profile.md` — persistent Archon configuration with project-specific signals and preferences. | **100%** | MEDIUM |

### 3.4 Fleet Coordination

| Feature | TR Fleet | Citadel Fleet | Difference |
|---------|---------|--------------|------------|
| Wave execution | 2-3 agents/wave | 2-3 agents/wave | Parity |
| Discovery relay | Between waves | Between waves | Parity |
| Worktree isolation | Yes | Yes | Parity |
| Budget tracking | ~700K/wave | ~700K/wave | Parity |
| **Instance ID generation** | Yes (unique IDs for each agent) | Check if present | TR generates instance IDs for tracking |
| **Scope overlap detection** | Pre-wave validation that no two agents claim same directories | Check if present | **Important for parallel safety** |
| **Dead instance recovery** | Sweeps for orphaned claims from crashed agents | Check if present | Prevents stuck claims |
| **Bottleneck logging** | Records which scopes block the most agents | Not present | Nice-to-have telemetry |
| **Ranked work queues** | When multiple items available, ranks by priority/dependency | Check if present | Better wave planning |

**Recommendation:** Verify Citadel's coordination protocol covers instance tracking, scope overlap, and dead instance recovery. These are critical for parallel safety and are 100% generalizable.

### 3.5 Planning Infrastructure

TR has several `.planning/` subdirectories Citadel doesn't:

| Directory | Purpose | Should Citadel Add? |
|-----------|---------|-------------------|
| `.planning/knowledge/` | Reusable patterns extracted from completed work | **YES** — Citadel has `knowledge-extractor` agent but no target directory. Create the directory. |
| `.planning/capabilities/` | Per-domain capability manifests with freshness tracking | **MEDIUM** — useful for large projects. May be over-engineering for a generic harness. Consider shipping as optional. |
| `.planning/quality/` | Audit manifests, proof reports, trend.json | **LOW** — tied to experience-auditor which is mostly TR-specific. |
| `.planning/reviews/` | Campaign review documents | **MEDIUM** — useful if Archon's review phase is ported. |
| `.planning/screenshots/` | Captured route screenshots | **LOW** — only if live-preview skill is ported. |
| `.planning/references/` | Visual reference images per campaign | **LOW** — design-specific. |

### 3.6 Other Infrastructure

| Feature | What TR Has | Should Citadel Port? |
|---------|------------|---------------------|
| **Anti-pattern checks in post-edit** | Performance linting on every write: `transition-all`, `repeat:Infinity`, `confirm()`, Zustand derivation | Citadel's post-edit already checks `confirm()`, `transition-all`, `setInterval`. **Parity achieved** for the generic checks. TR also checks `repeat:Infinity` and Zustand derivation — consider adding. |
| **Drift log with scoring** | Append-only log with weighted scoring (NEW=3, EDIT=1), decay, rotation | **MEDIUM** — useful for doc-health. Only port if doc-health skill ships. |
| **Marshal session log** | `.planning/marshal/SESSION_LOG.md` (last 5 sessions) + `PATTERNS.md` | **MEDIUM** — helps Marshal learn from past sessions. Check if Citadel's Marshal already does this. |
| **Question documents** | Marshal writes `.planning/marshal/questions-{timestamp}.md` when blocked | **LOW** — niche feature. |
| **Capability manifests** | Per-domain docs of what's built, with staleness tracking via post-edit hook | **MEDIUM** — great for large projects. Consider as optional feature. |
| **Visual verification tooling** | `npm run verify:visual` command, route registry, JSON mode | **TR-specific** — tied to TR's routing and Playwright setup. Pattern could be generalized. |

---

## 4. Recommended Porting Order

### Wave 1 — High Impact, Low Effort (100% generalizable)

1. **`/research`** — Most requested missing skill. Zero TR references.
2. **`/experiment`** — "Try this approach" workflow. Zero TR references.
3. **`/systematic-debugging`** — 4-step root cause analysis. Zero TR references.
4. **Read protection for .env** — One-line change to settings.json hook matcher.
5. **Campaign template additions** — Add Review Queue and Circuit Breakers sections.

### Wave 2 — Medium Impact, Medium Effort

6. **`/live-preview`** — Strip TR route registry, keep Playwright screenshot loop.
7. **`/research-fleet`** — Parallel research using Fleet wave mechanics.
8. **`/doc-health`** — With drift tracking infrastructure in post-edit.
9. **`/system-map`** — System/dependency mapping.
10. **Archon self-correction protocol** — Direction alignment + quality spot-checks.
11. **`.planning/knowledge/`** — Create directory for knowledge-extractor agent output.
12. **Fleet coordination hardening** — Instance IDs, scope overlap, dead instance recovery.

### Wave 3 — Nice to Have

13. **`/design-critique`** — Generalize 3-perspective pattern, remove TR design language.
14. **`/initiative-loop`** — "What needs attention?" sweep.
15. **`/idea` + `/idea-development`** — Idea pipeline.
16. **`/research-sweep`** — Web research scanning.
17. **`/structure-first`** — AI budget decision gate.
18. **Archon health diagnostics** — Signals-based work selection.
19. **Marshal session log** — Learning from past sessions.
20. **`/vault-crawler`** — Obsidian integration.

---

## 5. TR-Specific References to Strip

When porting any skill, search and remove references to:

- **Domain names:** Sandbox, Battlemap, Observatory, Studio, Landing, Codex, Foyer
- **Design language:** "Three Words" (Inhabited/Responsive/Intentional), glass morphism, "depth-not-fidelity", "material-source-not-mood"
- **Systems:** OmniCanvas, WFC (Wave Function Collapse), Show Bible, Entity/Realm/Biome
- **Specific files:** `src/canvas/`, `src/domains/studio/`, realm-specific routes
- **Quality patterns:** "taste packets", "scene templates", "4 WFC presets"
- **Architecture specifics:** CommitGateway, Airlock Pattern, Platform vs Studio shells, ChromeLevel
- **Import aliases:** `@canvas/*`, `@design-system/*` (keep generic ones like `@kernel/*`, `@os/*`, `@domains/*`)

Most skills are cleanly separated from TR content. The main contamination risk is in:
- design-critique (Three Words, glass morphism references in evaluation criteria)
- live-preview (TR route registry, specific screenshot targets)
- experience-auditor (scene templates, WFC presets — don't port this skill)
- autopilot (references to "design DNA" and "anti-patterns.md" — these are TR knowledge base files)

---

## 6. Key Architectural Insight

TR's harness evolved from Citadel's foundation but added three capabilities Citadel should consider:

1. **Research as a first-class concern.** TR treats research, experimentation, and idea development as equal to code production. Citadel has no research skills at all. This is the biggest gap.

2. **Self-correction loops in orchestrators.** TR's Archon checks direction alignment every 2 phases and runs quality spot-checks every phase. This prevents drift in long campaigns. Citadel's Archon executes phases but doesn't self-correct.

3. **Graduated quality gates.** TR has quality checks at three levels: per-file (post-edit hook), per-phase (Archon completion checklist), and per-campaign (design critique). Citadel has per-file and per-session (Stop hook) but nothing at the phase level.
