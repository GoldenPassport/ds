/**
 * Timing reporter — writes test-timings.json after every CLI run.
 *
 * Collects the wall-clock duration of every story test, sorts slowest-first,
 * and prints a console summary highlighting anything over 20 s.  The JSON
 * file is useful for spotting stories that should be split into smaller files.
 */
import { writeFileSync } from 'node:fs';
import { relative } from 'node:path';

import type { Task, TaskResult } from '@vitest/runner';
import { Reporter, RunnerTestFile, Vitest } from 'vitest/node';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TestRow {
  file: string; // e.g. "src/stories/Chat.stories.tsx"
  suite: string; // describe() block name, or "" when flat
  test: string; // story / variant name
  durationMs: number;
  status: string; // "pass" | "fail" | "skip" | …
}

interface FileRow {
  file: string;
  tests: number;
  totalMs: number;
  maxMs: number;
}

// ---------------------------------------------------------------------------
// Reporter
// ---------------------------------------------------------------------------

export default class TimingReporter implements Reporter {
  private root = process.cwd();
  private readonly thresholdMs = 20_000;
  private readonly outFile = 'test-timings.json';

  onInit(ctx: Vitest) {
    this.root = ctx.config.root;
  }

  onFinished(files: RunnerTestFile[] = []) {
    const tests: TestRow[] = [];

    for (const file of files) {
      const filepath = relative(this.root, file.name);
      walkTasks(file.tasks ?? [], filepath, '', tests);
    }

    if (tests.length === 0) return;

    // Sort slowest first
    tests.sort((a, b) => b.durationMs - a.durationMs);

    // Roll up per-file totals
    const fileMap = new Map<string, FileRow>();
    for (const t of tests) {
      const row = fileMap.get(t.file) ?? { file: t.file, tests: 0, totalMs: 0, maxMs: 0 };
      row.tests += 1;
      row.totalMs += t.durationMs;
      row.maxMs = Math.max(row.maxMs, t.durationMs);
      fileMap.set(t.file, row);
    }
    const files_ = [...fileMap.values()].sort((a, b) => b.totalMs - a.totalMs);

    const slow = tests.filter((t) => t.durationMs > this.thresholdMs);

    // Write JSON
    writeFileSync(
      this.outFile,
      JSON.stringify(
        {
          generated: new Date().toISOString(),
          totalTests: tests.length,
          slowTests: slow.length,
          thresholdMs: this.thresholdMs,
          byFile: files_,
          byTest: tests,
        },
        null,
        2,
      ),
    );

    // ── Console summary ──────────────────────────────────────────────────
    console.log(`\n${'─'.repeat(72)}`);
    console.log(`📊 Test Timing Report  (${tests.length} tests)`);
    console.log('─'.repeat(72));

    if (slow.length > 0) {
      console.log(
        `\n⚠️  ${slow.length} test${slow.length > 1 ? 's' : ''} exceeded ${this.thresholdMs / 1000} s:\n`,
      );
      const display = slow.slice(0, 25);
      for (const t of display) {
        const secs = fmt(t.durationMs);
        const label = t.suite ? `${t.suite} › ${t.test}` : t.test;
        console.log(`  ${secs}  ${t.file}\n${''.padStart(10)}${label}`);
      }
      if (slow.length > 25) console.log(`  … and ${slow.length - 25} more (see ${this.outFile})`);
    } else {
      console.log(`\n  ✓ All tests completed under ${this.thresholdMs / 1000} s`);
    }

    console.log(`\n  Slowest story files (by total time):`);
    for (const f of files_.slice(0, 10)) {
      console.log(`  ${fmt(f.totalMs)}  ${f.file}  (${f.tests} tests, max ${fmt(f.maxMs)})`);
    }

    console.log(`\n  Full report → ${this.outFile}`);
    console.log('─'.repeat(72) + '\n');
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function walkTasks(tasks: Task[], filepath: string, parentSuite: string, out: TestRow[]) {
  for (const task of tasks) {
    if (task.type === 'test') {
      const result = (task as { result?: TaskResult }).result;
      out.push({
        file: filepath,
        suite: parentSuite,
        test: task.name,
        durationMs: Math.round(result?.duration ?? 0),
        status: result?.state ?? 'unknown',
      });
    } else if ('tasks' in task && Array.isArray((task as { tasks?: Task[] }).tasks)) {
      const suite = parentSuite ? `${parentSuite} › ${task.name}` : task.name;
      walkTasks((task as { tasks: Task[] }).tasks, filepath, suite, out);
    }
  }
}

function fmt(ms: number): string {
  return `${(ms / 1000).toFixed(1).padStart(6)}s`;
}
