/**
 * Extends the Storybook WebSocket heartbeat timeout to prevent "Server timed
 * out" during long-running Accessibility scans.
 *
 * Background — how the heartbeat works (storybook/dist/channels/index.js):
 *   • The server sends { type:'ping' } every 15 s via setInterval.
 *   • Each ping resets a 20 s watchdog (HEARTBEAT_INTERVAL 15 s +
 *     HEARTBEAT_MAX_LATENCY 5 s).  If the watchdog fires it calls
 *     socket.close(3008, 'timeout'), which the manager turns into the
 *     "Server timed out" notification.
 *   • After processing a ping the transport also sends { type:'pong' }.
 *
 * This file runs synchronously before ReactProvider is constructed (it is
 * deferred by setTimeout(0)), so the patch is in place before any WebSocket
 * is created.  Being our own file it survives addon updates.
 */

// Tracks the pending delayed-close timer for each WebSocket instance.
// Using a WeakMap avoids attaching extra properties to the socket object
// and keeps the type system clean (no `as any` casts needed).
const pending = new WeakMap<WebSocket, ReturnType<typeof setTimeout>>();

const _close = WebSocket.prototype.close;
const _send  = WebSocket.prototype.send;

// close(3008) — heartbeat watchdog fired.
// Delay by 30 s to give Axe scans time to finish instead of closing immediately.
WebSocket.prototype.close = function (this: WebSocket, code?: number, reason?: string) {
  if (code === 3008) {
    clearTimeout(pending.get(this));
    pending.set(this, setTimeout(() => {
      pending.delete(this);
      _close.call(this, code, reason);
    }, 30_000));
    return;
  }
  // Any other close code — cancel any pending delay and close immediately.
  clearTimeout(pending.get(this));
  pending.delete(this);
  _close.call(this, code, reason);
} as typeof WebSocket.prototype.close;

// send(pong) — a real ping just arrived and heartbeat() reset the watchdog.
// Cancel the pending delay; the connection is healthy.
WebSocket.prototype.send = function (this: WebSocket, data: Parameters<typeof WebSocket.prototype.send>[0]) {
  try {
    if (typeof data === 'string' && pending.has(this)) {
      const msg = JSON.parse(data) as { type?: string };
      if (msg?.type === 'pong') {
        clearTimeout(pending.get(this));
        pending.delete(this);
      }
    }
  } catch { /* non-JSON payload — ignore */ }
  _send.call(this, data);
};
