# Worked examples — future-block TAPOS digest

`SEED = aabbccdd11223344`. Open at block 1000, delay 3 → `resolveAfter = 1003`, `expireAt = 1013` when `windowBlocks = 10`.

## Timeline

| Current block | Action | Result |
| --- | --- | --- |
| 1001 | `resolve` | too early |
| 1002 | `markReady` (delay 3 job) | too early |
| 1003 | `markReady` | phase `ready` |
| 1003 | `resolve` with `blockIdHex(1003)` | phase `resolved`, digest = `mixDigest(blockId, SEED)` |
| 1004 | second `resolve` | already resolved |
| expireAt + 1 | `resolve` without prior success | phase `expired`, digest `null` |
| later | `resolve` on expired | reason `expired` |

Digest length is 64 hex. Same block id + seed is stable; different seed differs.

## Two jobs, same block

Alice seed A, Bob seed B, same `resolveAfter`. Same `blockId` yields **two different digests** (`mixDigest(id, A)` vs `mixDigest(id, B)`).

Resolving job A does not move job B. If B still has a longer delay, resolve on A's block is `too early` for B.

## uint32

Digest prefix `0000002a` → `uint32FromDigest` is `0x2a`.

## Refusals

| Case | Error |
| --- | --- |
| `delayBlocks` 0 | bad delay |
| memo `zz` | bad memo |

No live block id from the chain. `blockIdHex` is a stand-in for tests.
