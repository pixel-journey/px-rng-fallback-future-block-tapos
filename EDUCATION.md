# Education — future-block TAPOS seed (orng fallback)

> **Rung:** `npm test` passes. No `orng.wax`. Resolve mixes a **future block id** with a memo seed after a delay.  
> **The test is the rule.**

Use when a chain or deployment has no ORNG service: open at block N, allow resolve only after **N + delay**, mix `blockId` with a client memo seed into a digest, optionally expire after a window.

**Not** a synchronous RNG: the action waits for a future block. Prefer [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) on WAX mainnet when available.

Siblings: [commit-reveal](https://github.com/pixel-journey/px-rng-fallback-commit-reveal), [drand](https://github.com/pixel-journey/px-rng-fallback-drand-bls-verifier), [multi-oracle quorum](https://github.com/pixel-journey/px-rng-fallback-multi-oracle-quorum).

## Learning outcomes

| Level | After this file |
| --- | --- |
| Beginner | resolveAfter = open + delay |
| Intermediate | too early / ready / expired phases |
| Masterclass | Deterministic mix; why this is weaker than orng |

---

## Beginner

Memo seed `aabbccdd11223344`. Open block **1000**, delay **3** → `resolveAfter` **1003**, `expireAt` **1015** (window 10 in tests).

## Intermediate — timing table

| Action | Block | Result |
| --- | --- | --- |
| markReady | 1002 | too early |
| markReady | 1003 | phase `ready` |
| resolve | 1001 | too early |
| resolve | 1003 | `resolved`, digest = mix(blockId, seed), length 64 |
| resolve | expireAt+1 | `expired` |
| second resolve | any | already resolved |

Same blockId + seed → same digest; different seed differs.

`uint32FromDigest("0000002a" + …)` → `0x2a`.

Delay 0 or memo `zz` refused on open.

## Masterclass — honesty limits

| Risk | Note |
| --- | --- |
| Block producer influence | Future block id is not oracle-grade on all networks |
| Seed grinding | Memo seed chosen at open; combine with delay |
| Expire without resolve | Define refund policy in product (not all paths in this lab) |

### Common mistakes

1. Resolving at open block (no delay).  
2. Treating TAPOS as "instant random."  
3. Allowing second resolve after expire.  
4. Using delay 0 "for tests" in production configs.

### Nice-to-have extensions (not in this repo)

- Commit seed hash at open, reveal at resolve (hybrid with commit-reveal).  
- Multiple future blocks mixed.  
- Automatic refund on expire.  
- Switch to orng when credits available.

Numbers: [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md).

### Exercises

1. Open 1000 delay 3 — first legal resolve block? (1003)  
2. Is digest length 64 hex? (yes)  
3. Preferred RNG on WAX mainnet? (orng.wax)
