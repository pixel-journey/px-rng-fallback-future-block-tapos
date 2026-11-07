import assert from "node:assert/strict";
import test from "node:test";
import {
  blockIdHex,
  markReady,
  mixDigest,
  openJob,
  resolve,
  uint32FromDigest,
} from "./tapos.ts";

const SEED = "aabbccdd11223344";

function base(openBlock = 1000, delay = 3) {
  return openJob({
    id: 1,
    player: "player1",
    openBlock,
    delayBlocks: delay,
    windowBlocks: 10,
    memoSeed: SEED,
  });
}

test("open sets resolveAfter = openBlock + delay", () => {
  const j = base(1000, 5);
  assert.equal(j.resolveAfter, 1005);
  assert.equal(j.expireAt, 1015);
  assert.equal(j.phase, "open");
});

test("markReady too early refused", () => {
  const r = markReady(base(), 1002);
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.reason, "too early");
});

test("markReady at resolveAfter succeeds", () => {
  const r = markReady(base(), 1003);
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.job.phase, "ready");
});

test("resolve before delay is too early", () => {
  const r = resolve(base(), {
    currentBlock: 1001,
    blockId: blockIdHex(1001),
  });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.reason, "too early");
});

test("resolve after delay produces digest", () => {
  const j = base();
  const id = blockIdHex(j.resolveAfter);
  const r = resolve(j, { currentBlock: j.resolveAfter, blockId: id });
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.job.phase, "resolved");
    assert.equal(r.job.digest, mixDigest(id, SEED));
    assert.equal(r.job.digest!.length, 64);
  }
});

test("same block id + seed is deterministic", () => {
  const id = blockIdHex(2000);
  assert.equal(mixDigest(id, SEED), mixDigest(id, SEED));
  assert.notEqual(mixDigest(id, SEED), mixDigest(id, "0011223344556677"));
});

test("past expire marks expired", () => {
  const j = base(1000, 3);
  const r = resolve(j, {
    currentBlock: j.expireAt + 1,
    blockId: blockIdHex(j.expireAt + 1),
  });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.job.phase, "expired");
});

test("double resolve refused", () => {
  const j = base();
  const id = blockIdHex(j.resolveAfter);
  let r = resolve(j, { currentBlock: j.resolveAfter, blockId: id });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  r = resolve(r.job, { currentBlock: j.resolveAfter + 1, blockId: id });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.reason, "already resolved");
});

test("bad memo and delay refused", () => {
  assert.throws(
    () =>
      openJob({
        id: 1,
        player: "player1",
        openBlock: 1,
        delayBlocks: 0,
        memoSeed: SEED,
      }),
    /bad delay/,
  );
  assert.throws(
    () =>
      openJob({
        id: 1,
        player: "player1",
        openBlock: 1,
        delayBlocks: 2,
        memoSeed: "zz",
      }),
    /bad memo/,
  );
});

test("uint32FromDigest reads first 4 bytes", () => {
  const d = "0000002a" + "11".repeat(28);
  assert.equal(uint32FromDigest(d), 0x2a);
});
