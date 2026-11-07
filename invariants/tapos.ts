/**
 * Future-block TAPOS + memo seed RNG fallback (educational).
 * Not a synchronous RNG: entropy is fixed only after a later block.
 * No live chain. No wasm. No broadcast.
 */

import { createHash } from "node:crypto";

export const MIN_DELAY_BLOCKS = 1;
export const MAX_DELAY_BLOCKS = 512;
export const MIN_MEMO_LEN = 8;
export const MAX_MEMO_LEN = 64;

export type Phase = "open" | "ready" | "resolved" | "expired";

export type Job = {
  id: number;
  player: string;
  openBlock: number;
  resolveAfter: number;
  expireAt: number;
  memoSeed: string;
  phase: Phase;
  digest: string | null;
};

export type ActionResult =
  | { ok: true; job: Job }
  | { ok: false; reason: string };

const NAME = /^[a-z1-5.]{1,12}$/;
const HEX_SEED = /^[0-9a-f]{8,64}$/;

function assertName(name: string): void {
  if (!NAME.test(name) || name.startsWith(".") || name.endsWith(".")) {
    throw new Error("bad player");
  }
}

export function blockIdHex(blockNum: number, salt = "tapos"): string {
  if (!Number.isInteger(blockNum) || blockNum < 0) throw new Error("bad block");
  const payload = `${salt}:${blockNum}`;
  return createHash("sha256").update(payload, "utf8").digest("hex");
}

export function mixDigest(blockId: string, memoSeed: string): string {
  const id = blockId.toLowerCase();
  const seed = memoSeed.toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(id)) throw new Error("bad block id");
  if (!HEX_SEED.test(seed)) throw new Error("bad memo");
  return createHash("sha256")
    .update(Buffer.from(id + seed, "utf8"))
    .digest("hex");
}

export function openJob(input: {
  id: number;
  player: string;
  openBlock: number;
  delayBlocks: number;
  windowBlocks?: number;
  memoSeed: string;
}): Job {
  if (!Number.isInteger(input.id) || input.id < 1) throw new Error("bad id");
  assertName(input.player);
  if (!Number.isInteger(input.openBlock) || input.openBlock < 0) {
    throw new Error("bad openBlock");
  }
  if (
    !Number.isInteger(input.delayBlocks) ||
    input.delayBlocks < MIN_DELAY_BLOCKS ||
    input.delayBlocks > MAX_DELAY_BLOCKS
  ) {
    throw new Error("bad delay");
  }
  const window = input.windowBlocks ?? 32;
  if (!Number.isInteger(window) || window < 1 || window > MAX_DELAY_BLOCKS) {
    throw new Error("bad window");
  }
  const seed = input.memoSeed.toLowerCase();
  if (!HEX_SEED.test(seed) || seed.length < MIN_MEMO_LEN) {
    throw new Error("bad memo");
  }
  if (seed.length > MAX_MEMO_LEN) throw new Error("bad memo");
  const resolveAfter = input.openBlock + input.delayBlocks;
  return {
    id: input.id,
    player: input.player,
    openBlock: input.openBlock,
    resolveAfter,
    expireAt: resolveAfter + window,
    memoSeed: seed,
    phase: "open",
    digest: null,
  };
}

export function markReady(job: Job, currentBlock: number): ActionResult {
  if (job.phase !== "open") return { ok: false, reason: "bad phase" };
  if (!Number.isInteger(currentBlock) || currentBlock < 0) {
    return { ok: false, reason: "bad block" };
  }
  if (currentBlock < job.resolveAfter) return { ok: false, reason: "too early" };
  if (currentBlock > job.expireAt) {
    return {
      ok: true,
      job: { ...job, phase: "expired" },
    };
  }
  return { ok: true, job: { ...job, phase: "ready" } };
}

export function resolve(
  job: Job,
  input: { currentBlock: number; blockId: string },
): ActionResult {
  if (job.phase === "resolved") return { ok: false, reason: "already resolved" };
  if (job.phase === "expired") return { ok: false, reason: "expired" };
  if (!Number.isInteger(input.currentBlock) || input.currentBlock < 0) {
    return { ok: false, reason: "bad block" };
  }
  if (input.currentBlock < job.resolveAfter) {
    return { ok: false, reason: "too early" };
  }
  if (input.currentBlock > job.expireAt) {
    return { ok: true, job: { ...job, phase: "expired" } };
  }
  let digest: string;
  try {
    digest = mixDigest(input.blockId, job.memoSeed);
  } catch {
    return { ok: false, reason: "bad block id" };
  }
  return {
    ok: true,
    job: { ...job, phase: "resolved", digest },
  };
}

export function uint32FromDigest(digest: string): number {
  const d = digest.toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(d)) throw new Error("bad digest");
  return Number(BigInt("0x" + d.slice(0, 8)));
}
