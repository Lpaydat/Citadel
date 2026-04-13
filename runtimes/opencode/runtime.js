#!/usr/bin/env node

'use strict';

module.exports = Object.freeze({
  id: 'opencode',
  displayName: 'OpenCode',
  capabilities: {
    guidance: {
      support: 'full',
      notes: 'Uses opencode.json instructions field and .citadel/project.md.',
    },
    skills: {
      support: 'full',
      notes: 'Skills loaded via OpenCode native skill tool from ~/.config/opencode/skill/.',
    },
    agents: {
      support: 'partial',
      notes: 'OpenCode uses subagent/task system. Agent definitions are adapted as skill references.',
    },
    hooks: {
      support: 'none',
      notes: 'OpenCode does not support Claude Code lifecycle hooks. Safety hooks are enforced via instructions.',
    },
    workspace: {
      support: 'full',
      notes: 'Full file and shell access via OpenCode tools.',
    },
    worktrees: {
      support: 'full',
      notes: 'Fleet worktree model works via git CLI.',
    },
    approvals: {
      support: 'partial',
      notes: 'Approval policies enforced via instruction-based guidance, not runtime hooks.',
    },
    history: {
      support: 'partial',
      notes: 'Session persistence via Citadel .planning/ state files.',
    },
    telemetry: {
      support: 'partial',
      notes: 'Telemetry is Citadel-managed JSONL state, scripts run via Node.js.',
    },
    mcp: {
      support: 'full',
      notes: 'OpenCode has native MCP support via opencode.json config.',
    },
    surfaces: {
      support: 'partial',
      notes: 'Uses skill tool invocation instead of slash commands.',
    },
  },
  degradations: [
    'hooks: Claude Code lifecycle hooks are not available. Safety policies (protect-files, external-gate) are enforced through instructions instead of runtime hooks.',
    'agents: Agent definitions in agents/ are adapted as skill content rather than native sub-process spawning.',
    'approvals: Consent system uses instruction-based guidance rather than hook-intercepted consent gates.',
  ],
});
