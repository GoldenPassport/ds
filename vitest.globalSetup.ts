/**
 * Vitest global setup — CLI force-exit safety net.
 *
 * After all tests finish, @storybook/addon-vitest's Vite plugin calls
 * server.close() on the preview server.  That call never resolves when
 * Playwright still holds open HMR WebSocket connections, so the CLI process
 * hangs indefinitely.  The 20 s timer below unblocks that deadlock.
 *
 * The VITEST_STORYBOOK guard prevents force-exit when tests are triggered
 * from the Storybook UI — in that case this process IS the dev server.
 */
export function setup() {}

export function teardown() {
  if (process.env.VITEST_STORYBOOK === 'true') return;
  // Do NOT call .unref() — the timer must stay referenced so it fires even
  // when the event loop would otherwise be empty.
  setTimeout(() => process.exit(0), 20_000);
}
