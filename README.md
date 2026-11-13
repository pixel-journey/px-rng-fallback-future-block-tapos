# Delayed future-block seed (TAPOS-style fallback)

> **Domain:** RNG fallback — delayed block seed  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)  
> **Path:** [ORNG-LEARNING-PATH.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md)

**Goal:** Open a job at `openBlock` with a client memo seed. Resolve is refused until `openBlock + delayBlocks`. Digest = `sha256(blockId || memoSeed)`. Past `expireAt` the job expires without a digest.

**Code under test:** `npm test` (unit + multi-job composition). Block ids here are lab stand-ins, not live chain TAPOS. No wasm.

Prefer [orng.wax](https://github.com/worldwide-asset-exchange/wax-orng) for production randomness. This is a teaching fallback. Sibling: [commit-reveal](https://github.com/pixel-journey/px-rng-fallback-commit-reveal).

## Composition

`tapos.composition.test.ts` walks open → too-early → ready → resolve → double-resolve refuse. Two jobs with different memo seeds get different digests on the same block id. Expire never produces a digest. Resolving job A leaves job B open.

```bash
npm test
```

MIT — Pixel Journey
