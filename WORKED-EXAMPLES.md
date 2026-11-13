# Worked examples — TAPOS delay job

## Example A — open and wait

```text
job = openJob({ id: 1, player: "alice", openBlock: 100, delayBlocks: 10, memoSeed: "aabbccdd" })
// resolveAfter = 110, expireAt = 142 (default window 32)
markReady(job, 105) → too early
markReady(job, 110) → ready
```

## Example B — resolve with digest

```text
blockId = blockIdHex(110)  // synthetic in tests
resolve(job, { currentBlock: 110, blockId }) → phase resolved, digest set
uint32FromDigest(digest)  // first 4 bytes as uint32
```

## Example C — expire

`currentBlock > expireAt` → phase `expired`; resolve after that refused.

## Example D — already resolved

Second resolve → `already resolved`.

## Example E — composition

Two jobs with different delays resolve independently (composition test).
