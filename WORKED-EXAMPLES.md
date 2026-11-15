# Worked examples — future-block TAPOS

Memo seed `aabbccdd11223344`. Open block **1000**, delay **3** → `resolveAfter` **1003**, `expireAt` **1015** (window 10).

## Timing

| Action | Block | Result |
| --- | --- | --- |
| markReady | 1002 | too early |
| markReady | 1003 | phase `ready` |
| resolve | 1001 | too early |
| resolve | 1003 | phase `resolved`, digest = mix(blockId, seed), length 64 |
| resolve | expireAt+1 | phase `expired` |
| second resolve | any | already resolved |

Same blockId + seed is deterministic; different seed differs.

`uint32FromDigest("0000002a" + …)` → `0x2a`.

Delay 0 or memo `zz` refused on open.

**Not** a synchronous RNG: the action waits for a future block id. No orng.wax in this lab.
