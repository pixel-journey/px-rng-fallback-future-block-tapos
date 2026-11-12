/**
 * Composition: multi-job delayed TAPOS lifecycle.
 * open → too-early refuse → resolve → double-resolve refuse.
 * Jobs stay independent. Expire path never yields a digest.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  blockIdHex,
  markReady,
  mixDigest,
  openJob,
  resolve,
  type Job,
} from "./tapos.ts";

const SEED_A = "aabbccdd11223344";
const SEED_B = "0011223344556677";

function open(
  id: number,
  player: string,
  openBlock: number,
  delay: number,
  seed: string,
): Job {
  return openJob({
    id,
    player,
    openBlock,
    delayBlocks: delay,
    windowBlocks: 10,
    memoSeed: seed,
  });
}

describe("composition: multi-job TAPOS desk", () => {
  it("full path: too early, ready, resolve, double resolve", () => {
    let job = open(1, "player1", 1000, 3, SEED_A);
    assert.equal(job.phase, "open");

    const early = resolve(job, {
      currentBlock: 1001,
      blockId: blockIdHex(1001),
    });
    assert.equal(early.ok, false);
    if (!early.ok) assert.equal(early.reason, "too early");

    const ready = markReady(job, job.resolveAfter);
    assert.equal(ready.ok, true);
    if (!ready.ok) return;
    job = ready.job;
    assert.equal(job.phase, "ready");

    const id = blockIdHex(job.resolveAfter);
    const done = resolve(job, { currentBlock: job.resolveAfter, blockId: id });
    assert.equal(done.ok, true);
    if (!done.ok) return;
    assert.equal(done.job.phase, "resolved");
    assert.equal(done.job.digest, mixDigest(id, SEED_A));

    const again = resolve(done.job, {
      currentBlock: job.resolveAfter + 1,
      blockId: id,
    });
    assert.equal(again.ok, false);
    if (!again.ok) assert.equal(again.reason, "already resolved");
  });

  it("two jobs resolve independently with different digests", () => {
    const a = open(1, "alice", 1000, 2, SEED_A);
    const b = open(2, "bob", 1000, 2, SEED_B);
    const block = a.resolveAfter;
    const id = blockIdHex(block);
    const ra = resolve(a, { currentBlock: block, blockId: id });
    const rb = resolve(b, { currentBlock: block, blockId: id });
    assert.equal(ra.ok && rb.ok, true);
    if (!ra.ok || !rb.ok) return;
    assert.equal(ra.job.phase, "resolved");
    assert.equal(rb.job.phase, "resolved");
    assert.notEqual(ra.job.digest, rb.job.digest);
    assert.equal(ra.job.digest, mixDigest(id, SEED_A));
    assert.equal(rb.job.digest, mixDigest(id, SEED_B));
  });

  it("past expire marks expired and blocks later resolve", () => {
    let job = open(3, "carol", 1000, 3, SEED_A);
    const r = resolve(job, {
      currentBlock: job.expireAt + 1,
      blockId: blockIdHex(job.expireAt + 1),
    });
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.equal(r.job.phase, "expired");
    assert.equal(r.job.digest, null);
    const again = resolve(r.job, {
      currentBlock: job.expireAt + 2,
      blockId: blockIdHex(job.expireAt + 2),
    });
    assert.equal(again.ok, false);
    if (!again.ok) assert.equal(again.reason, "expired");
  });

  it("resolving job A does not change job B still open", () => {
    const a = open(10, "alice", 500, 1, SEED_A);
    const b = open(20, "bob", 500, 5, SEED_B);
    const ra = resolve(a, {
      currentBlock: a.resolveAfter,
      blockId: blockIdHex(a.resolveAfter),
    });
    assert.equal(ra.ok, true);
    if (!ra.ok) return;
    assert.equal(ra.job.phase, "resolved");
    assert.equal(b.phase, "open");
    const earlyB = resolve(b, {
      currentBlock: a.resolveAfter,
      blockId: blockIdHex(a.resolveAfter),
    });
    assert.equal(earlyB.ok, false);
    if (!earlyB.ok) assert.equal(earlyB.reason, "too early");
  });
});
