#!/usr/bin/env node

/**
 * protect-files.js — PreToolUse hook (Edit/Write/Read)
 *
 * Blocks edits to files that should not be modified during agent sessions.
 * Blocks reads on .env files to prevent agents from reading secrets.
 * Protected paths are configurable via harness.json protectedFiles array.
 *
 * Default protected: .claude/settings.json, .claude/hooks/*
 * Users can add their own patterns.
 *
 * Supports glob-like patterns:
 *   - * matches any file in the directory
 *   - ** matches recursively (not implemented — keep it simple)
 */

const fs = require('fs');
const path = require('path');
const health = require('./harness-health-util');

const PROJECT_ROOT = health.PROJECT_ROOT;

function main() {
  let input = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => { input += chunk; });
  process.stdin.on('end', () => {
    let event;
    try {
      event = JSON.parse(input);
    } catch {
      process.exit(0);
    }

    const toolName = event.tool_name || '';
    if (toolName !== 'Edit' && toolName !== 'Write' && toolName !== 'Read') {
      process.exit(0);
    }

    const filePath = event.tool_input?.file_path || event.tool_input?.path || '';
    if (!filePath) {
      process.exit(0);
    }

    const relativePath = path.relative(PROJECT_ROOT, filePath).replace(/\/g, '/');

    // Read events: only block .env files (secrets protection)
    if (toolName === 'Read') {
      const basename = path.basename(filePath);
      if (basename.startsWith('.env')) {
        process.stdout.write(
          `[protect-files] Blocked: cannot read ${relativePath} — .env files contain secrets.`
        );
        process.exit(2);
      }
      process.exit(0);
    }

    // Edit/Write events: check against protected patterns
    const config = health.readConfig();
    const protectedPatterns = config.protectedFiles || [
      '.claude/settings.json',
      '.claude/hooks/*',
    ];

    for (const pattern of protectedPatterns) {
      if (matchPattern(relativePath, pattern)) {
        process.stdout.write(
          `[protect-files] Blocked: ${relativePath} is protected by pattern "${pattern}". ` +
          `Remove the pattern from harness.json protectedFiles to allow edits.`
        );
        process.exit(2); // Block the edit
      }
    }

    process.exit(0);
  });
}

function matchPattern(filePath, pattern) {
  // Exact match
  if (filePath === pattern) return true;

  // Wildcard: pattern ends with /*
  if (pattern.endsWith('/*')) {
    const dir = pattern.slice(0, -2);
    return filePath.startsWith(dir + '/') && !filePath.slice(dir.length + 1).includes('/');
  }

  // Directory prefix: pattern ends with /
  if (pattern.endsWith('/')) {
    return filePath.startsWith(pattern);
  }

  return false;
}

main();
